# Story 1.6 : Mettre à jour le kilométrage manuellement

Status: review

## Story

As a utilisateur,
I want saisir le kilométrage actuel de mon véhicule à tout moment,
so that l'app peut calculer avec précision quand les prochaines échéances arrivent.

## Acceptance Criteria

**Given** l'utilisateur est sur la fiche d'un véhicule
**When** il saisit un nouveau kilométrage (supérieur à l'actuel) et valide
**Then** le champ `current_mileage` du véhicule est mis à jour
**And** un enregistrement est ajouté dans `mileage_updates` avec `source: manual`

**Given** l'utilisateur saisit un kilométrage inférieur au kilométrage actuel
**When** il tente de valider
**Then** un avertissement est affiché ("Kilométrage inférieur au précédent — confirmer ?")
**And** si confirmation : la mise à jour est enregistrée ; sinon : annulée

## Tasks / Subtasks

- [x] Task 1 — lib/db/mileage.ts avec recordMileageUpdate
- [x] Task 2 — Composant MileageUpdateModal dans components/vehicles/
- [x] Task 3 — Intégration dans app/vehicle/[id].tsx
- [x] Task 4 — Tests recordMileageUpdate

## Dev Agent Record

### Agent Model Used
claude-sonnet-4-6

### File List

### Change Log
| Date | Change |
|---|---|
| 2026-04-21 | Story créée et implémentée |
