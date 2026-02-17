import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShieldCheck, Database, Users, MapPin, KeyRound, ArrowRight } from 'lucide-react'

import { supabase } from '@/lib/supabase'
import { navForRole } from '@/config/navigation'
import type { AppRole } from '@/types/roles'

type Counts = {
  branches: number | null
  permissions: number | null
  rolePermissions: number | null
  shipments: number | null
}

type Profile = {
  id: string
  email: string
  role: string
  environment?: string | null
  must_change_password?: boolean | null
  is_active?: boolean | null
  branch_id?: string | null
  full_name?: string | null
}

function StatCard({
  title,
  icon: Icon,
  value,
  subtitle,
}: {
  title: string
  icon: React.ComponentType<{ className?: string }>
  value: React.ReactNode
  subtitle?: string
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-white/80" />
        </div>
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-widest text-white/60">{title}</div>
          {subtitle ? <div className="text-[11px] text-white/40 truncate">{subtitle}</div> : null}
        </div>
      </div>
      <div className="mt-4 text-3xl font-semibold text-white">{value}</div>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [counts, setCounts] = useState<Counts>({
    branches: null,
    permissions: null,
    rolePermissions: null,
    shipments: null,
  })

  const displayName = useMemo(() => {
    if (!profile) return ''
    return profile.full_name || profile.email
  }, [profile])

  const quickLinks = useMemo(() => {
    const role = (profile?.role as AppRole | undefined) ?? undefined
    return navForRole(role)
      .filter((i) => i.href !== '/dashboard')
      .slice(0, 6)
  }, [profile?.role])

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      setLoading(true)
      setError(null)

      const { data: sess } = await supabase.auth.getSession()
      const userId = sess.session?.user?.id

      if (!userId) {
        if (!cancelled) navigate('/login')
        return
      }

      const { data: p, error: pErr } = await supabase
        .from('profiles')
        .select('id,email,role,environment,must_change_password,is_active,branch_id,full_name')
        .eq('id', userId)
        .maybeSingle()

      if (pErr) {
        if (!cancelled) {
          setError(
            `Profile load failed: ${pErr.message}. This is typically an RLS/policy issue on public.profiles.`,
          )
          setLoading(false)
        }
        return
      }

      if (!cancelled) setProfile((p as any) ?? null)

      const [branchesRes, permRes, rolePermRes, shipRes] = await Promise.all([
        supabase.from('branches').select('id', { count: 'exact', head: true }),
        supabase.from('permissions').select('id', { count: 'exact', head: true }),
        supabase.from('role_permissions').select('permission_id', { count: 'exact', head: true }),
        supabase.from('shipments').select('id', { count: 'exact', head: true }),
      ])

      const firstErr = branchesRes.error || permRes.error || rolePermRes.error || shipRes.error
      if (firstErr && !cancelled) {
        setError(
          `Data load warning: ${firstErr.message}. If the dashboard looks empty, verify SELECT RLS policies for branches/permissions/role_permissions/shipments.`,
        )
      }

      if (!cancelled) {
        setCounts({
          branches: branchesRes.count ?? null,
          permissions: permRes.count ?? null,
          rolePermissions: rolePermRes.count ?? null,
          shipments: shipRes.count ?? null,
        })
        setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [navigate])

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-white/70">
          <ShieldCheck className="h-4 w-4" />
          <span className="text-xs uppercase tracking-widest">Britium Enterprise Console</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <div className="text-sm text-white/60">
              {profile ? (
                <>
                  Signed in as <span className="text-white">{displayName}</span>
                  {' — '}
                  role <span className="text-white">{profile.role}</span>
                </>
              ) : (
                'Loading session…'
              )}
            </div>
          </div>

          {profile?.must_change_password ? (
            <button
              onClick={() => navigate('/force-password-reset')}
              className="px-4 py-2 rounded-xl bg-white text-black font-medium"
            >
              Update Password
            </button>
          ) : null}
        </div>
      </header>

      {error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {/* Quick links */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-white">Quick links</h2>
          <div className="text-xs text-white/50">(based on your role)</div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickLinks.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="group rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-white/80" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{item.name}</div>
                    <div className="text-xs text-white/50">Open module</div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-white/40 group-hover:text-white/80 transition" />
              </div>
            </Link>
          ))}

          {quickLinks.length === 0 ? (
            <div className="col-span-full text-sm text-white/60">
              No modules assigned for your role yet. Check your <code>profiles.role</code> value and
              role-based routing rules.
            </div>
          ) : null}
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Branches"
          icon={MapPin}
          value={loading ? '…' : counts.branches ?? '—'}
          subtitle={counts.branches === 0 ? '0 rows — seed branches or allow SELECT' : 'Operational locations'}
        />
        <StatCard
          title="Permissions"
          icon={KeyRound}
          value={loading ? '…' : counts.permissions ?? '—'}
          subtitle="Permission catalog"
        />
        <StatCard
          title="Role Permissions"
          icon={Users}
          value={loading ? '…' : counts.rolePermissions ?? '—'}
          subtitle="Role → permission mappings"
        />
        <StatCard
          title="Shipments"
          icon={Database}
          value={loading ? '…' : counts.shipments ?? '—'}
          subtitle="Visible to your role/RLS"
        />
      </div>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold text-white">If the dashboard is empty</h2>
        <ol className="mt-3 space-y-2 text-sm text-white/70 list-decimal pl-5">
          <li>
            Your SQL showed <b>branches_count = 0</b>. Create at least one branch (e.g. HQ) so
            branch-based filters have something to reference.
          </li>
          <li>
            If counts show 0 but you expect data, RLS is blocking SELECT. Add SELECT policies for{' '}
            <code>branches</code>, <code>permissions</code>, <code>role_permissions</code>, and{' '}
            <code>shipments</code>.
          </li>
          <li>
            If you’re stuck in first-time login, go to <code>/force-password-reset</code> (button
            above appears when <code>must_change_password</code> is true).
          </li>
        </ol>
      </section>
    </div>
  )
}
