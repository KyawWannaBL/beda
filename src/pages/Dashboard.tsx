import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

type ProfileRow = {
  id: string;
  email: string | null;
  role: string | null;
  environment: string | null;
  must_change_password: boolean | null;
  is_active: boolean | null;
};

function prettyError(e: unknown) {
  const msg = (e as any)?.message ?? String(e);
  return msg;
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [error, setError] = useState<string>("");

  const headline = useMemo(() => {
    if (!profile?.role) return "Console";
    return profile.role === "APP_OWNER" ? "System Operational" : "Dashboard";
  }, [profile?.role]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError("");

      try {
        const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
        if (sessionErr) throw sessionErr;

        const session = sessionData.session;
        if (!session?.user?.id) {
          navigate("/login");
          return;
        }

        const userId = session.user.id;

        const { data, error: profErr } = await supabase
          .from("profiles")
          .select("id,email,role,environment,must_change_password,is_active")
          .eq("id", userId)
          .maybeSingle();

        if (profErr) throw profErr;

        if (!cancelled) {
          setProfile((data as any) ?? null);

          // Force password reset flow
          if ((data as any)?.must_change_password) {
            navigate("/force-password-reset");
            return;
          }
        }
      } catch (e) {
        const msg = prettyError(e);
        if (!cancelled) {
          setError(msg);

          // If keys are broken, keep user on screen with error
          // (don’t auto-redirect loop)
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const keyHint = useMemo(() => {
    if (!error) return "";
    if (error.toLowerCase().includes("legacy api keys are disabled")) {
      return (
        "Fix: Use sb_publishable_... in the frontend and sb_secret_... (SERVICE_ROLE_KEY) in Edge Functions, " +
        "or re-enable legacy keys in Supabase settings."
      );
    }
    return "";
  }, [error]);

  return (
    <div className="min-h-screen bg-luxury-obsidian text-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{headline}</h1>
            <p className="mt-1 text-white/60">
              {profile?.environment ? `Environment: ${profile.environment}` : "Environment: —"}
            </p>
          </div>

          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate("/login");
            }}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
            <div className="font-semibold text-red-200">Error</div>
            <div className="mt-1 text-sm text-red-200/90">{error}</div>
            {keyHint && <div className="mt-2 text-sm text-red-100/90">{keyHint}</div>}
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          {loading ? (
            <div className="text-white/70">Loading dashboard…</div>
          ) : (
            <>
              <div className="text-white/70 text-sm">Signed-in profile</div>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs text-white/60">Email</div>
                  <div className="mt-1 font-medium">{profile?.email ?? "—"}</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs text-white/60">Role</div>
                  <div className="mt-1 font-medium">{profile?.role ?? "—"}</div>
                </div>
              </div>

              <div className="mt-6 text-sm text-white/60">
                If this page stays blank, open DevTools Console: any error there is usually an auth/key or RLS issue.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
