import {
  useEffect,
  useState,
  createContext,
  useContext,
  ReactNode,
} from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

type AuthContextType = {
  user: any;
  role: string | null;
  branchId: string | null;
  permissions: string[];
  hasPermission: (code: string) => boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [branchId, setBranchId] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ENTERPRISE Permission Loader
  const loadPermissions = async (roleName: string) => {
    const { data, error } = await supabase
      .from('role_permissions')
      .select(`
        permission_id,
        permissions (code)
      `)
      .eq('role', roleName);

    if (error) {
      console.error("Permission load failed:", error);
      return;
    }

    const codes = data?.map((p: any) => p.permissions?.code).filter(Boolean) || [];
    setPermissions(codes);
  };

  // Shared function to fetch profile and then permissions
  const fetchUserContext = async (userId: string) => {
    try {
      // 1. Load profile (Role & Branch)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, branch_id')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      if (profile) {
        setRole(profile.role);
        setBranchId(profile.branch_id);

        // 2. If role exists, load permissions
        if (profile.role) {
          await loadPermissions(profile.role);
        }
        
        return profile;
      }
    } catch (error) {
      console.error('Error loading user context:', error);
    }
    return null;
  };

  useEffect(() => {
    const loadUser = async () => {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData?.session?.user) {
        setLoading(false);
        return;
      }

      const currentUser = sessionData.session.user;
      setUser(currentUser);

      await fetchUserContext(currentUser.id);

      setLoading(false);
    };

    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
            setUser(session.user);
            await fetchUserContext(session.user.id);
        }
        if (event === 'SIGNED_OUT') {
            setUser(null);
            setRole(null);
            setBranchId(null);
            setPermissions([]);
        }
    });

    return () => {
        listener.subscription.unsubscribe();
    }
  }, []);

  // ✅ FRONTEND HEARTBEAT (Auto Session Update)
  useEffect(() => {
    // Only run if we have a logged-in user
    if (!user) return;

    const updateSession = async () => {
      try {
        await supabase.from("user_sessions").upsert({
          user_id: user.id,
          role: role,          // Send current role state
          branch_id: branchId, // Send current branchId state
          last_seen: new Date().toISOString(),
          is_active: true
        }, { onConflict: 'user_id' });
      } catch (err) {
        console.error("Heartbeat failed:", err);
      }
    };

    // 1. Send immediate heartbeat on mount/change
    updateSession();

    // 2. Set interval for every 30 seconds
    const interval = setInterval(updateSession, 30000);

    // Cleanup interval on unmount or user change
    return () => clearInterval(interval);
  }, [user, role, branchId]);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (data.user) {
        setUser(data.user);
        
        const profile = await fetchUserContext(data.user.id);
        
        // Initial Session Log (Optional, since Heartbeat will likely catch it too, 
        // but this table 'active_sessions' might be an audit log vs 'user_sessions' which is status)
        if (profile) {
          try {
            await supabase.from('active_sessions').insert({
              user_id: data.user.id,
              branch_id: profile.branch_id,
              role: profile.role
            });
          } catch (sessionError) {
            console.error('Failed to register active session:', sessionError);
          }
        }

        navigate('/dashboard');
    }
  };

  const logout = async () => {
    // Optional: Mark session inactive on logout
    if (user) {
       await supabase.from("user_sessions").upsert({
          user_id: user.id,
          is_active: false,
          last_seen: new Date().toISOString()
       }, { onConflict: 'user_id' });
    }

    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    setBranchId(null);
    setPermissions([]);
    navigate('/login');
  };

  const hasPermission = (code: string) => {
    if (role === 'APP_OWNER') return true;
    return permissions.includes(code);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        branchId,
        permissions,
        hasPermission,
        loading,
        login,
        logout,
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