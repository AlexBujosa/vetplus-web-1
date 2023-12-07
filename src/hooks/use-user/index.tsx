import { GET_MY_PROFILE, UPDATE_USER } from '@/graphql/user'
import { useAtom } from 'jotai'
import { userAtom } from './userAtom'
import client from '@/utils/apolloClient'
import { GraphQLClient } from 'graphql-request'

export default function useUser() {
  const [, setUser] = useAtom(userAtom)
  const endpoint = import.meta.env.VITE_GRAPHQL_ENDPOINT!

  async function getUserProfile() {
    const token = localStorage.getItem('token')

    const client = new GraphQLClient(endpoint, {
      headers: {
        authorization: token ? `Bearer ${token}` : '',
      },
    })

    const { getMyProfile } = await client.request<any>(GET_MY_PROFILE)
    setUser(getMyProfile)
    return getMyProfile
  }

  async function updateUser(payload: EditUserForm) {
    const { updateUser } = await client.request<any>(UPDATE_USER, {
      updateUserInput: { ...payload },
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
