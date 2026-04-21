import {
  Modal, View, Text, TextInput, TouchableOpacity,
  ActivityIndicator, Alert
} from 'react-native'
import { useState } from 'react'
import { recordMileageUpdate } from '../../lib/db/mileage'
import type { Vehicle } from '../../types'

interface Props {
  vehicle: Vehicle
  visible: boolean
  onClose: () => void
  onSuccess: (newMileage: number) => void
}

export function MileageUpdateModal({ vehicle, visible, onClose, onSuccess }: Props) {
  const [mileage, setMileage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const reset = () => {
    setMileage('')
    setError(null)
    setLoading(false)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const performUpdate = async (newMileage: number) => {
    setLoading(true)
    const result = await recordMileageUpdate({
      vehicleId: vehicle.id,
      mileage: newMileage,
      source: 'manual',
    })
    setLoading(false)
    if (result.error) {
      setError(result.error)
      return
    }
    reset()
    onSuccess(newMileage)
    onClose()
  }

  const handleSave = async () => {
    setError(null)
    const newMileage = parseInt(mileage, 10)
    if (!mileage || isNaN(newMileage)) {
      setError('Veuillez saisir un kilométrage valide')
      return
    }
    if (newMileage < 0) {
      setError('Le kilométrage ne peut pas être négatif')
      return
    }

    // Avertissement si kilométrage inférieur au précédent
    if (newMileage < vehicle.current_mileage) {
      Alert.alert(
        'Kilométrage inférieur',
        `Le nouveau kilométrage (${newMileage} km) est inférieur au kilométrage actuel (${vehicle.current_mileage} km). Confirmer ?`,
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Confirmer', onPress: () => performUpdate(newMileage) },
        ]
      )
      return
    }

    await performUpdate(newMileage)
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View className="flex-1 justify-end bg-black/40">
        <View className="bg-white rounded-t-3xl px-6 pt-6 pb-10">
          <Text className="text-xl font-bold text-gray-900 mb-1">Mettre à jour le kilométrage</Text>
          <Text className="text-gray-500 mb-6">Actuel : {vehicle.current_mileage} km</Text>

          <TextInput
            className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-gray-900 text-lg"
            placeholder="Nouveau kilométrage"
            keyboardType="numeric"
            value={mileage}
            onChangeText={setMileage}
            autoFocus
            editable={!loading}
          />

          {error && <Text className="text-red-500 text-sm mb-4">{error}</Text>}

          <TouchableOpacity
            className="bg-blue-600 py-4 rounded-xl items-center mb-3"
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold text-lg">Enregistrer</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="py-3 items-center"
            onPress={handleClose}
            disabled={loading}
          >
            <Text className="text-gray-500">Annuler</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}
