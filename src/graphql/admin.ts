import { gql } from '@apollo/client'

export const GET_ALL_USERS = gql`
  query {
    findAll {
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
