import client from '@/utils/apolloClient'
import { SIGN_WITH_EMAIL_QUERY } from '@/graphql/auth'
import { useNavigate } from 'react-router-dom'
import useUser from '@/hooks/use-user'
import { allowedRoles, routes } from '@/config/routes'
import { useSetAtom } from 'jotai'
import { roleAtom } from './roleAtom'

export type LoginSubmitForm = {
  email: string
  password: string
}

export default function useAuth() {
  const navigate = useNavigate()
  const { getUserProfile } = useUser()

  const setRole = useSetAtom(roleAtom)

  async function loginWithEmail({ email, password }: LoginSubmitForm) {
    const variables = {
      signInInput: {
        email,
        password,
      },
    }

    const data: any = await client.request(SIGN_WITH_EMAIL_QUERY, variables)
    // const profile = await client.request()
    const token = data.signInWithEmail.access_token
    localStorage.setItem('token', token)

    const profile = await getUserProfile()

    const { role } = profile

    setRole(role)

    if (!allowedRoles.includes(role)) {
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
