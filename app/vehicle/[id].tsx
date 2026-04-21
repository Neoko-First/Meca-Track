import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState, useEffect } from 'react'
import { getVehicleById, updateVehicle, deleteVehicle } from '../../lib/db/vehicles'
import { MileageUpdateModal } from '../../components/vehicles/MileageUpdateModal'
import { VEHICLE_TYPES, FUEL_TYPES } from '../../constants/vehicleTypes'
import type { Vehicle } from '../../types'

const VEHICLE_TYPE_LABELS: Record<Vehicle['type'], string> = {
  car: 'Voiture', motorcycle: 'Moto', scooter: 'Scooter',
  van: 'Camionnette', campervan: 'Camping-car', truck: 'Camion',
  quad: 'Quad', other: 'Autre',
}

const FUEL_TYPE_LABELS: Record<NonNullable<Vehicle['fuel_type']>, string> = {
  petrol: 'Essence', diesel: 'Diesel', hybrid: 'Hybride',
  electric: 'Électrique', hydrogen: 'Hydrogène', lpg: 'GPL', other: 'Autre',
}

export default function VehicleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mileageModalVisible, setMileageModalVisible] = useState(false)

  // Champs édition
  const [name, setName] = useState('')
  const [type, setType] = useState<Vehicle['type']>('car')
  const [fuelType, setFuelType] = useState<Vehicle['fuel_type']>(null)
  const [mileage, setMileage] = useState('')
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState('')
  const [licensePlate, setLicensePlate] = useState('')

  useEffect(() => {
    loadVehicle()
  }, [id])

  const loadVehicle = async () => {
    const result = await getVehicleById(id)
    setLoading(false)
    if (result.error || !result.data) {
      setError(result.error ?? 'Véhicule introuvable')
      return
    }
    const v = result.data
    setVehicle(v)
    setName(v.name)
    setType(v.type)
    setFuelType(v.fuel_type)
    setMileage(String(v.current_mileage))
    setBrand(v.brand ?? '')
    setModel(v.model ?? '')
    setYear(v.year ? String(v.year) : '')
    setLicensePlate(v.license_plate ?? '')
  }

  const handleSave = async () => {
    setError(null)
    const mileageNum = parseInt(mileage, 10)
    if (!mileage || isNaN(mileageNum)) {
      setError('Le kilométrage doit être un nombre valide')
      return
    }
    setSaving(true)
    const result = await updateVehicle(id, {
      name: name.trim() || undefined,
      type,
      fuel_type: fuelType,
      current_mileage: mileageNum,
      brand: brand.trim() || undefined,
      model: model.trim() || undefined,
      year: year ? parseInt(year, 10) : undefined,
      license_plate: licensePlate.trim() || undefined,
    })
    setSaving(false)
    if (result.error) {
      setError(result.error)
      return
    }
    setVehicle(result.data)
  }

  const handleDelete = () => {
    Alert.alert(
      'Supprimer le véhicule',
      'Toutes les données associées (entretiens, pleins, alertes) seront supprimées. Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer', style: 'destructive',
          onPress: async () => {
            const result = await deleteVehicle(id)
            if (result.error) {
              setError(result.error)
              return
            }
            router.replace('/(tabs)')
          },
        },
      ]
    )
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    )
  }

  if (!vehicle) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-red-500">{error ?? 'Véhicule introuvable'}</Text>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView className="flex-1 px-6 pt-6" keyboardShouldPersistTaps="handled">
        <Text className="text-2xl font-bold text-gray-900 mb-6">{vehicle.name}</Text>

        {/* Type */}
        <Text className="text-sm font-medium text-gray-700 mb-2">Type</Text>
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

        {/* Kilométrage */}
        <Text className="text-sm font-medium text-gray-700 mb-1">Kilométrage actuel</Text>
        <TextInput
          className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-gray-900"
          keyboardType="numeric"
          value={mileage}
          onChangeText={setMileage}
          editable={!saving}
        />

        {/* Nom */}
        <Text className="text-sm font-medium text-gray-700 mb-1">Nom</Text>
        <TextInput
          className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-gray-900"
          value={name}
          onChangeText={setName}
          editable={!saving}
        />

        {/* Marque */}
        <Text className="text-sm font-medium text-gray-700 mb-1">Marque</Text>
        <TextInput
          className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-gray-900"
          value={brand}
          onChangeText={setBrand}
          editable={!saving}
        />

        {/* Modèle */}
        <Text className="text-sm font-medium text-gray-700 mb-1">Modèle</Text>
        <TextInput
          className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-gray-900"
          value={model}
          onChangeText={setModel}
          editable={!saving}
        />

        {/* Année */}
        <Text className="text-sm font-medium text-gray-700 mb-1">Année</Text>
        <TextInput
          className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-gray-900"
          keyboardType="numeric"
          value={year}
          onChangeText={setYear}
          editable={!saving}
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
          autoCapitalize="characters"
          value={licensePlate}
          onChangeText={setLicensePlate}
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
          className="border border-blue-400 py-4 rounded-xl items-center mb-4"
          onPress={() => setMileageModalVisible(true)}
          disabled={saving}
        >
          <Text className="text-blue-600 font-semibold">Mettre à jour le kilométrage</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-green-600 py-4 rounded-xl items-center mb-4"
          onPress={() => router.push(`/maintenance/new?vehicleId=${vehicle.id}&currentMileage=${vehicle.current_mileage}`)}
          disabled={saving}
        >
          <Text className="text-white font-semibold">Ajouter un entretien</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="border border-red-400 py-4 rounded-xl items-center mb-8"
          onPress={handleDelete}
          disabled={saving}
        >
          <Text className="text-red-500 font-semibold">Supprimer le véhicule</Text>
        </TouchableOpacity>
      </ScrollView>

      {vehicle && (
        <MileageUpdateModal
          vehicle={vehicle}
          visible={mileageModalVisible}
          onClose={() => setMileageModalVisible(false)}
          onSuccess={(newMileage) => {
            setVehicle((v) => v ? { ...v, current_mileage: newMileage } : v)
            setMileage(String(newMileage))
          }}
        />
      )}
    </KeyboardAvoidingView>
  )
}
