# Story 1.5 : Modifier et supprimer un véhicule

Status: review

## Story

As a utilisateur,
I want modifier les informations de mon véhicule ou le supprimer,
so that mes données restent exactes si je me trompe ou si je change de véhicule.

## Acceptance Criteria

**Given** l'utilisateur est sur la fiche d'un véhicule
**When** il modifie un ou plusieurs champs et sauvegarde
**Then** les modifications sont persistées en SQLite et visibles immédiatement

**Given** l'utilisateur demande la suppression d'un véhicule
**When** il confirme la suppression dans la modale de confirmation
**Then** le véhicule et toutes ses données associées sont supprimés

**Given** l'utilisateur annule la suppression
**When** il appuie sur "Annuler"
**Then** aucune donnée n'est supprimée

## Tasks / Subtasks

- [x] Task 1 — updateVehicle + deleteVehicle dans lib/db/vehicles.ts
- [x] Task 2 — Écran app/vehicle/[id].tsx (fiche + édition + suppression)
- [x] Task 3 — Tests updateVehicle / deleteVehicle

## Dev Agent Record

### Agent Model Used
claude-sonnet-4-6

### File List

### Change Log
| Date | Change |
|---|---|
| 2026-04-21 | Story créée et implémentée |
