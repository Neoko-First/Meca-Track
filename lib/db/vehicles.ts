import { getDatabase } from './migrations'
import type { Result, Vehicle } from '../../types'

// Génère un UUID v4 côté client (support offline)
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export async function getVehicles(): Promise<Result<Vehicle[]>> {
  try {
    const db = getDatabase()
    const rows = db.getAllSync<Vehicle>('SELECT * FROM vehicles ORDER BY created_at DESC')
    return { data: rows, error: null }
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Erreur lecture véhicules'
    return { data: null, error: message }
  }
}

export interface CreateVehicleInput {
  type: Vehicle['type']
  current_mileage: number
  name?: string
  brand?: string
  model?: string
  year?: number
  fuel_type?: Vehicle['fuel_type']
  license_plate?: string
  user_id?: string
}

export async function getVehicleById(id: string): Promise<Result<Vehicle>> {
  try {
    const db = getDatabase()
    const vehicle = db.getFirstSync<Vehicle>('SELECT * FROM vehicles WHERE id = ?', [id])
    if (!vehicle) return { data: null, error: 'Véhicule introuvable' }
    return { data: vehicle, error: null }
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Erreur lecture véhicule'
    return { data: null, error: message }
  }
}

export type UpdateVehicleInput = Partial<Omit<CreateVehicleInput, 'user_id'>>

export async function updateVehicle(id: string, input: UpdateVehicleInput): Promise<Result<Vehicle>> {
  try {
    if (input.current_mileage !== undefined && input.current_mileage < 0) {
      return { data: null, error: 'Le kilométrage ne peut pas être négatif' }
    }
    const db = getDatabase()
    const now = new Date().toISOString()
    const existing = db.getFirstSync<Vehicle>('SELECT * FROM vehicles WHERE id = ?', [id])
    if (!existing) return { data: null, error: 'Véhicule introuvable' }

    // On ne met à jour que les champs fournis
    const updated: Partial<Vehicle> = { ...input, updated_at: now }
    const fields = Object.keys(updated).map((k) => `${k} = ?`).join(', ')
    const values = [...Object.values(updated), id]

    db.runSync(`UPDATE vehicles SET ${fields} WHERE id = ?`, values)
    const vehicle = db.getFirstSync<Vehicle>('SELECT * FROM vehicles WHERE id = ?', [id])!
    return { data: vehicle, error: null }
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Erreur mise à jour véhicule'
    return { data: null, error: message }
  }
}

export async function deleteVehicle(id: string): Promise<Result<void>> {
  try {
    const db = getDatabase()
    // Suppression en cascade (données associées) grâce aux REFERENCES SQLite
    db.runSync('DELETE FROM maintenance_records WHERE vehicle_id = ?', [id])
    db.runSync('DELETE FROM fuel_records WHERE vehicle_id = ?', [id])
    db.runSync('DELETE FROM mileage_updates WHERE vehicle_id = ?', [id])
    db.runSync('DELETE FROM calendar_alerts WHERE vehicle_id = ?', [id])
    db.runSync('DELETE FROM vehicles WHERE id = ?', [id])
    return { data: undefined, error: null }
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Erreur suppression véhicule'
    return { data: null, error: message }
  }
}

export async function createVehicle(input: CreateVehicleInput): Promise<Result<Vehicle>> {
  try {
    // Validation
    if (input.current_mileage < 0) {
      return { data: null, error: 'Le kilométrage ne peut pas être négatif' }
    }

    const db = getDatabase()
    const now = new Date().toISOString()
    const id = generateUUID()
    // Nom par défaut si non fourni
    const name = input.name?.trim() || `${input.type} — ${input.brand || 'Véhicule'}`

    db.runSync(
      `INSERT INTO vehicles (id, user_id, name, type, brand, model, year, fuel_type, license_plate, current_mileage, created_at, updated_at, synced_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)`,
      [
        id,
        input.user_id ?? null,
        name,
        input.type,
        input.brand ?? null,
        input.model ?? null,
        input.year ?? null,
        input.fuel_type ?? null,
        input.license_plate ?? null,
        input.current_mileage,
        now,
        now,
      ]
    )

    const vehicle = db.getFirstSync<Vehicle>('SELECT * FROM vehicles WHERE id = ?', [id])!
    return { data: vehicle, error: null }
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Erreur création véhicule'
    return { data: null, error: message }
  }
}
