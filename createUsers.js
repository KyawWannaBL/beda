import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://lppxrrrbkkzcdjovpbsp.supabase.co";
const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwcHhycnJia2t6Y2Rqb3ZwYnNwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDAzODcyNywiZXhwIjoyMDg1NjE0NzI3fQ.RZAD8KR7wcK8CeOep0Rq_9sRIvWgXxbZZc78m94V0qM"; 

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const DEFAULT_PASSWORD = "Britium@2026";

// Example user list
const users = [
  { email: "npw@britiumexpress.com", role: "SUBSTATION_MANAGER" },
  { email: "warehouse001@britiumexpress.com", role: "WAREHOUSE_MANAGER" },
  { email: "dataentry001@britiumexpress.com", role: "DATA_ENTRY" },
  { email: "driver_ygn001@britiumexpress.com", role: "DRIVER" }
];

async function ensureUser(email, role) {
  const { data: existingUsers } = await supabase.auth.admin.listUsers();

  const existing = existingUsers.users.find(u => u.email === email);

  let userId;

  if (existing) {
    console.log(`ℹ️ ${email} already exists.`);
    userId = existing.id;
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password: DEFAULT_PASSWORD,
      email_confirm: true
    });

    if (error) {
      console.log(`❌ ${email}: ${error.message}`);
      return;
    }

    userId = data.user.id;
    console.log(`✅ Created: ${email}`);
  }

  await supabase
    .from("profiles")
    .upsert({
      id: userId,
      role,
      status: "active",
      must_change_password: false,
      email
    });
}
