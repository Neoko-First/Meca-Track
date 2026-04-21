import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { useAuthStore } from '../../lib/store/authStore'

export default function RegisterScreen() {
  const router = useRouter()
  const { signUp } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    setError(null)
    if (!email.trim() || !password) {
      setError('Veuillez remplir tous les champs')
      return
    }
    setLoading(true)
    const result = await signUp(email.trim(), password)
    setLoading(false)
    if (result.error) {
      setError(result.error)
    }
    // La redirection est gérée par le auth gate dans _layout.tsx via le changement de mode
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View className="flex-1 justify-center px-6">
        <Text className="text-2xl font-bold text-gray-900 mb-8">Créer un compte</Text>

        <Text className="text-sm font-medium text-gray-700 mb-1">Email</Text>
        <TextInput
          className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-gray-900"
          placeholder="vous@exemple.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
          editable={!loading}
        />

        <Text className="text-sm font-medium text-gray-700 mb-1">Mot de passe</Text>
        <TextInput
          className="border border-gray-300 rounded-xl px-4 py-3 mb-6 text-gray-900"
          placeholder="Minimum 8 caractères"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!loading}
        />

        {error && (
          <Text className="text-red-500 text-sm mb-4">{error}</Text>
        )}

        <TouchableOpacity
          className="bg-blue-600 py-4 rounded-xl items-center mb-4"
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-semibold text-lg">Créer un compte</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(auth)/login')} disabled={loading}>
          <Text className="text-center text-blue-600">
            Déjà un compte ? Se connecter
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}
