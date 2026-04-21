jest.mock('expo-sqlite', () => ({ openDatabaseSync: jest.fn(() => mockDb) }))

const mockDb = {
  getAllSync: jest.fn(),
  execSync: jest.fn(),
  getFirstSync: jest.fn(),
  runSync: jest.fn(),
}

jest.mock('../lib/db/migrations', () => ({
  getDatabase: jest.fn(() => mockDb),
  initDatabase: jest.fn(),
}))

import { createVehicle } from '../lib/db/vehicles'

beforeEach(() => jest.clearAllMocks())

describe('createVehicle', () => {
  it('crée un véhicule avec les champs obligatoires', async () => {
    const fakeVehicle = {
      id: 'some-uuid', type: 'car', current_mileage: 45000,
      name: 'car — Véhicule', created_at: '2026-04-21T00:00:00.000Z',
    }
    mockDb.runSync.mockReturnValue(undefined)
    mockDb.getFirstSync.mockReturnValue(fakeVehicle)

    const result = await createVehicle({ type: 'car', current_mileage: 45000 })

    expect(result.error).toBeNull()
    expect(result.data?.type).toBe('car')
    expect(mockDb.runSync).toHaveBeenCalledTimes(1)
    // Vérifie que l'INSERT contient les bonnes valeurs
    const insertCall = mockDb.runSync.mock.calls[0]
    expect(insertCall[1][3]).toBe('car')       // type
    expect(insertCall[1][9]).toBe(45000)        // current_mileage
  })

  it('crée un véhicule avec tous les champs optionnels', async () => {
    const fakeVehicle = {
      id: 'uuid-full', type: 'motorcycle', brand: 'Honda', model: 'CB500',
      year: 2021, fuel_type: 'petrol', license_plate: 'AB-123-CD',
      current_mileage: 12000, name: 'Ma Honda',
    }
    mockDb.runSync.mockReturnValue(undefined)
    mockDb.getFirstSync.mockReturnValue(fakeVehicle)

    const result = await createVehicle({
      type: 'motorcycle', current_mileage: 12000,
      name: 'Ma Honda', brand: 'Honda', model: 'CB500',
      year: 2021, fuel_type: 'petrol', license_plate: 'AB-123-CD',
    })

    expect(result.error).toBeNull()
    expect(result.data?.brand).toBe('Honda')
    const insertCall = mockDb.runSync.mock.calls[0]
    expect(insertCall[1][2]).toBe('Ma Honda')   // name
    expect(insertCall[1][4]).toBe('Honda')       // brand
    expect(insertCall[1][7]).toBe('petrol')      // fuel_type
  })

  it('kilométrage négatif → erreur de validation sans appel DB', async () => {
    const result = await createVehicle({ type: 'car', current_mileage: -1 })

    expect(result.data).toBeNull()
    expect(result.error).toContain('négatif')
    expect(mockDb.runSync).not.toHaveBeenCalled()
  })

  it('erreur DB → retourne Result avec error', async () => {
    mockDb.runSync.mockImplementation(() => { throw new Error('DB error') })

    const result = await createVehicle({ type: 'car', current_mileage: 5000 })

    expect(result.data).toBeNull()
    expect(result.error).toBe('DB error')
  })
})
