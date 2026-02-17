import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

type CheckRow = {
  name: string;
  ok: boolean;
  details: string;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading, error: authError } = useAuth();

  const [checks, setChecks] = useState<CheckRow[]>([]);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [authLoading, user, navigate]);

  const runDiagnostics = async () => {
    if (!user) return;
    setChecking(true);

    const rows: CheckRow[] = [];

    // Session
    try {
      const { data, error } = await supabase.auth.getSession();
      rows.push({
        name: "auth.getSession()",
        ok: !error && !!data.session,
        details: error?.message ?? (data.session ? "OK" : "No session"),
      });
    } catch (e: any) {
      rows.push({ name: "auth.getSession()", ok: false, details: e?.message ?? String(e) });
    }

    // Profile fetch
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id,email,role,environment,is_active,must_change_password,branch_id")
        .eq("id", user.id)
        .maybeSingle();

      rows.push({
        name: "profiles (self select)",
        ok: !error && !!data,
        details: error?.message ?? (data ? "OK" : "No profile row found"),
      });
    } catch (e: any) {
      rows.push({ name: "profiles (self select)", ok: false, details: e?.message ?? String(e) });
    }

    // Branches count
    try {
      const { count, error } = await supabase
        .from("branches")
        .select("*", { count: "exact", head: true });

      rows.push({
        name: "branches (count)",
        ok: !error,
        details: error?.message ?? `count=${count ?? 0}`,
      });
    } catch (e: any) {
      rows.push({ name: "branches (count)", ok: false, details: e?.message ?? String(e) });
    }

    // Permissions count
    try {
      const { count, error } = await supabase
        .from("permissions")
        .select("*", { count: "exact", head: true });

      rows.push({
        name: "permissions (count)",
        ok: !error,
        details: error?.message ?? `count=${count ?? 0}`,
      });
    } catch (e: any) {
      rows.push({ name: "permissions (count)", ok: false, details: e?.message ?? String(e) });
    }

    // Role permissions count
    try {
      const { count, error } = await supabase
        .from("role_permissions")
        .select("*", { count: "exact", head: true });

      rows.push({
        name: "role_permissions (count)",
        ok: !error,
        details: error?.message ?? `count=${count ?? 0}`,
      });
    } catch (e: any) {
      rows.push({ name: "role_permissions (count)", ok: false, details: e?.message ?? String(e) });
    }

    setChecks(rows);
    setChecking(false);
  };

  useEffect(() => {
    if (user) runDiagnostics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-200">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="text-sm text-gray-400">
              Signed in as <span className="text-gray-200">{user?.email ?? "—"}</span>
              {" · "}
              Role: <span className="text-gray-200">{profile?.role ?? "UNKNOWN"}</span>
              {" · "}
              Env: <span className="text-gray-200">{profile?.environment ?? "—"}</span>
            </p>
          </div>

          <button
            onClick={runDiagnostics}
            disabled={checking}
            className="px-4 py-2 rounded bg-gray-800 hover:bg-gray-700 disabled:opacity-60"
          >
            {checking ? "Checking…" : "Run diagnostics"}
          </button>
        </header>

        {authError && (
          <div className="rounded border border-red-700 bg-red-950/40 p-3 text-sm">
            <div className="font-medium">Auth error</div>
            <div className="text-red-200">{String(authError)}</div>
          </div>
        )}

        <div className="rounded border border-gray-800 bg-gray-900 p-4">
          <h2 className="font-medium mb-3">Backend checks</h2>

          <div className="space-y-2">
            {checks.length === 0 ? (
              <div className="text-sm text-gray-400">No checks yet.</div>
            ) : (
              checks.map((c) => (
                <div
                  key={c.name}
                  className="flex items-start justify-between gap-4 border border-gray-800 rounded p-3"
                >
                  <div>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-sm text-gray-400">{c.details}</div>
                  </div>
                  <div
                    className={`text-xs px-2 py-1 rounded ${
                      c.ok ? "bg-green-900/40 text-green-200" : "bg-red-900/40 text-red-200"
                    }`}
                  >
                    {c.ok ? "OK" : "FAIL"}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 text-sm text-gray-400">
            If <b>branches count is 0</b> but you expect data, it’s usually missing RLS SELECT policy.
            If <b>profiles select FAIL</b> with recursion, re-run the profiles RLS fix SQL above.
          </div>
        </div>
      </div>
    </div>
  );
}
