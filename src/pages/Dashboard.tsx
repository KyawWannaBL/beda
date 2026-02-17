import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

type Profile = {
  id: string;
  email: string | null;
  role: string | null;
  environment: string | null;
  is_active: boolean | null;
  must_change_password: boolean | null;
  full_name?: string | null;
  branch_id?: string | null;
};

export default function Dashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError("");

      const { data, error: sessionErr } = await supabase.auth.getSession();
      if (sessionErr) {
        if (!cancelled) setError(sessionErr.message);
        if (!cancelled) setLoading(false);
        return;
      }

      const user = data.session?.user;
      if (!user) {
        navigate("/login", { replace: true });
        return;
      }

      // If you want forced reset behavior:
      // (You can remove this block if not needed)
      // We'll still fetch profile first, because your must_change_password is stored in profiles.

      setLoading(false);
      setProfileLoading(true);

      const { data: p, error: pErr } = await supabase
        .from("profiles")
        .select("id,email,role,environment,is_active,must_change_password,full_name,branch_id")
        .eq("id", user.id)
        .maybeSingle();

      if (cancelled) return;

      if (pErr) {
        // Common: 42P17 infinite recursion detected in policy for relation "profiles"
        setError(
          `Profile load failed: ${pErr.message}${
            (pErr as any).code ? ` (code ${(pErr as any).code})` : ""
          }`
        );
        setProfile(null);
      } else {
        setProfile(p as any);

        if (p?.must_change_password) {
          navigate("/force-password-reset", { replace: true });
          return;
        }
      }

      setProfileLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="opacity-80">Loading session…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="opacity-70 text-sm">System Operational · PROD-ENTERPRISE</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <div className="font-semibold mb-1">Error</div>
            <div className="text-sm opacity-90 whitespace-pre-wrap">{error}</div>

            <div className="mt-3 text-sm opacity-80">
              If you see recursion/policy errors for <code>profiles</code>, fix your RLS policies
              (don’t query <code>profiles</code> from inside a <code>profiles</code> policy).
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="font-semibold mb-3">Profile</div>

          {profileLoading ? (
            <div className="opacity-80">Loading profile…</div>
          ) : profile ? (
            <div className="text-sm space-y-2">
              <div>
                <span className="opacity-70">Email:</span> {profile.email ?? "—"}
              </div>
              <div>
                <span className="opacity-70">Role:</span> {profile.role ?? "—"}
              </div>
              <div>
                <span className="opacity-70">Environment:</span> {profile.environment ?? "—"}
              </div>
              <div>
                <span className="opacity-70">Active:</span>{" "}
                {String(profile.is_active ?? false)}
              </div>
              <div>
                <span className="opacity-70">Must change password:</span>{" "}
                {String(profile.must_change_password ?? false)}
              </div>
              <div>
                <span className="opacity-70">Branch:</span> {profile.branch_id ?? "—"}
              </div>
            </div>
          ) : (
            <div className="opacity-80">
              No profile row found for this user (or blocked by RLS).
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
