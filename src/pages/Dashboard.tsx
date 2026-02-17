// src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

type ProfileRow = {
  id: string;
  email: string | null;
  role: string | null;
  environment: string | null;
  is_active: boolean | null;
  must_change_password: boolean | null;
  branch_id: string | null;
};

function isLegacyKeyDisabledError(msg: string) {
  return msg.toLowerCase().includes("legacy api keys are disabled");
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const [email, setEmail] = useState<string>("");
  const [profile, setProfile] = useState<ProfileRow | null>(null);

  const [counts, setCounts] = useState({
    branches: 0,
    permissions: 0,
    role_permissions: 0,
  });

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      setError("");

      const { data: sessData, error: sessErr } = await supabase.auth.getSession();
      if (sessErr) throw sessErr;

      const session = sessData.session;
      if (!session) {
        navigate("/login", { replace: true });
        return;
      }

      const userId = session.user.id;
      setEmail(session.user.email ?? "");

      const [profileRes, branchesRes, permsRes, rolePermsRes] = await Promise.all([
        supabase
          .from("profiles")
          .select(
            "id,email,role,environment,is_active,must_change_password,branch_id",
          )
          .eq("id", userId)
          .maybeSingle(),
        supabase.from("branches").select("*", { count: "exact", head: true }),
        supabase.from("permissions").select("*", { count: "exact", head: true }),
        supabase
          .from("role_permissions")
          .select("*", { count: "exact", head: true }),
      ]);

      if (profileRes.error) throw profileRes.error;
      if (branchesRes.error) throw branchesRes.error;
      if (permsRes.error) throw permsRes.error;
      if (rolePermsRes.error) throw rolePermsRes.error;

      if (!alive) return;

      setProfile((profileRes.data as any) ?? null);
      setCounts({
        branches: branchesRes.count ?? 0,
        permissions: permsRes.count ?? 0,
        role_permissions: rolePermsRes.count ?? 0,
      });
    })()
      .catch((e: any) => {
        if (!alive) return;
        setError(e?.message ?? String(e));
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [navigate]);

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen p-6 bg-black text-white">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="text-white/70 text-sm">{email}</p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20"
          >
            Logout
          </button>
        </div>

        {loading && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            Loading…
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <div className="font-semibold text-red-200">Error</div>
            <div className="text-red-100 text-sm mt-1 break-words">{error}</div>

            {isLegacyKeyDisabledError(error) && (
              <div className="text-sm mt-3 text-red-100/90 space-y-2">
                <div className="font-semibold">Fix:</div>
                <ul className="list-disc ml-5 space-y-1">
                  <li>
                    Update your frontend env key to a <b>publishable</b> key
                    (<code>sb_publishable_...</code>), or re-enable legacy keys in
                    Supabase API settings.
                  </li>
                  <li>
                    Never use <b>secret</b> keys (<code>sb_secret_...</code>) in the browser.
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Stat label="Branches" value={counts.branches} />
              <Stat label="Permissions" value={counts.permissions} />
              <Stat label="Role Permissions" value={counts.role_permissions} />
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <h2 className="text-lg font-semibold mb-3">My Profile</h2>

              {!profile ? (
                <div className="text-white/70 text-sm">
                  No profile row found for this user id. (profiles.id should match auth.users.id)
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <Field k="role" v={profile.role} />
                  <Field k="environment" v={profile.environment} />
                  <Field k="is_active" v={String(profile.is_active)} />
                  <Field k="must_change_password" v={String(profile.must_change_password)} />
                  <Field k="branch_id" v={profile.branch_id} />
                </div>
              )}

              {counts.branches === 0 && (
                <div className="mt-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-100">
                  Your <b>branches</b> table is empty. If your UI expects at least one branch,
                  seed a default branch (or run your reset-accounts function with a “seed branch” step).
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="text-white/70 text-sm">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}

function Field({ k, v }: { k: string; v: string | null }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-3">
      <div className="text-white/60 text-xs">{k}</div>
      <div className="mt-1 break-words">{v ?? "-"}</div>
    </div>
  );
}
