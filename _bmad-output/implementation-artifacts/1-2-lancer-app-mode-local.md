# Story 1.2 : Lancer l'app en mode local (sans compte)

Status: review

## Story

As a utilisateur,
I want lancer l'app et l'utiliser sans créer de compte,
so that je peux commencer à suivre mes véhicules immédiatement sans friction.

## Acceptance Criteria

**Given** l'app est lancée pour la première fois (aucun mode choisi)
**When** l'écran de bienvenue s'affiche
**Then** l'utilisateur voit deux options : "Continuer sans compte" et "Créer un compte"

**Given** l'utilisateur appuie sur "Continuer sans compte"
**When** le choix est confirmé
**Then** le mode local est persisté via `expo-secure-store`
**And** l'utilisateur est redirigé vers l'écran principal `/(tabs)` (liste de véhicules vide)

**Given** l'app a déjà été ouverte en mode local
**When** l'utilisateur ferme et relance l'app
**Then** il est directement redirigé vers `/(tabs)` sans revoir l'écran de bienvenue

**Given** l'app est lancée pour la première fois
**When** l'utilisateur appuie sur "Créer un compte"
**Then** il est redirigé vers `/(auth)/login` (placeholder Story 1.3)

**Given** l'app est en mode local et aucun véhicule n'existe
**When** l'écran principal `/(tabs)/index.tsx` s'affiche
**Then** un état vide explicite est affiché ("Aucun véhicule — Ajouter mon premier véhicule")

**Given** l'app a été utilisée en mode local
**When** l'utilisateur ferme et relance l'app
**Then** toutes les données SQLite locales sont accessibles sans connexion internet

## Tasks / Subtasks

- [x] Task 1 — Créer le store d'authentification Zustand (AC: 2, 3)
  - [x] 1.1 Créer `lib/store/authStore.ts` avec Zustand : state `mode: 'local' | 'authenticated' | null`, `userId: string | null`
  - [x] 1.2 Implémenter `continueLocally()` : persiste `mode = 'local'` dans `expo-secure-store`, met à jour le store
  - [x] 1.3 Implémenter `loadAuthState()` : lit `expo-secure-store` au démarrage, hydrate le store
  - [x] 1.4 Implémenter `logout()` : supprime la clé `expo-secure-store`, remet `mode = null`

- [x] Task 2 — Créer l'écran de bienvenue (AC: 1, 2, 4)
  - [x] 2.1 Créer `app/welcome.tsx` avec les deux boutons : "Continuer sans compte" et "Créer un compte"
  - [x] 2.2 Bouton "Continuer sans compte" → appelle `continueLocally()` puis `router.replace('/(tabs)')`
  - [x] 2.3 Bouton "Créer un compte" → `router.push('/(auth)/login')`
  - [x] 2.4 Ajouter `<Stack.Screen name="welcome" options={{ headerShown: false }} />` dans `app/_layout.tsx`

- [x] Task 3 — Implémenter le auth gate dans `_layout.tsx` (AC: 3, 6)
  - [x] 3.1 Appeler `loadAuthState()` après `initDatabase()` dans le `useEffect` de `_layout.tsx`
  - [x] 3.2 Après DB prête + auth chargé : si `mode === null` → `router.replace('/welcome')`, sinon → `router.replace('/(tabs)')`
  - [x] 3.3 Gérer l'état de chargement pendant la lecture de `expo-secure-store` (spinner existant suffit)

- [x] Task 4 — Mettre à jour l'écran principal avec l'état vide (AC: 5)
  - [x] 4.1 Mettre à jour `app/(tabs)/index.tsx` : lire la liste des véhicules depuis SQLite (via `lib/db/vehicles.ts`)
  - [x] 4.2 Si aucun véhicule : afficher un état vide avec message et bouton "Ajouter mon premier véhicule" (→ `app/vehicle/new.tsx`)
  - [x] 4.3 Créer `lib/db/vehicles.ts` avec la fonction `getVehicles(): Promise<Result<Vehicle[]>>`

- [x] Task 5 — Tests (AC: tous)
  - [x] 5.1 Créer `__tests__/authStore.test.ts` : tester `continueLocally()`, `loadAuthState()`, `logout()`
  - [x] 5.2 Mocker `expo-secure-store` dans les tests (jest.mock)
  - [x] 5.3 Créer `__tests__/vehicles.db.test.ts` : tester `getVehicles()` retourne un tableau vide sur DB fraîche

## Dev Notes

### Contexte hérité de Story 1.1

**Ce qui existe déjà — NE PAS recréer :**
- `lib/db/migrations.ts` → `initDatabase()` : initialise les 7 tables SQLite au démarrage (déjà intégré dans `app/_layout.tsx`)
- `lib/db/schema.ts` → `getDatabase()`, `CREATE_TABLES_SQL`, `TABLE_NAMES`
- `types/index.ts` → `Vehicle`, `UserSettings`, `Result<T>`, tous les types
- `constants/vehicleTypes.ts`, `constants/maintenanceTypes.ts`, `constants/alertTypes.ts`
- `app/(auth)/login.tsx` → placeholder existant (ne pas modifier le contenu, juste naviguer vers lui)
- `app/(tabs)/index.tsx` → placeholder existant (à enrichir Task 4)
- `app/_layout.tsx` → déjà opérationnel (modifier uniquement pour ajouter auth gate)

**Fichiers créés en Story 1.1 (ne pas recréer, utiliser) :**
```
lib/db/schema.ts       ← TABLE_NAMES.VEHICLES, getDatabase()
lib/db/migrations.ts   ← initDatabase(), getDatabase()
types/index.ts         ← Vehicle, Result<T>
```

**Note critique Story 1.1 :** `--legacy-peer-deps` requis lors des `npm install` (react-native-reanimated@4.2.2). Utiliser cette flag si besoin.

### Architecture — fichiers à créer

```
lib/
  store/
    authStore.ts      ← CRÉER (Zustand + expo-secure-store)
  db/
    vehicles.ts       ← CRÉER (requêtes SQLite véhicules)

app/
  welcome.tsx         ← CRÉER (écran de bienvenue)
  _layout.tsx         ← MODIFIER (auth gate + loadAuthState)
  (tabs)/
    index.tsx         ← MODIFIER (état vide)

__tests__/
  authStore.test.ts   ← CRÉER
  vehicles.db.test.ts ← CRÉER
```

### authStore.ts — implémentation requise

```typescript
// lib/store/authStore.ts
import { create } from 'zustand'
import * as SecureStore from 'expo-secure-store'

const AUTH_MODE_KEY = 'auth_mode'
const USER_ID_KEY = 'user_id'

interface AuthState {
  mode: 'local' | 'authenticated' | null
  userId: string | null
  isLoading: boolean
  loadAuthState: () => Promise<void>
  continueLocally: () => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  mode: null,
  userId: null,
  isLoading: true,

  loadAuthState: async () => {
    const mode = await SecureStore.getItemAsync(AUTH_MODE_KEY)
    const userId = await SecureStore.getItemAsync(USER_ID_KEY)
    set({
      mode: (mode as 'local' | 'authenticated' | null) ?? null,
      userId: userId ?? null,
      isLoading: false,
    })
  },

  continueLocally: async () => {
    await SecureStore.setItemAsync(AUTH_MODE_KEY, 'local')
    set({ mode: 'local', userId: null })
  },

  logout: async () => {
    await SecureStore.deleteItemAsync(AUTH_MODE_KEY)
    await SecureStore.deleteItemAsync(USER_ID_KEY)
    set({ mode: null, userId: null })
  },
}))
```

### _layout.tsx — auth gate à ajouter

Modifier le `useEffect` existant pour :
1. Initialiser la DB (déjà fait)
2. Charger l'état auth depuis `expo-secure-store`
3. Rediriger selon le mode

```typescript
// Dans _layout.tsx — après les imports existants :
import { useRouter } from 'expo-router'
import { useAuthStore } from '../lib/store/authStore'

// Dans le composant :
const { loadAuthState, mode, isLoading: authLoading } = useAuthStore()
const router = useRouter()

useEffect(() => {
  initDatabase().then(({ data, error }) => {
    if (error) {
      setDbError(error)
      return
    }
    loadAuthState() // charge expo-secure-store async
    setDbReady(true)
  })
}, [])

useEffect(() => {
  if (!dbReady || authLoading) return
  if (mode === null) {
    router.replace('/welcome')
  } else {
    router.replace('/(tabs)')
  }
}, [dbReady, authLoading, mode])
```

Ajouter dans le `Stack` :
```tsx
<Stack.Screen name="welcome" options={{ headerShown: false }} />
```

### vehicles.ts — getVehicles requise

```typescript
// lib/db/vehicles.ts
import { getDatabase } from './migrations'
import type { Result, Vehicle } from '../../types'

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
```

### welcome.tsx — structure requise

```tsx
// app/welcome.tsx
import { View, Text, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuthStore } from '../lib/store/authStore'

export default function WelcomeScreen() {
  const router = useRouter()
  const { continueLocally } = useAuthStore()

  const handleLocal = async () => {
    await continueLocally()
    router.replace('/(tabs)')
  }

  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-3xl font-bold text-gray-900 mb-2">meca-track</Text>
      <Text className="text-gray-500 text-center mb-12">
        Suivez l'entretien de vos véhicules, sans prise de tête.
      </Text>
      <TouchableOpacity
        className="w-full bg-blue-600 py-4 rounded-xl mb-4"
        onPress={handleLocal}
      >
        <Text className="text-white text-center font-semibold text-lg">
          Continuer sans compte
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="w-full border border-gray-300 py-4 rounded-xl"
        onPress={() => router.push('/(auth)/login')}
      >
        <Text className="text-gray-700 text-center font-semibold text-lg">
          Créer un compte
        </Text>
      </TouchableOpacity>
    </View>
  )
}
```

### (tabs)/index.tsx — état vide requis

```tsx
// app/(tabs)/index.tsx
import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { getVehicles } from '../../lib/db/vehicles'
import type { Vehicle } from '../../types'

export default function HomeScreen() {
  const router = useRouter()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])

  useEffect(() => {
    getVehicles().then(({ data }) => {
      if (data) setVehicles(data)
    })
  }, [])

  if (vehicles.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-xl font-semibold text-gray-800 mb-2">
          Aucun véhicule
        </Text>
        <Text className="text-gray-500 text-center mb-8">
          Ajoutez votre premier véhicule pour commencer le suivi.
        </Text>
        <TouchableOpacity
          className="bg-blue-600 px-6 py-3 rounded-xl"
          onPress={() => router.push('/vehicle/new')}
        >
          <Text className="text-white font-semibold">
            Ajouter mon premier véhicule
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <FlatList
      data={vehicles}
      keyExtractor={(v) => v.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          className="p-4 border-b border-gray-100"
          onPress={() => router.push(`/vehicle/${item.id}`)}
        >
          <Text className="text-lg font-medium text-gray-900">{item.name}</Text>
          <Text className="text-gray-500">{item.current_mileage} km</Text>
        </TouchableOpacity>
      )}
    />
  )
}
```

### Règles obligatoires (à respecter impérativement)

- ✅ `Result<T>` pour TOUTES les opérations async (pas de try/catch inline dans les composants)
- ✅ SQLite via `getDatabase()` de `lib/db/migrations.ts` — ne pas ouvrir une nouvelle connexion
- ✅ `snake_case` pour les colonnes SQLite (déjà défini dans `schema.ts`)
- ✅ Dates ISO 8601 via `new Date().toISOString()`
- ✅ IDs UUID côté client (pas utilisé dans cette story)
- ✅ NativeWind classes Tailwind — pas de `StyleSheet.create()`
- ✅ `expo-secure-store` pour la persistence du choix d'auth (PAS AsyncStorage)

### Tests — guide d'implémentation

**Mock expo-secure-store dans Jest :**
```typescript
// Au top du fichier test
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}))
```

**Structure test authStore :**
- Tester `loadAuthState()` quand aucune clé en store → `mode === null`
- Tester `loadAuthState()` quand clé `auth_mode = 'local'` → `mode === 'local'`
- Tester `continueLocally()` → appelle `setItemAsync('auth_mode', 'local')`
- Tester `logout()` → appelle `deleteItemAsync` pour les deux clés

**Note tests Story 1.1 (à ne pas casser) :**
- `__tests__/schema.test.ts` — 22 tests passent, ne pas modifier `lib/db/schema.ts`
- `__tests__/types.test.ts` — tests de compilation TypeScript

### Anti-patterns à éviter

- ❌ Ne PAS utiliser `AsyncStorage` — utiliser `expo-secure-store`
- ❌ Ne PAS recréer `openDatabaseSync('meca-track.db')` — utiliser `getDatabase()` de `migrations.ts`
- ❌ Ne PAS modifier `lib/db/schema.ts` ni `lib/db/migrations.ts`
- ❌ Ne PAS ajouter de logique Supabase dans cette story (Story 1.3)
- ❌ Ne PAS implémenter le formulaire véhicule (Story 1.4) — `vehicle/new.tsx` reste placeholder

### Références

- Architecture : `_bmad-output/planning-artifacts/architecture.md#Authentification & Sécurité`
- Architecture : `_bmad-output/planning-artifacts/architecture.md#Architecture Frontend`
- Architecture : `_bmad-output/planning-artifacts/architecture.md#Structure du Projet`
- Story 1.1 : `_bmad-output/implementation-artifacts/1-1-initialisation-projet.md#Dev Notes`
- Epics : `_bmad-output/planning-artifacts/epics.md#Story 1.2`

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

- Erreur pré-existante `types.test.ts:59` (TS2339 `never`) héritée de Story 1.1, non introduite par cette story — aucune régression sur les tests Jest (29/29 verts)

### Completion Notes List

- `authStore.ts` créé avec Zustand v5 : 3 actions async (`loadAuthState`, `continueLocally`, `logout`) + état `isLoading` pour gate UI
- Auth gate en 3 `useEffect` dans `_layout.tsx` : init DB → load auth → redirect (pattern séquentiel safe)
- `welcome.tsx` : spinner pendant `continueLocally()` pour éviter les doubles appuis
- `lib/db/vehicles.ts` : `getVehicles()` retourne `Result<Vehicle[]>` avec `getAllSync` de la connexion partagée
- `(tabs)/index.tsx` : gestion des 3 états (chargement / vide / liste) avec FlatList
- Suite de tests : 4 nouveaux tests authStore + 3 nouveaux tests vehicles.db — 29 tests au total, 0 régression

### File List

- `lib/store/authStore.ts`
- `lib/db/vehicles.ts`
- `app/welcome.tsx`
- `app/_layout.tsx`
- `app/(tabs)/index.tsx`
- `__tests__/authStore.test.ts`
- `__tests__/vehicles.db.test.ts`

## Change Log

| Date | Change |
|---|---|
| 2026-04-21 | Story créée — mode local sans compte |
| 2026-04-21 | Story implémentée — authStore, welcome screen, auth gate, état vide véhicules |
