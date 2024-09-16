import { gql } from '@apollo/client'

export const GET_NEW_NOTIFICATION = gql`
  subscription {
    getNewNotification {
      id
      id_user
      title
      subtitle
      category
      read
      created_at
      updated_at
      status
      id_entity
    }
  }
`
