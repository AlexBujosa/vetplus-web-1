import { GET_MY_PROFILE } from '@/graphql/user'
import { useAtom } from 'jotai'
import { userAtom } from './userAtom'
import client from '@/utils/apolloClient'

export default function useUser() {
  const [, setUser] = useAtom(userAtom)

  async function getUserProfile() {
    const { getMyProfile } = await client.request<any>(GET_MY_PROFILE)
    setUser(getMyProfile)
    return getMyProfile
  }

  return { getUserProfile }
}
