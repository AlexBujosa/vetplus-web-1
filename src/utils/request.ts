import { DocumentNode } from 'graphql'
import { request as graphqRequest } from 'graphql-request'

export default function request(query: DocumentNode) {
  const token = localStorage.getItem('token')

  return graphqRequest(import.meta.env.VITE_GRAPHQL_ENDPOINT!, query, {
    Headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  })
}
