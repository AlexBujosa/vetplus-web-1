import { GET_MY_PROFILE, GET_USER_ROLE } from '@/graphql/user'
import { useAtom } from 'jotai'
import { userAtom } from './userAtom'
import client from '@/utils/apolloClient'

export default function useUser() {
  const [user, setUser] = useAtom(userAtom)

  async function getUserRole(): Promise<any> {
    return await client.request(GET_USER_ROLE)
  }

  async function getUserProfile(): Promise<any> {
    const data = await client.request(GET_MY_PROFILE)

    if (data) {
      setUser(user)
    }

    return data
  }

  return { getUserRole, getUserProfile }
}
