export const queries = {
  fetchTickets: `        query {
          tickets {
            id
            title
            content
            status
            createdAt
          }
        }`,
  fetchTicketsByAgent: `        query {
          ticketsByUser {
            id
            title
            content
            status
            createdAt
          }
        }`,
  fetchTicketStats: `        query FetchTicketStats {
          tickets {
            id
            title
            status
            createdAt
          }
        }`,
  fetchTicket: ` query GetTicket($id: ID!) {
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
        }`,
}

export const mutations = {
  login: `mutation LoginAgent($input: LoginInput!) {
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
        }`,
  signup: `mutation SignupAgent($input: SignupInput!) {
          signup(input: $input) {
            token
            message
            success
            expiresIn
          }
        `,
  verifyToken: `mutation VerifyToken($input: VerifyTokenInput!) {
          verifyToken(input: $input) {
            success
            message
            agent {
              id
              firstname
              lastname
              email
            }
          }
        }`,
  createTicket: `mutation CreateTicket($input: CreateTicketInput!) {
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
        }`,
  updateTicket: `mutation UpdateTicket($input: UpdateTicketsInput!) {
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
        }`,
  createComment: `
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
        `,
}
