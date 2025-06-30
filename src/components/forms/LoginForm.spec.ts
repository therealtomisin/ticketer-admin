import { mount, VueWrapper } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import Login from '@/components/forms/LoginForm.vue' // Adjust path as needed

// Mock the stores and composables
const mockPush = vi.fn()
const mockLogin = vi.fn()
const mockToastSuccess = vi.fn(() => ({ dismiss: vi.fn() }))
const mockToastError = vi.fn()

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

// Mock auth store
vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({
    login: mockLogin,
  }),
}))

// Mock toast notifications
vi.mock('vue-toast-notification', () => ({
  useToast: () => ({
    success: mockToastSuccess,
    error: mockToastError,
  }),
}))

describe('Login Component', () => {
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
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/signup', component: { template: '<div>Signup</div>' } },
      ],
    })

    wrapper = mount(Login, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': {
            template: '<a><slot /></a>',
            props: ['to'],
          },
        },
      },
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  describe('Component Rendering', () => {
    it('renders the login form correctly', () => {
      expect(wrapper.find('form').exists()).toBe(true)
      expect(wrapper.find('input[placeholder="Email"]').exists()).toBe(true)
      expect(wrapper.find('input[type="password"]').exists()).toBe(true)
      expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
    })

    it('renders the signup link', () => {
      const signupText = wrapper.text()
      expect(signupText).toContain("Don't have an account?")
      expect(signupText).toContain('Sign up')
    })

    it('has correct button text', () => {
      const submitButton = wrapper.find('button[type="submit"]')
      expect(submitButton.text()).toBe('Login')
    })
  })

  describe('Form Input Handling', () => {
    it('updates email when typing in email input', async () => {
      const emailInput = wrapper.find('input[placeholder="Email"]')
      await emailInput.setValue('test@example.com')

      expect((emailInput.element as HTMLInputElement).value).toBe('test@example.com')
    })

    it('updates password when typing in password input', async () => {
      const passwordInput = wrapper.find('input[type="password"]')
      await passwordInput.setValue('password123')

      expect((passwordInput.element as HTMLInputElement).value).toBe('password123')
    })

    it('maintains input values after typing', async () => {
      const emailInput = wrapper.find('input[placeholder="Email"]')
      const passwordInput = wrapper.find('input[type="password"]')

      await emailInput.setValue('user@test.com')
      await passwordInput.setValue('mypassword')

      expect((emailInput.element as HTMLInputElement).value).toBe('user@test.com')
      expect((passwordInput.element as HTMLInputElement).value).toBe('mypassword')
    })
  })

  describe('Form Submission', () => {
    beforeEach(async () => {
      const emailInput = wrapper.find('input[placeholder="Email"]')
      const passwordInput = wrapper.find('input[type="password"]')

      await emailInput.setValue('test@example.com')
      await passwordInput.setValue('password123')
    })

    it('calls auth.login with correct credentials on form submit', async () => {
      mockLogin.mockResolvedValue({ success: true })

      await wrapper.find('form').trigger('submit.prevent')

      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123')
    })

    it('redirects to home page on successful login', async () => {
      mockLogin.mockResolvedValue({ success: true })

      await wrapper.find('form').trigger('submit.prevent')
      await wrapper.vm.$nextTick()

      expect(mockToastSuccess).toHaveBeenCalledWith('Login Succesfully!')
      expect(mockPush).toHaveBeenCalledWith('/')
    })

    it('shows success toast on successful login', async () => {
      mockLogin.mockResolvedValue({ success: true })

      await wrapper.find('form').trigger('submit.prevent')
      await wrapper.vm.$nextTick()

      expect(mockToastSuccess).toHaveBeenCalledWith('Login Succesfully!')
    })

    it('dismisses success toast after showing', async () => {
      const mockDismiss = vi.fn()
      mockToastSuccess.mockReturnValue({ dismiss: mockDismiss })
      mockLogin.mockResolvedValue({ success: true })

      await wrapper.find('form').trigger('submit.prevent')
      await wrapper.vm.$nextTick()

      expect(mockDismiss).toHaveBeenCalled()
    })
  })

  describe('Login Failure Handling', () => {
    beforeEach(async () => {
      const emailInput = wrapper.find('input[placeholder="Email"]')
      const passwordInput = wrapper.find('input[type="password"]')

      await emailInput.setValue('test@example.com')
      await passwordInput.setValue('wrongpassword')
    })

    it('shows error toast when login fails with success: false', async () => {
      mockLogin.mockResolvedValue({ success: false })

      await wrapper.find('form').trigger('submit.prevent')
      await wrapper.vm.$nextTick()

      expect(mockToastError).toHaveBeenCalledWith('Login failed!')
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('shows error toast when login throws an exception', async () => {
      mockLogin.mockRejectedValue(new Error('Network error'))

      await wrapper.find('form').trigger('submit.prevent')
      await wrapper.vm.$nextTick()

      expect(mockToastError).toHaveBeenCalledWith('Login failed!')
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('does not redirect on failed login', async () => {
      mockLogin.mockResolvedValue({ success: false })

      await wrapper.find('form').trigger('submit.prevent')
      await wrapper.vm.$nextTick()

      expect(mockPush).not.toHaveBeenCalled()
    })
  })

  describe('Form Validation', () => {
    it('submits form even with empty fields (component relies on backend validation)', async () => {
      mockLogin.mockResolvedValue({ success: false })

      await wrapper.find('form').trigger('submit.prevent')

      expect(mockLogin).toHaveBeenCalledWith('', '')
    })

    it('can handle submission with only email filled', async () => {
      const emailInput = wrapper.find('input[placeholder="Email"]')
      await emailInput.setValue('test@example.com')

      mockLogin.mockResolvedValue({ success: false })

      await wrapper.find('form').trigger('submit.prevent')

      expect(mockLogin).toHaveBeenCalledWith('test@example.com', '')
    })
  })

  describe('Accessibility', () => {
    it('has proper input types', () => {
      const emailInput = wrapper.find('input[placeholder="Email"]')
      const passwordInput = wrapper.find('input[placeholder="Password"]')

      expect(passwordInput.attributes('type')).toBe('password')
      expect(emailInput.attributes('type')).toBe(undefined) // Default text type
    })

    it('has proper form structure', () => {
      const form = wrapper.find('form')
      const submitButton = wrapper.find('button[type="submit"]')

      expect(form.exists()).toBe(true)
      expect(submitButton.exists()).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('handles multiple rapid form submissions', async () => {
      mockLogin.mockResolvedValue({ success: true })

      const emailInput = wrapper.find('input[placeholder="Email"]')
      const passwordInput = wrapper.find('input[type="password"]')

      await emailInput.setValue('test@example.com')
      await passwordInput.setValue('password123')

      // Submit form multiple times rapidly
      const form = wrapper.find('form')
      await form.trigger('submit.prevent')
      await form.trigger('submit.prevent')
      await form.trigger('submit.prevent')

      // Should call login for each submission
      expect(mockLogin).toHaveBeenCalledTimes(3)
    })

    it('handles special characters in email and password', async () => {
      mockLogin.mockResolvedValue({ success: true })

      const emailInput = wrapper.find('input[placeholder="Email"]')
      const passwordInput = wrapper.find('input[type="password"]')

      await emailInput.setValue('test+user@example-domain.com')
      await passwordInput.setValue('p@ssw0rd!#$%')

      await wrapper.find('form').trigger('submit.prevent')

      expect(mockLogin).toHaveBeenCalledWith('test+user@example-domain.com', 'p@ssw0rd!#$%')
    })
  })
})
