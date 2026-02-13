import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  if (req.method !== "POST") return new Response("POST only", { status: 405 });

  const ADMIN_SECRET = Deno.env.get("RESET_ADMIN_SECRET")!;
  const INITIAL_PASSWORD = Deno.env.get("INITIAL_PASSWORD")!; // keep in env only (not UI)

  const provided = req.headers.get("x-admin-secret");
  if (!provided || provided !== ADMIN_SECRET) return new Response("Forbidden", { status: 403 });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );

  // 1) Load desired users
  const { data: seed, error: seedErr } = await supabase
    .from("users_2026_02_12_13_00")
    .select("email, role, full_name, employee_id, city, department, is_active")
    .eq("is_active", true);

  if (seedErr) return new Response(seedErr.message, { status: 500 });

  const desiredEmails = new Set(seed!.map((u) => u.email.toLowerCase()));

  // 2) Delete existing users we want to replace
  const toDeleteDomain = (email: string) =>
    email.toLowerCase().endsWith("@britiumexpress.com") ||
    ["customer1@gmail.com", "customer2@gmail.com", "customer3@gmail.com"].includes(email.toLowerCase());

  let deleted = 0;
  let page = 1;
  const perPage = 1000;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) return new Response(error.message, { status: 500 });

    const users = data.users;
    if (!users.length) break;

    for (const u of users) {
      const email = (u.email || "").toLowerCase();
      if (!email) continue;
      if (toDeleteDomain(email)) {
        await supabase.auth.admin.deleteUser(u.id);
        deleted++;
      }
    }

    if (users.length < perPage) break;
    page++;
  }

  // 3) Create fresh users from seed
  let created = 0;
  const errors: Array<{ email: string; error: string }> = [];

  for (const u of seed!) {
    const email = u.email.toLowerCase();
    try {
      const { data: createdUser, error: cErr } = await supabase.auth.admin.createUser({
        email,
        password: INITIAL_PASSWORD,
        email_confirm: true,
        user_metadata: {
          role: u.role,
          full_name: u.full_name,
          employee_id: u.employee_id,
          city: u.city,
          department: u.department,
          must_change_password: true,
        },
      });
      if (cErr) throw cErr;

      // Ensure profiles row exists + force password change flag
      const id = createdUser.user?.id;
      if (id) {
        await supabase.from("profiles").upsert({
          id,
          email,
          role: u.role,
          must_change_password: true,
          display_name: u.full_name,
        });
      }

      created++;
    } catch (e) {
      errors.push({ email, error: String(e?.message ?? e) });
    }
  }

  // Do NOT return password in response
  return new Response(
    JSON.stringify({ deleted, created, errorCount: errors.length, errors }),
    { headers: { "content-type": "application/json" } }
  );
});
