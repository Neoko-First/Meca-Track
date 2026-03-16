import { VEHICLE_TYPES, FUEL_TYPES } from '../constants/vehicleTypes'
import { MAINTENANCE_TYPES } from '../constants/maintenanceTypes'
import { CALENDAR_ALERT_TYPES } from '../constants/alertTypes'

// Pattern Result<T> — obligatoire pour toutes les opérations async
export type Result<T> = { data: T; error: null } | { data: null; error: string }

export type VehicleType = (typeof VEHICLE_TYPES)[number]
export type FuelType = (typeof FUEL_TYPES)[number]
export type MaintenanceType = (typeof MAINTENANCE_TYPES)[number]
export type CalendarAlertType = (typeof CALENDAR_ALERT_TYPES)[number]

export interface Vehicle {
  id: string
  user_id: string | null
  name: string
  type: VehicleType
  brand: string | null
  model: string | null
  year: number | null
  fuel_type: FuelType | null
  license_plate: string | null
  current_mileage: number
  created_at: string
  updated_at: string
  synced_at: string | null
}

export interface MaintenanceRecord {
  id: string
  vehicle_id: string
  type: MaintenanceType
  label: string | null
  mileage_at_service: number
  date: string
  cost: number | null
  notes: string | null
  next_mileage: number | null
  next_date: string | null
  created_at: string
  synced_at: string | null
}

export interface FuelRecord {
  id: string
  vehicle_id: string
  date: string
  cost: number
  mileage_at_fill: number | null
  created_at: string
  synced_at: string | null
}

export interface MileageUpdate {
  id: string
  vehicle_id: string
  mileage: number
  date: string
  source: 'manual' | 'fuel_fill' | 'maintenance'
  created_at: string
  synced_at: string | null
}

export interface CalendarAlert {
  id: string
  vehicle_id: string
  type: CalendarAlertType
  label: string
  due_date: string
  reminder_days_before: number
  is_active: 0 | 1
  created_at: string
  synced_at: string | null
}

export interface SyncQueueItem {
  id: string
  operation: 'insert' | 'update' | 'delete'
  table_name: string
  record_id: string
  payload: string
  created_at: string
  attempts: number
}

export interface UserSettings {
  id: 'default'
  notification_mode: 'intelligent' | 'daily' | 'weekly' | 'monthly'
  home_view: 'global' | 'per_vehicle'
  selected_vehicle_id: string | null
  km_rhythm_data: string | null
  created_at: string
  updated_at: string
}
