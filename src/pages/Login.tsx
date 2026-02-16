import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button'; // Using your standard UI library

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
      // Authenticate with Supabase and fetch profile
      await login(email, password);
      
      // Navigate to the command center
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Access Denied. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-luxury-obsidian">
      <div className="w-full max-w-md p-8 luxury-glass rounded-3xl border border-white/5 shadow-2xl">
        <div className="text-center mb-10">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-luxury-gold to-amber-600 flex items-center justify-center shadow-lg mx-auto mb-4">
            <span className="text-luxury-obsidian font-black text-3xl">B</span>
          </div>
          <h2 className="text-2xl font-bold text-luxury-cream">Secure Terminal</h2>
          <p className="text-xs text-white/40 uppercase tracking-widest mt-2">Logistics Cloud Access</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">Identity (Email)</label>
            <input
              type="email"
              placeholder="admin@britiumexpress.com"
              className="w-full p-4 rounded-2xl bg-white/5 text-white border border-white/10 focus:border-luxury-gold/50 focus:outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">Security Key (Password)</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full p-4 rounded-2xl bg-white/5 text-white border border-white/10 focus:border-luxury-gold/50 focus:outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-luxury-gold hover:bg-amber-500 text-luxury-obsidian font-bold rounded-2xl shadow-lg shadow-luxury-gold/20"
          >
            {loading ? 'Decrypting...' : 'Initiate Session'}
          </Button>
        </form>
      </div>
    </div>
  );
}