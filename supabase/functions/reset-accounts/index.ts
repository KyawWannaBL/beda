/// <reference lib="deno.unstable" />

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

type AccountInput = {
  email: string;
  role?: string;
  environment?: string;
  is_active?: boolean;
  must_change_password?: boolean;
  branch_code?: string;
  full_name?: string;
};

type RequestBody = {
  secret?: string;
  mode?: "sync" | "reset_passwords" | "profiles_only";
  default_role?: string;
  default_environment?: string;
  default_branch_code?: string;
  accounts: AccountInput[];
  dry_run?: boolean;
};

function json(status: number, body: unknown, headers: HeadersInit = {}) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...headers,
    },
  });
}

function corsHeaders(origin = "*"): HeadersInit {
  return {
    "access-control-allow-origin": origin,
    "access-control-allow-headers":
      "authorization, x-client-info, apikey, content-type, x-admin-secret",
    "access-control-allow-methods": "POST, OPTIONS",
  };
}

async function readJson<T>(req: Request): Promise<T> {
  const text = await req.text();
  if (!text) throw new Error("Missing JSON body");
  return JSON.parse(text) as T;
}

function normEmail(email: string) {
  return String(email || "").trim().toLowerCase();
}

async function ensureDefaultBranch(
  supabaseAdmin: ReturnType<typeof createClient>,
  branchCode: string,
) {
  const { count, error } = await supabaseAdmin
    .from("branches")
    .select("*", { count: "exact", head: true });

  if (error) throw new Error(`branches count failed: ${error.message}`);
  if ((count ?? 0) > 0) return;

  const code = (branchCode || "HQ").trim();
  const { error: insErr } = await supabaseAdmin.from("branches").insert({
    name: "Head Office",
    code,
    is_active: true,
    environment: "production",
  });

  if (insErr) throw new Error(`failed to seed default branch: ${insErr.message}`);
}

async function getBranchIdByCode(
  supabaseAdmin: ReturnType<typeof createClient>,
  code: string | undefined,
) {
  if (!code) {
    const { data, error } = await supabaseAdmin
      .from("branches")
      .select("id")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) throw new Error(`branch lookup failed: ${error.message}`);
    return data?.id ?? null;
  }

  const { data, error } = await supabaseAdmin
    .from("branches")
    .select("id")
    .eq("code", code)
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(`branch lookup(${code}) failed: ${error.message}`);
  return data?.id ?? null;
}

async function findAuthUserByEmail(
  supabaseAdmin: ReturnType<typeof createClient>,
  email: string,
) {
  const perPage = 1000;
  for (let page = 1; page <= 10; page++) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      page,
      perPage,
    });
    if (error) throw new Error(`listUsers failed: ${error.message}`);

    const hit = data?.users?.find((u) => (u.email || "").toLowerCase() === email);
    if (hit) return hit;

    if (!data?.users || data.users.length < perPage) break;
  }
  return null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }
  if (req.method !== "POST") {
    return json(405, { error: "Method not allowed. Use POST." }, corsHeaders());
  }

  const SUPABASE_URL =
    Deno.env.get("SUPABASE_URL") ?? Deno.env.get("PROJECT_URL") ?? "";

  // IMPORTANT: Use a server-only elevated key here:
  // - Prefer sb_secret_... (new secret key) OR service_role (legacy) if enabled.
  const ADMIN_KEY =
    Deno.env.get("SERVICE_ROLE_KEY") ??
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ??
    Deno.env.get("KEY") ??
    "";

  const RESET_SECRET = Deno.env.get("RESET_ADMIN_SECRET") ?? "";
  const INITIAL_PASSWORD = Deno.env.get("INITIAL_PASSWORD") ?? "";

  if (!SUPABASE_URL || !ADMIN_KEY || !RESET_SECRET) {
    return json(
      500,
      {
        error:
          "Missing env. Require SUPABASE_URL/PROJECT_URL, SERVICE_ROLE_KEY (or KEY), RESET_ADMIN_SECRET (and optionally INITIAL_PASSWORD).",
        missing: {
          url: !SUPABASE_URL,
          adminKey: !ADMIN_KEY,
          resetAdminSecret: !RESET_SECRET,
          initialPasswordOptional: !INITIAL_PASSWORD,
        },
      },
      corsHeaders(),
    );
  }

  // Custom fetch to avoid putting sb_* keys into Authorization header (see Supabase key notes)
  const safeFetch: typeof fetch = async (input, init = {}) => {
    const headers = new Headers(init.headers);
    headers.set("apikey", ADMIN_KEY);

    const auth = headers.get("Authorization") ?? "";
    const bearerValue = auth.replace(/^Bearer\s+/i, "");
    if (bearerValue === ADMIN_KEY || auth === ADMIN_KEY) {
      headers.delete("Authorization");
    }

    return await fetch(input, { ...init, headers });
  };

  const supabaseAdmin = createClient(SUPABASE_URL, ADMIN_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: safeFetch, headers: { "X-Client-Info": "reset-accounts/2.0" } },
  });

  try {
    const body = await readJson<RequestBody>(req);

    const providedHeader = req.headers.get("x-admin-secret") ?? "";
    const providedBody = body?.secret ?? "";
    const provided = providedHeader || providedBody;

    if (!provided || provided !== RESET_SECRET) {
      return json(403, { error: "Forbidden: Invalid admin secret" }, corsHeaders());
    }

    const dryRun = Boolean(body.dry_run);
    const mode = body.mode ?? "sync";

    const defaultRole = (body.default_role ?? "STAFF").trim();
    const defaultEnv = (body.default_environment ?? "PROD-ENTERPRISE").trim();
    const defaultBranchCode = (body.default_branch_code ?? "HQ").trim();

    const accounts = Array.isArray(body.accounts) ? body.accounts : [];
    if (accounts.length === 0) {
      return json(400, { error: "accounts[] is required" }, corsHeaders());
    }

    if (!dryRun) {
      await ensureDefaultBranch(supabaseAdmin, defaultBranchCode);
    }

    const results: any[] = [];
    let ok = 0;
    let failed = 0;

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
      const must_change_password = a.must_change_password ?? true;

      try {
        const branchId = dryRun
          ? null
          : await getBranchIdByCode(supabaseAdmin, a.branch_code ?? defaultBranchCode);

        let authUser = await findAuthUserByEmail(supabaseAdmin, email);
        let authAction: "created" | "updated" | "unchanged" = "unchanged";

        if (!authUser && mode !== "profiles_only") {
          if (!INITIAL_PASSWORD && mode !== "sync") {
            throw new Error("INITIAL_PASSWORD is empty; cannot create/reset users");
          }

          if (dryRun) {
            authUser = { id: "DRY_RUN_USER_ID" } as any;
            authAction = "created";
          } else {
            const { data, error } = await supabaseAdmin.auth.admin.createUser({
              email,
              password: INITIAL_PASSWORD || undefined,
              email_confirm: true,
              user_metadata: {
                role,
                full_name: a.full_name ?? null,
                must_change_password,
              },
            });
            if (error) throw error;
            authUser = data.user;
            authAction = "created";
          }
        }

        if (authUser && mode === "reset_passwords") {
          if (!INITIAL_PASSWORD) throw new Error("INITIAL_PASSWORD is empty; cannot reset");

          if (dryRun) {
            authAction = authAction === "created" ? "created" : "updated";
          } else {
            const { error } = await supabaseAdmin.auth.admin.updateUserById(authUser.id, {
              password: INITIAL_PASSWORD,
              email_confirm: true,
              user_metadata: { role, must_change_password: true },
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
              branch_id: branchId,
              full_name: a.full_name ?? null,
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
          branch_id: branchId,
          is_active,
          must_change_password,
        });
      } catch (e: any) {
        failed++;
        results.push({ email, status: "error", error: e?.message ?? String(e) });
      }
    }

    return json(
      200,
      { dry_run: dryRun, mode, summary: { ok, failed, total: accounts.length }, results },
      corsHeaders(),
    );
  } catch (e: any) {
    return json(500, { error: e?.message ?? String(e) }, corsHeaders());
  }
});
