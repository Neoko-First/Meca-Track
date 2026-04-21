import '../global.css'

import { useEffect, useState } from 'react'
import { Stack, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { View, Text } from 'react-native'
import { initDatabase } from '../lib/db/migrations'
import { useAuthStore } from '../lib/store/authStore'

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false)
  const [dbError, setDbError] = useState<string | null>(null)
  const { loadAuthState, mode, isLoading: authLoading } = useAuthStore()
  const router = useRouter()

  // Étape 1 : initialisation SQLite
  useEffect(() => {
    initDatabase().then(({ data, error }) => {
      if (error) {
        setDbError(error)
        return
      }
      setDbReady(true)
    })
  }, [])

  // Étape 2 : chargement de l'état auth depuis expo-secure-store
  useEffect(() => {
    if (dbReady) {
      loadAuthState()
    }
  }, [dbReady])

  // Étape 3 : redirection selon le mode
  useEffect(() => {
    if (!dbReady || authLoading) return
    if (mode === null) {
      router.replace('/welcome')
    } else {
      router.replace('/(tabs)')
    }
  }, [dbReady, authLoading, mode])

  if (dbError) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-red-500 text-lg">Erreur DB : {dbError}</Text>
      </View>
    )
  }

  if (!dbReady || authLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500">Initialisation…</Text>
      </View>
    )
  }

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  )
}
