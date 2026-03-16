import { View, Text } from 'react-native'
import { useLocalSearchParams } from 'expo-router'

export default function VehicleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-semibold text-gray-800">Véhicule</Text>
      <Text className="text-gray-500 mt-2">ID : {id}</Text>
      <Text className="text-gray-400 mt-1">À venir — Story 1.5</Text>
    </View>
  )
}
