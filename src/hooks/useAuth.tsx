import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { UserRole } from '@/lib/index';
import { toast } from 'sonner';

interface UserData {
  uid: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  mustChangePassword: boolean;
  fullName?: string; // Added for UI consistency
}

interface AuthContextType {
  user: any | null;
  userData: UserData | null;
  legacyUser: UserData | null; // Keep for Dashboard compatibility
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

  const fetchUserData = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from('users') // Ensure your table name matches
        .select('*')
        .eq('uid', uid)
        .single();

      if (error) throw error;
      if (data) {
        setUserData(data as UserData);
      }
    } catch (error: any) {
      console.error("Auth: Error fetching user profile:", error.message);
      // We don't toast here because it might just be a first-time login
    } finally {
      setIsLoading(false); // Crucial: Stop loading even if DB fetch fails
    }
  };

  useEffect(() => {
    // Initialize session
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await fetchUserData(session.user.id);
      } else {
        setIsLoading(false);
      }
    };

    initSession();

    // Listen for Auth Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      
      if (event === 'SIGNED_IN' && session?.user) {
        await fetchUserData(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUserData(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
      throw error;
    }
    toast.success('Access Granted');
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUserData(null);
    toast.success('Session Ended');
  };

  // ... Other functions (resetPassword, changePassword) remain same

  return (
    <AuthContext.Provider value={{ 
      user, 
      userData, 
      legacyUser: userData, // Mapping this for Dashboard.tsx support
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      logout,
      resetPassword: async (email) => { /* ... */ },
      changePassword: async (pwd) => { /* ... */ },
      checkMustChangePassword: () => userData?.mustChangePassword || false
    }}>
      {isLoading ? (
        /* Global Britium Loading State */
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
          <div className="h-12 w-12 rounded-full border-t-2 border-emerald-500 animate-spin" />
          <p className="text-emerald-500/50 font-mono text-xs tracking-widest uppercase">Initializing Britium Secure</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};