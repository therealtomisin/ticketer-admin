import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'

const httpLink = createHttpLink({
  // uri: import.meta.env.BASE_URL, // adjust as needed
  uri: 'http://localhost:4003/graphql', // adjust as needed
  // uri: 'https://mysite-856n.onrender.com/graphql', // adjust as needed
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
