import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

interface UserData {
  uid: string;
  email: string;
  role: string;
  fullName?: string;
  isActive: boolean;
  mustChangePassword: boolean;
  permissions: Record<string, boolean>;
}

interface AuthContextType {
  user: any | null;
  userData: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (newPassword: string) => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  // 🔥 Fetch profile from user_profiles
  const fetchUserProfile = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', uid)
        .single();

      if (error) throw error;

      if (!data) return;

      const profile: UserData = {
        uid: data.user_id,
        email: data.email,
        role: data.role,
        fullName: data.full_name,
        isActive: data.status === 'active',
        mustChangePassword: data.must_change_password,
        permissions: data.permissions || {},
      };

      setUserData(profile);

      // 🚨 Force password change
      if (profile.mustChangePassword) {
        navigate('/change-password');
      }

    } catch (err: any) {
      console.error('Profile fetch error:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔥 Init Session
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session?.user) {
        setUser(data.session.user);
        await fetchUserProfile(data.session.user.id);
      } else {
        setIsLoading(false);
      }
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);

        if (event === 'SIGNED_IN' && session?.user) {
          await fetchUserProfile(session.user.id);
        }

        if (event === 'SIGNED_OUT') {
          setUser(null);
          setUserData(null);
          setIsLoading(false);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 🔐 Login
  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  // 🔐 Logout
  const logout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // 🔐 Change Password
  const changePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;

    await supabase
      .from('user_profiles')
      .update({
        must_change_password: false,
        last_password_change: new Date(),
      })
      .eq('user_id', user?.id);

    navigate('/dashboard');
  };

  // 🔐 Permission Checker
  const hasPermission = (permission: string) => {
    return !!userData?.permissions?.[permission];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        changePassword,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
