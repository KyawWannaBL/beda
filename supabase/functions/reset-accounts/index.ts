/// <reference lib="deno.unstable" />

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

type AccountInput = {
  email: string;
  role?: string; // must match your public.app_role enum value
  environment?: string; // e.g. "PROD-ENTERPRISE"
  is_active?: boolean;
  must_change_password?: boolean;
  branch_code?: string; // matches public.branches.code
  full_name?: string; // optional, if you use it
};

type RequestBody = {
  secret: string;
  mode?: "sync" | "reset_passwords" | "profiles_only";
  default_role?: string;
  default_environment?: string;
  default_branch_code?: string;
  accounts: AccountInput[];
  dry_run?: boolean;
};

const ALLOWED_ROLES = new Set([
  "APP_OWNER",
  "CUSTOMER",
  "CUSTOMER_SERVICE",
  "DATA_ENTRY",
  "DRIVER",
  "FINANCE_STAFF",
  "FINANCE_USER",
  "HELPER",
  "HR_ADMIN",
  "MARKETING_ADMIN",
  "MERCHANT",
  "OPERATIONS_ADMIN",
  "RIDER",
  "STAFF",
  "SUBSTATION_MANAGER",
  "SUPERVISOR",
  "SUPER_ADMIN",
  "WAREHOUSE_MANAGER",
]);

function json(status: number, body: unknown, extraHeaders: HeadersInit = {}) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...extraHeaders,
    },
  });
}

function corsHeaders(origin = "*"): HeadersInit {
  return {
    "access-control-allow-origin": origin,
    "access-control-allow-headers":
      "authorization, x-client-info, apikey, content-type, x-reset-secret",
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

function env(name: string, fallback?: string) {
  return Deno.env.get(name) ?? fallback ?? "";
}

function getSupabaseUrl() {
  // Supabase usually injects SUPABASE_URL in Edge Functions.
  // If not, allow PROJECT_URL as a manual secret.
  const url = env("SUPABASE_URL") || env("PROJECT_URL");
  return url;
}

function getServiceRoleKey() {
  // IMPORTANT: Supabase secrets cannot start with SUPABASE_, so use SERVICE_ROLE_KEY.
  // Keep a fallback for local/dev if you have it in your shell env.
  const key = env("SERVICE_ROLE_KEY") || env("SUPABASE_SERVICE_ROLE_KEY");
  return key;
}

async function ensureDefaultBranch(
  supabaseAdmin: ReturnType<typeof createClient>,
  branchCode: string,
) {
  const { count, error: countErr } = await supabaseAdmin
    .from("branches")
    .select("*", { count: "exact", head: true });

  if (countErr) throw new Error(`branches count failed: ${countErr.message}`);
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

    const hit = data?.users?.find((u) =>
      (u.email || "").toLowerCase() === email
    );
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

  const SUPABASE_URL = getSupabaseUrl();
  const SERVICE_ROLE_KEY = getServiceRoleKey();
  const RESET_SECRET = env("RESET_ADMIN_SECRET");
  const INITIAL_PASSWORD = env("INITIAL_PASSWORD"); // optional but needed for create/reset_passwords

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !RESET_SECRET) {
    return json(
      500,
      {
        error:
          "Missing env. Require SUPABASE_URL (or PROJECT_URL), SERVICE_ROLE_KEY, RESET_ADMIN_SECRET. Optionally INITIAL_PASSWORD.",
        missing: {
          SUPABASE_URL_or_PROJECT_URL: !SUPABASE_URL,
          SERVICE_ROLE_KEY: !SERVICE_ROLE_KEY,
          RESET_ADMIN_SECRET: !RESET_SECRET,
        },
      },
      corsHeaders(),
    );
  }

  const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "X-Client-Info": "reset-accounts/1.1" } },
  });

  try {
    const body = await readJson<RequestBody>(req);

    // Allow secret either in JSON or header.
    const headerSecret = req.headers.get("x-reset-secret") ?? "";
    const supplied = (body?.secret ?? "") || headerSecret;

    if (!supplied || supplied !== RESET_SECRET) {
      return json(401, { error: "Unauthorized" }, corsHeaders());
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

    if (!ALLOWED_ROLES.has(defaultRole)) {
      return json(
        400,
        { error: `default_role "${defaultRole}" is not allowed` },
        corsHeaders(),
      );
    }

    // Seed a branch if branches is empty (you saw branches_count = 0)
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
      const must_change_password = a.must_change_password ?? false;

      if (!ALLOWED_ROLES.has(role)) {
        failed++;
        results.push({
          email,
          status: "error",
          error: `role "${role}" is not allowed`,
        });
        continue;
      }

      try {
        const branchId = dryRun
          ? null
          : await getBranchIdByCode(
            supabaseAdmin,
            a.branch_code ?? defaultBranchCode,
          );

        // 1) Ensure Auth user exists
        let authUser = await findAuthUserByEmail(supabaseAdmin, email);
        let authAction: "created" | "updated" | "unchanged" = "unchanged";

        if (!authUser && mode !== "profiles_only") {
          if (!INITIAL_PASSWORD && !dryRun) {
            throw new Error(
              "INITIAL_PASSWORD is required to create users (mode=sync). Set INITIAL_PASSWORD secret.",
            );
          }

          if (dryRun) {
            authAction = "created";
            authUser = { id: "DRY_RUN" } as any;
          } else {
            const { data, error } = await supabaseAdmin.auth.admin.createUser({
              email,
              password: INITIAL_PASSWORD || undefined,
              email_confirm: true,
            });
            if (error) throw error;
            authUser = data.user;
            authAction = "created";
          }
        }

        // 2) Reset passwords (optional mode)
        if (authUser && mode === "reset_passwords") {
          if (!INITIAL_PASSWORD) {
            throw new Error("INITIAL_PASSWORD is empty; cannot reset_passwords");
          }

          if (dryRun) {
            authAction = authAction === "created" ? "created" : "updated";
          } else {
            const { error } = await supabaseAdmin.auth.admin.updateUserById(
              authUser.id,
              { password: INITIAL_PASSWORD, email_confirm: true },
            );
            if (error) throw error;
            authAction = authAction === "created" ? "created" : "updated";
          }
        }

        // 3) Upsert profile (id must match auth.users.id)
        if (!authUser?.id) {
          throw new Error("Auth user missing (cannot upsert profile)");
        }

        if (!dryRun) {
          const payload: Record<string, unknown> = {
            id: authUser.id,
            email,
            role,
            environment,
            is_active,
            must_change_password,
            branch_id: branchId,
          };

          // Only set if your table has it; safe to include if column exists
          if (a.full_name) payload["full_name"] = a.full_name;

          const { error: upsertErr } = await supabaseAdmin
            .from("profiles")
            .upsert(payload, { onConflict: "id" });

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
        results.push({
          email,
          status: "error",
          error: e?.message ?? String(e),
        });
      }
    }

    return json(
      200,
      {
        dry_run: dryRun,
        mode,
        summary: { ok, failed, total: accounts.length },
        results,
      },
      corsHeaders(),
    );
  } catch (e: any) {
    return json(500, { error: e?.message ?? String(e) }, corsHeaders());
  }
});
