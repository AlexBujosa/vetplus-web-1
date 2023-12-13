import client from '@/utils/apolloClient'
import { SIGN_IN_WITH_GOOGLE, SIGN_WITH_EMAIL_QUERY } from '@/graphql/auth'
import { useNavigate } from 'react-router-dom'
import useUser from '@/hooks/use-user'
import { allowedRoles, defaultRoute, routes } from '@/config/routes'
import { useSetAtom } from 'jotai'
import { roleAtom } from './roleAtom'
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import { auth, provider } from '../use-google'
import { userAtom } from '../use-user/userAtom'
import { GET_MY_PROFILE } from '@/graphql/user'
import { Role } from '@/types/role'

export type LoginSubmitForm = {
  email: string
  password: string
}

export default function useAuth() {
  const navigate = useNavigate()
  const { getUserProfile } = useUser()

  const setRole = useSetAtom(roleAtom)
  const setUser = useSetAtom(userAtom)

  async function loginWithEmail({ email, password }: LoginSubmitForm) {
    const variables = {
      signInInput: {
        email,
        password,
      },
    }

    const {
      data: { signInWithEmail },
    } = await client.query({
      query: SIGN_WITH_EMAIL_QUERY,
      variables,
    })

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

  async function logout() {
    localStorage.clear()
    await signOut(auth)
    navigate(routes.auth.pages.login.href)
  }

  async function loginWithGoogle() {
    const result = await signInWithPopup(auth, provider)

    const credential = GoogleAuthProvider.credentialFromResult(result)!

    console.log({ credential })

    localStorage.setItem('token', credential.idToken!)

    const {
      data: { googleLogin },
    } = await client.query({
      query: SIGN_IN_WITH_GOOGLE,
    })

    console.log({ googleLogin })

    localStorage.setItem('token', googleLogin.access_token!)

    const {
      data: { getMyProfile },
    } = await client.query({
      query: GET_MY_PROFILE,
    })

    setUser(getMyProfile)

    const { role }: { role: Role } = getMyProfile

    setRole(role)
    navigate(defaultRoute[role])
  }

  return { loginWithEmail, loginWithGoogle, logout }
}
