import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/lib/supabase'; // Ensure this points to your supabase client
import { UserRole } from '@/lib/index';
import { toast } from 'sonner';

interface UserData {
  uid: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  mustChangePassword: boolean;
}

interface AuthContextType {
  user: any | null;
  userData: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  changePassword: (newPassword: string) => Promise<void>;
  checkMustChangePassword: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchUserData(session.user.id);
      setIsLoading(false);
    });

    // 2. Listen for auth changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setUserData(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetches custom role data from your 'profiles' or 'users' table in Supabase
  const fetchUserData = async (uid: string) => {
    const { data, error } = await supabase
      .from('profiles') // or 'users' depending on your Supabase table name
      .select('*')
      .eq('uid', uid)
      .single();

    if (!error && data) {
      setUserData(data as UserData);
    }
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
      throw error;
    }
    toast.success('Successfully logged in');
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUserData(null);
    toast.success('Logged out');
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    toast.success('Reset link sent to your email');
  };

  const changePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
    toast.success('Password updated successfully');
  };

  const checkMustChangePassword = () => userData?.mustChangePassword || false;

  return (
    <AuthContext.Provider value={{ 
      user, userData, isAuthenticated: !!user, isLoading, 
      login, logout, resetPassword, changePassword, checkMustChangePassword 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};