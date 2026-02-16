import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";

type PermissionCode = string;

type ProfileRow = {
  id: string;
  email?: string | null;
  full_name?: string | null;
  role?: string | null;
  branch_id?: string | null;
  must_change_password?: boolean | null;
  is_active?: boolean | null;
  [k: string]: any;
};

type UserData = {
  id: string;
  email?: string | null;
  full_name?: string | null;
  role?: string | null;
  branch_id?: string | null;
  permissions: Record<PermissionCode, true>;
};

type AuthContextValue = {
  loading: boolean;
  user: ProfileRow | null;
  role: string | null;
  branch_id: string | null;
  permissions: PermissionCode[];
  userData: UserData | null;
  legacyUser: any | null;
  login: (email: string, password: string) => Promise<{ mustChangePassword: boolean }>;
  logout: () => Promise<void>;
  changePassword: (newPassword: string) => Promise<void>;
  hasPermission: (permission: PermissionCode) => boolean;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchProfile(userId: string): Promise<ProfileRow | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.warn("[auth] profile fetch failed", error);
    return null;
  }
  return (data as ProfileRow) ?? null;
}

async function fetchPermissionCodes(role: string): Promise<PermissionCode[]> {
  // APP_OWNER bypasses checks in-code, but we still try to hydrate a full list for UIs.
  if (role === "APP_OWNER") {
    const { data } = await supabase.from("permissions").select("code").order("code");
    return (data ?? []).map((p: any) => p.code).filter(Boolean);
  }

  // Try relational select first (requires FK from role_permissions.permission_id -> permissions.id).
  const relational = await supabase
    .from("role_permissions")
    .select("permission_id, permissions ( code )")
    .eq("role", role);

  if (!relational.error && relational.data) {
    const codes = (relational.data as any[])
      .map((rp) => rp?.permissions?.code)
      .filter(Boolean);
    return Array.from(new Set(codes));
  }

  // Fallback: 2-step query
  const { data: rpData } = await supabase
    .from("role_permissions")
    .select("permission_id")
    .eq("role", role);

  const ids = (rpData ?? []).map((r: any) => r.permission_id).filter(Boolean);
  if (!ids.length) return [];

  const { data: permData } = await supabase.from("permissions").select("code").in("id", ids);
  const codes = (permData ?? []).map((p: any) => p.code).filter(Boolean);
  return Array.from(new Set(codes));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<ProfileRow | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [branchId, setBranchId] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<PermissionCode[]>([]);

  const hydrateFromSession = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    const sessionUser = data.session?.user;

    if (!sessionUser) {
      setUser(null);
      setRole(null);
      setBranchId(null);
      setPermissions([]);
      return;
    }

    const profile = await fetchProfile(sessionUser.id);
    const resolvedRole = profile?.role ?? null;
    const resolvedBranch = profile?.branch_id ?? null;

    setUser({
      // Preserve the profile as the primary user object (UI expects full_name, branch_id, etc.)
      ...profile,
      id: sessionUser.id,
      email: profile?.email ?? sessionUser.email ?? null,
    });
    setRole(resolvedRole);
    setBranchId(resolvedBranch);

    if (resolvedRole) {
      const codes = await fetchPermissionCodes(resolvedRole);
      setPermissions(codes);
    } else {
      setPermissions([]);
    }
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      await hydrateFromSession();
    } finally {
      setLoading(false);
    }
  }, [hydrateFromSession]);

  useEffect(() => {
    // Initial load
    refresh();

    // Keep state in sync with auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async () => {
      await refresh();
    });

    return () => subscription.unsubscribe();
  }, [refresh]);

  const hasPermission = useCallback(
    (permission: PermissionCode) => {
      if (!user || !role) return false;
      if (role === "APP_OWNER") return true;
      return permissions.includes(permission);
    },
    [user, role, permissions]
  );

  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    // Hydrate immediately so callers can route deterministically.
    await refresh();

    // Evaluate must_change_password from profile (preferred) or fallback to false.
    const profile = await fetchProfile(data.user.id);
    return { mustChangePassword: Boolean(profile?.must_change_password) };
  }, [refresh]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    // onAuthStateChange will refresh state.
  }, []);

  const changePassword = useCallback(
    async (newPassword: string) => {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      const currentId = user?.id;
      if (currentId) {
        await supabase
          .from("profiles")
          .update({ must_change_password: false })
          .eq("id", currentId);
      }

      await refresh();
    },
    [user?.id, refresh]
  );

  const userData: UserData | null = useMemo(() => {
    if (!user) return null;
    const map: Record<PermissionCode, true> = {};
    for (const p of permissions) map[p] = true;
    return {
      id: user.id,
      email: user.email ?? null,
      full_name: user.full_name ?? null,
      role: user.role ?? null,
      branch_id: user.branch_id ?? null,
      permissions: map,
    };
  }, [user, permissions]);

  // Best-effort legacy shim (some pages still reference legacyUser)
  const legacyUser = useMemo(() => {
    if (!userData) return null;
    return {
      id: userData.id,
      name: userData.full_name ?? (userData.email?.split("@")[0] ?? "User"),
      email: userData.email ?? "",
      role: userData.role ?? "",
      permissions: Object.keys(userData.permissions),
      isActive: Boolean(user?.is_active ?? true),
      createdAt: user?.created_at ? new Date(user.created_at) : new Date(),
      lastLogin: new Date(),
      batchId: user?.batch_id ?? undefined,
    };
  }, [user, userData]);

  const value: AuthContextValue = {
    loading,
    user,
    role,
    branch_id: branchId,
    permissions,
    userData,
    legacyUser,
    login,
    logout,
    changePassword,
    hasPermission,
    refresh,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
