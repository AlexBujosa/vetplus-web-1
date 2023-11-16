import { gql } from 'graphql-request'

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
