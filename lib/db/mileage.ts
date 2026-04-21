import { getDatabase } from './migrations'
import type { Result, MileageUpdate } from '../../types'

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export interface RecordMileageInput {
  vehicleId: string
  mileage: number
  source: MileageUpdate['source']
  /** Si true, autorise un kilométrage inférieur à l'actuel (avec confirmation préalable côté UI) */
  forceUpdate?: boolean
}

export async function recordMileageUpdate(input: RecordMileageInput): Promise<Result<MileageUpdate>> {
  try {
    const db = getDatabase()
    const now = new Date().toISOString()
    const id = generateUUID()

    // Enregistrement dans mileage_updates
    db.runSync(
      `INSERT INTO mileage_updates (id, vehicle_id, mileage, date, source, created_at, synced_at)
       VALUES (?, ?, ?, ?, ?, ?, NULL)`,
      [id, input.vehicleId, input.mileage, now, input.source, now]
    )

    // Mise à jour de current_mileage dans vehicles
    db.runSync(
      `UPDATE vehicles SET current_mileage = ?, updated_at = ? WHERE id = ?`,
      [input.mileage, now, input.vehicleId]
    )

    const update = db.getFirstSync<MileageUpdate>(
      'SELECT * FROM mileage_updates WHERE id = ?', [id]
    )!
    return { data: update, error: null }
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Erreur mise à jour kilométrage'
    return { data: null, error: message }
  }
}

export async function getMileageHistory(vehicleId: string): Promise<Result<MileageUpdate[]>> {
  try {
    const db = getDatabase()
    const rows = db.getAllSync<MileageUpdate>(
      'SELECT * FROM mileage_updates WHERE vehicle_id = ? ORDER BY date DESC',
      [vehicleId]
    )
    return { data: rows, error: null }
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Erreur lecture historique kilométrage'
    return { data: null, error: message }
  }
}
