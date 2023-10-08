import React from 'react'
import { Role } from '@/types/role'
import { useNavigate, Outlet } from 'react-router-dom'
import useUser from '@/hooks/use-user'

interface IRolesAuthRouteProps {
  allowedRoles: Role | Role[]
}

export function RolesAuthRoute(props: IRolesAuthRouteProps) {
  const { allowedRoles } = props
  const navigate = useNavigate()
  const { getUserRole } = useUser()

  const { role } = getUserRole()

  if (!allowedRoles.includes(role)) {
    navigate(-1)
  }

  return <Outlet />
}
