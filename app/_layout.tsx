import '../global.css'

import { useEffect, useState } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { View, Text } from 'react-native'
import { initDatabase } from '../lib/db/migrations'

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false)
  const [dbError, setDbError] = useState<string | null>(null)

  useEffect(() => {
    initDatabase().then(({ data, error }) => {
      if (error) {
        setDbError(error)
      } else {
        setDbReady(true)
      }
    })
  }, [])

  if (dbError) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-red-500 text-lg">Erreur DB : {dbError}</Text>
      </View>
    )
  }

  if (!dbReady) {
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
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  )
}
