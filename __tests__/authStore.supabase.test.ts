import * as SecureStore from 'expo-secure-store'
import { useAuthStore } from '../lib/store/authStore'

// Supabase mocké statiquement (jest.mock est hoisted avant les imports)
jest.mock('../lib/sync/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
    },
  },
}))

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}))

// Référence aux mocks après le hoisting
import { supabase } from '../lib/sync/supabase'
const mockSupabase = supabase as jest.Mocked<typeof supabase>
const mockSecureStore = SecureStore as jest.Mocked<typeof SecureStore>

beforeEach(() => {
  jest.clearAllMocks()
  useAuthStore.setState({ mode: null, userId: null, isLoading: false })
  mockSecureStore.setItemAsync.mockResolvedValue(undefined)
  mockSecureStore.deleteItemAsync.mockResolvedValue(undefined)
})

describe('authStore — signIn', () => {
  it('succès : mode authenticated + userId persisté', async () => {
    ;(mockSupabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: { user: { id: 'user-123' }, session: {} },
      error: null,
    })

    const result = await useAuthStore.getState().signIn('test@test.com', 'motdepasse')

    expect(result.error).toBeNull()
    expect(useAuthStore.getState().mode).toBe('authenticated')
    expect(useAuthStore.getState().userId).toBe('user-123')
    expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith('auth_mode', 'authenticated')
    expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith('user_id', 'user-123')
  })

  it('erreur Supabase → retourne Result avec error', async () => {
    ;(mockSupabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: { user: null, session: null },
      error: { message: 'Invalid login credentials' },
    })

    const result = await useAuthStore.getState().signIn('bad@test.com', 'mauvaismdp')

    expect(result.error).toBe('Invalid login credentials')
    expect(useAuthStore.getState().mode).toBeNull()
  })
})

describe('authStore — signUp', () => {
  it('succès : mode authenticated + userId persisté', async () => {
    ;(mockSupabase.auth.signUp as jest.Mock).mockResolvedValue({
      data: { user: { id: 'new-user-456' }, session: {} },
      error: null,
    })

    const result = await useAuthStore.getState().signUp('new@test.com', 'monpassword123')

    expect(result.error).toBeNull()
    expect(useAuthStore.getState().mode).toBe('authenticated')
    expect(useAuthStore.getState().userId).toBe('new-user-456')
  })

  it('mot de passe < 8 caractères → erreur de validation sans appel Supabase', async () => {
    const result = await useAuthStore.getState().signUp('test@test.com', 'court')

    expect(result.error).toContain('8 caractères')
    expect(mockSupabase.auth.signUp).not.toHaveBeenCalled()
    expect(useAuthStore.getState().mode).toBeNull()
  })
})
