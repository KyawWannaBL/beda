import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

type Props = {
  allowedRoles?: string[]
  children: React.ReactNode
}

export default function RoleBasedRoute({ allowedRoles = [], children }: Props) {
  const { user, role, loading } = useAuth()
  const location = useLocation()

  if (loading) return null

  // Not signed in
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  // App owner is a super-role in this app
  if (role === 'APP_OWNER') return <>{children}</>

  // No specific role requirement
  if (allowedRoles.length === 0) return <>{children}</>

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}
