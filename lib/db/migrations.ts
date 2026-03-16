import * as SQLite from 'expo-sqlite'
import { CREATE_TABLES_SQL, TABLE_NAMES } from './schema'
import type { Result } from '../../types'

let db: SQLite.SQLiteDatabase | null = null

export function getDatabase(): SQLite.SQLiteDatabase {
  if (!db) {
    db = SQLite.openDatabaseSync('meca-track.db')
  }
  return db
}

export async function initDatabase(): Promise<Result<void>> {
  try {
    const database = getDatabase()

    // Create all 7 tables
    for (const sql of CREATE_TABLES_SQL) {
      database.execSync(sql)
    }

    // Insert default user_settings if not exists
    const existing = database.getFirstSync<{ id: string }>(
      `SELECT id FROM ${TABLE_NAMES.USER_SETTINGS} WHERE id = 'default'`
    )

    if (!existing) {
      const now = new Date().toISOString()
      database.runSync(
        `INSERT INTO ${TABLE_NAMES.USER_SETTINGS} (id, notification_mode, home_view, selected_vehicle_id, km_rhythm_data, created_at, updated_at)
         VALUES ('default', 'intelligent', 'global', NULL, NULL, ?, ?)`,
        [now, now]
      )
    }

    return { data: undefined, error: null }
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Erreur inconnue lors de l\'initialisation de la base de données'
    return { data: null, error: message }
  }
}
