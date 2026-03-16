import { CREATE_TABLES_SQL, TABLE_NAMES } from '../lib/db/schema'

describe('SQLite Schema', () => {
  const expectedTables = [
    'vehicles',
    'maintenance_records',
    'fuel_records',
    'mileage_updates',
    'calendar_alerts',
    'sync_queue',
    'user_settings',
  ]

  it('should define exactly 7 CREATE TABLE statements', () => {
    expect(CREATE_TABLES_SQL).toHaveLength(7)
  })

  it.each(expectedTables)('should include table: %s', (tableName) => {
    const found = CREATE_TABLES_SQL.some((sql) =>
      sql.includes(`CREATE TABLE IF NOT EXISTS ${tableName}`)
    )
    expect(found).toBe(true)
  })

  it('should export TABLE_NAMES with all 7 table identifiers', () => {
    expect(Object.values(TABLE_NAMES)).toHaveLength(7)
    expect(TABLE_NAMES.VEHICLES).toBe('vehicles')
    expect(TABLE_NAMES.MAINTENANCE_RECORDS).toBe('maintenance_records')
    expect(TABLE_NAMES.FUEL_RECORDS).toBe('fuel_records')
    expect(TABLE_NAMES.MILEAGE_UPDATES).toBe('mileage_updates')
    expect(TABLE_NAMES.CALENDAR_ALERTS).toBe('calendar_alerts')
    expect(TABLE_NAMES.SYNC_QUEUE).toBe('sync_queue')
    expect(TABLE_NAMES.USER_SETTINGS).toBe('user_settings')
  })

  it('vehicles table should have required columns', () => {
    const vehiclesSql = CREATE_TABLES_SQL.find((sql) =>
      sql.includes('CREATE TABLE IF NOT EXISTS vehicles')
    )!
    expect(vehiclesSql).toContain('id')
    expect(vehiclesSql).toContain('name')
    expect(vehiclesSql).toContain('type')
    expect(vehiclesSql).toContain('current_mileage')
    expect(vehiclesSql).toContain('created_at')
    expect(vehiclesSql).toContain('updated_at')
  })

  it('user_settings table should have notification_mode and home_view columns', () => {
    const settingsSql = CREATE_TABLES_SQL.find((sql) =>
      sql.includes('CREATE TABLE IF NOT EXISTS user_settings')
    )!
    expect(settingsSql).toContain('notification_mode')
    expect(settingsSql).toContain('home_view')
    expect(settingsSql).toContain("DEFAULT 'intelligent'")
    expect(settingsSql).toContain("DEFAULT 'global'")
  })

  it('sync_queue table should have attempts column with DEFAULT 0', () => {
    const syncSql = CREATE_TABLES_SQL.find((sql) =>
      sql.includes('CREATE TABLE IF NOT EXISTS sync_queue')
    )!
    expect(syncSql).toContain('attempts')
    expect(syncSql).toContain('DEFAULT 0')
  })
})
