import client from '@/utils/apolloClient'
import { SIGN_IN_WITH_GOOGLE, SIGN_WITH_EMAIL_QUERY } from '@/graphql/auth'
import { useNavigate } from 'react-router-dom'
import useUser from '@/hooks/use-user'
import { allowedRoles, routes } from '@/config/routes'
import { useSetAtom } from 'jotai'
import { roleAtom } from './roleAtom'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../use-google'

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

    const {
      signInWithEmail,
    }: {
      signInWithEmail: {
        access_token: string
      }
    } = await client.request(SIGN_WITH_EMAIL_QUERY, variables)

    const token = signInWithEmail.access_token

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

  async function loginWithGoogle() {
    const result = await signInWithPopup(auth, provider)

    const credential = GoogleAuthProvider.credentialFromResult(result)!

    const token = credential.idToken

    localStorage.setItem('token', token!)

    const {
      googleLogin,
    }: {
      googleLogin: {
        access_token: string
      }
    } = await client.request(SIGN_IN_WITH_GOOGLE)

    localStorage.setItem('token', googleLogin.access_token!)

    const profile = await getUserProfile()

    console.log({ profile })

    return googleLogin
  }

  return { loginWithEmail, loginWithGoogle, logout }
}
