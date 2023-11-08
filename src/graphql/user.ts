import { gql } from '@apollo/client'

export const GET_MY_PROFILE = gql`
  query {
    getMyProfile {
      names
      surnames
      email
      image
      role
    }
  }
`
