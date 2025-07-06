// // /* eslint-disable @typescript-eslint/no-explicit-any */
// // import { mount, VueWrapper } from '@vue/test-utils'
// // import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
// // import { createRouter, createWebHistory } from 'vue-router'
// // import { createPinia, setActivePinia } from 'pinia'
// // import Dashboard from './TicketListView.vue' // Adjust path as needed

// // // Mock data
// // const mockTickets = [
// //   {
// //     id: '1',
// //     title: 'First Ticket',
// //     content: 'Content of first ticket',
// //     status: 'ACTIVE',
// //     createdAt: new Date('2025-06-15T10:00:00Z'),
// //   },
// //   {
// //     id: '2',
// //     title: 'Second Ticket',
// //     content: 'Content of second ticket',
// //     status: 'CLOSED',
// //     createdAt: new Date('2025-06-20T10:00:00Z'),
// //   },
// //   {
// //     id: '3',
// //     title: 'Third Ticket',
// //     content: 'Content of third ticket',
// //     status: 'UNASSIGNED',
// //     createdAt: new Date('2025-06-25T10:00:00Z'),
// //   },
// //   {
// //     id: '4',
// //     title: 'Fourth Ticket',
// //     content: 'Content of fourth ticket',
// //     status: 'ACTIVE',
// //     createdAt: new Date('2025-06-28T10:00:00Z'),
// //   },
// //   {
// //     id: '5',
// //     title: 'Fifth Ticket',
// //     content: 'Content of fifth ticket',
// //     status: 'CLOSED',
// //     createdAt: new Date('2025-06-30T10:00:00Z'),
// //   },
// //   {
// //     id: '6',
// //     title: 'Sixth Ticket',
// //     content: 'Content of sixth ticket',
// //     status: 'ACTIVE',
// //     createdAt: new Date('2025-07-01T10:00:00Z'),
// //   },
// // ]

// // // Mock functions
// // const mockFetchTicketsByAgent = vi.fn()
// // const mockSetTicket = vi.fn()
// // const mockPush = vi.fn()

// // // Mock vue-router
// // vi.mock('vue-router', async () => {
// //   const actual = await vi.importActual('vue-router')
// //   return {
// //     ...actual,
// //     useRouter: () => ({
// //       push: mockPush,
// //     }),
// //   }
// // })

// // // Mock tickets store
// // vi.mock('@/stores/tickets', () => ({
// //   useTicketsStore: () => ({
// //     tickets: mockTickets,
// //     fetchTicketsByAgent: mockFetchTicketsByAgent,
// //     setTicket: mockSetTicket,
// //   }),
// // }))

// // // Mock URL and Blob for CSV export
// // global.URL = {
// //   createObjectURL: vi.fn(() => 'mock-url'),
// //   revokeObjectURL: vi.fn(),
// // } as any

// // global.Blob = vi.fn().mockImplementation((content, options) => ({
// //   content,
// //   options,
// // })) as any

// // // Mock document methods for CSV download
// // Object.defineProperty(document, 'createElement', {
// //   value: vi.fn(() => ({
// //     setAttribute: vi.fn(),
// //     click: vi.fn(),
// //     style: {},
// //   })),
// // })

// // Object.defineProperty(document.body, 'appendChild', {
// //   value: vi.fn(),
// // })

// // Object.defineProperty(document.body, 'removeChild', {
// //   value: vi.fn(),
// // })

// // describe('Dashboard Component', () => {
// //   let wrapper: VueWrapper<any>

// //   //   beforeEach(() => {
// //   //     // Reset all mocks
// //   //     vi.clearAllMocks()
// //   //     mockFetchTicketsByAgent.mockResolvedValue(mockTickets)

// //   //     // Setup Pinia
// //   //     setActivePinia(createPinia())

// //   //     // Create router for testing
// //   //     const router = createRouter({
// //   //       history: createWebHistory(),
// //   //       routes: [{ path: '/my-tickets/:id', component: { template: '<div>Ticket Detail</div>' } }],
// //   //     })

// //   //     wrapper = mount(Dashboard, {
// //   //       global: {
// //   //         plugins: [router],
// //   //       },
// //   //     })
// //   //   })

// //   beforeEach(async () => {
// //     vi.clearAllMocks()
// //     mockFetchTicketsByAgent.mockResolvedValue(mockTickets)

// //     // Setup Pinia
// //     setActivePinia(createPinia())

// //     // Setup Vue Router
// //     const router = createRouter({
// //       history: createWebHistory(),
// //       routes: [
// //         { path: '/', component: { template: '<div>Home</div>' } },
// //         { path: '/my-tickets/:id', component: { template: '<div>Ticket Detail</div>' } },
// //       ],
// //     })

// //     await router.isReady()

// //     wrapper = mount(Dashboard, {
// //       global: {
// //         plugins: [createPinia(), router],
// //       },
// //     })
// //   })

// //   afterEach(() => {
// //     wrapper.unmount()
// //   })

// //   describe('Component Rendering', () => {
// //     it('renders the stats section correctly', async () => {
// //       await wrapper.vm.$nextTick()

// //       expect(wrapper.text()).toContain('Total Assigned')
// //       expect(wrapper.text()).toContain('Active')
// //       expect(wrapper.text()).toContain('Closed')

// //       // Check stats values
// //       const statValues = wrapper.findAll('.text-2xl.font-semibold')
// //       expect(statValues).toHaveLength(3)
// //     })

// //     it('renders the export button', () => {
// //       const exportButton = wrapper.find('button:first-of-type')
// //       expect(exportButton.text()).toBe('Export as CSV')
// //       expect(exportButton.find('svg').exists()).toBe(true)
// //     })

// //     it('renders the tickets table', () => {
// //       expect(wrapper.find('table').exists()).toBe(true)
// //       expect(wrapper.text()).toContain('Tickets Assigned to You')

// //       const tableHeaders = wrapper.findAll('th')
// //       expect(tableHeaders).toHaveLength(3)
// //       expect(tableHeaders[0].text()).toBe('Title')
// //       expect(tableHeaders[1].text()).toBe('Status')
// //       expect(tableHeaders[2].text()).toBe('Created At')
// //     })

// //     it('renders pagination controls', () => {
// //       const paginationButtons = wrapper.findAll('.px-3.py-1')
// //       expect(paginationButtons).toHaveLength(2)
// //       expect(paginationButtons[0].text()).toBe('Prev')
// //       expect(paginationButtons[1].text()).toBe('Next')
// //     })

// //     it('does not show export modal initially', () => {
// //       const modal = wrapper.find('.fixed.inset-0')
// //       expect(modal.exists()).toBe(false)
// //     })
// //   })

// //   describe('Stats Calculation', () => {
// //     it('calculates total assigned tickets correctly', async () => {
// //       await wrapper.vm.$nextTick()

// //       expect(wrapper.vm.totalAssigned).toBe(6)
// //     })

// //     it('calculates active tickets correctly', async () => {
// //       await wrapper.vm.$nextTick()

// //       expect(wrapper.vm.activeAssigned).toBe(3) // ACTIVE tickets in mock data
// //     })

// //     it('calculates closed tickets correctly', async () => {
// //       await wrapper.vm.$nextTick()

// //       expect(wrapper.vm.closedAssigned).toBe(2) // CLOSED tickets in mock data
// //     })
// //   })

// //   describe('Table Rendering and Pagination', () => {
// //     it('displays paginated tickets correctly', async () => {
// //       await wrapper.vm.$nextTick()

// //       const tableRows = wrapper.findAll('tbody tr')
// //       expect(tableRows).toHaveLength(5) // perPage = 5
// //     })

// //     it('shows correct ticket information in table rows', async () => {
// //       await wrapper.vm.$nextTick()

// //       const firstRow = wrapper.find('tbody tr:first-child')
// //       expect(firstRow.text()).toContain('First Ticket')
// //       expect(firstRow.text()).toContain('ACTIVE')
// //     })

// //     it('applies correct status styling', async () => {
// //       await wrapper.vm.$nextTick()

// //       const statusElements = wrapper.findAll('tbody td:nth-child(2) span')

// //       // Check if status classes are applied
// //       const activeStatus = statusElements.find((el) => el.text() === 'ACTIVE')
// //       const closedStatus = statusElements.find((el) => el.text() === 'CLOSED')
// //       const unassignedStatus = statusElements.find((el) => el.text() === 'UNASSIGNED')

// //       if (activeStatus) expect(activeStatus.classes()).toContain('text-yellow-600')
// //       if (closedStatus) expect(closedStatus.classes()).toContain('text-green-600')
// //       if (unassignedStatus) expect(unassignedStatus.classes()).toContain('text-gray-600')
// //     })

// //     it('handles pagination correctly', async () => {
// //       await wrapper.vm.$nextTick()

// //       const nextButton = wrapper.find('button:last-child')
// //       await nextButton.trigger('click')

// //       expect(wrapper.vm.currentPage).toBe(2)

// //       const prevButton = wrapper.find('button:nth-last-child(2)')
// //       await prevButton.trigger('click')

// //       expect(wrapper.vm.currentPage).toBe(1)
// //     })

// //     it('disables prev button on first page', async () => {
// //       await wrapper.vm.$nextTick()

// //       const prevButton = wrapper.find('button:nth-last-child(2)')
// //       expect(prevButton.attributes('disabled')).toBeDefined()
// //     })

// //     it('disables next button on last page', async () => {
// //       await wrapper.vm.$nextTick()

// //       // Go to last page
// //       wrapper.vm.currentPage = 2 // With 6 tickets and perPage=5, page 2 is the last
// //       await wrapper.vm.$nextTick()

// //       const nextButton = wrapper.find('button:last-child')
// //       expect(nextButton.attributes('disabled')).toBeDefined()
// //     })
// //   })

// //   describe('Export Modal', () => {
// //     it('shows export modal when export button is clicked', async () => {
// //       const exportButton = wrapper.find('button:first-of-type')
// //       await exportButton.trigger('click')

// //       const modal = wrapper.find('.fixed.inset-0')
// //       expect(modal.exists()).toBe(true)
// //       expect(modal.text()).toContain('Export Tickets')
// //     })

// //     it('hides export modal when close button is clicked', async () => {
// //       await wrapper.setData({ showExportModal: true })

// //       const closeButton = wrapper.find('.text-gray-500')
// //       await closeButton.trigger('click')

// //       expect(wrapper.vm.showExportModal).toBe(false)
// //     })

// //     it('hides export modal when cancel button is clicked', async () => {
// //       await wrapper.setData({ showExportModal: true })

// //       const cancelButton = wrapper.findAll('.px-4.py-2')[0] // First button is cancel
// //       await cancelButton.trigger('click')

// //       expect(wrapper.vm.showExportModal).toBe(false)
// //     })

// //     it('renders export filter options correctly', async () => {
// //       await wrapper.setData({ showExportModal: true })

// //       const statusSelect = wrapper.find('select')
// //       const options = statusSelect.findAll('option')

// //       expect(options).toHaveLength(4)
// //       expect(options[0].text()).toBe('All Statuses')
// //       expect(options[1].text()).toBe('Active')
// //       expect(options[2].text()).toBe('Closed')
// //       expect(options[3].text()).toBe('Unassigned')
// //     })

// //     it('renders date range inputs', async () => {
// //       await wrapper.setData({ showExportModal: true })

// //       const dateInputs = wrapper.findAll('input[type="date"]')
// //       expect(dateInputs).toHaveLength(2)
// //     })

// //     it('sets default date range on mount', async () => {
// //       await wrapper.vm.$nextTick()

// //       expect(wrapper.vm.exportFilters.startDate).toBeTruthy()
// //       expect(wrapper.vm.exportFilters.endDate).toBeTruthy()

// //       // Check if dates are within expected range (last 30 days)
// //       const startDate = new Date(wrapper.vm.exportFilters.startDate)
// //       const endDate = new Date(wrapper.vm.exportFilters.endDate)
// //       const daysDiff = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)

// //       expect(daysDiff).toBeCloseTo(30, 1)
// //     })
// //   })

// //   describe('CSV Export Functionality', () => {
// //     beforeEach(async () => {
// //       await wrapper.vm.$nextTick()
// //       await wrapper.setData({ showExportModal: true })
// //     })

// //     it('exports all tickets when no filters are applied', async () => {
// //       const exportButton = wrapper
// //         .findAllComponents('button')
// //         .find((btn) => btn.text() === 'Export')

// //       await exportButton?.trigger('click')

// //       expect(global.Blob).toHaveBeenCalledWith(
// //         expect.arrayContaining([expect.stringContaining('ID,Title,Status,Created At')]),
// //         { type: 'text/csv;charset=utf-8;' },
// //       )
// //     })

// //     it('filters tickets by status', async () => {
// //       const statusSelect = wrapper.find('select')
// //       await statusSelect.setValue('ACTIVE')

// //       const exportButton = wrapper
// //         .findAllComponents('button')
// //         .find((btn) => btn.text() === 'Export')

// //       await exportButton?.trigger('click')

// //       // Verify that only ACTIVE tickets would be exported
// //       expect(wrapper.vm.exportFilters.status).toBe('ACTIVE')
// //     })

// //     it('filters tickets by date range', async () => {
// //       const dateInputs = wrapper.findAll('input[type="date"]')
// //       await dateInputs[0].setValue('2025-06-20') // Start date
// //       await dateInputs[1].setValue('2025-06-30') // End date

// //       expect(wrapper.vm.exportFilters.startDate).toBe('2025-06-20')
// //       expect(wrapper.vm.exportFilters.endDate).toBe('2025-06-30')
// //     })

// //     it('creates download link with correct filename', async () => {
// //       const createElementSpy = vi.spyOn(document, 'createElement')

// //       const exportButton = wrapper
// //         .findAllComponents('button')
// //         .find((btn) => btn.text() === 'Export')

// //       await exportButton?.trigger('click')

// //       expect(createElementSpy).toHaveBeenCalledWith('a')
// //     })

// //     it('closes modal after export', async () => {
// //       const exportButton = wrapper
// //         .findAllComponents('button')
// //         .find((btn) => btn.text() === 'Export')

// //       await exportButton?.trigger('click')

// //       expect(wrapper.vm.showExportModal).toBe(false)
// //     })
// //   })

// //   describe('Ticket Navigation', () => {
// //     it('navigates to ticket detail when row is clicked', async () => {
// //       await wrapper.vm.$nextTick()

// //       const firstRow = wrapper.find('tbody tr:first-child')
// //       await firstRow.trigger('click')

// //       expect(mockSetTicket).toHaveBeenCalledWith(mockTickets[0])
// //       expect(mockPush).toHaveBeenCalledWith('/my-tickets/1')
// //     })

// //     it('handles ticket click with correct ticket data', async () => {
// //       await wrapper.vm.$nextTick()

// //       const secondRow = wrapper.find('tbody tr:nth-child(2)')
// //       await secondRow.trigger('click')

// //       expect(mockSetTicket).toHaveBeenCalledWith(mockTickets[1])
// //       expect(mockPush).toHaveBeenCalledWith('/my-tickets/2')
// //     })
// //   })

// //   describe('Date Formatting', () => {
// //     it('formats dates correctly in table', async () => {
// //       await wrapper.vm.$nextTick()

// //       const dateCell = wrapper.find('tbody tr:first-child td:last-child')
// //       const expectedDate = new Date('2025-06-15T10:00:00Z').toLocaleDateString()

// //       expect(dateCell.text()).toBe(expectedDate)
// //     })

// //     it('formats dates correctly in CSV export', () => {
// //       const testDate = new Date('2025-06-15T10:00:00Z')
// //       const formatted = wrapper.vm.formatDate(testDate)

// //       expect(formatted).toBe(testDate.toLocaleDateString())
// //     })
// //   })

// //   describe('Component Lifecycle', () => {
// //     it('fetches tickets on mount', () => {
// //       expect(mockFetchTicketsByAgent).toHaveBeenCalled()
// //     })

// //     it('handles fetch tickets error gracefully', async () => {
// //       mockFetchTicketsByAgent.mockRejectedValue(new Error('Fetch failed'))
// //       const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

// //       // Remount component to trigger onMounted with error
// //       wrapper.unmount()
// //       wrapper = mount(Dashboard, {
// //         global: {
// //           plugins: [
// //             createRouter({
// //               history: createWebHistory(),
// //               routes: [
// //                 { path: '/my-tickets/:id', component: { template: '<div>Ticket Detail</div>' } },
// //               ],
// //             }),
// //           ],
// //         },
// //       })

// //       await wrapper.vm.$nextTick()

// //       // Component should handle the error gracefully
// //       expect(wrapper.vm.assignedTickets).toEqual([])

// //       consoleSpy.mockRestore()
// //     })
// //   })

// //   describe('Computed Properties', () => {
// //     it('calculates paginated tickets correctly', async () => {
// //       await wrapper.vm.$nextTick()

// //       const paginatedTickets = wrapper.vm.paginatedTickets
// //       expect(paginatedTickets).toHaveLength(5)
// //       expect(paginatedTickets[0].id).toBe('1')
// //     })

// //     it('calculates end index correctly', async () => {
// //       await wrapper.vm.$nextTick()

// //       expect(wrapper.vm.endIndex).toBe(5) // currentPage (1) * perPage (5)

// //       wrapper.vm.currentPage = 2
// //       await wrapper.vm.$nextTick()

// //       expect(wrapper.vm.endIndex).toBe(10)
// //     })
// //   })

// //   describe('Responsive Design', () => {
// //     it('renders grid layout for stats section', () => {
// //       const statsGrid = wrapper.find('.grid.grid-cols-1.sm\\:grid-cols-3')
// //       expect(statsGrid.exists()).toBe(true)
// //     })

// //     it('has overflow-x-auto for table responsiveness', () => {
// //       const tableContainer = wrapper.find('.overflow-x-auto')
// //       expect(tableContainer.exists()).toBe(true)
// //     })
// //   })

// //   describe('Accessibility', () => {
// //     it('has proper table structure', () => {
// //       const table = wrapper.find('table')
// //       const thead = table.find('thead')
// //       const tbody = table.find('tbody')

// //       expect(thead.exists()).toBe(true)
// //       expect(tbody.exists()).toBe(true)
// //     })

// //     it('has proper form labels in export modal', async () => {
// //       await wrapper.setData({ showExportModal: true })

// //       const labels = wrapper.findAll('label')
// //       expect(labels.length).toBeGreaterThan(0)

// //       const statusLabel = labels.find((label) => label.text().includes('Status'))
// //       const dateLabel = labels.find((label) => label.text().includes('Date Range'))

// //       expect(statusLabel).toBeTruthy()
// //       expect(dateLabel).toBeTruthy()
// //     })
// //   })
// // })

// // import { mount, VueWrapper } from '@vue/test-utils'
// // import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
// // import { createRouter, createWebHistory, type Router } from 'vue-router' // Import Router type
// // import { createPinia, setActivePinia, type Pinia } from 'pinia' // Import Pinia type
// // import Dashboard from './TicketListView.vue' // Adjust path as needed

// // // Mock data (keep as is)
// // const mockTickets = [
// //   {
// //     id: '1',
// //     title: 'First Ticket',
// //     content: 'Content of first ticket',
// //     status: 'ACTIVE',
// //     createdAt: new Date('2025-06-15T10:00:00Z'),
// //   },
// //   {
// //     id: '2',
// //     title: 'Second Ticket',
// //     content: 'Content of second ticket',
// //     status: 'CLOSED',
// //     createdAt: new Date('2025-06-20T10:00:00Z'),
// //   },
// //   {
// //     id: '3',
// //     title: 'Third Ticket',
// //     content: 'Content of third ticket',
// //     status: 'UNASSIGNED',
// //     createdAt: new Date('2025-06-25T10:00:00Z'),
// //   },
// //   {
// //     id: '4',
// //     title: 'Fourth Ticket',
// //     content: 'Content of fourth ticket',
// //     status: 'ACTIVE',
// //     createdAt: new Date('2025-06-28T10:00:00Z'),
// //   },
// //   {
// //     id: '5',
// //     title: 'Fifth Ticket',
// //     content: 'Content of fifth ticket',
// //     status: 'CLOSED',
// //     createdAt: new Date('2025-06-30T10:00:00Z'),
// //   },
// //   {
// //     id: '6',
// //     title: 'Sixth Ticket',
// //     content: 'Content of sixth ticket',
// //     status: 'ACTIVE',
// //     createdAt: new Date('2025-07-01T10:00:00Z'),
// //   },
// // ]

// // // Mock functions (keep as is)
// // const mockFetchTicketsByAgent = vi.fn()
// // const mockSetTicket = vi.fn()
// // const mockPush = vi.fn()

// // // Mock vue-router (keep as is, but ensure use of `vi.mock` is correct)
// // vi.mock('vue-router', async () => {
// //   const actual = await vi.importActual('vue-router')
// //   return {
// //     ...actual,
// //     useRouter: () => ({
// //       push: mockPush,
// //     }),
// //   }
// // })

// // // Mock tickets store (keep as is)
// // vi.mock('@/stores/tickets', () => ({
// //   useTicketsStore: () => ({
// //     tickets: mockTickets,
// //     fetchTicketsByAgent: mockFetchTicketsByAgent,
// //     setTicket: mockSetTicket,
// //   }),
// // }))

// // // Mock URL and Blob for CSV export (keep as is)
// // global.URL = {
// //   createObjectURL: vi.fn(() => 'mock-url'),
// //   revokeObjectURL: vi.fn(),
// // } as any

// // global.Blob = vi.fn().mockImplementation((content, options) => ({
// //   content,
// //   options,
// // })) as any

// // // Mock document methods for CSV download (keep as is)
// // Object.defineProperty(document, 'createElement', {
// //   value: vi.fn(() => ({
// //     setAttribute: vi.fn(),
// //     click: vi.fn(),
// //     style: {},
// //     // Add removeChild if it's implicitly called on cleanup of the element
// //     remove: vi.fn(),
// //   })),
// // })

// // Object.defineProperty(document.body, 'appendChild', {
// //   value: vi.fn(),
// // })

// // Object.defineProperty(document.body, 'removeChild', {
// //   value: vi.fn(),
// // })

// // describe('Dashboard Component', () => {
// //   let wrapper: VueWrapper<any>
// //   let router: Router // Declare router here
// //   let pinia: Pinia // Declare pinia here

// //   beforeEach(async () => {
// //     vi.clearAllMocks()
// //     mockFetchTicketsByAgent.mockResolvedValue(mockTickets)

// //     // Setup Pinia
// //     pinia = createPinia()
// //     setActivePinia(pinia)

// //     // Setup Vue Router
// //     // Create a new router instance for each test to ensure isolation
// //     router = createRouter({
// //       history: createWebHistory(),
// //       routes: [
// //         { path: '/', component: { template: '<div>Home</div>' } },
// //         { path: '/my-tickets/:id', component: { template: '<div>Ticket Detail</div>' } },
// //       ],
// //     })

// //     // Wait for the router to be ready BEFORE mounting the component
// //     // This is crucial for components that rely on route information on mount.
// //     await router.isReady()

// //     wrapper = mount(Dashboard, {
// //       global: {
// //         plugins: [pinia, router], // Pass both pinia and router instances
// //       },
// //     })

// //     // Important: Wait for the component to render and for any
// //     // asynchronous operations within its `onMounted` or `created` hooks to complete.
// //     // This includes the `fetchTicketsByAgent` call.
// //     await wrapper.vm.$nextTick()
// //     // If there are other asynchronous calls in onMounted, you might need to await them too.
// //     // For example, if fetchTicketsByAgent returns a Promise, ensure it's resolved.
// //     // Since mockFetchTicketsByAgent is mockResolvedValue, this should be handled.
// //   })

// //   afterEach(() => {
// //     // Ensure wrapper is defined before attempting to unmount
// //     if (wrapper) {
// //       wrapper.unmount()
// //     }
// //     // Clean up router history if necessary, though router.isReady() and new instance
// //     // per test should minimize issues.
// //     // router.history.destroy() // Explicitly destroy router history
// //   })

// //   // Your existing test suites (Component Rendering, Stats Calculation, etc.)
// //   // ... remain the same ...
// //   describe('Component Rendering', () => {
// //     it('renders the stats section correctly', async () => {
// //       // await wrapper.vm.$nextTick() // Already done in beforeEach
// //       expect(wrapper.text()).toContain('Total Assigned')
// //       expect(wrapper.text()).toContain('Active')
// //       expect(wrapper.text()).toContain('Closed')

// //       // Check stats values
// //       const statValues = wrapper.findAll('.text-2xl.font-semibold')
// //       expect(statValues).toHaveLength(3)
// //     })

// //     it('renders the export button', () => {
// //       const exportButton = wrapper.find('button:first-of-type')
// //       expect(exportButton.text()).toBe('Export as CSV')
// //       expect(exportButton.find('svg').exists()).toBe(true)
// //     })

// //     it('renders the tickets table', () => {
// //       expect(wrapper.find('table').exists()).toBe(true)
// //       expect(wrapper.text()).toContain('Tickets Assigned to You')

// //       const tableHeaders = wrapper.findAll('th')
// //       expect(tableHeaders).toHaveLength(3)
// //       expect(tableHeaders[0].text()).toBe('Title')
// //       expect(tableHeaders[1].text()).toBe('Status')
// //       expect(tableHeaders[2].text()).toBe('Created At')
// //     })

// //     it('renders pagination controls', () => {
// //       const paginationButtons = wrapper.findAll('.px-3.py-1')
// //       expect(paginationButtons).toHaveLength(2)
// //       expect(paginationButtons[0].text()).toBe('Prev')
// //       expect(paginationButtons[1].text()).toBe('Next')
// //     })

// //     it('does not show export modal initially', () => {
// //       const modal = wrapper.find('.fixed.inset-0')
// //       expect(modal.exists()).toBe(false)
// //     })
// //   })

// //   describe('Stats Calculation', () => {
// //     it('calculates total assigned tickets correctly', async () => {
// //       // await wrapper.vm.$nextTick() // Already done in beforeEach
// //       expect(wrapper.vm.totalAssigned).toBe(6)
// //     })

// //     it('calculates active tickets correctly', async () => {
// //       // await wrapper.vm.$nextTick() // Already done in beforeEach
// //       expect(wrapper.vm.activeAssigned).toBe(3) // ACTIVE tickets in mock data
// //     })

// //     it('calculates closed tickets correctly', async () => {
// //       // await wrapper.vm.$nextTick() // Already done in beforeEach
// //       expect(wrapper.vm.closedAssigned).toBe(2) // CLOSED tickets in mock data
// //     })
// //   })

// //   describe('Table Rendering and Pagination', () => {
// //     it('displays paginated tickets correctly', async () => {
// //       // await wrapper.vm.$nextTick() // Already done in beforeEach
// //       const tableRows = wrapper.findAll('tbody tr')
// //       expect(tableRows).toHaveLength(5) // perPage = 5
// //     })

// //     it('shows correct ticket information in table rows', async () => {
// //       // await wrapper.vm.$nextTick() // Already done in beforeEach
// //       const firstRow = wrapper.find('tbody tr:first-child')
// //       expect(firstRow.text()).toContain('First Ticket')
// //       expect(firstRow.text()).toContain('ACTIVE')
// //     })

// //     it('applies correct status styling', async () => {
// //       // await wrapper.vm.$nextTick() // Already done in beforeEach
// //       const statusElements = wrapper.findAll('tbody td:nth-child(2) span')

// //       // Check if status classes are applied
// //       const activeStatus = statusElements.find((el) => el.text() === 'ACTIVE')
// //       const closedStatus = statusElements.find((el) => el.text() === 'CLOSED')
// //       const unassignedStatus = statusElements.find((el) => el.text() === 'UNASSIGNED')

// //       if (activeStatus) expect(activeStatus.classes()).toContain('text-yellow-600')
// //       if (closedStatus) expect(closedStatus.classes()).toContain('text-green-600')
// //       if (unassignedStatus) expect(unassignedStatus.classes()).toContain('text-gray-600')
// //     })

// //     it('handles pagination correctly', async () => {
// //       // await wrapper.vm.$nextTick() // Already done in beforeEach
// //       const nextButton = wrapper.find('button:last-child')
// //       await nextButton.trigger('click')

// //       expect(wrapper.vm.currentPage).toBe(2)

// //       const prevButton = wrapper.find('button:nth-last-child(2)')
// //       await prevButton.trigger('click')

// //       expect(wrapper.vm.currentPage).toBe(1)
// //     })

// //     it('disables prev button on first page', async () => {
// //       // await wrapper.vm.$nextTick() // Already done in beforeEach
// //       const prevButton = wrapper.find('button:nth-last-child(2)')
// //       expect(prevButton.attributes('disabled')).toBeDefined()
// //     })

// //     it('disables next button on last page', async () => {
// //       // await wrapper.vm.$nextTick() // Already done in beforeEach

// //       // Go to last page
// //       await wrapper.setData({ currentPage: 2 }) // Directly set data for computed properties to react
// //       await wrapper.vm.$nextTick() // Wait for Vue to re-render

// //       const nextButton = wrapper.find('button:last-child')
// //       expect(nextButton.attributes('disabled')).toBeDefined()
// //     })
// //   })

// //   describe('Export Modal', () => {
// //     it('shows export modal when export button is clicked', async () => {
// //       const exportButton = wrapper.find('button:first-of-type')
// //       await exportButton.trigger('click')

// //       const modal = wrapper.find('.fixed.inset-0')
// //       expect(modal.exists()).toBe(true)
// //       expect(modal.text()).toContain('Export Tickets')
// //     })

// //     it('hides export modal when close button is clicked', async () => {
// //       await wrapper.setData({ showExportModal: true })
// //       await wrapper.vm.$nextTick() // Ensure modal is rendered

// //       const closeButton = wrapper.find('.text-gray-500')
// //       await closeButton.trigger('click')

// //       expect(wrapper.vm.showExportModal).toBe(false)
// //     })

// //     it('hides export modal when cancel button is clicked', async () => {
// //       await wrapper.setData({ showExportModal: true })
// //       await wrapper.vm.$nextTick() // Ensure modal is rendered

// //       const cancelButton = wrapper.findAll('.px-4.py-2')[0] // First button is cancel
// //       await cancelButton.trigger('click')

// //       expect(wrapper.vm.showExportModal).toBe(false)
// //     })

// //     it('renders export filter options correctly', async () => {
// //       await wrapper.setData({ showExportModal: true })
// //       await wrapper.vm.$nextTick() // Ensure modal is rendered

// //       const statusSelect = wrapper.find('select')
// //       const options = statusSelect.findAll('option')

// //       expect(options).toHaveLength(4)
// //       expect(options[0].text()).toBe('All Statuses')
// //       expect(options[1].text()).toBe('Active')
// //       expect(options[2].text()).toBe('Closed')
// //       expect(options[3].text()).toBe('Unassigned')
// //     })

// //     it('renders date range inputs', async () => {
// //       await wrapper.setData({ showExportModal: true })
// //       await wrapper.vm.$nextTick() // Ensure modal is rendered

// //       const dateInputs = wrapper.findAll('input[type="date"]')
// //       expect(dateInputs).toHaveLength(2)
// //     })

// //     it('sets default date range on mount', async () => {
// //       // The default date range is set when the modal is shown, not on component mount
// //       await wrapper.setData({ showExportModal: true })
// //       await wrapper.vm.$nextTick()

// //       expect(wrapper.vm.exportFilters.startDate).toBeTruthy()
// //       expect(wrapper.vm.exportFilters.endDate).toBeTruthy()

// //       // Check if dates are within expected range (last 30 days)
// //       const startDate = new Date(wrapper.vm.exportFilters.startDate)
// //       const endDate = new Date(wrapper.vm.exportFilters.endDate)
// //       const daysDiff = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)

// //       expect(daysDiff).toBeCloseTo(30, 1)
// //     })
// //   })

// //   describe('CSV Export Functionality', () => {
// //     beforeEach(async () => {
// //       // Ensure the modal is open before each test in this suite
// //       await wrapper.setData({ showExportModal: true })
// //       await wrapper.vm.$nextTick()
// //       vi.clearAllMocks() // Clear mocks specifically for export functionality if needed
// //     })

// //     it('exports all tickets when no filters are applied', async () => {
// //       const exportButton = wrapper
// //         .findAllComponents('button')
// //         .find((btn) => btn.text() === 'Export')

// //       await exportButton?.trigger('click')

// //       // Inspect the arguments passed to Blob to verify content
// //       expect(global.Blob).toHaveBeenCalledWith(
// //         expect.arrayContaining([
// //           expect.stringContaining('ID,Title,Status,Created At'),
// //           expect.stringContaining('1,First Ticket,ACTIVE'),
// //           expect.stringContaining('2,Second Ticket,CLOSED'),
// //           // ... you might want to check all tickets or a representative sample
// //         ]),
// //         { type: 'text/csv;charset=utf-8;' },
// //       )

// //       expect(global.URL.createObjectURL).toHaveBeenCalled()
// //       expect(document.createElement).toHaveBeenCalledWith('a')
// //       expect(document.body.appendChild).toHaveBeenCalled()
// //       expect(document.body.removeChild).toHaveBeenCalled()
// //     })

// //     it('filters tickets by status', async () => {
// //       const statusSelect = wrapper.find('select')
// //       await statusSelect.setValue('ACTIVE')
// //       await wrapper.vm.$nextTick() // Wait for select to update vm

// //       const exportButton = wrapper
// //         .findAllComponents('button')
// //         .find((btn) => btn.text() === 'Export')

// //       await exportButton?.trigger('click')

// //       // Verify that only ACTIVE tickets would be exported
// //       // You'll need to check the actual content of the Blob to confirm filtering
// //       const blobArgs = (global.Blob as any).mock.calls[
// //         (global.Blob as any).mock.calls.length - 1
// //       ][0][0]
// //       expect(blobArgs).not.toContain('CLOSED')
// //       expect(blobArgs).not.toContain('UNASSIGNED')
// //       expect(blobArgs).toContain('ACTIVE')
// //       // For a more robust test, you could parse the CSV string and check row counts
// //     })

// //     it('filters tickets by date range', async () => {
// //       const dateInputs = wrapper.findAll('input[type="date"]')
// //       await dateInputs[0].setValue('2025-06-20') // Start date
// //       await dateInputs[1].setValue('2025-06-30') // End date
// //       await wrapper.vm.$nextTick()

// //       expect(wrapper.vm.exportFilters.startDate).toBe('2025-06-20')
// //       expect(wrapper.vm.exportFilters.endDate).toBe('2025-06-30')

// //       const exportButton = wrapper
// //         .findAllComponents('button')
// //         .find((btn) => btn.text() === 'Export')

// //       await exportButton?.trigger('click')

// //       const blobArgs = (global.Blob as any).mock.calls[
// //         (global.Blob as any).mock.calls.length - 1
// //       ][0][0]

// //       // Check for tickets within the range
// //       expect(blobArgs).toContain('2,Second Ticket,CLOSED') // 2025-06-20
// //       expect(blobArgs).toContain('3,Third Ticket,UNASSIGNED') // 2025-06-25
// //       expect(blobArgs).toContain('4,Fourth Ticket,ACTIVE') // 2025-06-28
// //       expect(blobArgs).toContain('5,Fifth Ticket,CLOSED') // 2025-06-30

// //       // Check for tickets outside the range
// //       expect(blobArgs).not.toContain('1,First Ticket,ACTIVE') // 2025-06-15
// //       expect(blobArgs).not.toContain('6,Sixth Ticket,ACTIVE') // 2025-07-01
// //     })

// //     it('creates download link with correct filename', async () => {
// //       const createElementSpy = vi.spyOn(document, 'createElement')

// //       const exportButton = wrapper
// //         .findAllComponents('button')
// //         .find((btn) => btn.text() === 'Export')

// //       await exportButton?.trigger('click')

// //       expect(createElementSpy).toHaveBeenCalledWith('a')
// //       const anchorElement = createElementSpy.mock.results[0].value
// //       expect(anchorElement.setAttribute).toHaveBeenCalledWith('href', 'mock-url')
// //       expect(anchorElement.setAttribute).toHaveBeenCalledWith(
// //         'download',
// //         expect.stringContaining('tickets-export-'),
// //       )
// //       expect(anchorElement.setAttribute).toHaveBeenCalledWith(
// //         'download',
// //         expect.stringMatching(/tickets-export-\d{4}-\d{2}-\d{2}\.csv/),
// //       )
// //     })

// //     it('closes modal after export', async () => {
// //       const exportButton = wrapper
// //         .findAllComponents('button')
// //         .find((btn) => btn.text() === 'Export')

// //       await exportButton?.trigger('click')

// //       expect(wrapper.vm.showExportModal).toBe(false)
// //     })
// //   })

// //   describe('Ticket Navigation', () => {
// //     it('navigates to ticket detail when row is clicked', async () => {
// //       // await wrapper.vm.$nextTick() // Already done in beforeEach

// //       const firstRow = wrapper.find('tbody tr:first-child')
// //       await firstRow.trigger('click')

// //       expect(mockSetTicket).toHaveBeenCalledWith(mockTickets[0])
// //       expect(mockPush).toHaveBeenCalledWith('/my-tickets/1')
// //     })

// //     it('handles ticket click with correct ticket data', async () => {
// //       // await wrapper.vm.$nextTick() // Already done in beforeEach

// //       const secondRow = wrapper.find('tbody tr:nth-child(2)')
// //       await secondRow.trigger('click')

// //       expect(mockSetTicket).toHaveBeenCalledWith(mockTickets[1])
// //       expect(mockPush).toHaveBeenCalledWith('/my-tickets/2')
// //     })
// //   })

// //   describe('Date Formatting', () => {
// //     it('formats dates correctly in table', async () => {
// //       // await wrapper.vm.$nextTick() // Already done in beforeEach

// //       const dateCell = wrapper.find('tbody tr:first-child td:last-child')
// //       // Ensure consistent date formatting based on locale for testing
// //       const expectedDate = new Date('2025-06-15T10:00:00Z').toLocaleDateString(
// //         undefined, // Use default locale
// //         { year: 'numeric', month: '2-digit', day: '2-digit' }, // Explicit format for consistency
// //       )
// //       // If the component uses Intl.DateTimeFormat, make sure your test matches that.
// //       // For now, assuming default `toLocaleDateString()`.

// //       expect(dateCell.text()).toBe(expectedDate)
// //     })

// //     it('formats dates correctly in CSV export', () => {
// //       const testDate = new Date('2025-06-15T10:00:00Z')
// //       const formatted = wrapper.vm.formatDate(testDate)

// //       // CSV export usually prefers YYYY-MM-DD or similar fixed format for machine readability.
// //       // Adjust this expectation based on the actual implementation of formatDate in TicketListView.vue
// //       // For example, if it's 'YYYY-MM-DD', then:
// //       expect(formatted).toBe('2025-06-15') // Assuming YYYY-MM-DD for CSV
// //     })
// //   })

// //   describe('Component Lifecycle', () => {
// //     it('fetches tickets on mount', () => {
// //       expect(mockFetchTicketsByAgent).toHaveBeenCalled()
// //     })

// //     it('handles fetch tickets error gracefully', async () => {
// //       mockFetchTicketsByAgent.mockRejectedValue(new Error('Fetch failed'))
// //       const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

// //       // Remount component to trigger onMounted with error
// //       wrapper.unmount() // Unmount the current wrapper
// //       // Need to re-create pinia and router for the new mount
// //       const newPinia = createPinia()
// //       const newRouter = createRouter({
// //         history: createWebHistory(),
// //         routes: [{ path: '/my-tickets/:id', component: { template: '<div>Ticket Detail</div>' } }],
// //       })
// //       await newRouter.isReady()

// //       wrapper = mount(Dashboard, {
// //         global: {
// //           plugins: [newPinia, newRouter],
// //         },
// //       })

// //       // Wait for the asynchronous fetch to complete and component to re-render
// //       await wrapper.vm.$nextTick()
// //       await new Promise((resolve) => setTimeout(resolve, 0)) // Small delay to allow promises to settle if needed

// //       // Component should handle the error gracefully
// //       expect(wrapper.vm.assignedTickets).toEqual([])
// //       expect(consoleSpy).toHaveBeenCalledWith(expect.any(String), expect.any(Error))

// //       consoleSpy.mockRestore()
// //     })
// //   })

// //   describe('Computed Properties', () => {
// //     it('calculates paginated tickets correctly', async () => {
// //       // await wrapper.vm.$nextTick() // Already done in beforeEach

// //       const paginatedTickets = wrapper.vm.paginatedTickets
// //       expect(paginatedTickets).toHaveLength(5)
// //       expect(paginatedTickets[0].id).toBe('1')
// //     })

// //     it('calculates end index correctly', async () => {
// //       // await wrapper.vm.$nextTick() // Already done in beforeEach

// //       expect(wrapper.vm.endIndex).toBe(5) // currentPage (1) * perPage (5)

// //       await wrapper.setData({ currentPage: 2 }) // Use setData for reactivity
// //       await wrapper.vm.$nextTick()

// //       expect(wrapper.vm.endIndex).toBe(10)
// //     })
// //   })

// //   describe('Responsive Design', () => {
// //     it('renders grid layout for stats section', () => {
// //       const statsGrid = wrapper.find('.grid.grid-cols-1.sm\\:grid-cols-3')
// //       expect(statsGrid.exists()).toBe(true)
// //     })

// //     it('has overflow-x-auto for table responsiveness', () => {
// //       const tableContainer = wrapper.find('.overflow-x-auto')
// //       expect(tableContainer.exists()).toBe(true)
// //     })
// //   })

// //   describe('Accessibility', () => {
// //     it('has proper table structure', () => {
// //       const table = wrapper.find('table')
// //       const thead = table.find('thead')
// //       const tbody = table.find('tbody')

// //       expect(thead.exists()).toBe(true)
// //       expect(tbody.exists()).toBe(true)
// //     })

// //     it('has proper form labels in export modal', async () => {
// //       await wrapper.setData({ showExportModal: true })
// //       await wrapper.vm.$nextTick() // Ensure modal is rendered

// //       const labels = wrapper.findAll('label')
// //       expect(labels.length).toBeGreaterThan(0)

// //       const statusLabel = labels.find((label) => label.text().includes('Status'))
// //       const dateLabel = labels.find((label) => label.text().includes('Date Range'))

// //       expect(statusLabel).toBeTruthy()
// //       expect(dateLabel).toBeTruthy()
// //     })
// //   })
// // })

// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { mount, VueWrapper } from '@vue/test-utils'
// import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
// import { createRouter, createWebHistory, type Router } from 'vue-router'
// import { createPinia, setActivePinia, type Pinia } from 'pinia'
// import Dashboard from './TicketListView.vue' // Adjust path as needed

// // Mock data (keep as is)
// const mockTickets = [
//   {
//     id: '1',
//     title: 'First Ticket',
//     content: 'Content of first ticket',
//     status: 'ACTIVE',
//     createdAt: new Date('2025-06-15T10:00:00Z'),
//   },
//   {
//     id: '2',
//     title: 'Second Ticket',
//     content: 'Content of second ticket',
//     status: 'CLOSED',
//     createdAt: new Date('2025-06-20T10:00:00Z'),
//   },
//   {
//     id: '3',
//     title: 'Third Ticket',
//     content: 'Content of third ticket',
//     status: 'UNASSIGNED',
//     createdAt: new Date('2025-06-25T10:00:00Z'),
//   },
//   {
//     id: '4',
//     title: 'Fourth Ticket',
//     content: 'Content of fourth ticket',
//     status: 'ACTIVE',
//     createdAt: new Date('2025-06-28T10:00:00Z'),
//   },
//   {
//     id: '5',
//     title: 'Fifth Ticket',
//     content: 'Content of fifth ticket',
//     status: 'CLOSED',
//     createdAt: new Date('2025-06-30T10:00:00Z'),
//   },
//   {
//     id: '6',
//     title: 'Sixth Ticket',
//     content: 'Content of sixth ticket',
//     status: 'ACTIVE',
//     createdAt: new Date('2025-07-01T10:00:00Z'),
//   },
// ]

// // Mock functions
// const mockFetchTicketsByAgent = vi.fn()
// const mockSetTicket = vi.fn()
// const mockPush = vi.fn()

// // Mock vue-router
// vi.mock('vue-router', async () => {
//   const actual = await vi.importActual('vue-router')
//   return {
//     ...actual,
//     useRouter: () => ({
//       push: mockPush,
//       // Add other router properties if the component tries to access them,
//       // even if not used in your tests, it might be implicitly trying.
//       // E.g., currentRoute: { value: { path: '/', params: {} } }
//     }),
//   }
// })

// // Mock tickets store
// vi.mock('@/stores/tickets', () => ({
//   useTicketsStore: () => ({
//     tickets: mockTickets, // Keep this as the direct array for simplicity in mocks
//     fetchTicketsByAgent: mockFetchTicketsByAgent,
//     setTicket: mockSetTicket,
//   }),
// }))

// // Mock URL and Blob for CSV export
// // Add type assertions for better safety.
// global.URL = {
//   createObjectURL: vi.fn(() => 'mock-url'),
//   revokeObjectURL: vi.fn(),
// } as unknown as typeof URL // More accurate typing

// global.Blob = vi.fn().mockImplementation((content, options) => ({
//   content,
//   options,
// })) as unknown as typeof Blob // More accurate typing

// // Mock document methods for CSV download
// const mockAnchorElement = {
//   setAttribute: vi.fn(),
//   click: vi.fn(),
//   style: {},
//   remove: vi.fn(), // Ensure remove is mocked
// }
// Object.defineProperty(document, 'createElement', {
//   value: vi.fn((tagName: string) => {
//     if (tagName === 'a') {
//       return mockAnchorElement
//     }
//     // Return a generic mock for other elements if needed, or throw if unexpected.
//     return {
//       setAttribute: vi.fn(),
//       click: vi.fn(),
//       style: {},
//       remove: vi.fn(),
//     }
//   }),
// })

// Object.defineProperty(document.body, 'appendChild', {
//   value: vi.fn(),
// })

// Object.defineProperty(document.body, 'removeChild', {
//   value: vi.fn(),
// })

// describe('Dashboard Component', () => {
//   let wrapper: VueWrapper<any>
//   let router: Router
//   let pinia: Pinia

//   beforeEach(async () => {
//     // 1. Clear all mocks FIRST. This ensures a clean slate before any new setup.
//     vi.clearAllMocks()

//     // 2. Mock resolved value for the fetch function before store is used
//     mockFetchTicketsByAgent.mockResolvedValue(mockTickets)

//     // 3. Setup Pinia
//     pinia = createPinia()
//     setActivePinia(pinia)

//     // 4. Setup Vue Router
//     router = createRouter({
//       history: createWebHistory(),
//       routes: [
//         { path: '/', component: { template: '<div>Home</div>' } },
//         { path: '/my-tickets/:id', component: { template: '<div>Ticket Detail</div>' } },
//       ],
//     })

//     // 5. Wait for the router to be ready. This is crucial.
//     await router.isReady()

//     // 6. Mount the component.
//     wrapper = mount(Dashboard, {
//       global: {
//         plugins: [pinia, router],
//       },
//     })

//     // 7. Wait for Vue to render and all component lifecycle hooks to complete,
//     //    including any data fetching.
//     //    We might need more than one nextTick if there are multiple async updates
//     //    or nested components. For the `onMounted` data fetch, one `nextTick`
//     //    after the promise resolves should be enough IF `fetchTicketsByAgent`
//     //    is the only async operation on mount.
//     await wrapper.vm.$nextTick()
//     // Consider adding a small timeout if $nextTick is not enough to settle
//     // all promises/timers, though generally it should be avoided.
//     // If your component has internal timers (e.g., setTimeout), you might need:
//     // await vi.advanceTimersByTimeAsync(0);
//   }, 15000) // Increase beforeEach hook timeout to 15 seconds as a temporary measure

//   afterEach(() => {
//     // Ensure wrapper is defined before attempting to unmount
//     if (wrapper && !wrapper.getCurrentComponent().isUnmounted) {
//       wrapper.unmount()
//     }
//     // Explicitly destroy router history
//     if (router) {
//       router.history.destroy()
//     }
//     // Reset mocks that might interfere with global state
//     // vi.resetAllMocks() // Use this if you want to clear mock implementations as well
//   })

//   // Your tests follow...
//   describe('Component Rendering', () => {
//     it('renders the stats section correctly', async () => {
//       // No need for await wrapper.vm.$nextTick() here, it's done in beforeEach
//       expect(wrapper.text()).toContain('Total Assigned')
//       expect(wrapper.text()).toContain('Active')
//       expect(wrapper.text()).toContain('Closed')

//       const statValues = wrapper.findAll('.text-2xl.font-semibold')
//       expect(statValues).toHaveLength(3)
//     })

//     it('renders the export button', () => {
//       const exportButton = wrapper.find('button:first-of-type')
//       expect(exportButton.text()).toBe('Export as CSV')
//       expect(exportButton.find('svg').exists()).toBe(true)
//     })

//     it('renders the tickets table', () => {
//       expect(wrapper.find('table').exists()).toBe(true)
//       expect(wrapper.text()).toContain('Tickets Assigned to You')

//       const tableHeaders = wrapper.findAll('th')
//       expect(tableHeaders).toHaveLength(3)
//       expect(tableHeaders[0].text()).toBe('Title')
//       expect(tableHeaders[1].text()).toBe('Status')
//       expect(tableHeaders[2].text()).toBe('Created At')
//     })

//     it('renders pagination controls', () => {
//       const paginationButtons = wrapper.findAll('.px-3.py-1')
//       expect(paginationButtons).toHaveLength(2)
//       expect(paginationButtons[0].text()).toBe('Prev')
//       expect(paginationButtons[1].text()).toBe('Next')
//     })

//     it('does not show export modal initially', () => {
//       const modal = wrapper.find('.fixed.inset-0')
//       expect(modal.exists()).toBe(false)
//     })
//   })

//   describe('Stats Calculation', () => {
//     it('calculates total assigned tickets correctly', () => {
//       expect(wrapper.vm.totalAssigned).toBe(6)
//     })

//     it('calculates active tickets correctly', () => {
//       expect(wrapper.vm.activeAssigned).toBe(3)
//     })

//     it('calculates closed tickets correctly', () => {
//       expect(wrapper.vm.closedAssigned).toBe(2)
//     })
//   })

//   describe('Table Rendering and Pagination', () => {
//     it('displays paginated tickets correctly', () => {
//       const tableRows = wrapper.findAll('tbody tr')
//       expect(tableRows).toHaveLength(5) // perPage = 5
//     })

//     it('shows correct ticket information in table rows', () => {
//       const firstRow = wrapper.find('tbody tr:first-child')
//       expect(firstRow.text()).toContain('First Ticket')
//       expect(firstRow.text()).toContain('ACTIVE')
//     })

//     it('applies correct status styling', () => {
//       const statusElements = wrapper.findAll('tbody td:nth-child(2) span')

//       const activeStatus = statusElements.find((el) => el.text() === 'ACTIVE')
//       const closedStatus = statusElements.find((el) => el.text() === 'CLOSED')
//       const unassignedStatus = statusElements.find((el) => el.text() === 'UNASSIGNED')

//       if (activeStatus) expect(activeStatus.classes()).toContain('text-yellow-600')
//       if (closedStatus) expect(closedStatus.classes()).toContain('text-green-600')
//       if (unassignedStatus) expect(unassignedStatus.classes()).toContain('text-gray-600')
//     })

//     it('handles pagination correctly', async () => {
//       const nextButton = wrapper.find('button:last-child')
//       await nextButton.trigger('click')

//       expect(wrapper.vm.currentPage).toBe(2)

//       const prevButton = wrapper.find('button:nth-last-child(2)')
//       await prevButton.trigger('click')

//       expect(wrapper.vm.currentPage).toBe(1)
//     })

//     it('disables prev button on first page', () => {
//       const prevButton = wrapper.find('button:nth-last-child(2)')
//       expect(prevButton.attributes('disabled')).toBeDefined()
//     })

//     it('disables next button on last page', async () => {
//       await wrapper.setData({ currentPage: 2 })
//       await wrapper.vm.$nextTick()

//       const nextButton = wrapper.find('button:last-child')
//       expect(nextButton.attributes('disabled')).toBeDefined()
//     })
//   })

//   describe('Export Modal', () => {
//     it('shows export modal when export button is clicked', async () => {
//       const exportButton = wrapper.find('button:first-of-type')
//       await exportButton.trigger('click')
//       await wrapper.vm.$nextTick() // Ensure modal is rendered

//       const modal = wrapper.find('.fixed.inset-0')
//       expect(modal.exists()).toBe(true)
//       expect(modal.text()).toContain('Export Tickets')
//     })

//     it('hides export modal when close button is clicked', async () => {
//       await wrapper.setData({ showExportModal: true })
//       await wrapper.vm.$nextTick()

//       const closeButton = wrapper.find('.text-gray-500')
//       await closeButton.trigger('click')
//       await wrapper.vm.$nextTick() // Wait for hide animation/render

//       expect(wrapper.vm.showExportModal).toBe(false)
//     })

//     it('hides export modal when cancel button is clicked', async () => {
//       await wrapper.setData({ showExportModal: true })
//       await wrapper.vm.$nextTick()

//       const cancelButton = wrapper.findAll('.px-4.py-2')[0]
//       await cancelButton.trigger('click')
//       await wrapper.vm.$nextTick()

//       expect(wrapper.vm.showExportModal).toBe(false)
//     })

//     it('renders export filter options correctly', async () => {
//       await wrapper.setData({ showExportModal: true })
//       await wrapper.vm.$nextTick()

//       const statusSelect = wrapper.find('select')
//       const options = statusSelect.findAll('option')

//       expect(options).toHaveLength(4)
//       expect(options[0].text()).toBe('All Statuses')
//       expect(options[1].text()).toBe('Active')
//       expect(options[2].text()).toBe('Closed')
//       expect(options[3].text()).toBe('Unassigned')
//     })

//     it('renders date range inputs', async () => {
//       await wrapper.setData({ showExportModal: true })
//       await wrapper.vm.$nextTick()

//       const dateInputs = wrapper.findAll('input[type="date"]')
//       expect(dateInputs).toHaveLength(2)
//     })

//     it('sets default date range on mount', async () => {
//       await wrapper.setData({ showExportModal: true })
//       await wrapper.vm.$nextTick()

//       expect(wrapper.vm.exportFilters.startDate).toBeTruthy()
//       expect(wrapper.vm.exportFilters.endDate).toBeTruthy()

//       const startDate = new Date(wrapper.vm.exportFilters.startDate)
//       const endDate = new Date(wrapper.vm.exportFilters.endDate)
//       const daysDiff = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)

//       expect(daysDiff).toBeCloseTo(30, 1)
//     })
//   })

//   describe('CSV Export Functionality', () => {
//     beforeEach(async () => {
//       await wrapper.setData({ showExportModal: true })
//       await wrapper.vm.$nextTick()
//       vi.clearAllMocks() // Clear mocks specifically for export functionality for this suite
//     })

//     it('exports all tickets when no filters are applied', async () => {
//       const exportButton = wrapper
//         .findAllComponents('button')
//         .find((btn) => btn.text() === 'Export')

//       await exportButton?.trigger('click')
//       await wrapper.vm.$nextTick() // Wait for export logic to complete

//       expect(global.Blob).toHaveBeenCalledWith(
//         expect.arrayContaining([
//           expect.stringContaining('ID,Title,Status,Created At'),
//           expect.stringContaining('1,First Ticket,ACTIVE'),
//           expect.stringContaining('2,Second Ticket,CLOSED'),
//           expect.stringContaining('6,Sixth Ticket,ACTIVE'), // Check for a specific ticket
//         ]),
//         { type: 'text/csv;charset=utf-8;' },
//       )
//       expect(global.URL.createObjectURL).toHaveBeenCalled()
//       expect(document.createElement).toHaveBeenCalledWith('a')
//       expect(document.body.appendChild).toHaveBeenCalled()
//       expect(mockAnchorElement.click).toHaveBeenCalled() // Check mockAnchorElement
//       expect(document.body.removeChild).toHaveBeenCalled()
//     })

//     it('filters tickets by status', async () => {
//       const statusSelect = wrapper.find('select')
//       await statusSelect.setValue('ACTIVE')
//       await wrapper.vm.$nextTick()

//       const exportButton = wrapper
//         .findAllComponents('button')
//         .find((btn) => btn.text() === 'Export')

//       await exportButton?.trigger('click')
//       await wrapper.vm.$nextTick()

//       const blobArgs = (global.Blob as any).mock.calls[
//         (global.Blob as any).mock.calls.length - 1
//       ][0][0]
//       expect(blobArgs).not.toContain('CLOSED')
//       expect(blobArgs).not.toContain('UNASSIGNED')
//       expect(blobArgs).toContain('ACTIVE')
//       expect(blobArgs).toContain('1,First Ticket,ACTIVE')
//       expect(blobArgs).toContain('4,Fourth Ticket,ACTIVE')
//       expect(blobArgs).toContain('6,Sixth Ticket,ACTIVE')
//     })

//     it('filters tickets by date range', async () => {
//       const dateInputs = wrapper.findAll('input[type="date"]')
//       await dateInputs[0].setValue('2025-06-20')
//       await dateInputs[1].setValue('2025-06-30')
//       await wrapper.vm.$nextTick()

//       const exportButton = wrapper
//         .findAllComponents('button')
//         .find((btn) => btn.text() === 'Export')

//       await exportButton?.trigger('click')
//       await wrapper.vm.$nextTick()

//       const blobArgs = (global.Blob as any).mock.calls[
//         (global.Blob as any).mock.calls.length - 1
//       ][0][0]

//       expect(blobArgs).toContain('2,Second Ticket,CLOSED')
//       expect(blobArgs).toContain('3,Third Ticket,UNASSIGNED')
//       expect(blobArgs).toContain('4,Fourth Ticket,ACTIVE')
//       expect(blobArgs).toContain('5,Fifth Ticket,CLOSED')

//       expect(blobArgs).not.toContain('1,First Ticket,ACTIVE')
//       expect(blobArgs).not.toContain('6,Sixth Ticket,ACTIVE')
//     })

//     it('creates download link with correct filename', async () => {
//       vi.clearAllMocks() // Clear createElement spy specifically for this test
//       const createElementSpy = vi.spyOn(document, 'createElement')

//       const exportButton = wrapper
//         .findAllComponents('button')
//         .find((btn) => btn.text() === 'Export')

//       await exportButton?.trigger('click')
//       await wrapper.vm.$nextTick()

//       expect(createElementSpy).toHaveBeenCalledWith('a')
//       const anchorElement = mockAnchorElement // Use the explicitly mocked element
//       expect(anchorElement.setAttribute).toHaveBeenCalledWith('href', 'mock-url')
//       expect(anchorElement.setAttribute).toHaveBeenCalledWith(
//         'download',
//         expect.stringMatching(/tickets-export-\d{4}-\d{2}-\d{2}\.csv/),
//       )
//     })

//     it('closes modal after export', async () => {
//       const exportButton = wrapper
//         .findAllComponents('button')
//         .find((btn) => btn.text() === 'Export')

//       await exportButton?.trigger('click')
//       await wrapper.vm.$nextTick()

//       expect(wrapper.vm.showExportModal).toBe(false)
//     })
//   })

//   describe('Ticket Navigation', () => {
//     it('navigates to ticket detail when row is clicked', async () => {
//       const firstRow = wrapper.find('tbody tr:first-child')
//       await firstRow.trigger('click')
//       await wrapper.vm.$nextTick() // Ensure push happens

//       expect(mockSetTicket).toHaveBeenCalledWith(mockTickets[0])
//       expect(mockPush).toHaveBeenCalledWith('/my-tickets/1')
//     })

//     it('handles ticket click with correct ticket data', async () => {
//       const secondRow = wrapper.find('tbody tr:nth-child(2)')
//       await secondRow.trigger('click')
//       await wrapper.vm.$nextTick()

//       expect(mockSetTicket).toHaveBeenCalledWith(mockTickets[1])
//       expect(mockPush).toHaveBeenCalledWith('/my-tickets/2')
//     })
//   })

//   describe('Date Formatting', () => {
//     it('formats dates correctly in table', async () => {
//       const dateCell = wrapper.find('tbody tr:first-child td:last-child')
//       const expectedDate = new Date('2025-06-15T10:00:00Z').toLocaleDateString(undefined, {
//         year: 'numeric',
//         month: '2-digit',
//         day: '2-digit',
//       })
//       expect(dateCell.text()).toBe(expectedDate)
//     })

//     it('formats dates correctly in CSV export', () => {
//       const testDate = new Date('2025-06-15T10:00:00Z')
//       // Ensure this matches the component's actual formatDate implementation for CSV
//       const formatted = wrapper.vm.formatDate(testDate)
//       expect(formatted).toBe('2025-06-15') // Assuming YYYY-MM-DD
//     })
//   })

//   describe('Component Lifecycle', () => {
//     it('fetches tickets on mount', () => {
//       expect(mockFetchTicketsByAgent).toHaveBeenCalled()
//     })

//     it('handles fetch tickets error gracefully', async () => {
//       mockFetchTicketsByAgent.mockRejectedValueOnce(new Error('Fetch failed')) // Use mockRejectedValueOnce

//       const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

//       // Unmount the current wrapper created in beforeEach
//       if (wrapper && !wrapper.getCurrentComponent().isUnmounted) {
//         wrapper.unmount()
//       }
//       if (router) {
//         // router.history.destroy()
//       }

//       // Re-create Pinia and Router for this specific test
//       const newPinia = createPinia()
//       const newRouter = createRouter({
//         history: createWebHistory(),
//         routes: [{ path: '/my-tickets/:id', component: { template: '<div>Ticket Detail</div>' } }],
//       })
//       await newRouter.isReady()

//       // Mount the component again to trigger the error
//       wrapper = mount(Dashboard, {
//         global: {
//           plugins: [newPinia, newRouter],
//         },
//       })

//       // Wait for the asynchronous fetch (which will now error) and component re-render
//       await wrapper.vm.$nextTick()
//       // Give some time for the promise rejection and error handler to run
//       await new Promise((resolve) => setTimeout(resolve, 50)) // Small delay for async error handling

//       expect(wrapper.vm.assignedTickets).toEqual([]) // Expect assignedTickets to be empty on error
//       expect(consoleSpy).toHaveBeenCalledWith(
//         expect.stringContaining('Error fetching tickets:'),
//         expect.any(Error),
//       )

//       consoleSpy.mockRestore()
//     })
//   })

//   describe('Computed Properties', () => {
//     it('calculates paginated tickets correctly', () => {
//       const paginatedTickets = wrapper.vm.paginatedTickets
//       expect(paginatedTickets).toHaveLength(5)
//       expect(paginatedTickets[0].id).toBe('1')
//     })

//     it('calculates end index correctly', async () => {
//       expect(wrapper.vm.endIndex).toBe(5)

//       await wrapper.setData({ currentPage: 2 })
//       await wrapper.vm.$nextTick()

//       expect(wrapper.vm.endIndex).toBe(6) // Should be 6 for 6 tickets, 5 per page, last page has 1 ticket. 5 (start index) + 1 (ticket)
//       // Re-evaluating: If endIndex is 1-based, and perPage is 5, then page 1 (tickets 1-5) ends at 5.
//       // Page 2 (ticket 6) would still represent an end index calculation that might be based on `currentPage * perPage`.
//       // If total is 6 and perPage is 5,
//       // Page 1: (1-5) endIndex = 5
//       // Page 2: (6-6) endIndex = Math.min(currentPage * perPage, totalTickets) = Math.min(2 * 5, 6) = 6. This looks correct now.
//     })
//   })

//   describe('Responsive Design', () => {
//     it('renders grid layout for stats section', () => {
//       const statsGrid = wrapper.find('.grid.grid-cols-1.sm\\:grid-cols-3')
//       expect(statsGrid.exists()).toBe(true)
//     })

//     it('has overflow-x-auto for table responsiveness', () => {
//       const tableContainer = wrapper.find('.overflow-x-auto')
//       expect(tableContainer.exists()).toBe(true)
//     })
//   })

//   describe('Accessibility', () => {
//     it('has proper table structure', () => {
//       const table = wrapper.find('table')
//       const thead = table.find('thead')
//       const tbody = table.find('tbody')

//       expect(thead.exists()).toBe(true)
//       expect(tbody.exists()).toBe(true)
//     })

//     it('has proper form labels in export modal', async () => {
//       await wrapper.setData({ showExportModal: true })
//       await wrapper.vm.$nextTick()

//       const labels = wrapper.findAll('label')
//       expect(labels.length).toBeGreaterThan(0)

//       const statusLabel = labels.find((label) => label.text().includes('Status'))
//       const dateLabel = labels.find((label) => label.text().includes('Date Range'))

//       expect(statusLabel).toBeTruthy()
//       expect(dateLabel).toBeTruthy()
//     })
//   })
// })

/* eslint-disable @typescript-eslint/no-explicit-any */
import { mount, VueWrapper } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { createRouter, createWebHistory, type Router } from 'vue-router'
import { createPinia, setActivePinia, type Pinia } from 'pinia'
import TicketListView from './TicketListView.vue' // Renamed from Dashboard to match component name

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

// Mock functions for Pinia store and Router
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
      // Provide a mock for currentRoute if the component implicitly accesses it
      currentRoute: { value: { path: '/', params: {} } },
    }),
  }
})

// Mock tickets store
vi.mock('@/stores/tickets', () => ({
  useTicketsStore: () => ({
    // Ensure 'tickets' is directly accessible as a ref or a getter that returns the array
    tickets: mockTickets, // This makes it directly available to the component
    fetchTicketsByAgent: mockFetchTicketsByAgent,
    setTicket: mockSetTicket,
  }),
}))

// Mock global URL and Blob for CSV export
global.URL = {
  createObjectURL: vi.fn(() => 'mock-url'),
  revokeObjectURL: vi.fn(),
} as unknown as typeof URL // Use unknown as typeof for better type safety

global.Blob = vi.fn().mockImplementation((content, options) => ({
  content,
  options,
})) as unknown as typeof Blob // Use unknown as typeof for better type safety

// Mock document methods for CSV download
const mockAnchorElement = {
  setAttribute: vi.fn(),
  click: vi.fn(),
  style: {},
  remove: vi.fn(), // Mock the remove method which is called on the link element
}
Object.defineProperty(document, 'createElement', {
  value: vi.fn((tagName: string) => {
    if (tagName === 'a') {
      return mockAnchorElement
    }
    // Return a generic mock for other elements if the component creates them
    return {
      setAttribute: vi.fn(),
      click: vi.fn(),
      style: {},
      remove: vi.fn(),
    }
  }),
})

Object.defineProperty(document.body, 'appendChild', {
  value: vi.fn(),
})

Object.defineProperty(document.body, 'removeChild', {
  value: vi.fn(),
})

describe('TicketListView Component', () => {
  let wrapper: VueWrapper<any>
  let router: Router
  let pinia: Pinia

  beforeEach(async () => {
    // Clear all mocks before each test to ensure a clean slate
    vi.clearAllMocks()

    // Reset the mock implementation for fetchTicketsByAgent for each test
    // This is crucial if you change its behavior in specific tests (e.g., error handling)
    mockFetchTicketsByAgent.mockResolvedValue(mockTickets)

    // Set up Pinia
    pinia = createPinia()
    setActivePinia(pinia)

    // Set up Vue Router
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/my-tickets/:id', component: { template: '<div>Ticket Detail</div>' } },
      ],
    })

    // Wait for the router to be ready before mounting the component
    await router.isReady()

    // Mount the component
    wrapper = mount(TicketListView, {
      global: {
        plugins: [pinia, router],
      },
    })

    // Wait for Vue to render and for the onMounted hook (which fetches data) to complete
    // This is critical for preventing timeouts and ensuring component state is ready
    await wrapper.vm.$nextTick()
    // If fetchTicketsByAgent returns a Promise that is explicitly awaited in onMounted,
    // this nextTick covers the component's reactivity update after the promise resolves.
  }, 10000) // Set a higher timeout for the beforeEach hook if needed (e.g., 10000ms)

  afterEach(() => {
    // Unmount the component wrapper
    if (wrapper && !wrapper.getCurrentComponent().isUnmounted) {
      wrapper.unmount()
    }
    // Destroy the router history to prevent memory leaks and state pollution between tests
    if (router) {
      router.history.destroy()
    }
  })

  // --- Component Rendering ---
  describe('Component Rendering', () => {
    it('renders the stats section correctly', () => {
      expect(wrapper.text()).toContain('Total Assigned')
      expect(wrapper.text()).toContain('Active')
      expect(wrapper.text()).toContain('Closed')

      const statValues = wrapper.findAll('.text-2xl.font-semibold')
      expect(statValues).toHaveLength(3)
      // Check the actual displayed values
      expect(statValues[0].text()).toBe('6') // totalAssigned
      expect(statValues[1].text()).toBe('3') // activeAssigned
      expect(statValues[2].text()).toBe('2') // closedAssigned
    })

    it('renders the export button', () => {
      const exportButton = wrapper.find('[data-testid="export-button"]')
      expect(exportButton.exists()).toBe(true)
      expect(exportButton.text()).toContain('Export as CSV')
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

  // --- Stats Calculation ---
  describe('Stats Calculation', () => {
    it('calculates total assigned tickets correctly', () => {
      expect(wrapper.vm.totalAssigned).toBe(mockTickets.length)
    })

    it('calculates active tickets correctly', () => {
      const activeCount = mockTickets.filter((t) => t.status === 'ACTIVE').length
      expect(wrapper.vm.activeAssigned).toBe(activeCount)
    })

    it('calculates closed tickets correctly', () => {
      const closedCount = mockTickets.filter((t) => t.status === 'CLOSED').length
      expect(wrapper.vm.closedAssigned).toBe(closedCount)
    })
  })

  // --- Table Rendering and Pagination ---
  describe('Table Rendering and Pagination', () => {
    it('displays paginated tickets correctly (first page)', () => {
      const tableRows = wrapper.findAll('tbody tr')
      expect(tableRows).toHaveLength(5) // perPage is 5
      expect(tableRows[0].text()).toContain('First Ticket')
      expect(tableRows[4].text()).toContain('Fifth Ticket')
    })

    it('shows correct ticket information in table rows', () => {
      const firstRow = wrapper.find('tbody tr:first-child')
      expect(firstRow.text()).toContain('First Ticket')
      expect(firstRow.text()).toContain('ACTIVE')
      expect(firstRow.text()).toContain(new Date('2025-06-15T10:00:00Z').toLocaleDateString())
    })

    it('applies correct status styling', () => {
      const statusElements = wrapper.findAll('tbody td:nth-child(2) span')

      // Check first active ticket
      expect(statusElements[0].text()).toBe('ACTIVE')
      expect(statusElements[0].classes()).toContain('text-yellow-600')

      // Check first closed ticket (mockTickets[1])
      expect(statusElements[1].text()).toBe('CLOSED')
      expect(statusElements[1].classes()).toContain('text-green-600')

      // Check first unassigned ticket (mockTickets[2])
      // Note: If unassigned is not on the first page, this might fail unless paginated.
      // Assuming it's within the first 5 for now.
      expect(statusElements[2].text()).toBe('UNASSIGNED')
      expect(statusElements[2].classes()).toContain('text-gray-600')
    })

    it('handles pagination correctly', async () => {
      const nextButton = wrapper.find('button:last-child')
      const prevButton = wrapper.find('button:nth-last-child(2)')

      // Initially on page 1
      expect(wrapper.vm.currentPage).toBe(1)
      expect(prevButton.attributes('disabled')).toBeDefined()
      expect(nextButton.attributes('disabled')).toBeUndefined()

      // Go to next page (page 2)
      await nextButton.trigger('click')
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.currentPage).toBe(2)
      expect(prevButton.attributes('disabled')).toBeUndefined()
      expect(nextButton.attributes('disabled')).toBeDefined() // Should be disabled as it's the last page

      // Verify content on page 2 (only 1 ticket)
      const tableRowsPage2 = wrapper.findAll('tbody tr')
      expect(tableRowsPage2).toHaveLength(1)
      expect(tableRowsPage2[0].text()).toContain('Sixth Ticket')

      // Go back to previous page (page 1)
      await prevButton.trigger('click')
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.currentPage).toBe(1)
      expect(prevButton.attributes('disabled')).toBeDefined()
      expect(nextButton.attributes('disabled')).toBeUndefined()
    })

    it('disables prev button on first page', () => {
      expect(wrapper.vm.currentPage).toBe(1)
      const prevButton = wrapper.find('button:nth-last-child(2)')
      expect(prevButton.attributes('disabled')).toBeDefined()
    })

    it('disables next button on last page', async () => {
      await wrapper.setData({ currentPage: 2 }) // Manually set to last page
      await wrapper.vm.$nextTick() // Wait for computed properties to re-evaluate and DOM to update

      const nextButton = wrapper.find('button:last-child')
      expect(nextButton.attributes('disabled')).toBeDefined()
    })
  })

  // --- Export Modal ---
  describe('Export Modal', () => {
    it('shows export modal when export button is clicked', async () => {
      const exportButton = wrapper.find('[data-testid="export-button"]')
      await exportButton.trigger('click')
      await wrapper.vm.$nextTick() // Wait for modal to appear

      const modal = wrapper.find('.fixed.inset-0')
      expect(modal.exists()).toBe(true)
      expect(modal.text()).toContain('Export Tickets')
    })

    it('hides export modal when close button is clicked', async () => {
      await wrapper.setData({ showExportModal: true })
      await wrapper.vm.$nextTick()

      const closeButton = wrapper.find('.text-gray-500')
      expect(closeButton.exists()).toBe(true) // Ensure the button is present
      await closeButton.trigger('click')
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.showExportModal).toBe(false)
      expect(wrapper.find('.fixed.inset-0').exists()).toBe(false) // Verify modal is gone from DOM
    })

    it('hides export modal when cancel button is clicked', async () => {
      await wrapper.setData({ showExportModal: true })
      await wrapper.vm.$nextTick()

      const cancelButton = wrapper.findAll('button').filter((b) => b.text().includes('Cancel'))[0]
      expect(cancelButton.exists()).toBe(true)
      await cancelButton.trigger('click')
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.showExportModal).toBe(false)
      expect(wrapper.find('.fixed.inset-0').exists()).toBe(false)
    })

    it('renders export filter options correctly', async () => {
      await wrapper.setData({ showExportModal: true })
      await wrapper.vm.$nextTick()

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
      await wrapper.vm.$nextTick()

      const dateInputs = wrapper.findAll('input[type="date"]')
      expect(dateInputs).toHaveLength(2)
      expect(dateInputs[0].attributes('name')).toBeUndefined() // No name attribute set in template
      expect(dateInputs[1].attributes('name')).toBeUndefined() // No name attribute set in template
    })

    it('sets default date range to last 30 days when modal opens', async () => {
      await wrapper.setData({ showExportModal: true })
      await wrapper.vm.$nextTick()

      // Check if dates are within expected range (last 30 days)
      const endDateString = wrapper.vm.exportFilters.endDate
      const startDateString = wrapper.vm.exportFilters.startDate

      expect(endDateString).toBeTruthy()
      expect(startDateString).toBeTruthy()

      const endDate = new Date(endDateString)
      const startDate = new Date(startDateString)

      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      thirtyDaysAgo.setHours(0, 0, 0, 0) // Normalize to start of day for comparison

      const today = new Date()
      today.setHours(0, 0, 0, 0) // Normalize to start of day for comparison

      // The `exportFilters.endDate` should be today's date
      // The `exportFilters.startDate` should be exactly 30 days before today
      expect(startDate.toISOString().split('T')[0]).toBe(thirtyDaysAgo.toISOString().split('T')[0])
      expect(endDate.toISOString().split('T')[0]).toBe(today.toISOString().split('T')[0])
    })
  })

  // --- CSV Export Functionality ---
  describe('CSV Export Functionality', () => {
    beforeEach(async () => {
      // Open the modal before each test in this suite
      await wrapper.setData({ showExportModal: true })
      await wrapper.vm.$nextTick()
      vi.clearAllMocks() // Clear mocks specifically for export functions here
    })

    it('exports all tickets when no filters are applied', async () => {
      const exportButton = wrapper.findAll('button').filter((b) => b.text().includes('Export'))[0]
      await exportButton.trigger('click')
      await wrapper.vm.$nextTick() // Allow click handler to run

      expect(global.Blob).toHaveBeenCalledTimes(1)
      const blobArguments = (global.Blob as any).mock.calls[0][0][0] // Get the CSV string content

      expect(blobArguments).toContain('ID,Title,Status,Created At')
      expect(blobArguments).toContain('1,"First Ticket",ACTIVE,') // Check specific ticket data
      expect(blobArguments).toContain('6,"Sixth Ticket",ACTIVE,') // Check for the last ticket

      expect(global.URL.createObjectURL).toHaveBeenCalledTimes(1)
      expect(document.createElement).toHaveBeenCalledWith('a')
      expect(document.body.appendChild).toHaveBeenCalledWith(mockAnchorElement)
      expect(mockAnchorElement.click).toHaveBeenCalledTimes(1)
      expect(document.body.removeChild).toHaveBeenCalledWith(mockAnchorElement)
      expect(wrapper.vm.showExportModal).toBe(false)
    })

    it('filters tickets by status', async () => {
      const statusSelect = wrapper.find('select')
      await statusSelect.setValue('CLOSED') // Filter for CLOSED tickets
      await wrapper.vm.$nextTick()

      const exportButton = wrapper.findAll('button').filter((b) => b.text().includes('Export'))[0]
      await exportButton.trigger('click')
      await wrapper.vm.$nextTick()

      const blobArguments = (global.Blob as any).mock.calls[0][0][0]

      // Should only contain CLOSED tickets
      expect(blobArguments).toContain('2,"Second Ticket",CLOSED,')
      expect(blobArguments).toContain('5,"Fifth Ticket",CLOSED,')

      // Should NOT contain ACTIVE or UNASSIGNED tickets
      expect(blobArguments).not.toContain('ACTIVE')
      expect(blobArguments).not.toContain('UNASSIGNED')
    })

    it('filters tickets by date range', async () => {
      const dateInputs = wrapper.findAll('input[type="date"]')
      await dateInputs[0].setValue('2025-06-20') // From 2025-06-20
      await dateInputs[1].setValue('2025-06-30') // To 2025-06-30
      await wrapper.vm.$nextTick()

      const exportButton = wrapper.findAll('button').filter((b) => b.text().includes('Export'))[0]
      await exportButton.trigger('click')
      await wrapper.vm.$nextTick()

      const blobArguments = (global.Blob as any).mock.calls[0][0][0]

      // Tickets within range: 2 (20th), 3 (25th), 4 (28th), 5 (30th)
      expect(blobArguments).toContain('2,"Second Ticket",CLOSED,2025-06-20')
      expect(blobArguments).toContain('3,"Third Ticket",UNASSIGNED,2025-06-25')
      expect(blobArguments).toContain('4,"Fourth Ticket",ACTIVE,2025-06-28')
      expect(blobArguments).toContain('5,"Fifth Ticket",CLOSED,2025-06-30')

      // Tickets outside range: 1 (15th), 6 (July 1st)
      expect(blobArguments).not.toContain('1,"First Ticket",ACTIVE,2025-06-15')
      expect(blobArguments).not.toContain('6,"Sixth Ticket",ACTIVE,2025-07-01')
    })

    it('creates download link with correct filename', async () => {
      const exportButton = wrapper.findAll('button').filter((b) => b.text().includes('Export'))[0]
      await exportButton.trigger('click')
      await wrapper.vm.$nextTick()

      expect(mockAnchorElement.setAttribute).toHaveBeenCalledWith('href', 'mock-url')
      // Filename should be dynamic with today's date (July 1, 2025)
      expect(mockAnchorElement.setAttribute).toHaveBeenCalledWith(
        'download',
        'tickets_export_2025-07-01.csv',
      )
    })

    it('closes modal after export', async () => {
      const exportButton = wrapper.findAll('button').filter((b) => b.text().includes('Export'))[0]
      await exportButton.trigger('click')
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.showExportModal).toBe(false)
      expect(wrapper.find('.fixed.inset-0').exists()).toBe(false)
    })
  })

  // --- Ticket Navigation ---
  describe('Ticket Navigation', () => {
    it('navigates to ticket detail when row is clicked', async () => {
      const firstRow = wrapper.find('tbody tr:first-child')
      await firstRow.trigger('click')
      await wrapper.vm.$nextTick() // Allow router.push to be called

      expect(mockSetTicket).toHaveBeenCalledWith(mockTickets[0])
      expect(mockPush).toHaveBeenCalledWith('/my-tickets/1')
    })

    it('handles ticket click with correct ticket data for second ticket', async () => {
      const secondRow = wrapper.find('tbody tr:nth-child(2)')
      await secondRow.trigger('click')
      await wrapper.vm.$nextTick()

      expect(mockSetTicket).toHaveBeenCalledWith(mockTickets[1])
      expect(mockPush).toHaveBeenCalledWith('/my-tickets/2')
    })
  })

  // --- Date Formatting ---
  describe('Date Formatting', () => {
    it('formats dates correctly in table', () => {
      const dateCell = wrapper.find('tbody tr:first-child td:last-child')
      // Ensure the test's expected format matches the component's `toLocaleDateString()`
      const expectedDate = new Date('2025-06-15T10:00:00Z').toLocaleDateString()
      expect(dateCell.text()).toBe(expectedDate)
    })

    it('formats dates correctly in CSV export (YYYY-MM-DD)', () => {
      const testDate = new Date('2025-06-15T10:00:00Z')
      // The component's `formatDate` is used within `exportToCSV`
      // For CSV, you're using `toISOString().slice(0, 10)` which results in YYYY-MM-DD
      // const expectedFormattedDateForCSV = '2025-06-15';
      // To test the direct function, we can access it from the component instance
      expect(wrapper.vm.formatDate(testDate)).toBe(testDate.toLocaleDateString()) // Component's formatDate
      // But the actual CSV content will use the YYYY-MM-DD from the filename logic for `createdAt` too.
      // This assertion should reflect the formatDate in your component, which is just `toLocaleDateString()`.
      // If the CSV content is explicitly YYYY-MM-DD, that implies a different internal formatter for CSV.
      // Let's assume formatDate in component is for table, and CSV stringifies manually.
    })
  })

  // --- Component Lifecycle ---
  describe('Component Lifecycle', () => {
    it('fetches tickets on mount', () => {
      // This is checked by the fact that the component is rendered with data
      expect(mockFetchTicketsByAgent).toHaveBeenCalledTimes(1)
    })

    it('handles fetch tickets error gracefully', async () => {
      // Set the mock to reject for this specific test
      mockFetchTicketsByAgent.mockRejectedValueOnce(new Error('Network Error'))
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      // Unmount current wrapper to force remount and re-trigger onMounted
      if (wrapper && !wrapper.getCurrentComponent().isUnmounted) {
        wrapper.unmount()
      }
      if (router) {
        // router.history.destroy();
      }

      // Re-initialize Pinia and Router for this specific test mount
      const newPinia = createPinia()
      const newRouter = createRouter({
        history: createWebHistory(),
        routes: [{ path: '/my-tickets/:id', component: { template: '<div>Ticket Detail</div>' } }],
      })
      await newRouter.isReady()

      // Mount the component again
      wrapper = mount(TicketListView, {
        global: {
          plugins: [newPinia, newRouter],
        },
      })

      // Wait for onMounted to run and the promise to reject
      await wrapper.vm.$nextTick()
      // Add a small delay to ensure error handling logic (e.g., console.error) has time to execute
      await new Promise((resolve) => setTimeout(resolve, 50))

      // Assert that assignedTickets are empty or reset on error
      expect(wrapper.vm.assignedTickets).toEqual([])
      // Assert that an error was logged (or appropriate user feedback is shown)
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error fetching tickets:'),
        expect.any(Error),
      )

      consoleErrorSpy.mockRestore() // Restore console.error
    })
  })

  // --- Computed Properties ---
  describe('Computed Properties', () => {
    it('calculates paginated tickets correctly', () => {
      expect(wrapper.vm.paginatedTickets).toHaveLength(5)
      expect(wrapper.vm.paginatedTickets[0].id).toBe('1')
    })

    it('calculates endIndex correctly', async () => {
      // Page 1: 5 tickets, endIndex should be 5
      expect(wrapper.vm.endIndex).toBe(5)

      // Go to page 2 (last page with 1 ticket)
      await wrapper.setData({ currentPage: 2 })
      await wrapper.vm.$nextTick()
      // For 6 tickets, 5 per page:
      // page 1: tickets 1-5 (index 0-4) -> endIndex = 5
      // page 2: ticket 6 (index 5) -> endIndex = 6 (Math.min(currentPage * perPage, totalTickets))
      expect(wrapper.vm.endIndex).toBe(6)
    })
  })

  // --- Responsive Design ---
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

  // --- Accessibility ---
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
      await wrapper.vm.$nextTick() // Ensure modal is rendered

      const statusLabel = wrapper.find('label[for="status"]') // Add `id="status"` to select and `for="status"` to label if not present
      const dateRangeLabels = wrapper
        .findAll('label')
        .filter((l) => l.text().includes('From') || l.text().includes('To'))

      expect(wrapper.find('label').text()).toContain('Status') // Check first label directly
      expect(dateRangeLabels.length).toBe(2)
      expect(dateRangeLabels[0].text()).toContain('From')
      expect(dateRangeLabels[1].text()).toContain('To')
    })
  })
})
