// Mock expo-sqlite pour les tests unitaires
jest.mock('expo-sqlite', () => ({
  openDatabaseSync: jest.fn(() => mockDb),
}))

const mockDb = {
  getAllSync: jest.fn(),
  execSync: jest.fn(),
  getFirstSync: jest.fn(),
  runSync: jest.fn(),
}

// Mock migrations pour contrôler getDatabase()
jest.mock('../lib/db/migrations', () => ({
  getDatabase: jest.fn(() => mockDb),
  initDatabase: jest.fn(),
}))

import { getVehicles } from '../lib/db/vehicles'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('getVehicles', () => {
  it('retourne un tableau vide quand la table est vide', async () => {
    mockDb.getAllSync.mockReturnValue([])
    const result = await getVehicles()
    expect(result.error).toBeNull()
    expect(result.data).toEqual([])
  })

  it('retourne les véhicules triés par created_at DESC', async () => {
    const fakeVehicles = [
      { id: '1', name: 'Voiture A', current_mileage: 10000, created_at: '2026-01-01T00:00:00.000Z' },
      { id: '2', name: 'Moto B', current_mileage: 5000, created_at: '2025-06-01T00:00:00.000Z' },
    ]
    mockDb.getAllSync.mockReturnValue(fakeVehicles)
    const result = await getVehicles()
    expect(result.error).toBeNull()
    expect(result.data).toHaveLength(2)
    expect(result.data![0].name).toBe('Voiture A')
  })

  it('retourne une erreur si la DB lève une exception', async () => {
    mockDb.getAllSync.mockImplementation(() => {
      throw new Error('Erreur SQLite simulée')
    })
    const result = await getVehicles()
    expect(result.data).toBeNull()
    expect(result.error).toBe('Erreur SQLite simulée')
  })
})
