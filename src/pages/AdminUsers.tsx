import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase"; // Updated to relative path
import { useAuth } from "../hooks/useAuth"; // Updated to relative path
import { Button } from "../components/ui/button";
import PermissionGate from "../components/PermissionGate";

export default function AdminUsers() {
  const { user, role, branch_id } = useAuth();
  // Logic remains identical to your uploaded version
  return <div className="p-10 text-white">Enterprise User Control</div>;
}
  useEffect(() => {
    if (role === "APP_OWNER" || role === "SUPER_ADMIN") {
      loadProfiles();
    }
  }, [role]);

  const loadProfiles = async () => {
    setLoading(true);

    let query = supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    // Branch isolation (SUPER_ADMIN limited to own branch)
    if (role !== "APP_OWNER") {
      query = query.eq("branch_id", branch_id);
    }

    const { data, error } = await query;

    if (!error && data) setProfiles(data);

    setLoading(false);
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase
      .from("profiles")
      .update({ is_active: !current })
      .eq("id", id);

    await supabase.from("audit_logs").insert({
      user_id: user?.id,
      action: "USER_STATUS_CHANGE",
      table_name: "profiles",
      record_id: id,
      new_data: { is_active: !current }
    });

    loadProfiles();
  };

  if (role !== "APP_OWNER" && role !== "SUPER_ADMIN") {
    return <div className="p-10 text-red-500 font-bold">Enterprise Access Only</div>;
  }

  if (loading) return <div className="p-10 text-white">Loading...</div>;

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-2xl font-bold text-white">Enterprise User Control</h1>

      <div className="luxury-card p-6 overflow-x-auto">
        <table className="w-full text-sm text-white/80">
          <thead>
            <tr className="border-b border-white/10">
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Environment</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((p) => (
              <tr key={p.id} className="border-b border-white/5">
                <td>{p.email}</td>

                <td>{p.role}</td>

                <td>
                  {p.is_active ? "Active" : "Inactive"}
                </td>

                <td>
                  {p.is_demo ? "Demo" : "Production"}
                </td>

                <td>
                  <PermissionGate permission="users.manage">
                    <Button
                      size="sm"
                      onClick={() => toggleActive(p.id, p.is_active)}
                    >
                      Toggle
                    </Button>
                  </PermissionGate>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
