import { GET_ALL_USERS } from '@/graphql/admin'
import client from '@/utils/apolloClient'

export default function useAdmin() {
  async function getAllUsers() {
    const {
      data: { findAll },
    } = await client.query({
      query: GET_ALL_USERS,
    })

    return findAll
  }

  async function getAllClinics() {}

  return {
    getAllUsers,
    getAllClinics,
  }
}
