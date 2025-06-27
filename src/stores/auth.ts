// stores/auth.ts
import { defineStore } from 'pinia'
import { apolloClient } from '@/lib/apollo'
import gql from 'graphql-tag'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('auth_token') || '',
    currentUser: null,
  }),
  actions: {
    async login(email: string, password: string) {
      const LOGIN_MUTATION = gql`
        mutation LoginAgent($input: LoginInput!) {
          login(input: $input) {
            agent {
              id
              firstname
              lastname
              email
            }
            token
            success
            message
          }
        }
      `
      // errors
      // role
      const { data } = await apolloClient.mutate({
        mutation: LOGIN_MUTATION,
        variables: { input: { email, password, type: 'agent' } },
      })
      console.log('the data is >> ', data)

      if (data.login.success) {
        this.token = data.login.token
        this.currentUser = data.login.agent
        localStorage.setItem('auth_token', this.token)
        sessionStorage.setItem('currentUser', data.login.agent)
      } else {
        console.error(data.login.message)
      }

      return { success: data.login.success }
    },

    async signup(firstname: string, lastname: string, email: string, password: string) {
      const SIGNUP_MUTATION = gql`
        mutation SignupAgent($input: SignupInput!) {
          signup(input: $input) {
            user {
              id
              firstname
              firstname
              email
            }
            agent {
              id
              firstname
              firstname
              email
            }
            token
            message
            success
          }
        }
      `
      const { data } = await apolloClient.mutate({
        mutation: SIGNUP_MUTATION,
        variables: { input: { firstname, lastname, email, password, type: 'user' } },
      })

      if (data.signup.success) {
        this.token = data.signup.token
        this.currentUser = data.signup.agent
        localStorage.setItem('auth_token', this.token)
        sessionStorage.setItem('currentUser', data.signup.agent)
      } else {
        console.error(data.signup.message)
      }

      return { success: data.signup.success }
    },

    logout() {
      this.token = ''
      localStorage.removeItem('auth_token')
    },
  },
})
