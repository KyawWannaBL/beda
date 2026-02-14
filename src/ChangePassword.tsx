import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function ChangePassword() {
  const { changePassword } = useAuth();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Minimum 8 characters required');
      return;
    }

    try {
      await changePassword(password);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 p-8 rounded-xl w-96 space-y-6 shadow-xl"
      >
        <h2 className="text-white text-xl font-bold text-center">
          Change Password
        </h2>

        {error && <div className="text-red-400">{error}</div>}

        <input
          type="password"
          placeholder="New Password"
          className="w-full p-3 rounded bg-slate-800 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full p-3 rounded bg-slate-800 text-white"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <button className="w-full bg-emerald-600 p-3 rounded">
          Update Password
        </button>
      </form>
    </div>
  );
}
