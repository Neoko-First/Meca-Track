import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { createVehicle } from '../../lib/db/vehicles'
import { VEHICLE_TYPES, FUEL_TYPES } from '../../constants/vehicleTypes'
import type { Vehicle } from '../../types'

// Labels affichés en français
const VEHICLE_TYPE_LABELS: Record<Vehicle['type'], string> = {
  car: 'Voiture', motorcycle: 'Moto', scooter: 'Scooter',
  van: 'Camionnette', campervan: 'Camping-car', truck: 'Camion',
  quad: 'Quad', other: 'Autre',
}

const FUEL_TYPE_LABELS: Record<NonNullable<Vehicle['fuel_type']>, string> = {
  petrol: 'Essence', diesel: 'Diesel', hybrid: 'Hybride',
  electric: 'Électrique', hydrogen: 'Hydrogène', lpg: 'GPL', other: 'Autre',
}

export default function NewVehicleScreen() {
  const router = useRouter()
  const [type, setType] = useState<Vehicle['type']>('car')
  const [fuelType, setFuelType] = useState<Vehicle['fuel_type']>(null)
  const [mileage, setMileage] = useState('')
  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState('')
  const [licensePlate, setLicensePlate] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setError(null)
    const mileageNum = parseInt(mileage, 10)
    if (!mileage || isNaN(mileageNum)) {
      setError('Le kilométrage est obligatoire et doit être un nombre')
      return
    }
    if (mileageNum < 0) {
      setError('Le kilométrage ne peut pas être négatif')
      return
    }
    setLoading(true)
    const result = await createVehicle({
      type,
      current_mileage: mileageNum,
      name: name.trim() || undefined,
      brand: brand.trim() || undefined,
      model: model.trim() || undefined,
      year: year ? parseInt(year, 10) : undefined,
      fuel_type: fuelType ?? undefined,
      license_plate: licensePlate.trim() || undefined,
    })
    setLoading(false)
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
        <Text className="text-2xl font-bold text-gray-900 mb-6">Ajouter un véhicule</Text>

        {/* Type — obligatoire */}
        <Text className="text-sm font-medium text-gray-700 mb-2">Type <Text className="text-red-500">*</Text></Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          {VEHICLE_TYPES.map((t) => (
            <TouchableOpacity
              key={t}
              className={`mr-2 px-4 py-2 rounded-xl border ${type === t ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}
              onPress={() => setType(t)}
            >
              <Text className={type === t ? 'text-white font-medium' : 'text-gray-700'}>
                {VEHICLE_TYPE_LABELS[t]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Kilométrage — obligatoire */}
        <Text className="text-sm font-medium text-gray-700 mb-1">Kilométrage actuel <Text className="text-red-500">*</Text></Text>
        <TextInput
          className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-gray-900"
          placeholder="ex. 45000"
          keyboardType="numeric"
          value={mileage}
          onChangeText={setMileage}
          editable={!loading}
        />

        {/* Nom (optionnel) */}
        <Text className="text-sm font-medium text-gray-700 mb-1">Nom (optionnel)</Text>
        <TextInput
          className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-gray-900"
          placeholder="ex. Ma Clio"
          value={name}
          onChangeText={setName}
          editable={!loading}
        />

        {/* Marque */}
        <Text className="text-sm font-medium text-gray-700 mb-1">Marque</Text>
        <TextInput
          className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-gray-900"
          placeholder="ex. Renault"
          value={brand}
          onChangeText={setBrand}
          editable={!loading}
        />

        {/* Modèle */}
        <Text className="text-sm font-medium text-gray-700 mb-1">Modèle</Text>
        <TextInput
          className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-gray-900"
          placeholder="ex. Clio"
          value={model}
          onChangeText={setModel}
          editable={!loading}
        />

        {/* Année */}
        <Text className="text-sm font-medium text-gray-700 mb-1">Année</Text>
        <TextInput
          className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-gray-900"
          placeholder="ex. 2019"
          keyboardType="numeric"
          value={year}
          onChangeText={setYear}
          editable={!loading}
        />

        {/* Carburant */}
        <Text className="text-sm font-medium text-gray-700 mb-2">Carburant</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          {FUEL_TYPES.map((f) => (
            <TouchableOpacity
              key={f}
              className={`mr-2 px-4 py-2 rounded-xl border ${fuelType === f ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}
              onPress={() => setFuelType(fuelType === f ? null : f)}
            >
              <Text className={fuelType === f ? 'text-white font-medium' : 'text-gray-700'}>
                {FUEL_TYPE_LABELS[f]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Immatriculation */}
        <Text className="text-sm font-medium text-gray-700 mb-1">Immatriculation</Text>
        <TextInput
          className="border border-gray-300 rounded-xl px-4 py-3 mb-6 text-gray-900"
          placeholder="ex. AB-123-CD"
          autoCapitalize="characters"
          value={licensePlate}
          onChangeText={setLicensePlate}
          editable={!loading}
        />

        {error && (
          <Text className="text-red-500 text-sm mb-4">{error}</Text>
        )}

        <TouchableOpacity
          className="bg-blue-600 py-4 rounded-xl items-center mb-8"
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-semibold text-lg">Enregistrer</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
