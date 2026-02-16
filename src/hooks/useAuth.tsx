import { useEffect, useState, createContext, useContext, ReactNode, useCallback } from 'react';
import { supabase } from '../lib/supabase'; // Relative path is safer for production
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const initAuth = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        if (profile) setRole(profile.role);
      }
    } catch (error) {
      console.error("Auth initialization failed:", error);
    } finally {
      setLoading(false); // ALWAYS release loading to prevent black screen
    }
  }, []);

  useEffect(() => {
    initAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        setRole(null);
        navigate('/');
      }
    });
    return () => subscription.unsubscribe();
  }, [initAuth, navigate]);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);