import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { createMaintenanceRecord } from '../../lib/db/maintenance'
import { MAINTENANCE_TYPES } from '../../constants/maintenanceTypes'
import type { MaintenanceRecord } from '../../types'

const MAINTENANCE_TYPE_LABELS: Record<MaintenanceRecord['type'], string> = {
  oil_change: 'Vidange',
  tire_change: 'Pneus',
  timing_belt: 'Courroie de distribution',
  brake_pads: 'Plaquettes de frein',
  brake_discs: 'Disques de frein',
  air_filter: 'Filtre à air',
  cabin_filter: 'Filtre habitacle',
  fuel_filter: 'Filtre à carburant',
  spark_plugs: 'Bougies',
  battery: 'Batterie',
  coolant: 'Liquide de refroidissement',
  brake_fluid: 'Liquide de frein',
  technical_inspection: 'Contrôle technique',
  general_revision: 'Révision générale',
  other: 'Autre',
}

export default function NewMaintenanceScreen() {
  const { vehicleId, currentMileage } = useLocalSearchParams<{
    vehicleId: string
    currentMileage: string
  }>()
  const router = useRouter()
  const currentMileageNum = parseInt(currentMileage, 10)

  const todayISO = new Date().toISOString().split('T')[0]

  const [type, setType] = useState<MaintenanceRecord['type']>('oil_change')
  const [label, setLabel] = useState('')
  const [mileage, setMileage] = useState(currentMileage ?? '')
  const [date, setDate] = useState(todayISO)
  const [cost, setCost] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    setError(null)

    const mileageNum = parseInt(mileage, 10)
    if (!mileage || isNaN(mileageNum) || mileageNum < 0) {
      setError('Le kilométrage doit être un nombre valide')
      return
    }

    setSaving(true)
    const result = await createMaintenanceRecord({
      vehicleId,
      type,
      mileage_at_service: mileageNum,
      date,
      label: label.trim() || undefined,
      cost: cost ? parseFloat(cost) : undefined,
      notes: notes.trim() || undefined,
      currentVehicleMileage: isNaN(currentMileageNum) ? 0 : currentMileageNum,
    })
    setSaving(false)

    if (result.error) {
      setError(result.error)
      return
    }

    router.back()
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView className="flex-1 px-6 pt-6" keyboardShouldPersistTaps="handled">
        <Text className="text-2xl font-bold text-gray-900 mb-6">Nouvel entretien</Text>

        {/* Sélecteur de type */}
        <Text className="text-sm font-medium text-gray-700 mb-2">Type d'entretien</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          {MAINTENANCE_TYPES.map((t) => (
            <TouchableOpacity
              key={t}
              className={`mr-2 px-4 py-2 rounded-xl border ${type === t ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}
              onPress={() => setType(t)}
            >
              <Text className={type === t ? 'text-white font-medium' : 'text-gray-700'}>
                {MAINTENANCE_TYPE_LABELS[t]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Champ label conditionnel (type 'other' uniquement) */}
        {type === 'other' && (
          <>
            <Text className="text-sm font-medium text-gray-700 mb-1">Libellé *</Text>
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-gray-900"
              placeholder="Décrivez l'entretien"
              value={label}
              onChangeText={setLabel}
              editable={!saving}
            />
          </>
        )}

        {/* Kilométrage */}
        <Text className="text-sm font-medium text-gray-700 mb-1">Kilométrage *</Text>
        <TextInput
          className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-gray-900"
          keyboardType="numeric"
          placeholder="Ex: 45000"
          value={mileage}
          onChangeText={setMileage}
          editable={!saving}
        />

        {/* Date */}
        <Text className="text-sm font-medium text-gray-700 mb-1">Date *</Text>
        <TextInput
          className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-gray-900"
          placeholder="AAAA-MM-JJ"
          value={date}
          onChangeText={setDate}
          editable={!saving}
        />

        {/* Coût (optionnel) */}
        <Text className="text-sm font-medium text-gray-700 mb-1">Coût (optionnel)</Text>
        <TextInput
          className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-gray-900"
          keyboardType="decimal-pad"
          placeholder="Ex: 89.90"
          value={cost}
          onChangeText={setCost}
          editable={!saving}
        />

        {/* Notes (optionnel) */}
        <Text className="text-sm font-medium text-gray-700 mb-1">Notes (optionnel)</Text>
        <TextInput
          className="border border-gray-300 rounded-xl px-4 py-3 mb-6 text-gray-900"
          placeholder="Observations, références pièces..."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
          editable={!saving}
        />

        {error && <Text className="text-red-500 text-sm mb-4">{error}</Text>}

        <TouchableOpacity
          className="bg-blue-600 py-4 rounded-xl items-center mb-4"
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-semibold text-lg">Enregistrer</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          className="border border-gray-300 py-4 rounded-xl items-center mb-8"
          onPress={() => router.back()}
          disabled={saving}
        >
          <Text className="text-gray-600 font-semibold">Annuler</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
