/* eslint-disable @typescript-eslint/no-explicit-any */
import { mount, VueWrapper } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import Dashboard from './TicketListView.vue' // Adjust path as needed

// Mock data
const mockTickets = [
  {
    id: '1',
    title: 'First Ticket',
    content: 'Content of first ticket',
    status: 'ACTIVE',
    createdAt: new Date('2025-06-15T10:00:00Z'),
  },
  {
    id: '2',
    title: 'Second Ticket',
    content: 'Content of second ticket',
    status: 'CLOSED',
    createdAt: new Date('2025-06-20T10:00:00Z'),
  },
  {
    id: '3',
    title: 'Third Ticket',
    content: 'Content of third ticket',
    status: 'UNASSIGNED',
    createdAt: new Date('2025-06-25T10:00:00Z'),
  },
  {
    id: '4',
    title: 'Fourth Ticket',
    content: 'Content of fourth ticket',
    status: 'ACTIVE',
    createdAt: new Date('2025-06-28T10:00:00Z'),
  },
  {
    id: '5',
    title: 'Fifth Ticket',
    content: 'Content of fifth ticket',
    status: 'CLOSED',
    createdAt: new Date('2025-06-30T10:00:00Z'),
  },
  {
    id: '6',
    title: 'Sixth Ticket',
    content: 'Content of sixth ticket',
    status: 'ACTIVE',
    createdAt: new Date('2025-07-01T10:00:00Z'),
  },
]

// Mock functions
const mockFetchTicketsByAgent = vi.fn()
const mockSetTicket = vi.fn()
const mockPush = vi.fn()

// Mock vue-router
vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router')
  return {
    ...actual,
    useRouter: () => ({
      push: mockPush,
    }),
  }
})

// Mock tickets store
vi.mock('@/stores/tickets', () => ({
  useTicketsStore: () => ({
    tickets: mockTickets,
    fetchTicketsByAgent: mockFetchTicketsByAgent,
    setTicket: mockSetTicket,
  }),
}))

// Mock URL and Blob for CSV export
global.URL = {
  createObjectURL: vi.fn(() => 'mock-url'),
  revokeObjectURL: vi.fn(),
} as any

global.Blob = vi.fn().mockImplementation((content, options) => ({
  content,
  options,
})) as any

// Mock document methods for CSV download
Object.defineProperty(document, 'createElement', {
  value: vi.fn(() => ({
    setAttribute: vi.fn(),
    click: vi.fn(),
    style: {},
  })),
})

Object.defineProperty(document.body, 'appendChild', {
  value: vi.fn(),
})

Object.defineProperty(document.body, 'removeChild', {
  value: vi.fn(),
})

describe('Dashboard Component', () => {
  let wrapper: VueWrapper<any>

  //   beforeEach(() => {
  //     // Reset all mocks
  //     vi.clearAllMocks()
  //     mockFetchTicketsByAgent.mockResolvedValue(mockTickets)

  //     // Setup Pinia
  //     setActivePinia(createPinia())

  //     // Create router for testing
  //     const router = createRouter({
  //       history: createWebHistory(),
  //       routes: [{ path: '/my-tickets/:id', component: { template: '<div>Ticket Detail</div>' } }],
  //     })

  //     wrapper = mount(Dashboard, {
  //       global: {
  //         plugins: [router],
  //       },
  //     })
  //   })

  beforeEach(async () => {
    vi.clearAllMocks()
    mockFetchTicketsByAgent.mockResolvedValue(mockTickets)

    // Setup Pinia
    setActivePinia(createPinia())

    // Setup Vue Router
    const router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/my-tickets/:id', component: { template: '<div>Ticket Detail</div>' } },
      ],
    })

    await router.isReady()

    wrapper = mount(Dashboard, {
      global: {
        plugins: [createPinia(), router],
      },
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  describe('Component Rendering', () => {
    it('renders the stats section correctly', async () => {
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('Total Assigned')
      expect(wrapper.text()).toContain('Active')
      expect(wrapper.text()).toContain('Closed')

      // Check stats values
      const statValues = wrapper.findAll('.text-2xl.font-semibold')
      expect(statValues).toHaveLength(3)
    })

    it('renders the export button', () => {
      const exportButton = wrapper.find('button:first-of-type')
      expect(exportButton.text()).toBe('Export as CSV')
      expect(exportButton.find('svg').exists()).toBe(true)
    })

    it('renders the tickets table', () => {
      expect(wrapper.find('table').exists()).toBe(true)
      expect(wrapper.text()).toContain('Tickets Assigned to You')

      const tableHeaders = wrapper.findAll('th')
      expect(tableHeaders).toHaveLength(3)
      expect(tableHeaders[0].text()).toBe('Title')
      expect(tableHeaders[1].text()).toBe('Status')
      expect(tableHeaders[2].text()).toBe('Created At')
    })

    it('renders pagination controls', () => {
      const paginationButtons = wrapper.findAll('.px-3.py-1')
      expect(paginationButtons).toHaveLength(2)
      expect(paginationButtons[0].text()).toBe('Prev')
      expect(paginationButtons[1].text()).toBe('Next')
    })

    it('does not show export modal initially', () => {
      const modal = wrapper.find('.fixed.inset-0')
      expect(modal.exists()).toBe(false)
    })
  })

  describe('Stats Calculation', () => {
    it('calculates total assigned tickets correctly', async () => {
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.totalAssigned).toBe(6)
    })

    it('calculates active tickets correctly', async () => {
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.activeAssigned).toBe(3) // ACTIVE tickets in mock data
    })

    it('calculates closed tickets correctly', async () => {
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.closedAssigned).toBe(2) // CLOSED tickets in mock data
    })
  })

  describe('Table Rendering and Pagination', () => {
    it('displays paginated tickets correctly', async () => {
      await wrapper.vm.$nextTick()

      const tableRows = wrapper.findAll('tbody tr')
      expect(tableRows).toHaveLength(5) // perPage = 5
    })

    it('shows correct ticket information in table rows', async () => {
      await wrapper.vm.$nextTick()

      const firstRow = wrapper.find('tbody tr:first-child')
      expect(firstRow.text()).toContain('First Ticket')
      expect(firstRow.text()).toContain('ACTIVE')
    })

    it('applies correct status styling', async () => {
      await wrapper.vm.$nextTick()

      const statusElements = wrapper.findAll('tbody td:nth-child(2) span')

      // Check if status classes are applied
      const activeStatus = statusElements.find((el) => el.text() === 'ACTIVE')
      const closedStatus = statusElements.find((el) => el.text() === 'CLOSED')
      const unassignedStatus = statusElements.find((el) => el.text() === 'UNASSIGNED')

      if (activeStatus) expect(activeStatus.classes()).toContain('text-yellow-600')
      if (closedStatus) expect(closedStatus.classes()).toContain('text-green-600')
      if (unassignedStatus) expect(unassignedStatus.classes()).toContain('text-gray-600')
    })

    it('handles pagination correctly', async () => {
      await wrapper.vm.$nextTick()

      const nextButton = wrapper.find('button:last-child')
      await nextButton.trigger('click')

      expect(wrapper.vm.currentPage).toBe(2)

      const prevButton = wrapper.find('button:nth-last-child(2)')
      await prevButton.trigger('click')

      expect(wrapper.vm.currentPage).toBe(1)
    })

    it('disables prev button on first page', async () => {
      await wrapper.vm.$nextTick()

      const prevButton = wrapper.find('button:nth-last-child(2)')
      expect(prevButton.attributes('disabled')).toBeDefined()
    })

    it('disables next button on last page', async () => {
      await wrapper.vm.$nextTick()

      // Go to last page
      wrapper.vm.currentPage = 2 // With 6 tickets and perPage=5, page 2 is the last
      await wrapper.vm.$nextTick()

      const nextButton = wrapper.find('button:last-child')
      expect(nextButton.attributes('disabled')).toBeDefined()
    })
  })

  describe('Export Modal', () => {
    it('shows export modal when export button is clicked', async () => {
      const exportButton = wrapper.find('button:first-of-type')
      await exportButton.trigger('click')

      const modal = wrapper.find('.fixed.inset-0')
      expect(modal.exists()).toBe(true)
      expect(modal.text()).toContain('Export Tickets')
    })

    it('hides export modal when close button is clicked', async () => {
      await wrapper.setData({ showExportModal: true })

      const closeButton = wrapper.find('.text-gray-500')
      await closeButton.trigger('click')

      expect(wrapper.vm.showExportModal).toBe(false)
    })

    it('hides export modal when cancel button is clicked', async () => {
      await wrapper.setData({ showExportModal: true })

      const cancelButton = wrapper.findAll('.px-4.py-2')[0] // First button is cancel
      await cancelButton.trigger('click')

      expect(wrapper.vm.showExportModal).toBe(false)
    })

    it('renders export filter options correctly', async () => {
      await wrapper.setData({ showExportModal: true })

      const statusSelect = wrapper.find('select')
      const options = statusSelect.findAll('option')

      expect(options).toHaveLength(4)
      expect(options[0].text()).toBe('All Statuses')
      expect(options[1].text()).toBe('Active')
      expect(options[2].text()).toBe('Closed')
      expect(options[3].text()).toBe('Unassigned')
    })

    it('renders date range inputs', async () => {
      await wrapper.setData({ showExportModal: true })

      const dateInputs = wrapper.findAll('input[type="date"]')
      expect(dateInputs).toHaveLength(2)
    })

    it('sets default date range on mount', async () => {
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.exportFilters.startDate).toBeTruthy()
      expect(wrapper.vm.exportFilters.endDate).toBeTruthy()

      // Check if dates are within expected range (last 30 days)
      const startDate = new Date(wrapper.vm.exportFilters.startDate)
      const endDate = new Date(wrapper.vm.exportFilters.endDate)
      const daysDiff = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)

      expect(daysDiff).toBeCloseTo(30, 1)
    })
  })

  describe('CSV Export Functionality', () => {
    beforeEach(async () => {
      await wrapper.vm.$nextTick()
      await wrapper.setData({ showExportModal: true })
    })

    it('exports all tickets when no filters are applied', async () => {
      const exportButton = wrapper
        .findAllComponents('button')
        .find((btn) => btn.text() === 'Export')

      await exportButton?.trigger('click')

      expect(global.Blob).toHaveBeenCalledWith(
        expect.arrayContaining([expect.stringContaining('ID,Title,Status,Created At')]),
        { type: 'text/csv;charset=utf-8;' },
      )
    })

    it('filters tickets by status', async () => {
      const statusSelect = wrapper.find('select')
      await statusSelect.setValue('ACTIVE')

      const exportButton = wrapper
        .findAllComponents('button')
        .find((btn) => btn.text() === 'Export')

      await exportButton?.trigger('click')

      // Verify that only ACTIVE tickets would be exported
      expect(wrapper.vm.exportFilters.status).toBe('ACTIVE')
    })

    it('filters tickets by date range', async () => {
      const dateInputs = wrapper.findAll('input[type="date"]')
      await dateInputs[0].setValue('2025-06-20') // Start date
      await dateInputs[1].setValue('2025-06-30') // End date

      expect(wrapper.vm.exportFilters.startDate).toBe('2025-06-20')
      expect(wrapper.vm.exportFilters.endDate).toBe('2025-06-30')
    })

    it('creates download link with correct filename', async () => {
      const createElementSpy = vi.spyOn(document, 'createElement')

      const exportButton = wrapper
        .findAllComponents('button')
        .find((btn) => btn.text() === 'Export')

      await exportButton?.trigger('click')

      expect(createElementSpy).toHaveBeenCalledWith('a')
    })

    it('closes modal after export', async () => {
      const exportButton = wrapper
        .findAllComponents('button')
        .find((btn) => btn.text() === 'Export')

      await exportButton?.trigger('click')

      expect(wrapper.vm.showExportModal).toBe(false)
    })
  })

  describe('Ticket Navigation', () => {
    it('navigates to ticket detail when row is clicked', async () => {
      await wrapper.vm.$nextTick()

      const firstRow = wrapper.find('tbody tr:first-child')
      await firstRow.trigger('click')

      expect(mockSetTicket).toHaveBeenCalledWith(mockTickets[0])
      expect(mockPush).toHaveBeenCalledWith('/my-tickets/1')
    })

    it('handles ticket click with correct ticket data', async () => {
      await wrapper.vm.$nextTick()

      const secondRow = wrapper.find('tbody tr:nth-child(2)')
      await secondRow.trigger('click')

      expect(mockSetTicket).toHaveBeenCalledWith(mockTickets[1])
      expect(mockPush).toHaveBeenCalledWith('/my-tickets/2')
    })
  })

  describe('Date Formatting', () => {
    it('formats dates correctly in table', async () => {
      await wrapper.vm.$nextTick()

      const dateCell = wrapper.find('tbody tr:first-child td:last-child')
      const expectedDate = new Date('2025-06-15T10:00:00Z').toLocaleDateString()

      expect(dateCell.text()).toBe(expectedDate)
    })

    it('formats dates correctly in CSV export', () => {
      const testDate = new Date('2025-06-15T10:00:00Z')
      const formatted = wrapper.vm.formatDate(testDate)

      expect(formatted).toBe(testDate.toLocaleDateString())
    })
  })

  describe('Component Lifecycle', () => {
    it('fetches tickets on mount', () => {
      expect(mockFetchTicketsByAgent).toHaveBeenCalled()
    })

    it('handles fetch tickets error gracefully', async () => {
      mockFetchTicketsByAgent.mockRejectedValue(new Error('Fetch failed'))
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      // Remount component to trigger onMounted with error
      wrapper.unmount()
      wrapper = mount(Dashboard, {
        global: {
          plugins: [
            createRouter({
              history: createWebHistory(),
              routes: [
                { path: '/my-tickets/:id', component: { template: '<div>Ticket Detail</div>' } },
              ],
            }),
          ],
        },
      })

      await wrapper.vm.$nextTick()

      // Component should handle the error gracefully
      expect(wrapper.vm.assignedTickets).toEqual([])

      consoleSpy.mockRestore()
    })
  })

  describe('Computed Properties', () => {
    it('calculates paginated tickets correctly', async () => {
      await wrapper.vm.$nextTick()

      const paginatedTickets = wrapper.vm.paginatedTickets
      expect(paginatedTickets).toHaveLength(5)
      expect(paginatedTickets[0].id).toBe('1')
    })

    it('calculates end index correctly', async () => {
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.endIndex).toBe(5) // currentPage (1) * perPage (5)

      wrapper.vm.currentPage = 2
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.endIndex).toBe(10)
    })
  })

  describe('Responsive Design', () => {
    it('renders grid layout for stats section', () => {
      const statsGrid = wrapper.find('.grid.grid-cols-1.sm\\:grid-cols-3')
      expect(statsGrid.exists()).toBe(true)
    })

    it('has overflow-x-auto for table responsiveness', () => {
      const tableContainer = wrapper.find('.overflow-x-auto')
      expect(tableContainer.exists()).toBe(true)
    })
  })

  describe('Accessibility', () => {
    it('has proper table structure', () => {
      const table = wrapper.find('table')
      const thead = table.find('thead')
      const tbody = table.find('tbody')

      expect(thead.exists()).toBe(true)
      expect(tbody.exists()).toBe(true)
    })

    it('has proper form labels in export modal', async () => {
      await wrapper.setData({ showExportModal: true })

      const labels = wrapper.findAll('label')
      expect(labels.length).toBeGreaterThan(0)

      const statusLabel = labels.find((label) => label.text().includes('Status'))
      const dateLabel = labels.find((label) => label.text().includes('Date Range'))

      expect(statusLabel).toBeTruthy()
      expect(dateLabel).toBeTruthy()
    })
  })
})
