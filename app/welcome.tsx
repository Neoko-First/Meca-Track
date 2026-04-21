import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { useAuthStore } from '../lib/store/authStore'

export default function WelcomeScreen() {
  const router = useRouter()
  const { continueLocally } = useAuthStore()
  const [loading, setLoading] = useState(false)

  const handleLocal = async () => {
    setLoading(true)
    await continueLocally()
    router.replace('/(tabs)')
  }

  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-3xl font-bold text-gray-900 mb-2">meca-track</Text>
      <Text className="text-gray-500 text-center mb-12">
        Suivez l'entretien de vos véhicules, sans prise de tête.
      </Text>

      <TouchableOpacity
        className="w-full bg-blue-600 py-4 rounded-xl mb-4 items-center"
        onPress={handleLocal}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-semibold text-lg">
            Continuer sans compte
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        className="w-full border border-gray-300 py-4 rounded-xl items-center"
        onPress={() => router.push('/(auth)/login')}
        disabled={loading}
      >
        <Text className="text-gray-700 font-semibold text-lg">
          Créer un compte
        </Text>
      </TouchableOpacity>
    </View>
  )
}
