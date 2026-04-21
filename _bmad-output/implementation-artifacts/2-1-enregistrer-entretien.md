# Story 2.1 : Enregistrer un entretien

Status: review

## Story

As a utilisateur,
I want enregistrer un entretien effectué sur mon véhicule (type, kilométrage, date, coût optionnel),
so that j'ai un historique complet de ce qui a été fait et quand.

## Acceptance Criteria

**Given** l'utilisateur est sur l'écran d'ajout d'entretien pour un véhicule
**When** il sélectionne un type d'entretien (depuis l'enum), saisit le kilométrage et la date, et valide
**Then** l'entretien est sauvegardé dans `maintenance_records` avec un UUID généré côté client
**And** si `mileage_at_service` > `vehicle.current_mileage` : le kilométrage véhicule est mis à jour
**And** dans ce cas, un enregistrement est ajouté dans `mileage_updates` avec `source: 'maintenance'`

**Given** l'utilisateur renseigne un coût (champ optionnel)
**When** il valide
**Then** le coût est persisté dans le champ `cost` de `maintenance_records`

**Given** l'utilisateur sélectionne le type "Autre"
**When** il tente de valider sans remplir le champ `label`
**Then** une erreur de validation s'affiche ("Le libellé est requis pour le type Autre")

## Tasks / Subtasks

- [x] Task 1 — Créer `lib/db/maintenance.ts` avec `createMaintenanceRecord()`
  - [x] 1.1 Définir `CreateMaintenanceInput` : `vehicleId`, `type`, `mileage_at_service`, `date`, `label?`, `cost?`, `notes?`, `currentVehicleMileage`
  - [x] 1.2 Implémenter `createMaintenanceRecord()` : validation, INSERT, mise à jour kilométrage si besoin (via `recordMileageUpdate`)
  - [x] 1.3 Implémenter `getMaintenanceRecords(vehicleId)` : liste triée `date DESC`

- [x] Task 2 — Implémenter `app/maintenance/new.tsx`
  - [x] 2.1 Recevoir `vehicleId` et `currentMileage` depuis les query params Expo Router
  - [x] 2.2 Sélecteur de type horizontal (scroll) avec labels français
  - [x] 2.3 Champs : kilométrage (obligatoire), date (YYYY-MM-DD, défaut aujourd'hui), coût (optionnel), notes (optionnel)
  - [x] 2.4 Champ `label` conditionnel affiché uniquement si type = 'other'
  - [x] 2.5 Appel `createMaintenanceRecord()` + navigation `router.back()` après succès

- [x] Task 3 — Ajouter le bouton "Ajouter un entretien" dans `app/vehicle/[id].tsx`
  - [x] 3.1 Bouton → `router.push('/maintenance/new?vehicleId=xxx&currentMileage=yyy')`

- [x] Task 4 — Tests `createMaintenanceRecord()`
  - [x] 4.1 Cas nominal : entretien sauvegardé + kilométrage mis à jour si supérieur
  - [x] 4.2 Kilométrage entretien ≤ kilométrage véhicule : pas de mise à jour kilométrage
  - [x] 4.3 Type 'other' sans label → erreur de validation
  - [x] 4.4 Erreur DB → Result avec error

## Dev Notes

### Fichiers à créer / modifier

```
lib/db/maintenance.ts        ← CRÉER
app/maintenance/new.tsx      ← MODIFIER (placeholder actuel)
app/vehicle/[id].tsx         ← MODIFIER (ajouter bouton entretien)
__tests__/maintenance.test.ts ← CRÉER
```

### Context hérité des stories précédentes

**NE PAS recréer — réutiliser :**
- `recordMileageUpdate(vehicleId, mileage, 'maintenance')` → `lib/db/mileage.ts`
- `getDatabase()` → `lib/db/migrations.ts` (jamais ouvrir une nouvelle connexion)
- `Result<T>`, `MaintenanceRecord`, `MileageUpdate` → `types/index.ts`
- `MAINTENANCE_TYPES` → `constants/maintenanceTypes.ts`
- Pattern UUID → copier le `generateUUID()` de `lib/db/vehicles.ts` dans `maintenance.ts`
- NativeWind classes Tailwind — même style que `vehicle/new.tsx` (cohérence)
- Pattern `KeyboardAvoidingView` + `ScrollView` + champs → identique à `vehicle/new.tsx`

**Pattern de navigation avec params Expo Router :**
```typescript
// Depuis vehicle/[id].tsx :
router.push(`/maintenance/new?vehicleId=${vehicle.id}&currentMileage=${vehicle.current_mileage}`)

// Dans maintenance/new.tsx :
const { vehicleId, currentMileage } = useLocalSearchParams<{
  vehicleId: string
  currentMileage: string
}>()
const currentMileageNum = parseInt(currentMileage, 10)
```

### Schema `maintenance_records` (rappel)

```sql
CREATE TABLE maintenance_records (
  id                  TEXT PRIMARY KEY,
  vehicle_id          TEXT NOT NULL REFERENCES vehicles(id),
  type                TEXT NOT NULL,     -- ENUM MAINTENANCE_TYPES
  label               TEXT,              -- requis si type = 'other'
  mileage_at_service  INTEGER NOT NULL,
  date                TEXT NOT NULL,     -- ISO 8601
  cost                REAL,              -- nullable
  notes               TEXT,
  next_mileage        INTEGER,           -- NULL pour Story 2.1, utilisé en Story 2.3
  next_date           TEXT,              -- NULL pour Story 2.1, utilisé en Story 2.3
  created_at          TEXT NOT NULL,
  synced_at           TEXT
)
```

### `createMaintenanceRecord` — squelette implémentation

```typescript
// lib/db/maintenance.ts
import { getDatabase } from './migrations'
import { recordMileageUpdate } from './mileage'
import type { Result, MaintenanceRecord } from '../../types'

export interface CreateMaintenanceInput {
  vehicleId: string
  type: MaintenanceRecord['type']
  mileage_at_service: number
  date: string                // ISO 8601 — convertir YYYY-MM-DD → new Date(str).toISOString()
  label?: string
  cost?: number
  notes?: string
  currentVehicleMileage: number  // pour décider si on met à jour le kilométrage
}

export async function createMaintenanceRecord(
  input: CreateMaintenanceInput
): Promise<Result<MaintenanceRecord>> {
  // 1. Validation type 'other' → label requis
  // 2. INSERT maintenance_records
  // 3. Si mileage_at_service > currentVehicleMileage → recordMileageUpdate(...)
  // 4. Return the created record
}
```

**Important :** `recordMileageUpdate` gère déjà l'UPDATE de `vehicles.current_mileage`. Ne pas dupliquer.

### Labels français pour MAINTENANCE_TYPES

```typescript
const MAINTENANCE_TYPE_LABELS: Record<MaintenanceRecord['type'], string> = {
  oil_change: 'Vidange',
  tire_change: 'Pneus',
  timing_belt: 'Courroie de distribution',
  brake_pads: 'Plaquettes de frein',
  brake_discs: 'Disques de frein',
  air_filter: 'Filtre à air',
  cabin_filter: 'Filtre habitacle',
  fuel_filter: 'Filtre à carburant',
  spark_plugs: 'Bougies',
  battery: 'Batterie',
  coolant: 'Liquide de refroidissement',
  brake_fluid: 'Liquide de frein',
  technical_inspection: 'Contrôle technique',
  general_revision: 'Révision générale',
  other: 'Autre',
}
```

### Gestion de la date

```typescript
// Défaut : date du jour en YYYY-MM-DD
const todayISO = new Date().toISOString().split('T')[0] // "2026-04-21"

// Conversion avant sauvegarde :
const isoDate = new Date(dateStr + 'T00:00:00').toISOString()
```

### Règles obligatoires (héritées de l'architecture)

- ✅ `Result<T>` pour TOUTES les opérations async
- ✅ `getDatabase()` partagé — ne jamais rouvrir une connexion
- ✅ UUID généré côté client
- ✅ Dates ISO 8601 en base
- ✅ Montants décimaux (REAL SQLite) — pas de `parseInt` sur le coût
- ✅ NativeWind, pas de `StyleSheet.create()`

### Anti-patterns à éviter

- ❌ Ne PAS appeler `db.runSync('UPDATE vehicles SET current_mileage...')` directement — utiliser `recordMileageUpdate()`
- ❌ Ne PAS afficher le champ `next_mileage` / `next_date` dans ce formulaire (Story 2.3)
- ❌ Ne PAS modifier `lib/db/schema.ts` ni `lib/db/migrations.ts`

### Tests — guide d'implémentation

Mock identique aux tests existants (`vehicles.create.test.ts`, `mileage.test.ts`) :
```typescript
jest.mock('expo-sqlite', () => ({ openDatabaseSync: jest.fn(() => mockDb) }))
jest.mock('../lib/db/migrations', () => ({ getDatabase: jest.fn(() => mockDb) }))
jest.mock('../lib/db/mileage', () => ({ recordMileageUpdate: jest.fn() }))
```

**Cas de test requis :**
1. `mileage_at_service > currentVehicleMileage` → `recordMileageUpdate` appelé avec `source: 'maintenance'`
2. `mileage_at_service <= currentVehicleMileage` → `recordMileageUpdate` NON appelé
3. `type === 'other'` sans `label` → erreur validation, pas d'INSERT
4. `cost` optionnel persisté correctement (test valeur `null` vs `number`)
5. Erreur DB → `Result` avec error

### Références

- Architecture : `_bmad-output/planning-artifacts/architecture.md#Patterns d'Implémentation`
- Schema : `lib/db/schema.ts` (maintenance_records)
- Réutilisé : `lib/db/mileage.ts#recordMileageUpdate`
- Epics : `_bmad-output/planning-artifacts/epics.md#Story 2.1`

## Dev Agent Record

### Agent Model Used
claude-sonnet-4-6

### Debug Log References

### Completion Notes List

### File List

- `lib/db/maintenance.ts` — CRÉÉ
- `app/maintenance/new.tsx` — IMPLÉMENTÉ (formulaire complet)
- `app/vehicle/[id].tsx` — MODIFIÉ (bouton "Ajouter un entretien")
- `__tests__/maintenance.test.ts` — CRÉÉ (6 tests, tous verts)

## Change Log

| Date | Change |
|---|---|
| 2026-04-21 | Story créée — Enregistrer un entretien |
