export const TABLE_NAMES = {
  VEHICLES: 'vehicles',
  MAINTENANCE_RECORDS: 'maintenance_records',
  FUEL_RECORDS: 'fuel_records',
  MILEAGE_UPDATES: 'mileage_updates',
  CALENDAR_ALERTS: 'calendar_alerts',
  SYNC_QUEUE: 'sync_queue',
  USER_SETTINGS: 'user_settings',
} as const

export const CREATE_TABLES_SQL: string[] = [
  `CREATE TABLE IF NOT EXISTS vehicles (
    id              TEXT PRIMARY KEY,
    user_id         TEXT,
    name            TEXT NOT NULL,
    type            TEXT NOT NULL,
    brand           TEXT,
    model           TEXT,
    year            INTEGER,
    fuel_type       TEXT,
    license_plate   TEXT,
    current_mileage INTEGER NOT NULL,
    created_at      TEXT NOT NULL,
    updated_at      TEXT NOT NULL,
    synced_at       TEXT
  )`,

  `CREATE TABLE IF NOT EXISTS maintenance_records (
    id                  TEXT PRIMARY KEY,
    vehicle_id          TEXT NOT NULL REFERENCES vehicles(id),
    type                TEXT NOT NULL,
    label               TEXT,
    mileage_at_service  INTEGER NOT NULL,
    date                TEXT NOT NULL,
    cost                REAL,
    notes               TEXT,
    next_mileage        INTEGER,
    next_date           TEXT,
    created_at          TEXT NOT NULL,
    synced_at           TEXT
  )`,

  `CREATE TABLE IF NOT EXISTS fuel_records (
    id              TEXT PRIMARY KEY,
    vehicle_id      TEXT NOT NULL REFERENCES vehicles(id),
    date            TEXT NOT NULL,
    cost            REAL NOT NULL,
    mileage_at_fill INTEGER,
    created_at      TEXT NOT NULL,
    synced_at       TEXT
  )`,

  `CREATE TABLE IF NOT EXISTS mileage_updates (
    id          TEXT PRIMARY KEY,
    vehicle_id  TEXT NOT NULL REFERENCES vehicles(id),
    mileage     INTEGER NOT NULL,
    date        TEXT NOT NULL,
    source      TEXT NOT NULL,
    created_at  TEXT NOT NULL,
    synced_at   TEXT
  )`,

  `CREATE TABLE IF NOT EXISTS calendar_alerts (
    id                    TEXT PRIMARY KEY,
    vehicle_id            TEXT NOT NULL REFERENCES vehicles(id),
    type                  TEXT NOT NULL,
    label                 TEXT NOT NULL,
    due_date              TEXT NOT NULL,
    reminder_days_before  INTEGER NOT NULL DEFAULT 30,
    is_active             INTEGER NOT NULL DEFAULT 1,
    created_at            TEXT NOT NULL,
    synced_at             TEXT
  )`,

  `CREATE TABLE IF NOT EXISTS sync_queue (
    id          TEXT PRIMARY KEY,
    operation   TEXT NOT NULL,
    table_name  TEXT NOT NULL,
    record_id   TEXT NOT NULL,
    payload     TEXT NOT NULL,
    created_at  TEXT NOT NULL,
    attempts    INTEGER NOT NULL DEFAULT 0
  )`,

  `CREATE TABLE IF NOT EXISTS user_settings (
    id                    TEXT PRIMARY KEY DEFAULT 'default',
    notification_mode     TEXT NOT NULL DEFAULT 'intelligent',
    home_view             TEXT NOT NULL DEFAULT 'global',
    selected_vehicle_id   TEXT,
    km_rhythm_data        TEXT,
    created_at            TEXT NOT NULL,
    updated_at            TEXT NOT NULL
  )`,
]
