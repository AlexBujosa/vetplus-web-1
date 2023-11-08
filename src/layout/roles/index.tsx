import { Role } from '@/types/role'
import { useNavigate, Outlet } from 'react-router-dom'
import useUser from '@/hooks/use-user'
import { useQuery } from '@tanstack/react-query'

interface IRolesAuthRouteProps {
  allowedRoles: Role | Role[]
}

export function RolesAuthRoute(props: IRolesAuthRouteProps) {
  const { allowedRoles } = props
  const navigate = useNavigate()
  const { getUserRole } = useUser()

  const { data: role } = useQuery({
    queryKey: ['role'],
    queryFn: getUserRole,
  })

  const { getMyProfile } = role

  if (!allowedRoles.includes(getMyProfile.role)) {
    navigate(-1)
  }

  return <Outlet />
}
