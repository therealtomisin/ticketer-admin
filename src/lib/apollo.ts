import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import type { ImportMeta } from '../../env'

const httpLink = createHttpLink({
  uri: (import.meta as ImportMeta).env.VITE_BASE_URL,
})

const authLink = setContext((_, { headers }) => {
  const token = sessionStorage.getItem('auth_token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})
