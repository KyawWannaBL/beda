import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';

import { ROUTE_PATHS, UserRole } from '@/lib/index';
import { useAuth } from '@/hooks/useAuth';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

type AuthMode = 'login' | 'forgot' | 'forceChange';

const ROLE_HOME: Partial<Record<UserRole, string>> = {
  APP_OWNER: ROUTE_PATHS.DASHBOARD,
  SUPER_ADMIN: ROUTE_PATHS.DASHBOARD,
  OPERATIONS_ADMIN: ROUTE_PATHS.DASHBOARD,
  FINANCE_ADMIN: ROUTE_PATHS.DASHBOARD,
  SUPERVISOR: ROUTE_PATHS.SUPERVISOR ?? ROUTE_PATHS.DASHBOARD,
  RIDER: ROUTE_PATHS.RIDER?.HOME ?? ROUTE_PATHS.DASHBOARD,
  DRIVER: ROUTE_PATHS.RIDER?.HOME ?? ROUTE_PATHS.DASHBOARD,
  HELPER: ROUTE_PATHS.RIDER?.HOME ?? ROUTE_PATHS.DASHBOARD,
};

const ROLE_OPTIONS: Array<{ value: UserRole; label: string }> = [
  { value: 'APP_OWNER', label: 'App Owner' },
  { value: 'SUPER_ADMIN', label: 'Super Admin' },
  { value: 'OPERATIONS_ADMIN', label: 'Operations Admin' },
  { value: 'FINANCE_ADMIN', label: 'Finance Admin' },
  { value: 'SUPERVISOR', label: 'Supervisor' },
  { value: 'RIDER', label: 'Rider' },
  { value: 'DRIVER', label: 'Driver' },
  { value: 'HELPER', label: 'Helper' },
  { value: 'MERCHANT', label: 'Merchant' },
  { value: 'CUSTOMER', label: 'Customer' },
];

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, resetPassword, changePassword, checkMustChangePassword } = useAuth();

  const [mode, setMode] = useState<AuthMode>('login');
  const [role, setRole] = useState<UserRole>('RIDER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>('');

  const emailRef = useRef<HTMLInputElement | null>(null);
  const newPasswordRef = useRef<HTMLInputElement | null>(null);

  const fromPath = useMemo(() => {
    const state = location.state as any;
    return state?.from?.pathname as string | undefined;
  }, [location.state]);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  useEffect(() => {
    if (mode === 'login' || mode === 'forgot') emailRef.current?.focus();
    if (mode === 'forceChange') newPasswordRef.current?.focus();
  }, [mode]);

  const routeAfterLogin = (resolvedRole: UserRole) => {
    const dest = fromPath || ROLE_HOME[resolvedRole] || ROUTE_PATHS.DASHBOARD;
    navigate(dest, { replace: true });
  };

  const handleLogin = async () => {
    setBusy(true);
    setError('');
    try {
      await login(email.trim(), password, role);

      const must = typeof checkMustChangePassword === 'function' ? checkMustChangePassword() : false;
      if (must) {
        setMode('forceChange');
        toast.info('Please change your password to continue.');
        return;
      }

      toast.success('Signed in');
      routeAfterLogin(role);
    } catch (e: any) {
      setError(e?.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  const handleForgot = async () => {
    setBusy(true);
    setError('');
    try {
      await resetPassword(email.trim());
      toast.success('Reset link sent. Please check your email.');
      setMode('login');
    } catch (e: any) {
      setError(e?.message || 'Failed to send reset link');
    } finally {
      setBusy(false);
    }
  };

  const handleForceChange = async () => {
    setBusy(true);
    setError('');
    try {
      if (newPassword.length < 8) {
        setError('Password must be at least 8 characters.');
        return;
      }
      await changePassword(password, newPassword);
      toast.success('Password changed. Please sign in again.');
      setPassword('');
      setNewPassword('');
      setMode('login');
      emailRef.current?.focus();
    } catch (e: any) {
      setError(e?.message || 'Failed to change password');
    } finally {
      setBusy(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (mode === 'login') return handleLogin();
    if (mode === 'forgot') return handleForgot();
    return handleForceChange();
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-10">
      <Card className="w-full max-w-md border-white/10 bg-white/5 backdrop-blur-md shadow-xl">
        <CardHeader className="space-y-2">
          <CardTitle className="text-white flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            Britium Express Portal
          </CardTitle>
          <CardDescription className="text-white/70">
            {mode === 'login' && 'Sign in to your assigned panel.'}
            {mode === 'forgot' && 'Send a password reset link to your email.'}
            {mode === 'forceChange' && 'Change your password to continue.'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            {mode === 'login' && (
              <div className="space-y-2">
                <Label className="text-white/90">Role</Label>
                <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-white/90">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                <Input
                  ref={emailRef}
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  placeholder="name@britiumexpress.com"
                  required
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div className="space-y-2">
                <Label className="text-white/90">{mode === 'forceChange' ? 'Current Password' : 'Password'}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/60 hover:text-white"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'forceChange' && (
              <div className="space-y-2">
                <Label className="text-white/90">New Password</Label>
                <Input
                  ref={newPasswordRef}
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  placeholder="Minimum 8 characters"
                  required
                />
              </div>
            )}

            {error && (
              <Alert className="border-rose-400/40 bg-rose-500/10 text-white">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={busy}
              className="w-full h-14 bg-gradient-to-r from-emerald-500 to-amber-400 text-slate-950 font-semibold hover:opacity-95"
            >
              {mode === 'login' && (busy ? 'Signing in…' : 'Sign In')}
              {mode === 'forgot' && (busy ? 'Sending…' : 'Send Reset Link')}
              {mode === 'forceChange' && (busy ? 'Updating…' : 'Update Password')}
            </Button>

            {mode === 'login' && (
              <div className="flex items-center justify-between text-sm">
                <button type="button" className="text-white/70 hover:text-white" onClick={() => setMode('forgot')}>
                  Forgot password?
                </button>
                <a className="text-white/70 hover:text-white" href="/">
                  Back to landing
                </a>
              </div>
            )}

            {mode === 'forgot' && (
              <button type="button" className="text-white/70 hover:text-white text-sm" onClick={() => setMode('login')}>
                Back to sign in
              </button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
