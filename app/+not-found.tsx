import { Link, Stack } from 'expo-router'
import { View, Text } from 'react-native'

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Page introuvable' }} />
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-lg font-semibold text-gray-800">Page introuvable</Text>
        <Link href="/" className="mt-4 text-blue-600">
          Retour à l'accueil
        </Link>
      </View>
    </>
  )
}
