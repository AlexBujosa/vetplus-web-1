import client from '@/utils/apolloClient'
import { SIGN_WITH_EMAIL_QUERY } from '@/graphql/auth'
import { useNavigate } from 'react-router-dom'
import useUser from '@/hooks/use-user'
import { allowedRoles, routes } from '@/config/routes'
import { useSetAtom } from 'jotai'
import { roleAtom } from './roleAtom'
import { tokenAtom } from './tokenAtom'

export type LoginSubmitForm = {
  email: string
  password: string
}

export default function useAuth() {
  const navigate = useNavigate()
  const { getUserProfile } = useUser()

  const setRole = useSetAtom(roleAtom)
  const setToken = useSetAtom(tokenAtom)

  async function loginWithEmail({ email, password }: LoginSubmitForm) {
    const variables = {
      signInInput: {
        email,
        password,
      },
    }

    const {
      signInWithEmail,
    }: {
      signInWithEmail: {
        access_token: string
      }
    } = await client.request(SIGN_WITH_EMAIL_QUERY, variables)

    const token = signInWithEmail.access_token

    setToken(token)

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
