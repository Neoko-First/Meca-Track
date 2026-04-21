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

// recordMileageUpdate mocké pour isoler la logique
jest.mock('../lib/db/mileage', () => ({
  recordMileageUpdate: jest.fn().mockResolvedValue({ data: {}, error: null }),
}))

import { createMaintenanceRecord, getMaintenanceRecords } from '../lib/db/maintenance'
import { recordMileageUpdate } from '../lib/db/mileage'

const fakeRecord = {
  id: 'mr-1',
  vehicle_id: 'v-1',
  type: 'oil_change',
  label: null,
  mileage_at_service: 46000,
  date: '2026-04-21T00:00:00.000Z',
  cost: null,
  notes: null,
  next_mileage: null,
  next_date: null,
  created_at: '2026-04-21T00:00:00.000Z',
  synced_at: null,
}

beforeEach(() => jest.clearAllMocks())

describe('createMaintenanceRecord', () => {
  it('crée un entretien et appelle recordMileageUpdate si kilométrage supérieur', async () => {
    mockDb.runSync.mockReturnValue(undefined)
    mockDb.getFirstSync.mockReturnValue(fakeRecord)

    const result = await createMaintenanceRecord({
      vehicleId: 'v-1',
      type: 'oil_change',
      mileage_at_service: 46000,
      date: '2026-04-21',
      currentVehicleMileage: 45000, // 46000 > 45000 → doit appeler recordMileageUpdate
    })

    expect(result.error).toBeNull()
    expect(result.data?.type).toBe('oil_change')
    expect(mockDb.runSync).toHaveBeenCalledTimes(1)
    expect(recordMileageUpdate).toHaveBeenCalledWith({
      vehicleId: 'v-1',
      mileage: 46000,
      source: 'maintenance',
    })
  })

  it('kilométrage entretien ≤ kilométrage véhicule → recordMileageUpdate NON appelé', async () => {
    mockDb.runSync.mockReturnValue(undefined)
    mockDb.getFirstSync.mockReturnValue({ ...fakeRecord, mileage_at_service: 44000 })

    const result = await createMaintenanceRecord({
      vehicleId: 'v-1',
      type: 'oil_change',
      mileage_at_service: 44000,
      date: '2026-04-21',
      currentVehicleMileage: 45000, // 44000 ≤ 45000 → pas de mise à jour
    })

    expect(result.error).toBeNull()
    expect(recordMileageUpdate).not.toHaveBeenCalled()
  })

  it('type other sans label → erreur de validation, pas d\'INSERT', async () => {
    const result = await createMaintenanceRecord({
      vehicleId: 'v-1',
      type: 'other',
      mileage_at_service: 45000,
      date: '2026-04-21',
      currentVehicleMileage: 45000,
      // label manquant intentionnellement
    })

    expect(result.data).toBeNull()
    expect(result.error).toContain('libellé')
    expect(mockDb.runSync).not.toHaveBeenCalled()
    expect(recordMileageUpdate).not.toHaveBeenCalled()
  })

  it('coût optionnel persisté correctement', async () => {
    mockDb.runSync.mockReturnValue(undefined)
    mockDb.getFirstSync.mockReturnValue({ ...fakeRecord, cost: 89.90 })

    const result = await createMaintenanceRecord({
      vehicleId: 'v-1',
      type: 'oil_change',
      mileage_at_service: 45000,
      date: '2026-04-21',
      cost: 89.90,
      currentVehicleMileage: 45000,
    })

    expect(result.error).toBeNull()
    // Vérifie que le coût est passé dans le runSync
    const insertValues = mockDb.runSync.mock.calls[0][1] as unknown[]
    const costIndex = insertValues.indexOf(89.90)
    expect(costIndex).toBeGreaterThan(-1)
  })

  it('erreur DB → retourne Result avec error', async () => {
    mockDb.runSync.mockImplementationOnce(() => { throw new Error('Erreur SQLite') })

    const result = await createMaintenanceRecord({
      vehicleId: 'v-1',
      type: 'oil_change',
      mileage_at_service: 45000,
      date: '2026-04-21',
      currentVehicleMileage: 40000,
    })

    expect(result.data).toBeNull()
    expect(result.error).toBe('Erreur SQLite')
  })
})

describe('getMaintenanceRecords', () => {
  it('retourne la liste triée date DESC', async () => {
    const records = [fakeRecord, { ...fakeRecord, id: 'mr-0', mileage_at_service: 40000 }]
    mockDb.getAllSync.mockReturnValue(records)

    const result = await getMaintenanceRecords('v-1')

    expect(result.error).toBeNull()
    expect(result.data).toHaveLength(2)
    expect(mockDb.getAllSync).toHaveBeenCalledWith(
      expect.stringContaining('ORDER BY date DESC'),
      ['v-1']
    )
  })
})
