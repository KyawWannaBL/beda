import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function ForcePasswordReset() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      const id = data.session?.user?.id ?? null;
      setUserId(id);
      if (!id) navigate("/login");
    })();
  }, [navigate]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) return setError("Passwords don't match");
    if (newPassword.length < 8) return setError("Password must be at least 8 characters");
    if (!userId) return setError("Session missing. Please login again.");

    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.updateUser({ password: newPassword });
      if (authError) throw authError;

      const { error: profileError } = await supabase
        .from("profiles")
        .update({ must_change_password: false })
        .eq("id", userId);

      if (profileError) throw profileError;

      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message ?? String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">First Time Login</h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 mb-4 rounded text-sm">{error}</div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <input
            type="password"
            placeholder="New Password"
            className="w-full p-2 border rounded"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            className="w-full p-2 border rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? "Updating..." : "Update Password & Enter App"}
          </button>
        </form>
      </div>
    </div>
  );
}
