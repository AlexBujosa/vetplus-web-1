import { gql } from '@apollo/client'

export const GET_MY_PROFILE = gql`
  query {
    getMyProfile {
      id
      names
      surnames
      email
      provider
      document
      address
      telephone_number
      image
      role
      created_at
      updated_at
      status
      VeterinariaSpecialties {
        specialties
      }
    }
  }
`

export const UPDATE_USER = gql`
  mutation ($updateUserInput: UpdateUserInput!) {
    updateUser(updateUserInput: $updateUserInput) {
      result
    }
  }
`

export const UPDATE_USER_BY_ADMIN = gql`
  mutation ($updateUserInput: UpdateUserByAdminInput!) {
    updateUserByAdmin(updateUserInput: $updateUserInput) {
      result
    }
  }
`

export const REGISTER_SPECIALTY = gql`
  mutation ($addSpecialtyInput: AddSpecialtyInput!) {
    registerSpecialty(addSpecialtyInput: $addSpecialtyInput) {
      result
    }
  }
`

export const SAVE_USER_IMAGE = gql`
  mutation ($saveUserImageInput: SaveUserImageInput!) {
    saveUserImage(saveUserImageInput: $saveUserImageInput) {
      result
      image
    }
  }
`
