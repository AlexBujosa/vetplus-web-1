import { Role } from '@/types/role'
import { useNavigate, Outlet } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { roleAtom } from '@/hooks/use-auth/roleAtom'

interface IRolesAuthRouteProps {
  allowedRoles: Role | Role[]
}

export function RolesAuthRoute(props: IRolesAuthRouteProps) {
  const { allowedRoles } = props
  const navigate = useNavigate()
  const role = useAtomValue(roleAtom)
  const isLoggedIn = localStorage.getItem('token')

  if (!allowedRoles.includes(role!) || !isLoggedIn) {
    navigate(-1)
  }

  return <Outlet />
}
