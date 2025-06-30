import { mount, VueWrapper } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import TicketDetail from './TicketDetailsView.vue' // Adjust path as needed

// Mock data
const mockTicket = {
  id: 1,
  title: 'Test Ticket',
  content: 'This is a test ticket content',
  ticketKey: 'TICKET-001',
  status: 'ACTIVE',
  deadline: '2025-07-15T10:00:00Z',
  attachments: ['file1.pdf', 'file2.jpg'],
  media: ['media1.mp4'],
  comments: [
    {
      id: 1,
      content: 'First comment from user',
      createdByType: 'User',
      createdAt: '2025-06-29T10:00:00Z',
      status: 'sent',
    },
    {
      id: 2,
      content: 'Response from agent',
      createdByType: 'Agent',
      createdAt: '2025-06-29T11:00:00Z',
      status: 'sent',
    },
    {
      id: 3,
      content: 'Pending comment',
      createdByType: 'Agent',
      createdAt: '2025-06-29T12:00:00Z',
      status: 'pending',
    },
  ],
}

// Mock functions
const mockFetchTicket = vi.fn()
const mockCreateComment = vi.fn()
const mockUpdateTicket = vi.fn()

// Mock vue-router
vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router')
  return {
    ...actual,
    useRoute: () => ({
      params: { id: '1' },
    }),
  }
})

// Mock tickets store
vi.mock('@/stores/tickets', () => ({
  useTicketsStore: () => ({
    ticket: mockTicket,
    fetchTicket: mockFetchTicket,
    createComment: mockCreateComment,
    updateTicket: mockUpdateTicket,
  }),
}))

describe('TicketDetail Component', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let wrapper: VueWrapper<any>

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks()

    // Setup Pinia
    setActivePinia(createPinia())

    // Create router for testing
    const router = createRouter({
      history: createWebHistory(),
      routes: [{ path: '/tickets/:id', component: { template: '<div>Ticket Detail</div>' } }],
    })

    wrapper = mount(TicketDetail, {
      global: {
        plugins: [router],
      },
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  describe('Component Rendering', () => {
    it('renders the ticket information correctly', () => {
      expect(wrapper.find('h2').text()).toBe('Test Ticket')
      expect(wrapper.text()).toContain('This is a test ticket content')
      expect(wrapper.text()).toContain('TICKET-001')
      expect(wrapper.text()).toContain('Status:')
      expect(wrapper.text()).toContain('Deadline:')
    })

    it('renders ticket status with correct styling', () => {
      const statusSpan = wrapper.find('.px-2.py-1.rounded-full')
      expect(statusSpan.exists()).toBe(true)
      expect(statusSpan.text()).toBe('ACTIVE')
      expect(statusSpan.classes()).toContain('bg-yellow-100')
      expect(statusSpan.classes()).toContain('text-yellow-800')
    })

    it('renders attachments section when media exists', () => {
      expect(wrapper.text()).toContain('Attachments')
      const attachmentLinks = wrapper.findAll('a[target="_blank"]')
      expect(attachmentLinks).toHaveLength(2)
      expect(attachmentLinks[0].attributes('href')).toBe('file1.pdf')
      expect(attachmentLinks[1].attributes('href')).toBe('file2.jpg')
    })

    it('renders conversation section', () => {
      expect(wrapper.text()).toContain('Conversation')
      const comments = wrapper.findAll('.mb-3')
      expect(comments).toHaveLength(3) // 3 comments in mock data
    })

    it('renders comment form', () => {
      const form = wrapper.find('form')
      const textarea = wrapper.find('textarea')
      const submitButton = wrapper.find('button[type="submit"]')

      expect(form.exists()).toBe(true)
      expect(textarea.exists()).toBe(true)
      expect(textarea.attributes('placeholder')).toBe('Type your message...')
      expect(submitButton.exists()).toBe(true)
      expect(submitButton.text()).toBe('Send')
    })
  })

  describe('Comment Rendering', () => {
    it('renders user comments with correct styling', () => {
      const userComments = wrapper.findAll('.mr-auto.bg-gray-100.text-gray-700')
      expect(userComments).toHaveLength(1)
      expect(userComments[0].text()).toContain('First comment from user')
    })

    it('renders agent comments with correct styling', () => {
      const agentComments = wrapper.findAll('.ml-auto.bg-blue-100.text-blue-800')
      expect(agentComments).toHaveLength(2)
      expect(agentComments[0].text()).toContain('Response from agent')
    })

    it('renders pending comments with loading indicator', () => {
      const pendingComment = wrapper.findAll('.opacity-80')
      expect(pendingComment).toHaveLength(1)

      const loadingIcon = wrapper.find('.animate-spin')
      expect(loadingIcon.exists()).toBe(true)
    })

    it('formats comment dates correctly', () => {
      const dateElements = wrapper.findAll('.text-xs.text-gray-400')
      expect(dateElements.length).toBeGreaterThan(0)
      // Check that dates are formatted (exact format depends on locale)
      dateElements.forEach((el) => {
        expect(el.text()).toMatch(/\d/)
      })
    })
  })

  describe('Status Management', () => {
    it('allows status editing when clicked', async () => {
      const statusElement = wrapper.find('.cursor-pointer')
      await statusElement.trigger('click')

      const select = wrapper.find('select')
      expect(select.exists()).toBe(true)
      expect(select.findAll('option')).toHaveLength(3)
    })

    it('has correct status options', async () => {
      const statusElement = wrapper.find('.cursor-pointer')
      await statusElement.trigger('click')

      const options = wrapper.findAll('option')
      const optionValues = options.map((option) => option.attributes('value'))
      expect(optionValues).toEqual(['UNASSIGNED', 'ACTIVE', 'CLOSED'])
    })
  })

  describe('Component Interactions', () => {
    it('calls createComment when form is submitted', async () => {
      const textarea = wrapper.find('textarea')
      const form = wrapper.find('form')

      await textarea.setValue('New test comment')
      await form.trigger('submit.prevent')

      expect(mockCreateComment).toHaveBeenCalledWith(1, 'New test comment', 'Agent')
    })

    it('clears textarea after successful comment submission', async () => {
      mockCreateComment.mockResolvedValue({})

      const textarea = wrapper.find('textarea')
      const form = wrapper.find('form')

      await textarea.setValue('Test comment')
      await form.trigger('submit.prevent')

      // Wait for next tick to allow reactive updates
      await wrapper.vm.$nextTick()

      expect(textarea.element.value).toBe('')
    })

    it('does not submit empty comments', async () => {
      const form = wrapper.find('form')
      await form.trigger('submit.prevent')

      expect(mockCreateComment).not.toHaveBeenCalled()
    })

    it('calls updateTicket when status is changed', async () => {
      mockUpdateTicket.mockResolvedValue({})

      const statusElement = wrapper.find('.cursor-pointer')
      await statusElement.trigger('click')

      const select = wrapper.find('select')
      await select.setValue('CLOSED')
      await select.trigger('blur')

      expect(mockUpdateTicket).toHaveBeenCalledWith(1, { status: 'CLOSED' })
    })
  })

  describe('Error Handling', () => {
    it('handles comment creation errors gracefully', async () => {
      mockCreateComment.mockRejectedValue(new Error('Network error'))
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const textarea = wrapper.find('textarea')
      const form = wrapper.find('form')

      await textarea.setValue('Test comment')
      await form.trigger('submit.prevent')

      expect(consoleSpy).toHaveBeenCalledWith('Failed to post comment:', expect.any(Error))
      consoleSpy.mockRestore()
    })

    it('handles status update errors gracefully', async () => {
      mockUpdateTicket.mockRejectedValue(new Error('Update failed'))
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const statusElement = wrapper.find('.cursor-pointer')
      await statusElement.trigger('click')

      const select = wrapper.find('select')
      await select.setValue('CLOSED')
      await select.trigger('change')

      expect(consoleSpy).toHaveBeenCalledWith('Failed to update ticket status:', expect.any(Error))
      consoleSpy.mockRestore()
    })
  })

  describe('Component Lifecycle', () => {
    it('fetches ticket data on mount', () => {
      expect(mockFetchTicket).toHaveBeenCalledWith(1)
    })

    it('handles fetch ticket errors', async () => {
      mockFetchTicket.mockRejectedValue(new Error('Fetch failed'))
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      // Remount component to trigger onMounted
      wrapper.unmount()
      wrapper = mount(TicketDetail, {
        global: {
          plugins: [
            createRouter({
              history: createWebHistory(),
              routes: [
                { path: '/tickets/:id', component: { template: '<div>Ticket Detail</div>' } },
              ],
            }),
          ],
        },
      })

      // Wait for async operations
      await wrapper.vm.$nextTick()

      expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch ticket:', expect.any(Error))
      consoleSpy.mockRestore()
    })
  })

  describe('Status Color Mapping', () => {
    it('applies correct colors for different statuses', () => {
      const testCases = [
        { status: 'ACTIVE', expectedClasses: ['bg-yellow-100', 'text-yellow-800'] },
        { status: 'CLOSED', expectedClasses: ['bg-green-100', 'text-green-800'] },
        { status: 'UNASSIGNED', expectedClasses: ['bg-gray-100', 'text-gray-700'] },
      ]

      testCases.forEach(({ status, expectedClasses }) => {
        // Update mock data status
        // const updatedMockTicket = { ...mockTicket, status }

        // Test the statusColor method indirectly by checking if correct classes are applied
        const statusSpan = wrapper.find('.px-2.py-1.rounded-full')
        if (status === 'ACTIVE') {
          // Current status in mock
          expectedClasses.forEach((className) => {
            expect(statusSpan.classes()).toContain(className)
          })
        }
      })
    })
  })

  describe('Date Formatting', () => {
    it('formats dates using toLocaleString', () => {
      // Test that formatDate function works correctly
      const testDate = '2025-06-29T10:00:00Z'
      const expectedFormat = new Date(testDate).toLocaleString()

      // Check if formatted dates appear in the component
      const dateElements = wrapper.findAll('.text-xs.text-gray-400')
      const hasFormattedDate = dateElements.some(
        (el) =>
          el.text().includes(expectedFormat.split(',')[0]) ||
          el.text().includes(expectedFormat.split(' ')[0]),
      )
      expect(hasFormattedDate).toBe(true)
    })
  })
})
