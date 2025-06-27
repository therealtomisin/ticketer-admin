/* eslint-disable @typescript-eslint/no-explicit-any */
import { apolloClient } from '@/lib/apollo'
import { gql } from '@apollo/client/core'
import { defineStore } from 'pinia'

export const useTicketsStore = defineStore('tickets', {
  state: () => ({
    tickets: [] as any[],
    ticket: null as any,
    stats: null as any,
  }),
  actions: {
    setTicket(ticket: {
      id: string
      title: string
      content: string
      status: string
      createdt: Date
    }) {
      this.ticket = ticket
    },

    async fetchTickets() {
      const GET_TICKETS = gql`
        query {
          tickets {
            id
            title
            content
            status
            createdAt
          }
        }
      `
      const { data } = await apolloClient.query({ query: GET_TICKETS })

      console.log('the tickets are >>> ', data.tickets)
      this.tickets = data.tickets
    },

    async fetchTicketsByAgent() {
      const GET_TICKETS = gql`
        query {
          ticketsByUser {
            id
            title
            content
            status
            createdAt
          }
        }
      `
      const { data } = await apolloClient.query({ query: GET_TICKETS })

      console.log('the tickets are >>> ', data.ticketsByUser)
      this.tickets = data.ticketsByUser
    },

    async fetchTicketStats() {
      const FETCH_TICKET_STATS = gql`
        query FetchTicketStats {
          tickets {
            id
            title
            status
            created_at
          }
        }
      `

      const { data } = await apolloClient.query({
        query: FETCH_TICKET_STATS,
      })
      this.stats = data.stats
    },

    async fetchTicket(id: number) {
      const GET_TICKET = gql`
        query GetTicket($id: ID!) {
          ticket(id: $id) {
            title
            id
            content
            status
            createdAt
            media
            ticketKey
            deadline
            comments {
              content
              createdAt
              createdByType
              createdById
            }
          }
        }
      `
      const { data } = await apolloClient.query({
        query: GET_TICKET,
        variables: { id },
      })
      this.ticket = data.ticket
    },

    async createTicket(title: string, content: string, images: string[] = []) {
      const CREATE_TICKET = gql`
        mutation CreateTicket($input: CreateTicketInput!) {
          createTicket(input: $input) {
            ticket {
              id
              ticketKey
              title
              content
              media
            }
            errors
          }
        }
      `
      const { data } = await apolloClient.mutate({
        mutation: CREATE_TICKET,
        variables: { input: { title, content, media: images } },
      })
      this.tickets = [...this.tickets, data.createTicket.ticket]
    },

    async updateTicket(id: number, update: { title?: string; content?: string; status: string }) {
      const { title, content, status } = update
      const UPDATE_TICKET = gql`
        mutation UpdateTicket($input: UpdateTicketsInput!) {
          updateTicket(input: $input) {
            ticket {
              id
              title
              content
              status
              ticketKey
              deadline
              createdAt
              media
              comments {
                id
                content
                createdAt
                createdByType
                createdById
              }
            }
          }
        }
      `
      const { data } = await apolloClient.mutate({
        mutation: UPDATE_TICKET,
        variables: { input: { id, title, content, status } },
      })
      const index = this.tickets.findIndex((t) => t.id === id)
      if (index !== -1) {
        this.tickets[index] = data.updateTicket.ticket
      }
      if (this.ticket && this.ticket.id === id) {
        this.ticket = data.updateTicket.ticket
      }
    },

    async createComment(ticketId: number, content: string, type: string) {
      // Generate a temporary ID for optimistic update
      const tempId = `temp-${Date.now()}`

      // Create the optimistic comment
      const optimisticComment = {
        id: tempId,
        content,
        createdAt: new Date().toISOString(),
        status: 'pending',
        // createdById: currentUser,
        createdByType: type,
      }

      // Optimistically update the state
      this.ticket = {
        ...this.ticket,
        comments: [...(this.ticket.comments || []), optimisticComment],
      }

      // GraphQL mutation
      const CREATE_COMMENT = gql`
        mutation CreateComment($input: CreateCommentInput!) {
          createComment(input: $input) {
            comment {
              id
              content
              createdAt
              createdById
              createdByType
            }
          }
        }
      `

      try {
        const { data } = await apolloClient.mutate({
          mutation: CREATE_COMMENT,
          variables: {
            input: {
              ticketId: Number(ticketId),
              content,
            },
          },
        })

        console.log('created comment >>>', data.createComment.comment)

        this.ticket.comments = [
          ...this.ticket.comments.filter((c) => c.id !== tempId),
          data.createComment.comment,
        ].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      } catch (error) {
        this.tickets = this.tickets.map((ticket) => {
          if (ticket.id === ticketId) {
            return {
              ...ticket,
              comments: ticket.comments.filter((c) => c.id !== tempId),
            }
          }
          return ticket
        })

        console.error('Failed to create comment:', error)
        throw error
      }
    },
  },
})
