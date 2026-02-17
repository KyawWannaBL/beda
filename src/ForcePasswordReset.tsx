import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export default function ForcePasswordReset() {
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string>("");
  const [ready, setReady] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const passwordError = useMemo(() => {
    if (!newPassword && !confirmPassword) return "";
    if (newPassword !== confirmPassword) return "Passwords don't match";
    if (newPassword.length < 8) return "Password must be at least 8 characters";
    return "";
  }, [newPassword, confirmPassword]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setError("");

      try {
        // ✅ IMPORTANT: if this page is opened from Supabase reset email,
        // the URL often contains ?code=... (PKCE). We must exchange it for a session
        // BEFORE we check getSession(), otherwise we'll redirect to /login.
        const hasCode = window.location.search.includes("code=");
        if (hasCode) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
            window.location.href
          );
          if (exchangeError) throw exchangeError;

          // Optional: clean URL so code isn't reused / leaked in screenshots
          window.history.replaceState({}, document.title, "/reset-password");
        }

        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        const id = data.session?.user?.id ?? null;
        if (cancelled) return;

        setUserId(id);

        // If session still missing, token may be expired or URL config is wrong.
        if (!id) {
          navigate("/login", { replace: true });
          return;
        }

        setReady(true);
      } catch (e: any) {
        if (cancelled) return;
        setError(e?.message ?? String(e));
        // Do NOT immediately redirect; show the error so user knows it's a reset-link issue.
        setReady(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (!userId) {
      setError("Session missing. Please open the reset link again or login.");
      return;
    }

    setLoading(true);
    try {
      // Update auth password
      const { error: authError } = await supabase.auth.updateUser({ password: newPassword });
      if (authError) throw authError;

      // Best-effort: clear must_change_password flag.
      // If RLS blocks this, keep it non-fatal (password update is the important part).
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ must_change_password: false })
        .eq("id", userId);

      if (profileError) {
        // Don't fail the whole flow if password was updated successfully.
        console.warn("profiles.must_change_password update failed:", profileError.message);
      }

      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = ready && !loading && !passwordError && newPassword.length >= 8;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Set New Password</h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 mb-4 rounded text-sm">{error}</div>
        )}

        {!ready ? (
          <div className="text-sm text-gray-600">
            Checking your reset session…
            <div className="mt-2">
              If you were redirected here from an email, make sure the reset link opens on{" "}
              <code>/reset-password</code> and your Supabase Auth URL configuration points to your
              production domain.
            </div>
          </div>
        ) : (
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <input
              type="password"
              placeholder="New Password"
              className="w-full p-2 border rounded"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="w-full p-2 border rounded"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />

            {passwordError && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{passwordError}</div>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full bg-blue-600 disabled:bg-blue-300 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              {loading ? "Updating..." : "Update Password & Enter App"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
