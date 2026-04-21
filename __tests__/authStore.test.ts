import * as SecureStore from 'expo-secure-store'
import { useAuthStore } from '../lib/store/authStore'

// Mock supabase pour éviter l'init avec des credentials vides
jest.mock('../lib/sync/supabase', () => ({
  supabase: { auth: { signInWithPassword: jest.fn(), signUp: jest.fn(), signOut: jest.fn() } },
}))

// Mock expo-secure-store
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}))

const mockSecureStore = SecureStore as jest.Mocked<typeof SecureStore>

// Réinitialiser le store et les mocks entre chaque test
beforeEach(() => {
  jest.clearAllMocks()
  useAuthStore.setState({ mode: null, userId: null, isLoading: true })
})

describe('useAuthStore — loadAuthState', () => {
  it('mode === null quand aucune clé en SecureStore', async () => {
    mockSecureStore.getItemAsync.mockResolvedValue(null)
    await useAuthStore.getState().loadAuthState()
    expect(useAuthStore.getState().mode).toBeNull()
    expect(useAuthStore.getState().isLoading).toBe(false)
  })

  it("mode === 'local' quand auth_mode = 'local' en SecureStore", async () => {
    mockSecureStore.getItemAsync.mockImplementation((key: string) => {
      if (key === 'auth_mode') return Promise.resolve('local')
      return Promise.resolve(null)
    })
    await useAuthStore.getState().loadAuthState()
    expect(useAuthStore.getState().mode).toBe('local')
    expect(useAuthStore.getState().isLoading).toBe(false)
  })
})

describe('useAuthStore — continueLocally', () => {
  it("persiste 'local' dans SecureStore et met à jour mode", async () => {
    mockSecureStore.setItemAsync.mockResolvedValue(undefined)
    await useAuthStore.getState().continueLocally()
    expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith('auth_mode', 'local')
    expect(useAuthStore.getState().mode).toBe('local')
    expect(useAuthStore.getState().userId).toBeNull()
  })
})

describe('useAuthStore — logout', () => {
  it('supprime les clés SecureStore et remet mode à null', async () => {
    mockSecureStore.deleteItemAsync.mockResolvedValue(undefined)
    // Simuler un état local
    useAuthStore.setState({ mode: 'local', userId: null })
    await useAuthStore.getState().logout()
    expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_mode')
    expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith('user_id')
    expect(useAuthStore.getState().mode).toBeNull()
  })
})
