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

export const REGISTER_SPECIALTY = gql`
  mutation ($addSpecialtyInput: AddSpecialtyInput!) {
    registerSpecialty(addSpecialtyInput: $addSpecialtyInput) {
      result
    }
  }
`
