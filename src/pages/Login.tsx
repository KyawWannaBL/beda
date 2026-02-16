import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

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
      const { mustChangePassword } = await login(email, password);
      navigate(mustChangePassword ? "/force-password-reset" : "/dashboard", { replace: true });
    } catch (err: any) {
      setError(err.message || 'Access Denied. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-luxury-obsidian p-6">
      <div className="w-full max-w-md p-10 luxury-glass rounded-[2.5rem] border border-white/5 shadow-2xl">
        <h2 className="text-2xl font-bold text-luxury-cream text-center mb-10">Secure Terminal</h2>
        {error && <div className="mb-6 p-4 rounded-xl bg-red-500/10 text-red-400 text-sm text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Identity (Email)"
            className="w-full p-4 rounded-2xl bg-white/5 text-white border border-white/10 outline-none focus:border-luxury-gold/50"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Security Key"
            className="w-full p-4 rounded-2xl bg-white/5 text-white border border-white/10 outline-none focus:border-luxury-gold/50"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" disabled={loading} className="w-full h-16 bg-luxury-gold hover:bg-amber-500 text-luxury-obsidian font-bold rounded-2xl">
            {loading ? 'Verifying...' : 'Initiate Session'}
          </Button>
        </form>
      </div>
    </div>
  );
}