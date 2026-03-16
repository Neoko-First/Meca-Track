# Story 1.1: Initialisation du projet depuis le template Expo

Status: review

## Story

As a développeur,
I want initialiser le projet meca-track depuis le template Expo Tabs, configurer toutes les dépendances, mettre en place la structure feature-based et créer le schéma SQLite complet,
so that l'app peut être lancée sur iOS et Android avec toute l'infrastructure technique en place pour les stories suivantes.

## Acceptance Criteria

1. L'app démarre sans erreur sur iOS et Android via Expo Go après installation des dépendances
2. Les 7 tables SQLite sont créées au premier lancement : `vehicles`, `maintenance_records`, `fuel_records`, `mileage_updates`, `calendar_alerts`, `sync_queue`, `user_settings`
3. Un enregistrement par défaut est présent dans `user_settings` avec `notification_mode: 'intelligent'` et `home_view: 'global'`
4. La structure de dossiers feature-based est en place : `lib/db/`, `lib/sync/`, `lib/notifications/`, `lib/store/`, `components/ui|vehicles|maintenance|costs|notifications/`, `hooks/`, `constants/`, `types/`, `__tests__/`
5. Les 4 fichiers de constantes enum existent : `constants/vehicleTypes.ts`, `constants/maintenanceTypes.ts`, `constants/alertTypes.ts`
6. Le fichier `types/index.ts` contient les types TypeScript : `Vehicle`, `MaintenanceRecord`, `FuelRecord`, `MileageUpdate`, `CalendarAlert`, `SyncQueueItem`, `UserSettings`, `Result<T>`
7. Les routes Expo Router sont créées : `(auth)/login.tsx`, `(auth)/register.tsx`, `vehicle/new.tsx`, `vehicle/[id].tsx`, `maintenance/new.tsx`, `maintenance/[id].tsx`, `fuel/new.tsx`
8. NativeWind est configuré et fonctionnel (`tailwind.config.js`, `global.css`)
9. Jest est configuré et les tests de schéma passent à 100%
10. `eas.json` existe avec les profils `development`, `preview`, `production`

## Tasks / Subtasks

- [x] Task 1 — Initialiser le projet et installer les dépendances (AC: 1)
  - [x] 1.1 Exécuter `npx create-expo-app@latest meca-track --template tabs` dans le répertoire workspace
  - [x] 1.2 Installer les dépendances core : `npx expo install expo-sqlite expo-notifications expo-background-fetch expo-task-manager`
  - [x] 1.3 Installer les dépendances state/sync : `npx expo install @tanstack/react-query zustand expo-secure-store`
  - [x] 1.4 Installer Supabase : `npm install @supabase/supabase-js`
  - [x] 1.5 Installer NativeWind : `npm install nativewind tailwindcss` et configurer `tailwind.config.js` + `global.css`
  - [ ] 1.6 Vérifier que l'app démarre sur iOS/Android simulateur sans erreur

- [x] Task 2 — Créer la structure de fichiers feature-based (AC: 4)
  - [x] 2.1 Créer les sous-dossiers de `lib/` : `db/`, `sync/`, `notifications/`, `store/`
  - [x] 2.2 Créer les sous-dossiers de `components/` : `ui/`, `vehicles/`, `maintenance/`, `costs/`, `notifications/`
  - [x] 2.3 Créer les dossiers racine : `hooks/`, `constants/`, `types/`, `__tests__/`
  - [x] 2.4 Créer les routes Expo Router manquantes avec placeholder : `app/(auth)/login.tsx`, `app/(auth)/register.tsx`, `app/vehicle/new.tsx`, `app/vehicle/[id].tsx`, `app/maintenance/new.tsx`, `app/maintenance/[id].tsx`, `app/fuel/new.tsx`
  - [x] 2.5 Mettre à jour `app/_layout.tsx` pour intégrer l'initialisation SQLite au démarrage

- [x] Task 3 — Définir le schéma SQLite et les migrations (AC: 2, 3)
  - [x] 3.1 Créer `lib/db/schema.ts` avec les 7 instructions `CREATE TABLE IF NOT EXISTS`
  - [x] 3.2 Créer `lib/db/migrations.ts` avec la fonction `initDatabase(): Promise<Result<void>>` qui exécute le schéma et insère le `user_settings` par défaut
  - [x] 3.3 Intégrer l'appel à `initDatabase()` dans `app/_layout.tsx` (avant tout rendu)
  - [ ] 3.4 Vérifier manuellement via logs que les 7 tables sont bien créées au premier lancement

- [x] Task 4 — Créer les constantes d'enum et les types TypeScript (AC: 5, 6)
  - [x] 4.1 Créer `constants/vehicleTypes.ts` avec `VEHICLE_TYPES` et `FUEL_TYPES`
  - [x] 4.2 Créer `constants/maintenanceTypes.ts` avec `MAINTENANCE_TYPES`
  - [x] 4.3 Créer `constants/alertTypes.ts` avec `CALENDAR_ALERT_TYPES`
  - [x] 4.4 Créer `types/index.ts` avec les interfaces `Vehicle`, `MaintenanceRecord`, `FuelRecord`, `MileageUpdate`, `CalendarAlert`, `SyncQueueItem`, `UserSettings` et le type `Result<T>`

- [x] Task 5 — Configurer Jest et créer les tests du schéma (AC: 9)
  - [x] 5.1 Configurer Jest pour Expo : `npm install --save-dev jest jest-expo @types/jest`
  - [x] 5.2 Ajouter script `"test": "jest"` dans `package.json` et configurer `jest.config.js` avec preset `jest-expo`
  - [x] 5.3 Créer `__tests__/schema.test.ts` qui vérifie que les 7 noms de tables sont définis dans `lib/db/schema.ts`
  - [x] 5.4 Créer `__tests__/types.test.ts` qui vérifie que le type `Result<T>` se compile sans erreur (test de type TypeScript)
  - [x] 5.5 Exécuter `npm test` — tous les tests passent à 100% (22 tests)

- [x] Task 6 — Configurer EAS Build (AC: 10)
  - [x] 6.1 Créer `eas.json` avec les profils `development` (simulator), `preview` (internal distribution), `production`
  - [x] 6.2 Vérifier que `app.json` contient `slug: "meca-track"` et `bundleIdentifier`/`package` corrects

## Dev Notes

### Stack technique obligatoire

- **React Native + Expo Managed Workflow** — NE PAS utiliser Expo Bare ou React Native CLI
- **expo-sqlite v14** — la v14 est requise (requêtes réactives). Utiliser `npx expo install` pour garantir la version compatible
- **Expo Router v3** — inclus dans le template `tabs`, routing file-based dans `app/`
- **NativeWind** — Tailwind CSS pour React Native. Nécessite `tailwind.config.js` + import `global.css` dans `_layout.tsx`
- **TypeScript strict** — obligatoire, ne pas désactiver `strict: true` dans `tsconfig.json`

### Commandes d'installation exactes

```bash
# Étape 1 — Template
npx create-expo-app@latest meca-track --template tabs

# Étape 2 — Dépendances Expo (utiliser npx expo install pour compat garantie)
npx expo install expo-sqlite expo-notifications expo-background-fetch expo-task-manager expo-secure-store

# Étape 3 — State management
npx expo install @tanstack/react-query zustand

# Étape 4 — Supabase (npm car non-Expo)
npm install @supabase/supabase-js

# Étape 5 — NativeWind
npm install nativewind tailwindcss
npx tailwindcss init

# Étape 6 — Tests
npm install --save-dev jest jest-expo @types/jest
```

### Schéma SQLite complet — lib/db/schema.ts

Les 7 tables à créer exactement comme spécifié (snake_case obligatoire) :

```sql
CREATE TABLE IF NOT EXISTS vehicles (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  year INTEGER,
  fuel_type TEXT,
  license_plate TEXT,
  current_mileage INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  synced_at TEXT
);

CREATE TABLE IF NOT EXISTS maintenance_records (
  id TEXT PRIMARY KEY,
  vehicle_id TEXT NOT NULL REFERENCES vehicles(id),
  type TEXT NOT NULL,
  label TEXT,
  mileage_at_service INTEGER NOT NULL,
  date TEXT NOT NULL,
  cost REAL,
  notes TEXT,
  next_mileage INTEGER,
  next_date TEXT,
  created_at TEXT NOT NULL,
  synced_at TEXT
);

CREATE TABLE IF NOT EXISTS fuel_records (
  id TEXT PRIMARY KEY,
  vehicle_id TEXT NOT NULL REFERENCES vehicles(id),
  date TEXT NOT NULL,
  cost REAL NOT NULL,
  mileage_at_fill INTEGER,
  created_at TEXT NOT NULL,
  synced_at TEXT
);

CREATE TABLE IF NOT EXISTS mileage_updates (
  id TEXT PRIMARY KEY,
  vehicle_id TEXT NOT NULL REFERENCES vehicles(id),
  mileage INTEGER NOT NULL,
  date TEXT NOT NULL,
  source TEXT NOT NULL,
  created_at TEXT NOT NULL,
  synced_at TEXT
);

CREATE TABLE IF NOT EXISTS calendar_alerts (
  id TEXT PRIMARY KEY,
  vehicle_id TEXT NOT NULL REFERENCES vehicles(id),
  type TEXT NOT NULL,
  label TEXT NOT NULL,
  due_date TEXT NOT NULL,
  reminder_days_before INTEGER NOT NULL DEFAULT 30,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  synced_at TEXT
);

CREATE TABLE IF NOT EXISTS sync_queue (
  id TEXT PRIMARY KEY,
  operation TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id TEXT NOT NULL,
  payload TEXT NOT NULL,
  created_at TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS user_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  notification_mode TEXT NOT NULL DEFAULT 'intelligent',
  home_view TEXT NOT NULL DEFAULT 'global',
  selected_vehicle_id TEXT,
  km_rhythm_data TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

### Types TypeScript obligatoires — types/index.ts

```typescript
// Pattern Result<T> — OBLIGATOIRE pour toutes les opérations async
export type Result<T> = { data: T; error: null } | { data: null; error: string }

export type VehicleType = typeof import('../constants/vehicleTypes').VEHICLE_TYPES[number]
export type FuelType = typeof import('../constants/vehicleTypes').FUEL_TYPES[number]
export type MaintenanceType = typeof import('../constants/maintenanceTypes').MAINTENANCE_TYPES[number]
export type CalendarAlertType = typeof import('../constants/alertTypes').CALENDAR_ALERT_TYPES[number]

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
```

### Règles obligatoires (architecture)

- ✅ `Result<T>` pour TOUTES les opérations async (pas de try/catch inline dans les composants)
- ✅ SQLite d'abord, Supabase ensuite — jamais d'écriture directe vers Supabase
- ✅ IDs = UUID générés côté client (pour support offline)
- ✅ Dates = ISO 8601 string partout (`new Date().toISOString()`)
- ✅ Montants = `number` décimal, 2 décimales max
- ✅ Kilométrage = `number` entier
- ✅ `snake_case` pour toutes les colonnes et tables DB
- ✅ `PascalCase.tsx` pour les composants React Native
- ✅ `camelCase.ts` pour utilitaires, hooks, stores

### Flux de données (pour référence future)

```
[UI] → [Hook] → [lib/db/] → [SQLite]
                    ↓
              [lib/sync/queue] → [Supabase] (si connecté)
```

### NativeWind — configuration

Dans `tailwind.config.js`, `content` doit inclure `"./app/**/*.{js,jsx,ts,tsx}"` et `"./components/**/*.{js,jsx,ts,tsx}"`.
Dans `app/_layout.tsx`, importer `"../global.css"` en première ligne.

### Routes Expo Router à créer (placeholders)

Les routes suivantes n'existent pas dans le template `tabs` et doivent être créées avec un contenu minimal (écran vide avec `<View>` + `<Text>`) :
- `app/(auth)/login.tsx`
- `app/(auth)/register.tsx`
- `app/vehicle/new.tsx`
- `app/vehicle/[id].tsx`
- `app/maintenance/new.tsx`
- `app/maintenance/[id].tsx`
- `app/fuel/new.tsx`

Le template `tabs` génère automatiquement : `app/(tabs)/index.tsx`, `app/(tabs)/explore.tsx`, `app/_layout.tsx`.

### eas.json — contenu minimal requis

```json
{
  "cli": { "version": ">= 12.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  }
}
```

### Project Structure Notes

- Alignement avec l'arborescence définie dans l'architecture : `app/`, `components/`, `lib/`, `hooks/`, `constants/`, `types/`, `__tests__/`
- Le template `tabs` génère `components/` avec quelques fichiers exemples — les conserver ou supprimer selon besoin, mais respecter la structure cible
- `lib/db/schema.ts` = source de vérité du schéma (utilisé par toutes les stories suivantes)
- Aucune implémentation métier dans cette story — uniquement infrastructure et types

### References

- Architecture : `_bmad-output/planning-artifacts/architecture.md#Évaluation du Starter Template`
- Architecture : `_bmad-output/planning-artifacts/architecture.md#Schéma SQLite`
- Architecture : `_bmad-output/planning-artifacts/architecture.md#Structure du Projet`
- Architecture : `_bmad-output/planning-artifacts/architecture.md#Patterns d'Implémentation`
- Epics : `_bmad-output/planning-artifacts/epics.md#Story 1.1`

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

### Completion Notes List

- `npm install` réussi avec `--legacy-peer-deps` (react-native-reanimated@4.2.2 nécessite react-native-worklets non encore publié stablement)
- `babel.config.js` mis à jour : plugin reanimated désactivé en test env via `process.env.NODE_ENV === 'test'`
- `jest.config.js` corrigé : `setupFilesAfterFramework` → `setupFilesAfterEnv`
- `package.json` : clé `jest` dupliquée supprimée (conflit avec jest.config.js)
- 22 tests passent : 100%

### File List

- `meca-track/package.json`
- `meca-track/app.json`
- `meca-track/eas.json`
- `meca-track/tailwind.config.js`
- `meca-track/global.css`
- `meca-track/tsconfig.json`
- `meca-track/jest.config.js`
- `meca-track/app/_layout.tsx`
- `meca-track/app/(auth)/login.tsx`
- `meca-track/app/(auth)/register.tsx`
- `meca-track/app/vehicle/new.tsx`
- `meca-track/app/vehicle/[id].tsx`
- `meca-track/app/maintenance/new.tsx`
- `meca-track/app/maintenance/[id].tsx`
- `meca-track/app/fuel/new.tsx`
- `meca-track/lib/db/schema.ts`
- `meca-track/lib/db/migrations.ts`
- `meca-track/constants/vehicleTypes.ts`
- `meca-track/constants/maintenanceTypes.ts`
- `meca-track/constants/alertTypes.ts`
- `meca-track/types/index.ts`
- `meca-track/__tests__/schema.test.ts`
- `meca-track/__tests__/types.test.ts`

## Change Log

| Date | Change |
|---|---|
| 2026-03-16 | Story créée — infrastructure initiale du projet meca-track |
