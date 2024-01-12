import {
  ApolloClient,
  DefaultOptions,
  InMemoryCache,
  from,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { createUploadLink } from 'apollo-upload-client'
import { removeTypenameFromVariables } from '@apollo/client/link/remove-typename'

const httpLink = createUploadLink({
  uri: import.meta.env.VITE_GRAPHQL_ENDPOINT,
})

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'network-only',
  },
  query: {
    fetchPolicy: 'no-cache',
  },
  mutate: {
    fetchPolicy: 'network-only',
  },
}

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token')
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

const removeTypenameLink = removeTypenameFromVariables()

const link = from([removeTypenameLink, authLink, httpLink])

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  defaultOptions,
})

export default client
