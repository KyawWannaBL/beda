import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Lock, ShieldCheck, Mail, Key } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Authenticates via Supabase and fetches role from 'profiles'
      await login(email, password);
      // Success: Proceed to the Command Center
      navigate('/dashboard'); 
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Access Denied. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-luxury-obsidian p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-luxury-gold/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px]" />

      <div className="w-full max-w-md p-10 luxury-glass rounded-[2.5rem] border border-white/5 shadow-2xl relative z-10">
        <div className="text-center mb-10">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-luxury-gold to-amber-600 flex items-center justify-center shadow-lg shadow-luxury-gold/20 mx-auto mb-6 transform -rotate-3 hover:rotate-0 transition-transform">
            <span className="text-luxury-obsidian font-black text-4xl">B</span>
          </div>
          <h2 className="text-2xl font-bold text-luxury-cream tracking-tight">Secure Terminal</h2>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.4em] mt-3 font-bold">
            Logistics Cloud Access Protocol
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center animate-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 ml-1 mb-2">
              <Mail className="h-3 w-3 text-luxury-gold" />
              <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Identity (Email)</label>
            </div>
            <input
              type="email"
              placeholder="admin@britiumexpress.com"
              className="w-full p-4 rounded-2xl bg-white/5 text-white border border-white/10 focus:border-luxury-gold/50 focus:bg-white/10 transition-all outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 ml-1 mb-2">
              <Key className="h-3 w-3 text-luxury-gold" />
              <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Security Key</label>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full p-4 rounded-2xl bg-white/5 text-white border border-white/10 focus:border-luxury-gold/50 focus:bg-white/10 transition-all outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-16 bg-luxury-gold hover:bg-amber-500 text-luxury-obsidian font-black rounded-2xl shadow-xl shadow-luxury-gold/10 transition-all active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-luxury-obsidian/30 border-t-luxury-obsidian rounded-full animate-spin" />
                  <span>Verifying Identity...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" />
                  <span>Initiate Session</span>
                </div>
              )}
            </Button>
          </div>
        </form>

        <div className="mt-10 pt-6 border-t border-white/5 text-center">
          <p className="text-[10px] text-white/20 uppercase tracking-widest leading-loose">
            Authorized Personnel Only <br />
            IP: Trace Active • Session: Encrypted
          </p>
        </div>
      </div>
    </div>
  );
}