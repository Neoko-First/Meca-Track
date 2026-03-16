---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
workflowType: 'architecture'
lastStep: 8
status: 'complete'
completedAt: '2026-03-16'
inputDocuments: ['_bmad-output/planning-artifacts/prd.md', '_bmad-output/brainstorming/brainstorming-session-2026-03-16-1000.md']
workflowType: 'architecture'
project_name: 'meca-track'
user_name: 'Alexandre'
date: '2026-03-16'
---

# Architecture Decision Document

_Ce document se construit collaborativement à travers une découverte étape par étape. Les sections sont ajoutées au fur et à mesure de chaque décision architecturale._

## Analyse du Contexte Projet

### Vue d'ensemble des Exigences

**Exigences Fonctionnelles (16 identifiées) :**

| Domaine | Fonctionnalités |
|---|---|
| Véhicules | Multi-véhicules (1-5), tous types, fiche enrichie (motorisation, type) |
| Kilométrage | Saisie manuelle, notifications adaptatives, estimation temporelle |
| Entretiens | Historique, intervalles de référence, diagnostic initial occasion |
| Coûts | Coût/entretien, module carburant rapide, tableau de bord, €/km |
| Alertes | Calendaires (CT, assurance) + kilométriques, timeline unifiée |
| UX | Onboarding progressif, accueil configurable, score de santé |

**Exigences Non-Fonctionnelles :**
- Offline-first : fonctionnement complet sans connexion réseau
- Sync cloud optionnel : cohérence des données inter-appareils
- Stockage texte/chiffres uniquement : pas de fichiers ni médias
- Rapidité d'interaction : saisie carburant en ~3 secondes
- Notifications fiables : système d'alertes avec logique d'apprentissage

**Contraintes décidées :**
- React Native (iOS + Android)
- Compte utilisateur minimaliste
- Zéro fonctionnalités sociales
- Scope MVP : particuliers, 1-5 véhicules

### Échelle & Complexité

- Complexité : Faible à Moyenne
- Domaine technique : Mobile cross-platform + persistence locale + sync cloud optionnel
- Composants architecturaux estimés : ~6

### Préoccupations Transversales Identifiées

1. **Stratégie offline-first + sync** — conflit de données, résolution, queue d'opérations
2. **Moteur de notifications intelligent** — apprentissage du rythme kilométrique, scheduling local vs push
3. **Algorithme d'estimation kilométrique** — alimente notifications, score de santé, timeline, alertes
4. **Modèle de données multi-véhicules** — socle de tous les features
5. **Logique mixte km/date** — timeline unifiée de deux types d'échéances
6. **Performance locale** — requêtes sur historique et calculs d'agrégats côté client

## Évaluation du Starter Template

### Domaine Technologique Principal

Application mobile cross-platform (iOS + Android) — React Native avec Expo Managed Workflow.

### Options Considérées

| Option | SQLite | Notifications | Setup | Build |
|---|---|---|---|---|
| **Expo Managed** ✅ | `expo-sqlite` v14 | `expo-notifications` | Minimal | EAS Build (cloud) |
| Expo Bare | `expo-sqlite` v14 | `expo-notifications` | Moyen | EAS + local toolchain |
| React Native CLI | `op-sqlite` | `@notifee` | Lourd | Xcode/Gradle local |

### Starter Sélectionné : Expo Managed Workflow

**Justification :**
- `expo-sqlite` v14 supporte les requêtes réactives — idéal pour offline-first
- `expo-notifications` gère les credentials APNs/FCM automatiquement
- Expo Router (file-based routing) inclus dans le template `tabs`
- EAS Build — pas de Xcode/Android Studio requis en local
- Parfaitement adapté à un projet solo / petite équipe sans modules natifs exotiques

**Commande d'initialisation :**

```bash
npx create-expo-app@latest meca-track --template tabs
```

**Librairies principales à ajouter :**

```bash
npx expo install expo-sqlite expo-notifications expo-background-fetch expo-task-manager
npx expo install @tanstack/react-query zustand expo-secure-store
```

**Décisions architecturales fournies par le starter :**
- **Langage :** TypeScript (défaut)
- **Navigation :** Expo Router v3 (file-based routing)
- **Build :** EAS Build (cloud, iOS + Android)
- **Mises à jour OTA :** EAS Update disponible
- **Structure :** app/ (routes), components/, constants/, hooks/

**Note :** L'initialisation du projet avec cette commande sera la première story d'implémentation.

## Décisions Architecturales Clés

### Analyse des Priorités

**Décisions Critiques (bloquent l'implémentation) :**
- Architecture de données locale (expo-sqlite)
- Stratégie offline-first + sync
- Authentification (Supabase Auth)
- State management (Zustand + TanStack Query)

**Décisions Importantes (structurent l'architecture) :**
- Sync cloud (Supabase)
- Système de notifications
- Styling (NativeWind)
- Tests (Jest)

**Décisions Différées (Post-MVP) :**
- Tests E2E (Maestro/Detox)
- Widget home screen
- Export/résumé véhicule

---

### Architecture des Données

**Base de données locale : expo-sqlite v14**
- Source de vérité principale — fonctionne 100% offline
- Supporte les requêtes réactives (v14+)
- Toutes les écritures passent d'abord par SQLite

**Sync cloud : Supabase (PostgreSQL)**
- Rationale : modèle relationnel natif pour les agrégats (SUM, GROUP BY) — coûts par mois, €/km, comparaisons inter-véhicules
- Rôle : backup + sync inter-appareils optionnelle, pas source de vérité primaire
- SDK React Native disponible

**Stratégie Offline-First : Local-first avec queue différée**
```
[Action utilisateur] → [expo-sqlite] → [Queue d'opérations] → [Supabase (si connecté)]
```
- Résolution de conflits : last-write-wins basé sur timestamp
- Justification : usage personnel, un seul utilisateur actif simultané

---

### Authentification & Sécurité

**Supabase Auth — Email + mot de passe**
- Compte minimaliste : aucune info superflue
- Row Level Security (RLS) Supabase pour isolation des données par utilisateur
- `expo-secure-store` pour le token de session local

---

### Architecture Frontend

**State Management : Zustand + TanStack Query**
- Zustand : état UI global (véhicule sélectionné, préférences, session)
- TanStack Query : cache serveur Supabase (fetch, invalidation, retry, persistence offline)

**Navigation : Expo Router v3 (file-based)**
- Structure app/ pour les routes
- Décidé par le starter template

**Styling : NativeWind**
- Classes Tailwind CSS pour React Native
- Cohérence visuelle rapide, adapté au développement solo

---

### Système de Notifications

**expo-notifications** — push + notifications locales schedulées
**expo-background-fetch + expo-task-manager** — recalcul des alertes en arrière-plan

**Algorithme d'estimation kilométrique :**
- Stocké dans expo-sqlite
- Moyenne glissante sur les N dernières saisies de kilométrage
- Recalcul à chaque nouvelle saisie → estimation date prochaine échéance

---

### Infrastructure & Déploiement

**Build : EAS Build (cloud)**
- iOS + Android sans Xcode/Android Studio local
- EAS Update disponible pour OTA

**Tests : Jest (unitaires)**
- Périmètre MVP : logique métier critique uniquement
  - Calcul €/km
  - Algorithme d'estimation kilométrique
  - Logique de notifications et alertes
  - Calculs d'agrégats de coûts

---

### Analyse d'Impact des Décisions

**Séquence d'implémentation recommandée :**
1. Init projet Expo + configuration TypeScript/NativeWind
2. Schéma SQLite local (modèle de données véhicules/entretiens/coûts)
3. Supabase setup (Auth + schéma PostgreSQL miroir)
4. Queue de sync offline → Supabase
5. Système de notifications + algorithme km
6. Features métier (entretiens, coûts, carburant)
7. Dashboard & agrégats

**Dépendances croisées :**
- Le schéma SQLite doit être défini avant toute feature métier
- La queue de sync dépend du schéma SQLite et du schéma Supabase
- L'algorithme d'estimation km alimente notifications, score de santé et timeline

## Patterns d'Implémentation & Règles de Cohérence

### Conventions de Nommage

| Contexte | Convention | Exemple |
|---|---|---|
| Tables SQLite/Supabase | `snake_case` | `maintenance_records` |
| Colonnes DB | `snake_case` | `vehicle_id`, `mileage_km` |
| Composants React Native | `PascalCase.tsx` | `VehicleCard.tsx` |
| Utilitaires / hooks / stores | `camelCase.ts` | `kmEstimator.ts`, `useVehicles.ts` |
| Variables / fonctions TS | `camelCase` | `currentMileage`, `addMaintenance()` |
| Types / Interfaces TS | `PascalCase` | `Vehicle`, `MaintenanceRecord` |

### Organisation des Fichiers (Feature-based)

```
app/                        ← routes Expo Router (file-based)
  (tabs)/
    index.tsx               ← accueil / dashboard
    vehicles.tsx
    costs.tsx
  vehicle/[id].tsx
  maintenance/[id].tsx

components/
  ui/                       ← composants génériques réutilisables
  vehicles/                 ← composants spécifiques véhicules
  maintenance/
  costs/

lib/
  db/                       ← schéma SQLite + toutes les requêtes locales
  sync/                     ← queue d'opérations offline → Supabase
  notifications/            ← logique alertes + algorithme estimation km
  store/                    ← stores Zustand

constants/                  ← intervalles de référence, config
hooks/                      ← hooks métier réutilisables
```

### Formats de Données

- **Dates :** ISO 8601 string partout — SQLite, Supabase, UI (`"2026-03-16T10:00:00Z"`)
- **Montants :** `number` décimal, 2 décimales max (`12.50` = 12,50€)
- **Kilométrage :** `number` entier (`85000`)
- **IDs :** UUID string (généré côté client pour fonctionnement offline)

### Pattern de Gestion des Erreurs

```typescript
// Type Result — obligatoire pour toutes les opérations async
type Result<T> = { data: T; error: null } | { data: null; error: string }

// Usage
const { data, error } = await addMaintenance(record)
if (error) showToast(error)
```

### Règles Obligatoires pour tous les Agents IA

- ✅ Toujours utiliser `Result<T>` pour les opérations async
- ✅ Toujours écrire dans SQLite en premier, sync Supabase ensuite
- ✅ Jamais écrire directement dans Supabase — passer par `lib/sync/`
- ✅ Nommage DB strictement `snake_case`
- ✅ IDs générés côté client (UUID) pour support offline complet
- ✅ Zéro `try/catch` inline dans les composants

## Structure du Projet & Frontières

### Arborescence Complète

```
meca-track/
├── app/                          ← Routes Expo Router (file-based)
│   ├── _layout.tsx               ← Layout racine (auth gate)
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx           ← Tab bar
│   │   ├── index.tsx             ← Dashboard / accueil
│   │   ├── vehicles.tsx          ← Liste véhicules
│   │   └── costs.tsx             ← Tableau de bord coûts
│   ├── vehicle/
│   │   ├── [id].tsx              ← Fiche véhicule
│   │   └── new.tsx               ← Ajout véhicule
│   ├── maintenance/
│   │   ├── [id].tsx              ← Détail entretien
│   │   └── new.tsx               ← Saisie entretien
│   └── fuel/
│       └── new.tsx               ← Saisie carburant rapide
│
├── components/
│   ├── ui/                       ← Composants génériques
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Toast.tsx
│   │   └── HealthScore.tsx
│   ├── vehicles/
│   │   ├── VehicleCard.tsx
│   │   └── VehicleForm.tsx
│   ├── maintenance/
│   │   ├── MaintenanceItem.tsx
│   │   └── MaintenanceForm.tsx
│   ├── costs/
│   │   ├── CostSummary.tsx
│   │   └── CostChart.tsx
│   └── notifications/
│       └── AlertBanner.tsx
│
├── lib/
│   ├── db/                       ← SQLite — source de vérité locale
│   │   ├── schema.ts             ← Définition des tables
│   │   ├── migrations.ts         ← Migrations SQLite
│   │   ├── vehicles.ts           ← Requêtes véhicules
│   │   ├── maintenance.ts        ← Requêtes entretiens
│   │   ├── fuel.ts               ← Requêtes carburant
│   │   └── costs.ts              ← Requêtes agrégats coûts
│   ├── sync/                     ← Queue offline → Supabase
│   │   ├── queue.ts              ← Gestion de la queue
│   │   ├── supabase.ts           ← Client Supabase
│   │   └── resolver.ts           ← Résolution de conflits
│   ├── notifications/
│   │   ├── scheduler.ts          ← Scheduling alertes
│   │   ├── kmEstimator.ts        ← Algo estimation kilométrique
│   │   └── backgroundTask.ts     ← expo-background-fetch
│   └── store/                    ← Stores Zustand
│       ├── vehicleStore.ts
│       ├── settingsStore.ts
│       └── authStore.ts
│
├── hooks/                        ← Hooks métier réutilisables
│   ├── useVehicles.ts
│   ├── useMaintenance.ts
│   ├── useCosts.ts
│   └── useSync.ts
│
├── constants/
│   ├── maintenanceIntervals.ts   ← Base de données intervalles référence
│   └── vehicleTypes.ts           ← Types de véhicules supportés
│
├── types/
│   └── index.ts                  ← Types globaux (Vehicle, MaintenanceRecord...)
│
├── __tests__/
│   ├── kmEstimator.test.ts
│   ├── costs.test.ts
│   └── notifications.test.ts
│
├── app.json                      ← Config Expo
├── eas.json                      ← Config EAS Build
├── tailwind.config.js            ← Config NativeWind
├── tsconfig.json
└── package.json
```

### Mapping Features → Structure

| Feature | Emplacement |
|---|---|
| Fiche véhicule | `app/vehicle/`, `lib/db/vehicles.ts`, `components/vehicles/` |
| Entretiens + intervalles | `app/maintenance/`, `lib/db/maintenance.ts`, `constants/maintenanceIntervals.ts` |
| Carburant rapide | `app/fuel/new.tsx`, `lib/db/fuel.ts` |
| Coûts & agrégats | `app/(tabs)/costs.tsx`, `lib/db/costs.ts` |
| Notifications adaptatives | `lib/notifications/`, `lib/store/settingsStore.ts` |
| Sync offline | `lib/sync/` (transversal) |
| Alertes calendaires (CT...) | `lib/notifications/scheduler.ts`, `lib/db/vehicles.ts` |

### Flux de Données

```
[UI] → [Hook] → [lib/db/] → [SQLite]
                    ↓
              [lib/sync/queue] → [Supabase] (si connecté)
```

## Validation de l'Architecture

### Cohérence ✅

Toutes les décisions technologiques sont compatibles entre elles : Expo Managed + expo-sqlite + expo-notifications (combinaison officiellement supportée), Supabase + TanStack Query (patterns établis pour React Native), NativeWind compatible Expo Managed, UUID côté client cohérent avec offline-first.

### Couverture des Exigences ✅

Toutes les 16 fonctionnalités identifiées ont un support architectural explicite dans la structure de projet. Les NFRs critiques (offline-first, performance, stockage texte/chiffres) sont couverts.

### Lacunes Identifiées

- ⚠️ **Important** : Schéma SQLite détaillé (tables, colonnes, types, index) à formaliser en story #1
- ℹ️ Schéma Supabase miroir PostgreSQL à créer en parallèle

### Checklist de Complétude

- [x] Analyse du contexte projet
- [x] Décisions architecturales critiques documentées
- [x] Stack technologique spécifiée (React Native, Expo Managed, Supabase, SQLite, Zustand, TanStack Query, NativeWind, Jest)
- [x] Patterns d'implémentation définis
- [x] Conventions de nommage établies
- [x] Structure de projet complète
- [x] Frontières de composants définies
- [x] Flux de données documenté
- [x] Gestion des erreurs standardisée
- [x] Stratégie offline-first spécifiée

### Statut : PRÊT POUR L'IMPLÉMENTATION ✅

**Niveau de confiance :** Élevé

**Points forts :**
- Architecture offline-first solide avec SQLite comme source de vérité
- Stack éprouvée et adaptée au contexte solo/petite équipe
- Patterns clairs qui évitent les conflits entre agents d'implémentation
- Scope MVP bien délimité

**Première priorité d'implémentation :**

```bash
npx create-expo-app@latest meca-track --template tabs
```

Suivie immédiatement par : définition du schéma SQLite dans `lib/db/schema.ts`

## Schéma SQLite

### Tables

```sql
-- Véhicules
CREATE TABLE vehicles (
  id              TEXT PRIMARY KEY,  -- UUID généré côté client
  user_id         TEXT,              -- Supabase auth UID (nullable si offline)
  name            TEXT NOT NULL,
  type            TEXT NOT NULL,     -- ENUM: car | motorcycle | scooter | van | campervan | truck | quad | other
  brand           TEXT,
  model           TEXT,
  year            INTEGER,
  fuel_type       TEXT,              -- ENUM: petrol | diesel | hybrid | electric | hydrogen | lpg | other
  license_plate   TEXT,
  current_mileage INTEGER NOT NULL,
  created_at      TEXT NOT NULL,     -- ISO 8601
  updated_at      TEXT NOT NULL,
  synced_at       TEXT               -- NULL = pas encore synchronisé
);

-- Entretiens
CREATE TABLE maintenance_records (
  id                  TEXT PRIMARY KEY,
  vehicle_id          TEXT NOT NULL REFERENCES vehicles(id),
  type                TEXT NOT NULL,     -- ENUM: oil_change | tire_change | timing_belt | brake_pads | brake_discs | air_filter | cabin_filter | fuel_filter | spark_plugs | battery | coolant | brake_fluid | technical_inspection | general_revision | other
  label               TEXT,              -- Libellé custom optionnel
  mileage_at_service  INTEGER NOT NULL,
  date                TEXT NOT NULL,     -- ISO 8601
  cost                REAL,              -- Nullable
  notes               TEXT,
  next_mileage        INTEGER,           -- Prochain entretien km (calculé)
  next_date           TEXT,              -- Pour alertes calendaires
  created_at          TEXT NOT NULL,
  synced_at           TEXT
);

-- Carburant
CREATE TABLE fuel_records (
  id              TEXT PRIMARY KEY,
  vehicle_id      TEXT NOT NULL REFERENCES vehicles(id),
  date            TEXT NOT NULL,
  cost            REAL NOT NULL,     -- Coût total en €
  mileage_at_fill INTEGER,           -- Nullable
  created_at      TEXT NOT NULL,
  synced_at       TEXT
);

-- Historique kilométrage (algo d'estimation)
CREATE TABLE mileage_updates (
  id          TEXT PRIMARY KEY,
  vehicle_id  TEXT NOT NULL REFERENCES vehicles(id),
  mileage     INTEGER NOT NULL,
  date        TEXT NOT NULL,
  source      TEXT NOT NULL,     -- ENUM: manual | fuel_fill | maintenance
  created_at  TEXT NOT NULL,
  synced_at   TEXT
);

-- Alertes calendaires
CREATE TABLE calendar_alerts (
  id                    TEXT PRIMARY KEY,
  vehicle_id            TEXT NOT NULL REFERENCES vehicles(id),
  type                  TEXT NOT NULL,     -- ENUM: technical_inspection | insurance | registration | crit_air | driving_license | other
  label                 TEXT NOT NULL,
  due_date              TEXT NOT NULL,     -- ISO 8601
  reminder_days_before  INTEGER NOT NULL DEFAULT 30,
  is_active             INTEGER NOT NULL DEFAULT 1,  -- 0/1 (boolean)
  created_at            TEXT NOT NULL,
  synced_at             TEXT
);

-- Queue de synchronisation offline → Supabase
CREATE TABLE sync_queue (
  id          TEXT PRIMARY KEY,
  operation   TEXT NOT NULL,     -- ENUM: insert | update | delete
  table_name  TEXT NOT NULL,
  record_id   TEXT NOT NULL,
  payload     TEXT NOT NULL,     -- JSON sérialisé
  created_at  TEXT NOT NULL,
  attempts    INTEGER NOT NULL DEFAULT 0
);

-- Préférences utilisateur
CREATE TABLE user_settings (
  id                    TEXT PRIMARY KEY DEFAULT 'default',
  notification_mode     TEXT NOT NULL DEFAULT 'intelligent',  -- ENUM: intelligent | daily | weekly | monthly
  home_view             TEXT NOT NULL DEFAULT 'global',       -- ENUM: global | per_vehicle
  selected_vehicle_id   TEXT,
  km_rhythm_data        TEXT,     -- JSON: historique mesures pour l'algo d'estimation
  created_at            TEXT NOT NULL,
  updated_at            TEXT NOT NULL
);
```

### Enums (constants/)

**`constants/vehicleTypes.ts`**
```typescript
export const VEHICLE_TYPES = ['car', 'motorcycle', 'scooter', 'van', 'campervan', 'truck', 'quad', 'other'] as const
export const FUEL_TYPES = ['petrol', 'diesel', 'hybrid', 'electric', 'hydrogen', 'lpg', 'other'] as const
```

**`constants/maintenanceTypes.ts`**
```typescript
export const MAINTENANCE_TYPES = [
  'oil_change', 'tire_change', 'timing_belt', 'brake_pads', 'brake_discs',
  'air_filter', 'cabin_filter', 'fuel_filter', 'spark_plugs', 'battery',
  'coolant', 'brake_fluid', 'technical_inspection', 'general_revision', 'other',
] as const
```

**`constants/alertTypes.ts`**
```typescript
export const CALENDAR_ALERT_TYPES = [
  'technical_inspection', 'insurance', 'registration', 'crit_air', 'driving_license', 'other',
] as const
```

### Guide pour les Agents d'Implémentation

- Suivre toutes les décisions architecturales exactement telles que documentées
- Utiliser les patterns d'implémentation de façon cohérente
- Respecter la structure de projet et les frontières
- SQLite en premier, Supabase en second (jamais d'écriture directe)
- Toujours retourner `Result<T>` pour les opérations async
- IDs en UUID générés côté client
