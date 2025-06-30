import { mount, VueWrapper } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import SignupForm from '@/components/forms/SignUpform.vue' // Adjust path as needed

// Mock the stores and composables
const mockPush = vi.fn()
const mockSignup = vi.fn()

// Mock window.alert
const mockAlert = vi.fn()
Object.defineProperty(window, 'alert', {
  value: mockAlert,
  writable: true,
})

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
    signup: mockSignup,
  }),
}))

describe('SignupForm Component', () => {
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
      routes: [{ path: '/verify', component: { template: '<div>Verify</div>' } }],
    })

    wrapper = mount(SignupForm, {
      global: {
        plugins: [router],
      },
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  describe('Component Rendering', () => {
    it('renders all form inputs correctly', () => {
      expect(wrapper.find('form').exists()).toBe(true)
      expect(wrapper.find('input[placeholder="First Name"]').exists()).toBe(true)
      expect(wrapper.find('input[placeholder="Last Name"]').exists()).toBe(true)
      expect(wrapper.find('input[placeholder="Email"]').exists()).toBe(true)
      expect(wrapper.find('input[placeholder="Password"]').exists()).toBe(true)
      expect(wrapper.find('input[placeholder="Confirm Password"]').exists()).toBe(true)
      expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
    })

    it('has correct input types', () => {
      const passwordInput = wrapper.find('input[placeholder="Password"]')
      const confirmPasswordInput = wrapper.find('input[placeholder="Confirm Password"]')

      expect(passwordInput.attributes('type')).toBe('password')
      expect(confirmPasswordInput.attributes('type')).toBe('password')
    })

    it('has correct button text', () => {
      const submitButton = wrapper.find('button[type="submit"]')
      expect(submitButton.text()).toBe('Sign Up')
    })
  })

  describe('Form Input Handling', () => {
    it('updates firstName when typing in first name input', async () => {
      const firstNameInput = wrapper.find('input[placeholder="First Name"]')
      await firstNameInput.setValue('John')

      expect((firstNameInput.element as HTMLInputElement).value).toBe('John')
    })

    it('updates lastName when typing in last name input', async () => {
      const lastNameInput = wrapper.find('input[placeholder="Last Name"]')
      await lastNameInput.setValue('Doe')

      expect((lastNameInput.element as HTMLInputElement).value).toBe('Doe')
    })

    it('updates email when typing in email input', async () => {
      const emailInput = wrapper.find('input[placeholder="Email"]')
      await emailInput.setValue('john.doe@example.com')

      expect((emailInput.element as HTMLInputElement).value).toBe('john.doe@example.com')
    })

    it('updates password when typing in password input', async () => {
      const passwordInput = wrapper.find('input[placeholder="Password"]')
      await passwordInput.setValue('password123')

      expect((passwordInput.element as HTMLInputElement).value).toBe('password123')
    })

    it('updates confirmPassword when typing in confirm password input', async () => {
      const confirmPasswordInput = wrapper.find('input[placeholder="Confirm Password"]')
      await confirmPasswordInput.setValue('password123')

      expect((confirmPasswordInput.element as HTMLInputElement).value).toBe('password123')
    })

    it('maintains all input values after typing', async () => {
      await wrapper.find('input[placeholder="First Name"]').setValue('John')
      await wrapper.find('input[placeholder="Last Name"]').setValue('Doe')
      await wrapper.find('input[placeholder="Email"]').setValue('john@example.com')
      await wrapper.find('input[placeholder="Password"]').setValue('password123')
      await wrapper.find('input[placeholder="Confirm Password"]').setValue('password123')

      expect(
        (wrapper.find('input[placeholder="First Name"]').element as HTMLInputElement).value,
      ).toBe('John')
      expect(
        (wrapper.find('input[placeholder="Last Name"]').element as HTMLInputElement).value,
      ).toBe('Doe')
      expect((wrapper.find('input[placeholder="Email"]').element as HTMLInputElement).value).toBe(
        'john@example.com',
      )
      expect(
        (wrapper.find('input[placeholder="Password"]').element as HTMLInputElement).value,
      ).toBe('password123')
      expect(
        (wrapper.find('input[placeholder="Confirm Password"]').element as HTMLInputElement).value,
      ).toBe('password123')
    })
  })

  describe('Password Validation', () => {
    beforeEach(async () => {
      await wrapper.find('input[placeholder="First Name"]').setValue('John')
      await wrapper.find('input[placeholder="Last Name"]').setValue('Doe')
      await wrapper.find('input[placeholder="Email"]').setValue('john@example.com')
    })

    it('shows alert when passwords do not match', async () => {
      await wrapper.find('input[placeholder="Password"]').setValue('password123')
      await wrapper.find('input[placeholder="Confirm Password"]').setValue('different123')

      await wrapper.find('form').trigger('submit.prevent')

      expect(mockAlert).toHaveBeenCalledWith('Passwords do not match')
      expect(mockSignup).not.toHaveBeenCalled()
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('proceeds with signup when passwords match', async () => {
      mockSignup.mockResolvedValue({ success: true })

      await wrapper.find('input[placeholder="Password"]').setValue('password123')
      await wrapper.find('input[placeholder="Confirm Password"]').setValue('password123')

      await wrapper.find('form').trigger('submit.prevent')

      expect(mockAlert).not.toHaveBeenCalledWith('Passwords do not match')
      expect(mockSignup).toHaveBeenCalled()
    })

    it('handles empty passwords', async () => {
      await wrapper.find('form').trigger('submit.prevent')

      // Empty passwords should match each other, so no alert should be shown
      expect(mockAlert).not.toHaveBeenCalledWith('Passwords do not match')
      expect(mockSignup).toHaveBeenCalled()
    })
  })

  describe('Successful Signup Flow', () => {
    beforeEach(async () => {
      await wrapper.find('input[placeholder="First Name"]').setValue('John')
      await wrapper.find('input[placeholder="Last Name"]').setValue('Doe')
      await wrapper.find('input[placeholder="Email"]').setValue('john@example.com')
      await wrapper.find('input[placeholder="Password"]').setValue('password123')
      await wrapper.find('input[placeholder="Confirm Password"]').setValue('password123')
    })

    it('calls auth.signup with correct parameters', async () => {
      mockSignup.mockResolvedValue({ success: true })

      await wrapper.find('form').trigger('submit.prevent')

      expect(mockSignup).toHaveBeenCalledWith('John', 'Doe', 'john@example.com', 'password123')
    })

    it('redirects to verify page on successful signup', async () => {
      mockSignup.mockResolvedValue({ success: true })

      await wrapper.find('form').trigger('submit.prevent')
      await wrapper.vm.$nextTick()

      expect(mockPush).toHaveBeenCalledWith('/verify')
    })

    it('does not redirect when signup is unsuccessful', async () => {
      mockSignup.mockResolvedValue({ success: false })

      await wrapper.find('form').trigger('submit.prevent')
      await wrapper.vm.$nextTick()

      expect(mockPush).not.toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    beforeEach(async () => {
      await wrapper.find('input[placeholder="First Name"]').setValue('John')
      await wrapper.find('input[placeholder="Last Name"]').setValue('Doe')
      await wrapper.find('input[placeholder="Email"]').setValue('john@example.com')
      await wrapper.find('input[placeholder="Password"]').setValue('password123')
      await wrapper.find('input[placeholder="Confirm Password"]').setValue('password123')
    })

    it('shows alert with error message when signup throws Error', async () => {
      const errorMessage = 'Email already exists'
      mockSignup.mockRejectedValue(new Error(errorMessage))

      await wrapper.find('form').trigger('submit.prevent')
      await wrapper.vm.$nextTick()

      expect(mockAlert).toHaveBeenCalledWith('Signup failed: ' + errorMessage)
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('shows generic error message when signup throws non-Error', async () => {
      mockSignup.mockRejectedValue('Some string error')

      await wrapper.find('form').trigger('submit.prevent')
      await wrapper.vm.$nextTick()

      expect(mockAlert).toHaveBeenCalledWith('Signup failed: Unknown error')
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('handles network errors properly', async () => {
      mockSignup.mockRejectedValue(new Error('Network error'))

      await wrapper.find('form').trigger('submit.prevent')
      await wrapper.vm.$nextTick()

      expect(mockAlert).toHaveBeenCalledWith('Signup failed: Network error')
    })
  })

  describe('Form Validation Edge Cases', () => {
    it('allows submission with empty fields', async () => {
      mockSignup.mockResolvedValue({ success: true })

      await wrapper.find('form').trigger('submit.prevent')

      expect(mockSignup).toHaveBeenCalledWith('', '', '', '')
    })

    it('handles special characters in names', async () => {
      mockSignup.mockResolvedValue({ success: true })

      await wrapper.find('input[placeholder="First Name"]').setValue("John-Paul O'Connor")
      await wrapper.find('input[placeholder="Last Name"]').setValue('van der Berg')
      await wrapper.find('input[placeholder="Email"]').setValue('john@example.com')
      await wrapper.find('input[placeholder="Password"]').setValue('password123')
      await wrapper.find('input[placeholder="Confirm Password"]').setValue('password123')

      await wrapper.find('form').trigger('submit.prevent')

      expect(mockSignup).toHaveBeenCalledWith(
        "John-Paul O'Connor",
        'van der Berg',
        'john@example.com',
        'password123',
      )
    })

    it('handles special characters in email and password', async () => {
      mockSignup.mockResolvedValue({ success: true })

      await wrapper.find('input[placeholder="First Name"]').setValue('John')
      await wrapper.find('input[placeholder="Last Name"]').setValue('Doe')
      await wrapper.find('input[placeholder="Email"]').setValue('john+test@example-domain.com')
      await wrapper.find('input[placeholder="Password"]').setValue('p@ssw0rd!#$%')
      await wrapper.find('input[placeholder="Confirm Password"]').setValue('p@ssw0rd!#$%')

      await wrapper.find('form').trigger('submit.prevent')

      expect(mockSignup).toHaveBeenCalledWith(
        'John',
        'Doe',
        'john+test@example-domain.com',
        'p@ssw0rd!#$%',
      )
    })
  })

  describe('Multiple Submissions', () => {
    beforeEach(async () => {
      await wrapper.find('input[placeholder="First Name"]').setValue('John')
      await wrapper.find('input[placeholder="Last Name"]').setValue('Doe')
      await wrapper.find('input[placeholder="Email"]').setValue('john@example.com')
      await wrapper.find('input[placeholder="Password"]').setValue('password123')
      await wrapper.find('input[placeholder="Confirm Password"]').setValue('password123')
    })

    it('handles rapid form submissions', async () => {
      mockSignup.mockResolvedValue({ success: true })

      const form = wrapper.find('form')
      await form.trigger('submit.prevent')
      await form.trigger('submit.prevent')
      await form.trigger('submit.prevent')

      expect(mockSignup).toHaveBeenCalledTimes(3)
    })

    it('prevents signup call when passwords mismatch on subsequent submissions', async () => {
      // First submission with matching passwords
      await wrapper.find('form').trigger('submit.prevent')
      expect(mockSignup).toHaveBeenCalledTimes(1)

      // Change confirm password to mismatch
      await wrapper.find('input[placeholder="Confirm Password"]').setValue('different123')
      await wrapper.find('form').trigger('submit.prevent')

      // Should still be called only once due to password mismatch
      expect(mockSignup).toHaveBeenCalledTimes(1)
      expect(mockAlert).toHaveBeenCalledWith('Passwords do not match')
    })
  })

  describe('Accessibility', () => {
    it('has proper form structure', () => {
      const form = wrapper.find('form')
      const submitButton = wrapper.find('button[type="submit"]')

      expect(form.exists()).toBe(true)
      expect(submitButton.exists()).toBe(true)
    })

    it('has proper input placeholders for accessibility', () => {
      const inputs = wrapper.findAll('input')
      const placeholders = inputs.map((input) => input.attributes('placeholder'))

      expect(placeholders).toEqual([
        'First Name',
        'Last Name',
        'Email',
        'Password',
        'Confirm Password',
      ])
    })
  })
})
