import { mount, VueWrapper, flushPromises } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { createPinia } from 'pinia'
import Dashboard from '@/views/HomeView.vue'
import { ref } from 'vue'

// Utility: Find button by text
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const findButtonByText = (wrapper: VueWrapper<any>, text: string) => {
  return wrapper.findAll('button').find((btn) => btn.text() === text)
}

// Mock router
const mockPush = vi.fn()
vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router')
  return {
    ...actual,
    useRouter: () => ({ push: mockPush }),
  }
})

// Ticket data
const mockTickets = [
  { id: 1, title: 'Bug in login form', status: 'ACTIVE', createdAt: '2024-01-15T10:30:00Z' },
  {
    id: 2,
    title: 'Feature request: Dark mode',
    status: 'CLOSED',
    createdAt: '2024-01-14T14:20:00Z',
  },
  { id: 3, title: 'Performance issue', status: 'UNASSIGNED', createdAt: '2024-01-13T09:15:00Z' },
  {
    id: 4,
    title: 'Database connection error',
    status: 'ACTIVE',
    createdAt: '2024-01-12T16:45:00Z',
  },
  { id: 5, title: 'UI improvement', status: 'CLOSED', createdAt: '2024-01-11T11:30:00Z' },
]

const mockTicketsForPagination = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  title: `Ticket ${i + 1}`,
  status: i % 3 === 0 ? 'ACTIVE' : i % 3 === 1 ? 'CLOSED' : 'UNASSIGNED',
  createdAt: `2024-01-${String(15 - i).padStart(2, '0')}T10:00:00Z`,
}))

// Mock store
const mockFetchTickets = vi.fn()
const mockTicketsRef = ref([...mockTickets])

const mockTicketsStore = {
  fetchTickets: mockFetchTickets,
  get tickets() {
    return mockTicketsRef.value
  },
}

vi.mock('@/stores/tickets', () => ({
  useTicketsStore: () => mockTicketsStore,
}))

// Test wrapper
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let wrapper: VueWrapper<any>

// Mount helper
const mountDashboard = async (tickets = mockTickets) => {
  mockTicketsRef.value = [...tickets]
  mockFetchTickets.mockResolvedValue(undefined)
  wrapper = mount(Dashboard, {
    global: {
      plugins: [createPinia()],
    },
  })
  await flushPromises()
}

describe('Dashboard Component', () => {
  afterEach(() => wrapper?.unmount())

  describe('Component Rendering', () => {
    beforeEach(async () => await mountDashboard())

    it('renders stats section', () => {
      expect(wrapper.text()).toContain('Total Tickets')
      expect(wrapper.text()).toContain('Active Tickets')
      expect(wrapper.text()).toContain('Closed Tickets')
    })

    it('renders the "View My Tickets" button', () => {
      expect(wrapper.text()).toContain('View My Tickets')
    })

    it('renders the recent tickets table', () => {
      expect(wrapper.find('table').exists()).toBe(true)
      expect(wrapper.text()).toContain('Recent Tickets')
      expect(wrapper.text()).toContain('Title')
      expect(wrapper.text()).toContain('Status')
      expect(wrapper.text()).toContain('Created At')
    })

    it('renders pagination controls', () => {
      expect(wrapper.text()).toContain('Previous')
      expect(wrapper.text()).toContain('Next')
      expect(wrapper.text()).toContain('Page')
    })
  })

  describe('Stats Calculation', () => {
    beforeEach(async () => await mountDashboard())

    it('displays correct total, active, and closed ticket counts', () => {
      expect(wrapper.text()).toContain('5')
      expect(wrapper.text()).toContain(
        mockTickets.filter((t) => t.status === 'ACTIVE').length.toString(),
      )
      expect(wrapper.text()).toContain(
        mockTickets.filter((t) => t.status === 'CLOSED').length.toString(),
      )
    })
  })

  describe('Tickets Display', () => {
    beforeEach(async () => await mountDashboard())

    it('displays ticket titles', () => {
      expect(wrapper.text()).toContain('Bug in login form')
      expect(wrapper.text()).toContain('Feature request: Dark mode')
    })

    it('shows statuses and applies correct classes', () => {
      const spans = wrapper.findAll('td span')
      expect(spans.some((span) => span.classes().includes('text-green-600'))).toBe(true)
      expect(spans.some((span) => span.classes().includes('text-yellow-600'))).toBe(true)
      expect(spans.some((span) => span.classes().includes('text-gray-600'))).toBe(true)
    })

    it('formats dates correctly', () => {
      expect(wrapper.text()).toMatch(/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}/)
    })
  })

  describe('Navigation', () => {
    beforeEach(async () => await mountDashboard())

    it('navigates to /my-tickets when button is clicked', async () => {
      const button = findButtonByText(wrapper, 'View My Tickets')
      await button?.trigger('click')
      expect(mockPush).toHaveBeenCalledWith('/my-tickets')
    })
  })

  describe('Pagination', () => {
    beforeEach(async () => await mountDashboard(mockTicketsForPagination))

    it('displays correct page info', () => {
      expect(wrapper.text()).toContain('Page 1 of 2')
    })

    it('shows first 10 tickets on page 1', () => {
      expect(wrapper.text()).toContain('Ticket 1')
      expect(wrapper.text()).toContain('Ticket 10')
      expect(wrapper.text()).not.toContain('Ticket 11')
    })

    it('disables previous button on first page', () => {
      const prev = findButtonByText(wrapper, 'Previous')
      expect(prev?.attributes('disabled')).toBeDefined()
    })

    it('enables next button when more pages exist', () => {
      const next = findButtonByText(wrapper, 'Next')
      expect(next?.attributes('disabled')).toBeUndefined()
    })

    it('navigates to next page', async () => {
      const next = findButtonByText(wrapper, 'Next')
      await next?.trigger('click')
      await flushPromises()
      expect(wrapper.text()).toContain('Page 2 of 2')
      expect(wrapper.text()).toContain('Ticket 11')
    })

    it('navigates to previous page', async () => {
      const next = findButtonByText(wrapper, 'Next')
      await next?.trigger('click')
      await flushPromises()

      const prev = findButtonByText(wrapper, 'Previous')
      await prev?.trigger('click')
      await flushPromises()

      expect(wrapper.text()).toContain('Page 1 of 2')
    })

    it('disables next button on last page', async () => {
      const next = findButtonByText(wrapper, 'Next')
      await next?.trigger('click')
      await flushPromises()

      expect(next?.attributes('disabled')).toBeDefined()
    })
  })

  describe('Store Integration', () => {
    beforeEach(async () => await mountDashboard())

    it('calls fetchTickets on mount', () => {
      expect(mockFetchTickets).toHaveBeenCalled()
    })

    it('uses tickets from store', () => {
      expect(wrapper.text()).toContain('Bug in login form')
    })
  })

  describe('Empty State', () => {
    beforeEach(async () => await mountDashboard([]))

    it('shows zero stats', () => {
      expect(wrapper.text()).toContain('0')
    })

    it('renders empty table', () => {
      expect(wrapper.findAll('tbody tr').length).toBe(0)
    })

    it('shows page as "Page 1 of 0"', () => {
      expect(wrapper.text()).toContain('Page 1 of 0')
    })
  })

  describe('Responsive Design', () => {
    beforeEach(async () => await mountDashboard())

    it('uses responsive grid', () => {
      const grid = wrapper.find('.grid')
      expect(grid.classes()).toContain('grid-cols-1')
      expect(grid.classes()).toContain('sm:grid-cols-3')
    })

    it('has overflow for table', () => {
      const container = wrapper.find('.overflow-x-auto')
      expect(container.exists()).toBe(true)
    })
  })
})
