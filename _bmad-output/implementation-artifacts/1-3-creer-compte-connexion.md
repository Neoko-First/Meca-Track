# Story 1.3 : Créer un compte et se connecter

Status: review

## Story

As a utilisateur,
I want créer un compte avec email + mot de passe et me connecter,
so that mes données pourront être synchronisées entre mes appareils.

## Acceptance Criteria

**Given** l'utilisateur est sur l'écran de connexion
**When** il saisit un email valide et un mot de passe (min. 8 caractères) et soumet
**Then** un compte est créé via Supabase Auth
**And** le token de session est géré par expo-secure-store (via le storage adapter Supabase)
**And** mode = 'authenticated' + userId persisté dans expo-secure-store

**Given** l'utilisateur a un compte existant
**When** il saisit ses identifiants et valide
**Then** il est authentifié et redirigé vers l'écran principal /(tabs)

**Given** l'utilisateur soumet des identifiants incorrects
**When** la réponse Supabase indique une erreur
**Then** un message d'erreur clair est affiché (pattern Result<T>)

**Given** le mot de passe est inférieur à 8 caractères
**When** l'utilisateur tente de soumettre
**Then** une erreur de validation s'affiche avant tout appel réseau

## Tasks / Subtasks

- [x] Task 1 — Créer le client Supabase
  - [x] 1.1 Créer `lib/sync/supabase.ts` avec client Supabase + ExpoSecureStoreAdapter
  - [x] 1.2 Créer `.env.example` avec EXPO_PUBLIC_SUPABASE_URL et EXPO_PUBLIC_SUPABASE_ANON_KEY

- [x] Task 2 — Étendre authStore avec signIn / signUp
  - [x] 2.1 Ajouter `signIn(email, password): Promise<Result<void>>` dans authStore
  - [x] 2.2 Ajouter `signUp(email, password): Promise<Result<void>>` dans authStore
  - [x] 2.3 Mettre à jour `logout()` pour appeler supabase.auth.signOut() si mode === 'authenticated'

- [x] Task 3 — Implémenter login.tsx et register.tsx
  - [x] 3.1 Implémenter `app/(auth)/login.tsx` (formulaire email + password + bouton connexion + lien register)
  - [x] 3.2 Implémenter `app/(auth)/register.tsx` (formulaire email + password + bouton créer compte + lien login)

- [x] Task 4 — Tests (signIn/signUp mockés)
  - [x] 4.1 Créer `__tests__/authStore.supabase.test.ts` avec mock de `lib/sync/supabase`
  - [x] 4.2 Tester signIn succès → mode 'authenticated', userId défini
  - [x] 4.3 Tester signIn erreur → Result<void> avec error non null
  - [x] 4.4 Tester signUp succès et validation mot de passe < 8 chars

## Dev Agent Record

### Agent Model Used
claude-sonnet-4-6

### Completion Notes List

### File List

### Change Log

| Date | Change |
|---|---|
| 2026-04-21 | Story créée et implémentée |
