import { tokenAtom } from '@/hooks/use-auth/tokenAtom'
import { GraphQLClient } from 'graphql-request'
import { useAtomValue } from 'jotai'

const endpoint = import.meta.env.VITE_GRAPHQL_ENDPOINT!

const token = useAtomValue(tokenAtom)

const client = new GraphQLClient(endpoint, {
  headers: {
    authorization: token ? `Bearer ${token}` : '',
  },
})

export default client
