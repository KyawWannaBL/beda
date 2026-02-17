/// <reference lib="deno.unstable" />

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

type AccountInput = {
  email: string;
  role?: string;
  environment?: string;
  is_active?: boolean;
  must_change_password?: boolean;
  full_name?: string;
  branch_code?: string;
};

type RequestBody = {
  secret?: string; // optional if you only use header
  mode?: "sync" | "reset_passwords" | "profiles_only";
  default_role?: string;
  default_environment?: string;
  default_branch_code?: string;
  accounts: AccountInput[];
  dry_run?: boolean;
};

function corsHeaders(origin = "*"): HeadersInit {
  return {
    "access-control-allow-origin": origin,
    "access-control-allow-headers":
      "authorization, x-client-info, apikey, content-type, x-admin-secret",
    "access-control-allow-methods": "POST, OPTIONS",
  };
}

function json(status: number, body: unknown, headers: HeadersInit = {}) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...corsHeaders(),
      ...headers,
    },
  });
}

function normEmail(email: string) {
  return String(email || "").trim().toLowerCase();
}

async function readJson<T>(req: Request): Promise<T> {
  const text = await req.text();
  if (!text) throw new Error("Missing JSON body");
  return JSON.parse(text) as T;
}

async function findAuthUserByEmail(
  supabaseAdmin: ReturnType<typeof createClient>,
  email: string,
) {
  const perPage = 1000;
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage });
    if (error) throw new Error(`listUsers failed: ${error.message}`);
    const hit = data?.users?.find((u) => (u.email || "").toLowerCase() === email);
    if (hit) return hit;
    if (!data?.users || data.users.length < perPage) break;
  }
  return null;
}

async function ensureDefaultBranch(
  supabaseAdmin: ReturnType<typeof createClient>,
  branchCode: string,
) {
  // If branches table doesn't exist, skip quietly.
  const { count, error: countErr } = await supabaseAdmin
    .from("branches")
    .select("*", { count: "exact", head: true });

  if (countErr) return;

  if ((count ?? 0) > 0) return;

  const code = (branchCode || "HQ").trim();
  await supabaseAdmin.from("branches").insert({
    name: "Head Office",
    code,
    is_active: true,
    environment: "production",
  });
}

async function getBranchIdByCode(
  supabaseAdmin: ReturnType<typeof createClient>,
  code?: string,
) {
  if (!code) return null;
  const { data, error } = await supabaseAdmin
    .from("branches")
    .select("id")
    .eq("code", code)
    .limit(1)
    .maybeSingle();

  if (error) return null;
  return data?.id ?? null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders() });
  if (req.method !== "POST") return json(405, { error: "POST only" });

  // ✅ Use names you actually have in `supabase secrets list`
  const RESET_SECRET = Deno.env.get("RESET_ADMIN_SECRET") ?? "";
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? Deno.env.get("PROJECT_URL") ?? "";
  const ADMIN_KEY =
    Deno.env.get("SERVICE_ROLE_KEY") ??
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ??
    "";

  const INITIAL_PASSWORD = Deno.env.get("INITIAL_PASSWORD") ?? "";

  if (!RESET_SECRET || !SUPABASE_URL || !ADMIN_KEY) {
    return json(500, {
      error: "Missing env vars",
      missing: {
        RESET_ADMIN_SECRET: !RESET_SECRET,
        SUPABASE_URL_or_PROJECT_URL: !SUPABASE_URL,
        SERVICE_ROLE_KEY_or_SUPABASE_SERVICE_ROLE_KEY: !ADMIN_KEY,
        INITIAL_PASSWORD_optional: !INITIAL_PASSWORD,
      },
    });
  }

  const headerSecret = req.headers.get("x-admin-secret") ?? "";

  const supabaseAdmin = createClient(SUPABASE_URL, ADMIN_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "X-Client-Info": "reset-accounts/1.0" } },
  });

  try {
    const body = await readJson<RequestBody>(req);

    // Allow either header secret or body secret
    const bodySecret = body.secret ?? "";
    const okSecret = (headerSecret && headerSecret === RESET_SECRET) ||
      (bodySecret && bodySecret === RESET_SECRET);

    if (!okSecret) {
      return json(403, { error: "Forbidden: Invalid admin secret" });
    }

    const dryRun = Boolean(body.dry_run);
    const mode = body.mode ?? "sync";

    const defaultRole = (body.default_role ?? "STAFF").trim();
    const defaultEnv = (body.default_environment ?? "PROD-ENTERPRISE").trim();
    const defaultBranchCode = (body.default_branch_code ?? "HQ").trim();

    const accounts = Array.isArray(body.accounts) ? body.accounts : [];
    if (accounts.length === 0) return json(400, { error: "accounts[] is required" });

    // Seed at least one branch if branches are empty
    if (!dryRun) await ensureDefaultBranch(supabaseAdmin, defaultBranchCode);

    let ok = 0;
    let failed = 0;
    const results: any[] = [];

    for (const a of accounts) {
      const email = normEmail(a.email);
      if (!email || !email.includes("@")) {
        failed++;
        results.push({ email: a.email, status: "error", error: "Invalid email" });
        continue;
      }

      const role = (a.role ?? defaultRole).trim();
      const environment = (a.environment ?? defaultEnv).trim();
      const is_active = a.is_active ?? true;
      const must_change_password = a.must_change_password ?? false;
      const full_name = (a.full_name ?? "").trim() || null;

      try {
        const branch_id = dryRun
          ? null
          : await getBranchIdByCode(supabaseAdmin, a.branch_code ?? defaultBranchCode);

        let authUser = await findAuthUserByEmail(supabaseAdmin, email);
        let authAction: "created" | "updated" | "unchanged" = "unchanged";

        if (!authUser && mode !== "profiles_only") {
          if (!INITIAL_PASSWORD && mode !== "profiles_only") {
            throw new Error("INITIAL_PASSWORD is required to create users");
          }

          if (dryRun) {
            authUser = { id: "DRY_RUN_USER_ID" } as any;
            authAction = "created";
          } else {
            const { data, error } = await supabaseAdmin.auth.admin.createUser({
              email,
              password: INITIAL_PASSWORD,
              email_confirm: true,
              user_metadata: {
                role,
                environment,
                full_name,
                must_change_password,
              },
            });
            if (error) throw error;
            authUser = data.user;
            authAction = "created";
          }
        }

        if (authUser && mode === "reset_passwords") {
          if (!INITIAL_PASSWORD) throw new Error("INITIAL_PASSWORD is empty; cannot reset_passwords");

          if (dryRun) {
            authAction = authAction === "created" ? "created" : "updated";
          } else {
            const { error } = await supabaseAdmin.auth.admin.updateUserById(authUser.id, {
              password: INITIAL_PASSWORD,
              email_confirm: true,
              user_metadata: {
                role,
                environment,
                full_name,
                must_change_password: true,
              },
            });
            if (error) throw error;
            authAction = authAction === "created" ? "created" : "updated";
          }
        }

        if (!authUser?.id) throw new Error("Auth user missing (cannot upsert profile)");

        if (!dryRun) {
          const { error: upsertErr } = await supabaseAdmin.from("profiles").upsert(
            {
              id: authUser.id,
              email,
              role,
              environment,
              is_active,
              must_change_password,
              full_name,
              branch_id,
            },
            { onConflict: "id" },
          );
          if (upsertErr) throw upsertErr;
        }

        ok++;
        results.push({
          email,
          status: "ok",
          auth: authAction,
          profile: dryRun ? "upsert(dry_run)" : "upserted",
          role,
          environment,
          is_active,
          must_change_password,
          branch_id,
        });
      } catch (e: any) {
        failed++;
        results.push({ email, status: "error", error: e?.message ?? String(e) });
      }
    }

    return json(200, {
      dry_run: dryRun,
      mode,
      summary: { ok, failed, total: accounts.length },
      results,
    });
  } catch (e: any) {
    return json(500, { error: e?.message ?? String(e) });
  }
});
