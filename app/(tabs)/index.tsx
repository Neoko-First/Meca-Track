import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { getVehicles } from '../../lib/db/vehicles'
import type { Vehicle } from '../../types'

export default function HomeScreen() {
  const router = useRouter()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getVehicles().then(({ data }) => {
      if (data) setVehicles(data)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    )
  }

  if (vehicles.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-xl font-semibold text-gray-800 mb-2">
          Aucun véhicule
        </Text>
        <Text className="text-gray-500 text-center mb-8">
          Ajoutez votre premier véhicule pour commencer le suivi.
        </Text>
        <TouchableOpacity
          className="bg-blue-600 px-6 py-3 rounded-xl"
          onPress={() => router.push('/vehicle/new')}
        >
          <Text className="text-white font-semibold">
            Ajouter mon premier véhicule
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <FlatList
      data={vehicles}
      keyExtractor={(v) => v.id}
      className="bg-white"
      renderItem={({ item }) => (
        <TouchableOpacity
          className="p-4 border-b border-gray-100"
          onPress={() => router.push(`/vehicle/${item.id}`)}
        >
          <Text className="text-lg font-medium text-gray-900">{item.name}</Text>
          <Text className="text-gray-500 mt-1">{item.current_mileage} km</Text>
        </TouchableOpacity>
      )}
    />
  )
}
