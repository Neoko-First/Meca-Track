import { getDatabase } from './migrations'
import { recordMileageUpdate } from './mileage'
import type { Result, MaintenanceRecord } from '../../types'

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export interface CreateMaintenanceInput {
  vehicleId: string
  type: MaintenanceRecord['type']
  mileage_at_service: number
  date: string           // YYYY-MM-DD — converti en ISO 8601 avant sauvegarde
  label?: string
  cost?: number
  notes?: string
  currentVehicleMileage: number  // pour décider si le kilométrage véhicule doit être mis à jour
}

export async function createMaintenanceRecord(
  input: CreateMaintenanceInput
): Promise<Result<MaintenanceRecord>> {
  try {
    // 1. Validation : type 'other' exige un label
    if (input.type === 'other' && !input.label?.trim()) {
      return { data: null, error: 'Le libellé est requis pour le type Autre' }
    }

    const db = getDatabase()
    const id = generateUUID()
    const now = new Date().toISOString()
    const isoDate = new Date(input.date + 'T00:00:00').toISOString()

    // 2. INSERT dans maintenance_records
    db.runSync(
      `INSERT INTO maintenance_records
        (id, vehicle_id, type, label, mileage_at_service, date, cost, notes, next_mileage, next_date, created_at, synced_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL, ?, NULL)`,
      [
        id,
        input.vehicleId,
        input.type,
        input.label ?? null,
        input.mileage_at_service,
        isoDate,
        input.cost ?? null,
        input.notes ?? null,
        now,
      ]
    )

    const record = db.getFirstSync<MaintenanceRecord>(
      'SELECT * FROM maintenance_records WHERE id = ?', [id]
    )!

    // 3. Si le kilométrage de l'entretien dépasse le kilométrage actuel du véhicule → mise à jour
    if (input.mileage_at_service > input.currentVehicleMileage) {
      await recordMileageUpdate({
        vehicleId: input.vehicleId,
        mileage: input.mileage_at_service,
        source: 'maintenance',
      })
    }

    return { data: record, error: null }
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Erreur enregistrement entretien'
    return { data: null, error: message }
  }
}

export async function getMaintenanceRecords(vehicleId: string): Promise<Result<MaintenanceRecord[]>> {
  try {
    const db = getDatabase()
    const rows = db.getAllSync<MaintenanceRecord>(
      'SELECT * FROM maintenance_records WHERE vehicle_id = ? ORDER BY date DESC',
      [vehicleId]
    )
    return { data: rows, error: null }
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Erreur lecture entretiens'
    return { data: null, error: message }
  }
}
