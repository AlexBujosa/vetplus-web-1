import client from '@/utils/apolloClient'
import { SIGN_WITH_EMAIL_QUERY } from '@/graphql/auth'
import { useNavigate } from 'react-router-dom'
import useUser from '@/hooks/use-user'
import { allowedRoles, routes } from '@/config/routes'
import { useSetAtom } from 'jotai'
import { roleAtom } from './roleAtom'
import { useQuery } from '@tanstack/react-query'
import { Role } from '@/types/role'

export type LoginSubmitForm = {
  email: string
  password: string
}

export default function useAuth() {
  const navigate = useNavigate()
  const { getUserRole } = useUser()

  const setRole = useSetAtom(roleAtom)

  const { data: role } = useQuery({
    queryKey: ['role'],
    queryFn: getUserRole,
  })

  async function loginWithEmail({ email, password }: LoginSubmitForm) {
    const variables = {
      signInInput: {
        email,
        password,
      },
    }

    const data: any = await client.request(SIGN_WITH_EMAIL_QUERY, variables)

    const token = data.signInWithEmail.access_token

    localStorage.setItem('token', token)
    const { getMyProfile } = role
    setRole(getMyProfile.role)

    if (!allowedRoles.includes(getMyProfile.role)) {
      throw new Error('Forbidden error')
    }

    navigate(routes.admin.pages.clients.href)
  }

  function logout() {
    localStorage.removeItem('token')
    navigate(routes.auth.pages.login.href)
  }

  return { loginWithEmail, logout }
}
