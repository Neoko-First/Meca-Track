# Story 1.4 : Ajouter un véhicule

Status: review

## Story

As a utilisateur,
I want ajouter un véhicule avec tous ses détails (type, marque, modèle, année, carburant, immatriculation, kilométrage actuel),
so that l'app connaît mon véhicule et peut calculer ses échéances.

## Acceptance Criteria

**Given** l'utilisateur est sur l'écran d'ajout de véhicule
**When** il renseigne le type (obligatoire), le kilométrage actuel (obligatoire) et valide
**Then** le véhicule est sauvegardé en SQLite avec un UUID généré côté client
**And** il apparaît dans la liste des véhicules (/(tabs)/index.tsx)

**Given** l'utilisateur saisit un kilométrage invalide (négatif ou non-numérique)
**When** il tente de valider
**Then** la validation bloque la sauvegarde et affiche un message d'erreur

**Given** l'utilisateur remplit les champs optionnels (marque, modèle, immatriculation...)
**When** il valide
**Then** toutes les informations sont persistées correctement dans la table `vehicles`

## Tasks / Subtasks

- [x] Task 1 — Fonction createVehicle dans lib/db/vehicles.ts
- [x] Task 2 — Écran app/vehicle/new.tsx fonctionnel
- [x] Task 3 — Tests createVehicle

## Dev Agent Record

### Agent Model Used
claude-sonnet-4-6

### Completion Notes List

### File List

### Change Log

| Date | Change |
|---|---|
| 2026-04-21 | Story créée et implémentée |
