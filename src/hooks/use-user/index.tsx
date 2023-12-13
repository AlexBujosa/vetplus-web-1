import { GET_MY_PROFILE, UPDATE_USER } from '@/graphql/user'
import { useAtom } from 'jotai'
import { userAtom } from './userAtom'
import client from '@/utils/apolloClient'

export default function useUser() {
  const [, setUser] = useAtom(userAtom)

  async function getUserProfile() {
    const {
      data: { getMyProfile },
    } = await client.query<any>({ query: GET_MY_PROFILE })
    setUser(getMyProfile)
    return getMyProfile
  }

  async function updateUser(payload: EditUserForm) {
    const {
      data: { updateUser },
    } = await client.mutate<any>({
      mutation: UPDATE_USER,
      variables: {
        updateUserInput: { ...payload },
      },
    })

    return updateUser
  }

  return { getUserProfile, updateUser }
}

export type EditUserForm = {
  names: string
  surnames: string
  document: string
  address: string
  telephone_number: string
}
