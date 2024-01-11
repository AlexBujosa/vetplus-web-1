import {
  GET_MY_PROFILE,
  REGISTER_SPECIALTY,
  SAVE_USER_IMAGE,
  UPDATE_USER,
} from '@/graphql/user'
import { useAtom } from 'jotai'
import { userAtom } from './userAtom'
import client from '@/utils/apolloClient'
import { Picture } from '@/pages/[admin]/clinic/general-info'
import { useQueryClient } from '@tanstack/react-query'

export default function useUser() {
  const [user, setUser] = useAtom(userAtom)
  const queryClient = useQueryClient()

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

  async function updateSpecialty(payload: { specialty: string }) {
    const {
      data: { registerSpecialty },
    } = await client.mutate({
      mutation: REGISTER_SPECIALTY,
      variables: {
        addSpecialtyInput: {
          specialties: payload.specialty,
        },
      },
    })

    return registerSpecialty
  }

  async function saveUserImage(image: Picture) {
    const {
      data: { saveUserImage },
    } = await client.mutate({
      mutation: SAVE_USER_IMAGE,
      variables: {
        saveUserImageInput: {
          image,
          old_image: user?.image,
        },
      },
    })

    queryClient.invalidateQueries({
      queryKey: ['profile'],
    })

    return saveUserImage
  }

  return { getUserProfile, updateUser, updateSpecialty, saveUserImage }
}

export type EditUserForm = {
  names: string
  surnames: string
  document: string
  address: string
  telephone_number: string
  image: string
}
