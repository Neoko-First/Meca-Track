import { create } from 'zustand'
import * as SecureStore from 'expo-secure-store'
import { supabase } from '../sync/supabase'
import type { Result } from '../../types'

const AUTH_MODE_KEY = 'auth_mode'
const USER_ID_KEY = 'user_id'

interface AuthState {
  mode: 'local' | 'authenticated' | null
  userId: string | null
  isLoading: boolean
  loadAuthState: () => Promise<void>
  continueLocally: () => Promise<void>
  signIn: (email: string, password: string) => Promise<Result<void>>
  signUp: (email: string, password: string) => Promise<Result<void>>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  mode: null,
  userId: null,
  isLoading: true,

  loadAuthState: async () => {
    const mode = await SecureStore.getItemAsync(AUTH_MODE_KEY)
    const userId = await SecureStore.getItemAsync(USER_ID_KEY)
    set({
      mode: (mode as 'local' | 'authenticated') ?? null,
      userId: userId ?? null,
      isLoading: false,
    })
  },

  continueLocally: async () => {
    await SecureStore.setItemAsync(AUTH_MODE_KEY, 'local')
    set({ mode: 'local', userId: null })
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { data: null, error: error.message }
    const userId = data.user?.id ?? null
    await SecureStore.setItemAsync(AUTH_MODE_KEY, 'authenticated')
    if (userId) await SecureStore.setItemAsync(USER_ID_KEY, userId)
    set({ mode: 'authenticated', userId })
    return { data: undefined, error: null }
  },

  signUp: async (email: string, password: string) => {
    if (password.length < 8) {
      return { data: null, error: 'Le mot de passe doit contenir au moins 8 caractères' }
    }
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) return { data: null, error: error.message }
    const userId = data.user?.id ?? null
    await SecureStore.setItemAsync(AUTH_MODE_KEY, 'authenticated')
    if (userId) await SecureStore.setItemAsync(USER_ID_KEY, userId)
    set({ mode: 'authenticated', userId })
    return { data: undefined, error: null }
  },

  logout: async () => {
    const { mode } = get()
    if (mode === 'authenticated') {
      await supabase.auth.signOut()
    }
    await SecureStore.deleteItemAsync(AUTH_MODE_KEY)
    await SecureStore.deleteItemAsync(USER_ID_KEY)
    set({ mode: null, userId: null })
  },
}))
