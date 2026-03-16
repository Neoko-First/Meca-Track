import { VEHICLE_TYPES, FUEL_TYPES } from '../constants/vehicleTypes'
import { MAINTENANCE_TYPES } from '../constants/maintenanceTypes'
import { CALENDAR_ALERT_TYPES } from '../constants/alertTypes'
import type {
  Result,
  Vehicle,
  MaintenanceRecord,
  FuelRecord,
  MileageUpdate,
  CalendarAlert,
  SyncQueueItem,
  UserSettings,
} from '../types'

describe('Constants — Enums', () => {
  it('VEHICLE_TYPES should contain at least 8 types including car and other', () => {
    expect(VEHICLE_TYPES).toContain('car')
    expect(VEHICLE_TYPES).toContain('motorcycle')
    expect(VEHICLE_TYPES).toContain('other')
    expect(VEHICLE_TYPES.length).toBeGreaterThanOrEqual(8)
  })

  it('FUEL_TYPES should contain petrol, diesel and electric', () => {
    expect(FUEL_TYPES).toContain('petrol')
    expect(FUEL_TYPES).toContain('diesel')
    expect(FUEL_TYPES).toContain('electric')
  })

  it('MAINTENANCE_TYPES should contain oil_change and general_revision', () => {
    expect(MAINTENANCE_TYPES).toContain('oil_change')
    expect(MAINTENANCE_TYPES).toContain('general_revision')
    expect(MAINTENANCE_TYPES).toContain('other')
  })

  it('CALENDAR_ALERT_TYPES should contain technical_inspection and insurance', () => {
    expect(CALENDAR_ALERT_TYPES).toContain('technical_inspection')
    expect(CALENDAR_ALERT_TYPES).toContain('insurance')
    expect(CALENDAR_ALERT_TYPES).toContain('crit_air')
  })
})

describe('Result<T> type — runtime behavior', () => {
  it('should accept a success result', () => {
    const success: Result<number> = { data: 42, error: null }
    expect(success.data).toBe(42)
    expect(success.error).toBeNull()
  })

  it('should accept an error result', () => {
    const failure: Result<number> = { data: null, error: 'Quelque chose a mal tourné' }
    expect(failure.data).toBeNull()
    expect(failure.error).toBe('Quelque chose a mal tourné')
  })

  it('should work as a discriminated union', () => {
    const result: Result<string> = { data: 'ok', error: null }
    if (result.error) {
      // TypeScript narrowing
      expect(result.error).toBeTruthy()
    } else {
      expect(result.data).toBe('ok')
    }
  })
})

describe('Type shapes — compile-time validation via runtime objects', () => {
  it('Vehicle type shape is valid', () => {
    const vehicle: Vehicle = {
      id: 'uuid-1',
      user_id: null,
      name: 'Ma Clio',
      type: 'car',
      brand: 'Renault',
      model: 'Clio',
      year: 2019,
      fuel_type: 'petrol',
      license_plate: 'AB-123-CD',
      current_mileage: 45000,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      synced_at: null,
    }
    expect(vehicle.type).toBe('car')
    expect(vehicle.current_mileage).toBe(45000)
  })

  it('UserSettings default values are valid', () => {
    const settings: UserSettings = {
      id: 'default',
      notification_mode: 'intelligent',
      home_view: 'global',
      selected_vehicle_id: null,
      km_rhythm_data: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    expect(settings.id).toBe('default')
    expect(settings.notification_mode).toBe('intelligent')
    expect(settings.home_view).toBe('global')
  })

  it('MileageUpdate source values are constrained', () => {
    const update: MileageUpdate = {
      id: 'uuid-2',
      vehicle_id: 'uuid-1',
      mileage: 46000,
      date: new Date().toISOString(),
      source: 'manual',
      created_at: new Date().toISOString(),
      synced_at: null,
    }
    expect(['manual', 'fuel_fill', 'maintenance']).toContain(update.source)
  })
})
