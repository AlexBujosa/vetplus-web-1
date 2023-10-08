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
  const { getUserRole } = useUser()
  const { role } = getUserRole()
  const setRole = useSetAtom(roleAtom)

  async function loginWithEmail({ email, password }: LoginSubmitForm) {
    const variables = {
      signInInput: {
        email,
        password,
      },
    }

    const { data } = await client.query({
      query: SIGN_WITH_EMAIL_QUERY,
      variables,
    })

    const token = data.signInWithEmail.access_token

    localStorage.setItem('token', token)
    setRole(role)

    if (!allowedRoles.includes(role)) {
      throw new Error('Forbidden error')
    }

    navigate(routes.admin.pages.dashboard.href)
  }

  function logout() {
    localStorage.removeItem('token')
    navigate(routes.auth.pages.login.href)
  }

  return { loginWithEmail, logout }
}
