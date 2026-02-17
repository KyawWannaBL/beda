/// <reference lib="deno.unstable" />

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

type AccountInput = {
  email: string;
  role?: string;
  environment?: string;
  is_active?: boolean;
  must_change_password?: boolean;
  full_name?: string | null;
};

type RequestBody = {
  // Either send secret in JSON body OR use x-admin-secret header
  secret?: string;

  // If accounts is empty, we will try to read from seed_table
  seed_table?: string; // default: "users_2026_02_11_14_10"

  mode?: "sync" | "reset_passwords" | "profiles_only";
  default_role?: string; // default: "STAFF"
  default_environment?: string; // default: "PROD-ENTERPRISE"

  accounts?: AccountInput[];
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

function json(status: number, body: unknown, extraHeaders: HeadersInit = {}) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...corsHeaders(),
      ...extraHeaders,
    },
  });
}

async function readJson<T>(req: Request): Promise<T> {
  const text = await req.text();
  if (!text) throw new Error("Missing JSON body");
  return JSON.parse(text) as T;
}

function normEmail(email: string) {
  return String(email || "").trim().toLowerCase();
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
    return json(405, { error: "Method not allowed. Use POST." });
  }

  const SUPABASE_URL =
    Deno.env.get("SUPABASE_URL") ??
    Deno.env.get("PROJECT_URL") ??
    "";

  // IMPORTANT:
  // - Put sb_secret_... in SERVICE_ROLE_KEY (recommended)
  // - If you re-enable legacy keys, you can also use SUPABASE_SERVICE_ROLE_KEY (eyJ...)
  const ADMIN_KEY =
    Deno.env.get("SERVICE_ROLE_KEY") ??
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ??
    "";

  const RESET_SECRET = Deno.env.get("RESET_ADMIN_SECRET") ?? "";
  const INITIAL_PASSWORD = Deno.env.get("INITIAL_PASSWORD") ?? "";

  if (!SUPABASE_URL || !ADMIN_KEY || !RESET_SECRET) {
    return json(500, {
      error: "Missing required env vars",
      missing: {
        SUPABASE_URL_or_PROJECT_URL: !SUPABASE_URL,
        SERVICE_ROLE_KEY_or_SUPABASE_SERVICE_ROLE_KEY: !ADMIN_KEY,
        RESET_ADMIN_SECRET: !RESET_SECRET,
        INITIAL_PASSWORD_optional: !INITIAL_PASSWORD,
      },
    });
  }

  const supabaseAdmin = createClient(SUPABASE_URL, ADMIN_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "X-Client-Info": "reset-accounts/2.0" } },
  });

  try {
    const body = await readJson<RequestBody>(req);

    const headerSecret = req.headers.get("x-admin-secret") ?? "";
    const bodySecret = body.secret ?? "";
    const provided = headerSecret || bodySecret;

    if (!provided || provided !== RESET_SECRET) {
      return json(403, { error: "Forbidden: Invalid admin secret" });
    }

    const dryRun = Boolean(body.dry_run);
    const mode = body.mode ?? "sync";
    const defaultRole = (body.default_role ?? "STAFF").trim();
    const defaultEnv = (body.default_environment ?? "PROD-ENTERPRISE").trim();

    let accounts: AccountInput[] = Array.isArray(body.accounts) ? body.accounts : [];

    // If accounts not provided, try seed table
    if (accounts.length === 0) {
      const seedTable = (body.seed_table ?? "users_2026_02_11_14_10").trim();

      const { data: seed, error: seedErr } = await supabaseAdmin
        .from(seedTable)
        .select("email, role, full_name, is_active")
        .eq("is_active", true);

      if (seedErr) {
        // Common when table name is wrong or not in schema cache
        return json(500, {
          error: `Seed data lookup failed: ${seedErr.message}`,
          hint:
            "Either pass accounts[] in the request OR set seed_table to an existing table name.",
        });
      }

      accounts = (seed ?? []).map((u: any) => ({
        email: u.email,
        role: u.role,
        full_name: u.full_name ?? null,
        is_active: true,
      }));

      if (accounts.length === 0) {
        return json(200, {
          dry_run: dryRun,
          mode,
          deleted: 0,
          created: 0,
          note: "Seed table returned 0 active users. Provide accounts[] or insert seed rows.",
        });
      }
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

      // For reset flows, you usually want this TRUE
      const must_change_password =
        a.must_change_password ?? (mode === "reset_passwords" ? true : false);

      try {
        let authUser = await findAuthUserByEmail(supabaseAdmin, email);
        let authAction: "created" | "updated" | "unchanged" = "unchanged";

        // Create auth user if missing (unless profiles_only)
        if (!authUser && mode !== "profiles_only") {
          if (!INITIAL_PASSWORD && mode !== "sync") {
            throw new Error("INITIAL_PASSWORD is required for creating users");
          }

          if (!dryRun) {
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
          } else {
            authUser = { id: "DRY_RUN" } as any;
          }
          authAction = "created";
        }

        // Reset password if requested
        if (authUser && mode === "reset_passwords") {
          if (!INITIAL_PASSWORD) throw new Error("INITIAL_PASSWORD is empty");

          if (!dryRun) {
            const { error } = await supabaseAdmin.auth.admin.updateUserById(
              authUser.id,
              {
                password: INITIAL_PASSWORD,
                email_confirm: true,
                user_metadata: {
                  role,
                  full_name: a.full_name ?? null,
                  must_change_password: true,
                },
              },
            );
            if (error) throw error;
          }
          authAction = authAction === "created" ? "created" : "updated";
        }

        if (!authUser?.id) throw new Error("Auth user missing; cannot upsert profile");

        // Upsert profile. Keep payload STRICT to columns you’re sure exist.
        const profilePayload: Record<string, unknown> = {
          id: authUser.id,
          email,
          role,
          environment,
          is_active,
          must_change_password,
        };

        // Only include full_name if your profiles table has it (comment out if not)
        if (a.full_name !== undefined) profilePayload.full_name = a.full_name;

        if (!dryRun) {
          const { error: upsertErr } = await supabaseAdmin
            .from("profiles")
            .upsert(profilePayload, { onConflict: "id" });

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
      note:
        "If you still see 'Legacy API keys are disabled', switch ADMIN_KEY to sb_secret_... or re-enable legacy keys in Supabase.",
    });
  } catch (e: any) {
    return json(500, { error: e?.message ?? String(e) });
  }
});
