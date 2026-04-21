jest.mock('expo-sqlite', () => ({ openDatabaseSync: jest.fn(() => mockDb) }))

const mockDb = {
  getAllSync: jest.fn(),
  getFirstSync: jest.fn(),
  runSync: jest.fn(),
}

jest.mock('../lib/db/migrations', () => ({
  getDatabase: jest.fn(() => mockDb),
  initDatabase: jest.fn(),
}))

import { updateVehicle, deleteVehicle } from '../lib/db/vehicles'

const fakeVehicle = {
  id: 'v-1', name: 'Ma Clio', type: 'car' as const,
  current_mileage: 45000, brand: 'Renault',
  created_at: '2026-01-01T00:00:00.000Z', updated_at: '2026-01-01T00:00:00.000Z',
}

beforeEach(() => jest.clearAllMocks())

describe('updateVehicle', () => {
  it('met à jour les champs et retourne le véhicule mis à jour', async () => {
    const updated = { ...fakeVehicle, current_mileage: 50000, updated_at: '2026-04-21T00:00:00.000Z' }
    mockDb.getFirstSync.mockReturnValueOnce(fakeVehicle).mockReturnValueOnce(updated)
    mockDb.runSync.mockReturnValue(undefined)

    const result = await updateVehicle('v-1', { current_mileage: 50000 })

    expect(result.error).toBeNull()
    expect(result.data?.current_mileage).toBe(50000)
    expect(mockDb.runSync).toHaveBeenCalledTimes(1)
  })

  it('kilométrage négatif → erreur de validation', async () => {
    const result = await updateVehicle('v-1', { current_mileage: -100 })

    expect(result.data).toBeNull()
    expect(result.error).toContain('négatif')
    expect(mockDb.runSync).not.toHaveBeenCalled()
  })

  it('véhicule introuvable → erreur', async () => {
    mockDb.getFirstSync.mockReturnValue(null)

    const result = await updateVehicle('inexistant', { current_mileage: 1000 })

    expect(result.data).toBeNull()
    expect(result.error).toContain('introuvable')
  })
})

describe('deleteVehicle', () => {
  it('supprime le véhicule et toutes ses données associées', async () => {
    mockDb.runSync.mockReturnValue(undefined)

    const result = await deleteVehicle('v-1')

    expect(result.error).toBeNull()
    // 5 DELETE : maintenance_records, fuel_records, mileage_updates, calendar_alerts, vehicles
    expect(mockDb.runSync).toHaveBeenCalledTimes(5)
    // Vérifie que la suppression du véhicule est la dernière
    const lastCall = mockDb.runSync.mock.calls[4][0] as string
    expect(lastCall).toContain('DELETE FROM vehicles')
  })

  it('erreur DB → retourne Result avec error', async () => {
    mockDb.runSync.mockImplementationOnce(() => { throw new Error('Erreur suppression') })

    const result = await deleteVehicle('v-1')

    expect(result.data).toBeNull()
    expect(result.error).toBe('Erreur suppression')
  })
})
