---
stepsCompleted: ['step-01', 'step-02', 'step-03', 'step-04']
inputDocuments: ['_bmad-output/planning-artifacts/prd.md', '_bmad-output/planning-artifacts/architecture.md', '_bmad-output/brainstorming/brainstorming-session-2026-03-16-1000.md']
---

# meca-track - Epic Breakdown

## Overview

Ce document présente la décomposition complète en épics et stories pour meca-track, en partant des exigences du PRD, de l'Architecture et du Brainstorming.

## Requirements Inventory

### Functional Requirements

| # | Exigence |
|---|---|
| FR1 | Gestion des véhicules (CRUD : création, modification, suppression) |
| FR2 | Profil véhicule détaillé (type, marque, modèle, année, carburant, immatriculation, kilométrage actuel) |
| FR3 | Suivi du kilométrage courant du véhicule |
| FR4 | Enregistrement des mises à jour kilométriques (manuelle, depuis plein carburant, depuis entretien) |
| FR5 | Gestion des enregistrements d'entretien (ajout, modification, historique) |
| FR6 | Base de données d'intervalles de référence (marque/modèle → intervalles recommandés pré-remplis) |
| FR7 | Système de notifications adaptatif (modes : intelligent / journalier / hebdomadaire / mensuel) |
| FR8 | Estimation temporelle des alertes kilométriques (km/semaine → date estimée) |
| FR9 | Timeline unifiée des événements à venir (km + date sur la même vue) |
| FR10 | Alertes calendaires (contrôle technique, assurance, vignette Crit'Air, permis, etc.) |
| FR11 | Module Carburant rapide (saisie en < 3 secondes) |
| FR12 | Coût associé à chaque entretien (champ prix optionnel) |
| FR13 | Authentification utilisateur (email + mot de passe, ou usage local sans compte) |
| FR14 | Fonctionnement offline-first (SQLite local comme source de vérité) |
| FR15 | Synchronisation cloud optionnelle (Supabase) |
| FR16 | Calcul automatique du coût au kilomètre (€/km sur période donnée) |
| FR17 | Vue d'accueil configurable (globale tous véhicules / centrée sur un véhicule) |
| FR18 | Score de santé du véhicule (indicateur visuel basé sur entretiens en retard / alertes proches) |
| FR19 | Accueil orienté "à venir" (prochaines échéances en avant-plan, pas l'historique) |

### NonFunctional Requirements

| # | Exigence |
|---|---|
| NFR1 | Offline-first : l'app fonctionne intégralement sans connexion internet |
| NFR2 | Saisie carburant en ≤ 3 secondes (friction minimale) |
| NFR3 | Stockage texte/chiffres uniquement (pas de fichiers, photos, PDF) |
| NFR4 | Authentification minimaliste (pas de profil social, pas d'infos superflues) |
| NFR5 | Zéro fonctionnalité sociale (pas de partage, pas de comparaison, pas de communauté) |
| NFR6 | Cross-platform iOS + Android via React Native / Expo Managed |
| NFR7 | Scope MVP : 1 à 5 véhicules, usage personnel uniquement |
| NFR8 | Tests unitaires Jest uniquement (logique métier : estimateur km, coûts, notifications) |

### Additional Requirements

**Stack technique :**
- React Native + Expo Managed Workflow (`npx create-expo-app@latest meca-track --template tabs`)
- Expo Router v3 (file-based routing)
- expo-sqlite v14 (base locale, offline-first)
- Supabase (PostgreSQL + Auth, sync optionnel)
- Zustand + TanStack Query (state management)
- NativeWind (Tailwind CSS pour RN)
- expo-notifications + expo-background-fetch + expo-task-manager
- expo-secure-store (stockage token local)
- EAS Build (build cloud)

**Patterns :**
- `Result<T>` pour la gestion d'erreurs
- UUID générés côté client (support offline)
- Last-write-wins pour la résolution de conflits (usage mono-utilisateur)
- Algorithme adaptatif : moyenne glissante km/semaine pour estimer dates d'alertes
- Organisation par feature (feature-based file structure)

**Schéma SQLite (7 tables) :**
`vehicles`, `maintenance_records`, `fuel_records`, `mileage_updates`, `calendar_alerts`, `sync_queue`, `user_settings`

### UX Design Requirements

_Pas de UX Design formel produit — exigences UX issues du brainstorming :_
- Onboarding progressif (démarrage minimal, enrichissement organique)
- Vue principale orientée "à venir" (assistant préventif, pas carnet de bord)
- Accueil configurable (global ou par véhicule)
- Score de santé visuel (un coup d'œil suffit)
- Saisie carburant ultra-rapide (type pré-rempli depuis fiche véhicule)

### FR Coverage Map

| FR | Épic | Description courte |
|---|---|---|
| FR1 | Epic 1 | CRUD véhicules |
| FR2 | Epic 1 | Profil véhicule détaillé |
| FR3 | Epic 1 | Kilométrage courant |
| FR4 | Epic 1 | Mises à jour kilométriques |
| FR13 | Epic 1 | Authentification |
| FR14 | Epic 1 | Offline-first SQLite |
| FR5 | Epic 2 | Enregistrements d'entretien |
| FR6 | Epic 2 | Intervalles de référence |
| FR9 | Epic 2 | Timeline unifiée |
| FR12 | Epic 2 | Coût par entretien |
| FR7 | Epic 3 | Notifications adaptatives |
| FR8 | Epic 3 | Estimation km → date |
| FR10 | Epic 3 | Alertes calendaires |
| FR11 | Epic 4 | Module carburant rapide |
| FR16 | Epic 4 | Coût au kilomètre €/km |
| FR17 | Epic 5 | Accueil configurable |
| FR18 | Epic 5 | Score de santé |
| FR19 | Epic 5 | Accueil orienté "à venir" |
| FR15 | Epic 6 | Synchronisation cloud |

## Epic List

### Epic 1 : Fondation — Démarrer & gérer ses véhicules
L'utilisateur peut lancer l'app, créer un compte (ou l'utiliser localement), ajouter ses véhicules avec tous leurs détails, et mettre à jour le kilométrage. L'infrastructure offline-first est opérationnelle.
**FRs couverts :** FR1, FR2, FR3, FR4, FR13, FR14

### Epic 2 : Entretiens — Enregistrer et planifier la maintenance
L'utilisateur peut enregistrer tous ses entretiens, les coûts associés, consulter son historique, et voir les prochaines échéances grâce aux intervalles de référence et à la timeline unifiée.
**FRs couverts :** FR5, FR6, FR9, FR12

### Epic 3 : Alertes — Ne plus jamais oublier
L'app envoie des rappels proactifs et adaptatifs. L'utilisateur configure ses préférences de notifications, reçoit des estimations de dates pour ses échéances kilométriques, et gère ses alertes calendaires.
**FRs couverts :** FR7, FR8, FR10

### Epic 4 : Coûts — Comprendre ses dépenses
L'utilisateur peut saisir ses pleins en 3 secondes, consulter un tableau de bord des dépenses (entretien + carburant), et voir le coût réel au kilomètre de chaque véhicule.
**FRs couverts :** FR11, FR16

### Epic 5 : Tableau de bord — Vue globale et santé véhicule
L'utilisateur dispose d'un accueil configuré à son profil (global ou par véhicule), orienté sur les prochaines échéances, avec un score de santé visuel pour chaque véhicule.
**FRs couverts :** FR17, FR18, FR19

### Epic 6 : Cloud — Synchronisation inter-appareils (optionnelle)
L'utilisateur peut créer un compte Supabase et synchroniser ses données entre ses appareils. La sync est non-bloquante : l'app reste 100% fonctionnelle sans elle.
**FRs couverts :** FR15

## Epic 1 : Fondation — Démarrer & gérer ses véhicules

L'utilisateur peut lancer l'app, créer un compte (ou l'utiliser localement), ajouter ses véhicules avec tous leurs détails, et mettre à jour le kilométrage. L'infrastructure offline-first est opérationnelle.

### Story 1.1 : Initialisation du projet depuis le template Expo

As a développeur,
I want initialiser le projet meca-track depuis le template Expo Tabs, configurer les dépendances et mettre en place la base SQLite locale,
So that l'app peut être lancée sur iOS et Android avec toute l'infrastructure technique en place.

**Acceptance Criteria:**

**Given** le projet est initialisé avec `npx create-expo-app@latest meca-track --template tabs`
**When** toutes les dépendances sont installées (expo-sqlite, zustand, nativewind, expo-router, expo-notifications, expo-secure-store, supabase-js, tanstack-query)
**Then** l'app démarre sans erreur sur iOS et Android via Expo Go

**Given** l'app démarre pour la première fois
**When** le module SQLite s'initialise
**Then** les 7 tables sont créées : `vehicles`, `maintenance_records`, `fuel_records`, `mileage_updates`, `calendar_alerts`, `sync_queue`, `user_settings`
**And** un enregistrement par défaut est inséré dans `user_settings` avec les valeurs par défaut (`notification_mode: intelligent`, `home_view: global`)

**Given** la structure de fichiers est en place
**When** le projet est ouvert
**Then** l'organisation feature-based est respectée : `app/`, `components/`, `lib/db/`, `lib/sync/`, `lib/notifications/`, `lib/store/`, `hooks/`, `constants/`, `types/`, `__tests__/`
**And** les constantes d'enum sont définies dans `constants/` (vehicleTypes, maintenanceTypes, alertTypes)

### Story 1.2 : Lancer l'app en mode local (sans compte)

As a utilisateur,
I want lancer l'app et l'utiliser sans créer de compte,
So that je peux commencer à suivre mes véhicules immédiatement sans friction.

**Acceptance Criteria:**

**Given** l'app est lancée pour la première fois
**When** l'utilisateur choisit "Continuer sans compte"
**Then** l'app initialise la base SQLite locale (7 tables)
**And** l'utilisateur est redirigé vers l'écran principal vide (aucun véhicule)

**Given** l'app a été utilisée en mode local
**When** l'utilisateur ferme et relance l'app
**Then** toutes les données locales sont persistées et accessibles sans connexion internet

### Story 1.3 : Créer un compte et se connecter

As a utilisateur,
I want créer un compte avec email + mot de passe et me connecter,
So that mes données pourront être synchronisées entre mes appareils.

**Acceptance Criteria:**

**Given** l'utilisateur est sur l'écran d'accueil (non connecté)
**When** il saisit un email valide et un mot de passe (min. 8 caractères) et soumet
**Then** un compte est créé via Supabase Auth et l'utilisateur est connecté
**And** le token de session est stocké localement via expo-secure-store

**Given** l'utilisateur a un compte existant
**When** il saisit ses identifiants et valide
**Then** il est authentifié et accède à l'écran principal

**Given** l'utilisateur soumet des identifiants incorrects
**When** la réponse serveur indique une erreur
**Then** un message d'erreur clair est affiché sans planter l'app (pattern Result\<T\>)

### Story 1.4 : Ajouter un véhicule

As a utilisateur,
I want ajouter un véhicule avec tous ses détails (type, marque, modèle, année, carburant, immatriculation, kilométrage actuel),
So that l'app connaît mon véhicule et peut calculer ses échéances.

**Acceptance Criteria:**

**Given** l'utilisateur est sur l'écran d'ajout de véhicule
**When** il renseigne le type (obligatoire), le kilométrage actuel (obligatoire) et valide
**Then** le véhicule est sauvegardé en SQLite avec un UUID généré côté client
**And** il apparaît dans la liste des véhicules

**Given** l'utilisateur saisit un kilométrage invalide (négatif ou non-numérique)
**When** il tente de valider
**Then** la validation bloque la sauvegarde et affiche un message d'erreur

**Given** l'utilisateur remplit les champs optionnels (marque, modèle, immatriculation...)
**When** il valide
**Then** toutes les informations sont persistées correctement dans la table `vehicles`

### Story 1.5 : Modifier et supprimer un véhicule

As a utilisateur,
I want modifier les informations de mon véhicule ou le supprimer,
So that mes données restent exactes si je me trompe ou si je change de véhicule.

**Acceptance Criteria:**

**Given** l'utilisateur est sur la fiche d'un véhicule
**When** il modifie un ou plusieurs champs et sauvegarde
**Then** les modifications sont persistées en SQLite et visibles immédiatement

**Given** l'utilisateur demande la suppression d'un véhicule
**When** il confirme la suppression dans la modale de confirmation
**Then** le véhicule et toutes ses données associées (entretiens, pleins, alertes) sont supprimés

**Given** l'utilisateur annule la suppression
**When** il appuie sur "Annuler"
**Then** aucune donnée n'est supprimée et il reste sur la fiche véhicule

### Story 1.6 : Mettre à jour le kilométrage manuellement

As a utilisateur,
I want saisir le kilométrage actuel de mon véhicule à tout moment,
So that l'app peut calculer avec précision quand les prochaines échéances arrivent.

**Acceptance Criteria:**

**Given** l'utilisateur est sur la fiche d'un véhicule
**When** il saisit un nouveau kilométrage (supérieur à l'actuel) et valide
**Then** le champ `current_mileage` du véhicule est mis à jour
**And** un enregistrement est ajouté dans `mileage_updates` avec `source: manual`

**Given** l'utilisateur saisit un kilométrage inférieur au kilométrage actuel
**When** il tente de valider
**Then** un avertissement est affiché ("Kilométrage inférieur au précédent — confirmer ?")
**And** si confirmation : la mise à jour est enregistrée ; sinon : annulée

## Epic 2 : Entretiens — Enregistrer et planifier la maintenance

L'utilisateur peut enregistrer tous ses entretiens, les coûts associés, consulter son historique, et voir les prochaines échéances grâce aux intervalles de référence et à la timeline unifiée.

### Story 2.1 : Enregistrer un entretien

As a utilisateur,
I want enregistrer un entretien effectué sur mon véhicule (type, kilométrage, date, coût optionnel),
So that j'ai un historique complet de ce qui a été fait et quand.

**Acceptance Criteria:**

**Given** l'utilisateur est sur l'écran d'ajout d'entretien pour un véhicule
**When** il sélectionne un type d'entretien (depuis l'enum), saisit le kilométrage et la date, et valide
**Then** l'entretien est sauvegardé dans `maintenance_records` avec un UUID généré côté client
**And** le kilométrage du véhicule est mis à jour si supérieur au kilométrage courant
**And** un enregistrement est ajouté dans `mileage_updates` avec `source: maintenance`

**Given** l'utilisateur renseigne un coût (champ optionnel)
**When** il valide
**Then** le coût est persisté dans le champ `cost` de `maintenance_records`

**Given** l'utilisateur sélectionne le type "Autre"
**When** il valide
**Then** le champ `label` (texte libre) est requis

### Story 2.2 : Consulter et modifier l'historique des entretiens

As a utilisateur,
I want consulter la liste de tous les entretiens d'un véhicule et en modifier un si nécessaire,
So that je peux corriger une erreur de saisie ou vérifier ce qui a été fait.

**Acceptance Criteria:**

**Given** l'utilisateur est sur la fiche d'un véhicule
**When** il navigue vers l'onglet "Entretiens"
**Then** la liste de tous les entretiens enregistrés s'affiche, triée du plus récent au plus ancien

**Given** l'utilisateur appuie sur un entretien de la liste
**When** il modifie un ou plusieurs champs et sauvegarde
**Then** les modifications sont persistées en SQLite et reflétées immédiatement dans la liste

**Given** l'utilisateur supprime un entretien
**When** il confirme la suppression
**Then** l'enregistrement est supprimé de `maintenance_records`

### Story 2.3 : Définir la prochaine échéance d'un entretien

As a utilisateur,
I want renseigner la prochaine échéance lors de la saisie d'un entretien (kilométrage cible et/ou date cible),
So that l'app sait quand me rappeler de refaire cet entretien.

**Acceptance Criteria:**

**Given** l'utilisateur saisit un entretien
**When** il renseigne un `next_mileage` et/ou une `next_date` et valide
**Then** ces valeurs sont persistées dans `maintenance_records`
**And** l'échéance apparaît dans la timeline des événements à venir

**Given** l'utilisateur ne renseigne aucune prochaine échéance
**When** il valide
**Then** l'entretien est sauvegardé sans échéance (les champs `next_mileage` et `next_date` restent NULL)

### Story 2.4 : Intervalles de référence pré-remplis

As a utilisateur,
I want que l'app me suggère automatiquement la prochaine échéance selon le type d'entretien et le carburant du véhicule,
So que je n'ai pas à chercher moi-même les intervalles recommandés.

**Acceptance Criteria:**

**Given** l'utilisateur saisit un entretien de type "Révision générale" sur un véhicule essence
**When** le type d'entretien est sélectionné
**Then** le champ `next_mileage` est pré-rempli avec l'intervalle de référence (ex. : +10 000 km pour essence)
**And** l'utilisateur peut modifier cette valeur suggérée

**Given** l'utilisateur saisit un entretien de type "Révision générale" sur un véhicule diesel
**When** le type d'entretien est sélectionné
**Then** le champ `next_mileage` est pré-rempli avec l'intervalle diesel (ex. : +15 000 km)

**Given** aucun intervalle de référence n'existe pour le type sélectionné
**When** l'utilisateur sélectionne ce type
**Then** les champs `next_mileage` et `next_date` restent vides sans suggestion

### Story 2.5 : Timeline des événements à venir

As a utilisateur,
I want voir une timeline unifiée de toutes mes prochaines échéances (kilométriques et calendaires) pour un véhicule,
So that j'ai en un coup d'œil tout ce qui approche, sans jongler entre plusieurs vues.

**Acceptance Criteria:**

**Given** l'utilisateur a des entretiens avec `next_mileage` ou `next_date` renseignés
**When** il consulte la timeline d'un véhicule
**Then** toutes les échéances s'affichent triées par proximité (la plus proche en premier)
**And** les échéances kilométriques et calendaires apparaissent sur la même liste

**Given** une échéance kilométrique est affichée
**When** le kilométrage actuel du véhicule est connu
**Then** le delta km restant est affiché (ex. : "dans 1 200 km")

**Given** aucune échéance n'est définie pour le véhicule
**When** l'utilisateur consulte la timeline
**Then** un message "Aucune échéance planifiée" s'affiche

## Epic 3 : Alertes — Ne plus jamais oublier

L'app envoie des rappels proactifs et adaptatifs. L'utilisateur configure ses préférences de notifications, reçoit des estimations de dates pour ses échéances kilométriques, et gère ses alertes calendaires.

### Story 3.1 : Configurer les préférences de notifications

As a utilisateur,
I want choisir la fréquence à laquelle l'app me demande de mettre à jour mon kilométrage (mode intelligent / journalier / hebdomadaire / mensuel),
So that les rappels correspondent à mon rythme d'utilisation sans me spammer.

**Acceptance Criteria:**

**Given** l'utilisateur accède aux paramètres de notifications
**When** il sélectionne un mode parmi : intelligent, journalier, hebdomadaire, mensuel
**Then** la préférence est sauvegardée dans `user_settings.notification_mode`
**And** les notifications futures respectent ce mode

**Given** le mode "intelligent" est actif et l'app ne dispose pas encore d'un historique kilométrique suffisant
**When** l'app démarre le processus d'apprentissage
**Then** des notifications récurrentes quotidiennes sont envoyées pour calibrer le rythme km de l'utilisateur

### Story 3.2 : Notifications de rappel de kilométrage

As a utilisateur,
I want recevoir une notification me demandant de mettre à jour mon kilométrage selon ma fréquence choisie,
So que l'app garde un kilométrage précis pour calculer mes échéances.

**Acceptance Criteria:**

**Given** le mode de notification est configuré (ex. : hebdomadaire)
**When** la période définie est écoulée
**Then** une notification push est envoyée : "Mettez à jour le kilométrage de [véhicule]"
**And** appuyer sur la notification ouvre directement l'écran de mise à jour kilométrique

**Given** l'utilisateur a mis à jour son kilométrage aujourd'hui
**When** la notification devrait se déclencher
**Then** la notification est reportée à la prochaine période (pas de doublon)

### Story 3.3 : Estimation de date pour les échéances kilométriques

As a utilisateur,
I want voir une estimation de la date à laquelle j'atteindrai une échéance kilométrique,
So que "dans 3 000 km" devienne "dans environ 6 semaines" — concret et planifiable.

**Acceptance Criteria:**

**Given** l'utilisateur a au moins 2 mises à jour kilométriques enregistrées sur une période
**When** il consulte une échéance kilométrique dans la timeline
**Then** une estimation de date est affichée à côté du delta km (ex. : "dans 1 500 km — environ 3 semaines")
**And** l'estimation est calculée à partir de la moyenne glissante km/semaine stockée dans `user_settings.km_rhythm_data`

**Given** l'utilisateur n'a pas encore assez d'historique kilométrique
**When** il consulte une échéance kilométrique
**Then** seul le delta km est affiché, sans estimation de date

### Story 3.4 : Notifications d'échéance approchante

As a utilisateur,
I want recevoir une notification push quand une échéance d'entretien approche (seuil km ou date),
So que je sois prévenu à temps pour planifier l'entretien sans y penser moi-même.

**Acceptance Criteria:**

**Given** une échéance kilométrique est définie sur un entretien
**When** le kilométrage restant avant l'échéance passe sous le seuil d'alerte (ex. : 500 km)
**Then** une notification push est envoyée : "[Type entretien] approche dans ~500 km sur [véhicule]"

**Given** une échéance par date est définie sur un entretien
**When** la date d'échéance est dans 30 jours (ou moins)
**Then** une notification push est envoyée : "[Type entretien] prévu dans 30 jours"

**Given** l'utilisateur a déjà été notifié pour cette échéance
**When** l'échéance n'a pas encore été réalisée
**Then** aucune notification doublon n'est envoyée avant le prochain seuil

### Story 3.5 : Créer et gérer des alertes calendaires

As a utilisateur,
I want créer des alertes calendaires pour les échéances fixes de mon véhicule (contrôle technique, assurance, vignette Crit'Air...),
So que ces obligations administratives ne m'échappent pas non plus.

**Acceptance Criteria:**

**Given** l'utilisateur est sur la fiche d'un véhicule
**When** il ajoute une alerte calendaire (type, libellé, date d'échéance, délai de rappel en jours)
**Then** l'alerte est sauvegardée dans `calendar_alerts` et apparaît dans la timeline unifiée

**Given** la date d'une alerte calendaire approche (dans `reminder_days_before` jours)
**When** la vérification en arrière-plan s'exécute
**Then** une notification push est envoyée : "[Label] dans X jours — [véhicule]"

**Given** l'utilisateur consulte la liste des alertes calendaires
**When** il désactive ou supprime une alerte
**Then** `is_active` est mis à 0 (désactivation) ou l'enregistrement est supprimé (suppression), sans notification future

## Epic 4 : Coûts — Comprendre ses dépenses

L'utilisateur peut saisir ses pleins en 3 secondes, consulter un tableau de bord des dépenses (entretien + carburant), et voir le coût réel au kilomètre de chaque véhicule.

### Story 4.1 : Enregistrer un plein de carburant

As a utilisateur,
I want enregistrer un plein de carburant en moins de 3 secondes,
So que je peux le faire directement à la station sans perdre de temps.

**Acceptance Criteria:**

**Given** l'utilisateur ouvre le module carburant
**When** l'écran s'affiche
**Then** le type de carburant est pré-rempli depuis la fiche véhicule (zéro ressaisie)
**And** seuls deux champs sont requis : coût total et kilométrage actuel (optionnel)

**Given** l'utilisateur saisit le coût total et valide
**When** la saisie est confirmée
**Then** le plein est sauvegardé dans `fuel_records` avec un UUID généré côté client
**And** si un kilométrage est saisi, `vehicles.current_mileage` est mis à jour et un enregistrement `mileage_updates` avec `source: fuel_fill` est créé

**Given** l'utilisateur possède plusieurs véhicules
**When** il ouvre le module carburant
**Then** le véhicule actif (ou le dernier utilisé) est présélectionné, avec possibilité de changer

### Story 4.2 : Consulter et modifier l'historique carburant

As a utilisateur,
I want consulter l'historique de mes pleins pour un véhicule et corriger une saisie si nécessaire,
So que mes données de coût carburant restent exactes.

**Acceptance Criteria:**

**Given** l'utilisateur est sur la fiche d'un véhicule
**When** il navigue vers l'onglet "Carburant"
**Then** la liste de tous les pleins s'affiche, triée du plus récent au plus ancien
**And** chaque entrée affiche la date et le coût

**Given** l'utilisateur appuie sur un plein de la liste
**When** il modifie le coût ou le kilométrage et sauvegarde
**Then** les modifications sont persistées en SQLite

**Given** l'utilisateur supprime un plein
**When** il confirme la suppression
**Then** l'enregistrement est supprimé de `fuel_records`

### Story 4.3 : Tableau de bord des coûts

As a utilisateur,
I want consulter un tableau de bord consolidant toutes mes dépenses (entretiens + carburant) par véhicule et par période,
So que je comprenne le vrai coût de possession de chaque véhicule.

**Acceptance Criteria:**

**Given** l'utilisateur navigue vers l'écran "Coûts"
**When** l'écran s'affiche
**Then** le total des dépenses (entretiens + carburant) est affiché pour la période courante (mois par défaut)
**And** les dépenses sont ventilées par catégorie (entretien vs carburant)

**Given** l'utilisateur sélectionne un filtre de période (mois courant / année courante / tout)
**When** il change la période
**Then** les totaux se recalculent et s'affichent immédiatement

**Given** l'utilisateur possède plusieurs véhicules
**When** il consulte le tableau de bord
**Then** il peut filtrer par véhicule ou voir le total tous véhicules confondus

### Story 4.4 : Coût au kilomètre

As a utilisateur,
I want voir le coût au kilomètre (€/km) de chaque véhicule sur une période donnée,
So que je puisse comparer le coût réel d'usage de mes véhicules.

**Acceptance Criteria:**

**Given** l'utilisateur consulte le tableau de bord des coûts d'un véhicule
**When** des données de kilométrage et de coûts sont disponibles sur la période sélectionnée
**Then** le coût au kilomètre est calculé : total dépenses ÷ km parcourus sur la période
**And** la valeur est affichée en €/km avec 2 décimales

**Given** le kilométrage parcouru sur la période est 0 ou inconnu
**When** le calcul est demandé
**Then** la métrique €/km n'est pas affichée (éviter la division par zéro)

## Epic 5 : Tableau de bord — Vue globale et santé véhicule

L'utilisateur dispose d'un accueil configuré à son profil (global ou par véhicule), orienté sur les prochaines échéances, avec un score de santé visuel pour chaque véhicule.

### Story 5.1 : Accueil orienté "à venir"

As a utilisateur,
I want que l'écran d'accueil affiche en priorité les prochaines échéances et alertes actives,
So que j'ouvre l'app pour savoir quoi faire, pas pour consulter le passé.

**Acceptance Criteria:**

**Given** l'utilisateur ouvre l'app
**When** l'écran d'accueil s'affiche
**Then** les prochaines échéances de tous ses véhicules sont listées, triées par urgence (la plus proche en premier)
**And** chaque élément indique le véhicule concerné, le type d'échéance, et le délai restant (km ou jours)

**Given** aucune échéance n'est définie pour aucun véhicule
**When** l'accueil s'affiche
**Then** un message d'invitation à ajouter des entretiens ou des alertes est affiché

**Given** une échéance est dépassée (kilométrage ou date)
**When** elle apparaît dans l'accueil
**Then** elle est mise en évidence visuellement (indicateur "en retard")

### Story 5.2 : Score de santé du véhicule

As a utilisateur,
I want voir un score de santé visuel pour chaque véhicule (jauge ou score 0-100),
So que d'un coup d'œil je sache si mon véhicule est "en bonne santé" sans lire une liste.

**Acceptance Criteria:**

**Given** l'utilisateur consulte la liste ou la fiche d'un véhicule
**When** l'écran s'affiche
**Then** un indicateur de santé (score 0-100 ou jauge couleur) est visible pour ce véhicule

**Given** aucun entretien n'est en retard et aucune alerte n'est dépassée
**When** le score est calculé
**Then** le score est élevé (zone verte)

**Given** un ou plusieurs entretiens sont en retard ou une alerte est dépassée
**When** le score est calculé
**Then** le score diminue proportionnellement au nombre et à l'ancienneté des retards (zone orange ou rouge)

**Given** aucune échéance n'a été définie pour le véhicule
**When** le score est affiché
**Then** un état neutre est affiché ("Aucune donnée") sans score arbitraire

### Story 5.3 : Vue d'accueil configurable (global vs par véhicule)

As a utilisateur,
I want choisir si mon accueil affiche tous mes véhicules ou se concentre sur un seul,
So que l'app s'adapte à ma réalité — que j'aie 1 voiture ou une flotte personnelle.

**Acceptance Criteria:**

**Given** l'utilisateur accède aux préférences d'affichage
**When** il sélectionne le mode "Global"
**Then** l'accueil affiche les échéances et alertes de tous ses véhicules confondus
**And** la préférence est sauvegardée dans `user_settings.home_view`

**Given** l'utilisateur sélectionne le mode "Par véhicule"
**When** il choisit le véhicule à afficher par défaut
**Then** l'accueil se concentre sur ce véhicule uniquement
**And** `user_settings.selected_vehicle_id` est mis à jour

**Given** l'utilisateur est en mode "Par véhicule" et supprime le véhicule sélectionné
**When** la suppression est confirmée
**Then** l'accueil bascule automatiquement en mode "Global"

## Epic 6 : Cloud — Synchronisation inter-appareils (optionnelle)

L'utilisateur peut créer un compte Supabase et synchroniser ses données entre ses appareils. La sync est non-bloquante : l'app reste 100% fonctionnelle sans elle.

### Story 6.1 : Synchroniser les données vers Supabase

As a utilisateur connecté,
I want que mes données locales soient synchronisées automatiquement vers Supabase quand je suis en ligne,
So que je ne perde pas mes données si je change d'appareil ou réinstalle l'app.

**Acceptance Criteria:**

**Given** l'utilisateur est connecté et une connexion internet est disponible
**When** une modification est effectuée localement (ajout, modification, suppression)
**Then** l'opération est ajoutée à la `sync_queue` avec le payload complet
**And** la sync_queue est dépilée et les opérations sont envoyées à Supabase

**Given** la connexion internet est indisponible au moment de la modification
**When** la connexion est rétablie
**Then** les opérations en attente dans `sync_queue` sont envoyées automatiquement

**Given** une opération de sync échoue (erreur réseau ou serveur)
**When** la tentative est enregistrée
**Then** le champ `attempts` est incrémenté dans `sync_queue` et une nouvelle tentative est planifiée

### Story 6.2 : Restaurer ses données sur un nouvel appareil

As a utilisateur connecté,
I want retrouver toutes mes données en me connectant sur un nouvel appareil,
So que je n'aie pas à tout ressaisir après une réinstallation ou un changement de téléphone.

**Acceptance Criteria:**

**Given** l'utilisateur se connecte sur un appareil vierge (base SQLite locale vide)
**When** l'authentification Supabase réussit
**Then** toutes ses données (véhicules, entretiens, pleins, alertes) sont téléchargées depuis Supabase et peuplent la base SQLite locale

**Given** des données locales existent déjà sur l'appareil au moment de la connexion
**When** la sync initiale s'exécute
**Then** la stratégie last-write-wins s'applique (l'enregistrement avec le `updated_at` le plus récent est conservé)

**Given** la restauration est en cours
**When** l'utilisateur interagit avec l'app
**Then** l'app reste utilisable (offline-first) et la restauration se fait en arrière-plan

### Story 6.3 : Dissocier son compte et passer en mode local

As a utilisateur connecté,
I want pouvoir me déconnecter et continuer à utiliser l'app en mode local,
So que je garde le contrôle de mes données sans être dépendant du cloud.

**Acceptance Criteria:**

**Given** l'utilisateur est connecté
**When** il se déconnecte depuis les paramètres
**Then** le token de session est supprimé de expo-secure-store
**And** les données locales SQLite sont conservées intactes

**Given** l'utilisateur est déconnecté
**When** il utilise l'app
**Then** toutes les fonctionnalités core restent disponibles (aucune fonctionnalité ne nécessite le cloud)
**And** aucune tentative de sync n'est effectuée
