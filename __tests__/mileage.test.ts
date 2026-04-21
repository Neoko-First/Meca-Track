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

import { recordMileageUpdate, getMileageHistory } from '../lib/db/mileage'

const fakeMileageUpdate = {
  id: 'mu-1', vehicle_id: 'v-1', mileage: 46000,
  date: '2026-04-21T10:00:00.000Z', source: 'manual' as const,
  created_at: '2026-04-21T10:00:00.000Z', synced_at: null,
}

beforeEach(() => jest.clearAllMocks())

describe('recordMileageUpdate', () => {
  it('enregistre une mise à jour kilométrique manuelle', async () => {
    mockDb.runSync.mockReturnValue(undefined)
    mockDb.getFirstSync.mockReturnValue(fakeMileageUpdate)

    const result = await recordMileageUpdate({
      vehicleId: 'v-1', mileage: 46000, source: 'manual',
    })

    expect(result.error).toBeNull()
    expect(result.data?.mileage).toBe(46000)
    expect(result.data?.source).toBe('manual')
    // 2 runSync : INSERT mileage_updates + UPDATE vehicles
    expect(mockDb.runSync).toHaveBeenCalledTimes(2)
    const insertCall = mockDb.runSync.mock.calls[0][0] as string
    expect(insertCall).toContain('INSERT INTO mileage_updates')
    const updateCall = mockDb.runSync.mock.calls[1][0] as string
    expect(updateCall).toContain('UPDATE vehicles SET current_mileage')
  })

  it('enregistre avec source fuel_fill', async () => {
    mockDb.runSync.mockReturnValue(undefined)
    mockDb.getFirstSync.mockReturnValue({ ...fakeMileageUpdate, source: 'fuel_fill' })

    const result = await recordMileageUpdate({
      vehicleId: 'v-1', mileage: 47000, source: 'fuel_fill',
    })

    expect(result.error).toBeNull()
    expect(result.data?.source).toBe('fuel_fill')
    const insertValues = mockDb.runSync.mock.calls[0][1] as unknown[]
    // source est le 5e paramètre (index 4)
    expect(insertValues[4]).toBe('fuel_fill')
  })

  it('erreur DB → retourne Result avec error', async () => {
    mockDb.runSync.mockImplementationOnce(() => { throw new Error('Erreur DB') })

    const result = await recordMileageUpdate({
      vehicleId: 'v-1', mileage: 46000, source: 'manual',
    })

    expect(result.data).toBeNull()
    expect(result.error).toBe('Erreur DB')
  })
})

describe('getMileageHistory', () => {
  it('retourne l\'historique trié par date DESC', async () => {
    const history = [fakeMileageUpdate, { ...fakeMileageUpdate, id: 'mu-0', mileage: 45000 }]
    mockDb.getAllSync.mockReturnValue(history)

    const result = await getMileageHistory('v-1')

    expect(result.error).toBeNull()
    expect(result.data).toHaveLength(2)
    expect(result.data![0].mileage).toBe(46000)
  })
})
