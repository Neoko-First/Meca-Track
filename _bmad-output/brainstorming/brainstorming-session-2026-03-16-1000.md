---
stepsCompleted: [1, 2, 3, 4]
inputDocuments: []
session_topic: 'Application native de suivi d''entretien et de coûts de véhicules'
session_goals: 'Définir les fonctionnalités clés, identifier les technologies à utiliser'
selected_approach: 'user-selected'
techniques_used: ['SCAMPER']
ideas_generated: [14]
context_file: ''
session_active: false
workflow_completed: true
---

# Session de Brainstorming — Résultats

**Facilitateur :** Alexandre
**Date :** 2026-03-16

---

## Vue d'ensemble de la session

**Sujet :** Application native de suivi d'entretien et de coûts de véhicules
**Objectifs :** Définir les fonctionnalités clés, identifier les technologies à utiliser
**Technique utilisée :** SCAMPER (Substituer, Combiner, Adapter, Modifier, Autres usages, Éliminer, Inverser)
**Total d'idées générées :** 14 fonctionnalités + 3 contraintes architecturales + 1 future feature

---

## Problème fondamental identifié

Une application de suivi de véhicule n'a pas accès au kilométrage en temps réel (contrairement aux systèmes embarqués). Le défi central est donc de **maintenir un kilométrage à jour** avec le minimum de friction, afin de calculer les prochaines échéances d'entretien avec précision.

---

## Inventaire complet des idées

### Thème 1 — Saisie & Suivi kilométrique

**[Fonctionnalité #1]** : Système de notifications adaptatif
_Concept_ : Phase d'apprentissage initiale avec notifications récurrentes pour calibrer le rythme kilométrique de l'utilisateur, puis bascule vers une logique intelligente. L'utilisateur choisit son mode : intelligent / journalier / hebdomadaire / mensuel.
_Nouveauté_ : Le système s'adapte au comportement réel plutôt qu'imposer un rythme arbitraire.

**[Fonctionnalité #2]** : Onboarding progressif
_Concept_ : Démarrage minimal (véhicule + kilométrage actuel), puis enrichissement organique au fil des entretiens saisis. L'app devient plus intelligente avec le temps sans surcharger l'utilisateur au départ.
_Nouveauté_ : Réduit la friction d'adoption — l'app est utile dès le 1er jour avec un minimum d'effort.

**[Fonctionnalité #13]** : Estimation temporelle des alertes kilométriques
_Concept_ : En connaissant le rythme moyen de l'utilisateur (km/semaine appris pendant la phase initiale), l'app convertit les échéances kilométriques en estimations de dates. "Révision dans ~6 semaines."
_Nouveauté_ : Rend les alertes km concrètes et planifiables, pas juste abstraites.

---

### Thème 2 — Gestion des entretiens

**[Fonctionnalité #3]** : Base de données d'intervalles de référence
_Concept_ : Bibliothèque intégrée marque/modèle/motorisation → intervalles recommandés pré-remplis. L'app suggère, l'utilisateur valide ou personnalise. Ex : révision essence 10 000 km, diesel 15 000 km.
_Nouveauté_ : Élimine la corvée de paramétrage pour 80% des cas courants.

**[Fonctionnalité #9]** : Timeline des événements à venir
_Concept_ : Vue chronologique unique qui liste toutes les échéances — "dans 800 km : révision", "dans 3 mois : contrôle technique", "dans 2 ans : assurance". Entretiens kilométriques ET échéances dates sur la même ligne de temps.
_Nouveauté_ : Unifie deux logiques différentes (km vs date) dans une vue unique et intuitive.

**[Fonctionnalité #11]** : Alertes calendaires
_Concept_ : Suivi des échéances fixes indépendantes du kilométrage — contrôle technique, assurance, vignette Crit'Air... Rappels N jours avant l'échéance.
_Nouveauté_ : Couvre tout ce qui n'est pas kilométrique dans un seul endroit.

---

### Thème 3 — Suivi des coûts

**[Fonctionnalité #4]** : Coût associé à chaque entretien
_Concept_ : Champ "prix total" optionnel à chaque saisie d'entretien. Simple, non bloquant.
_Nouveauté_ : Transforme un historique technique en historique financier sans effort supplémentaire.

**[Fonctionnalité #5]** : Module Carburant ultra-rapide
_Concept_ : Interface minimaliste — sélection du véhicule (type de carburant pré-rempli depuis la fiche), saisie du prix total. 3 secondes, c'est fait.
_Nouveauté_ : Le type de carburant vient de la fiche véhicule → zéro ressaisie, zéro erreur.

**[Fonctionnalité #6]** : Tableau de bord des coûts
_Concept_ : Vue consolidée des dépenses — par véhicule, par période (mois/année), et tout véhicule confondu. Entretien + carburant agrégés.
_Nouveauté_ : Donne une vision du coût réel de possession d'un véhicule, souvent sous-estimé.

**[Fonctionnalité #7]** : Coût au kilomètre
_Concept_ : Calcul automatique €/km sur une période donnée, par véhicule. Visible dans le tableau de bord des coûts.
_Nouveauté_ : Rend tangible le vrai coût d'usage d'un véhicule — métrique rare dans les apps grand public.

---

### Thème 4 — Expérience utilisateur & Interface

**[Fonctionnalité #8]** : Score de santé du véhicule
_Concept_ : Indicateur visuel simple (jauge ou score 0-100) basé sur les entretiens en retard et les alertes en approche. Un coup d'œil suffit pour savoir si le véhicule est "en bonne santé".
_Nouveauté_ : Rend l'état du véhicule immédiatement lisible sans lire une liste.

**[Fonctionnalité #12]** : Vue d'accueil configurable
_Concept_ : L'utilisateur choisit son écran d'accueil — vue globale (tous véhicules, coûts consolidés, alertes toutes voitures) ou vue centrée sur un véhicule spécifique. Réglable dans les préférences.
_Nouveauté_ : S'adapte à la réalité de l'utilisateur — 1 voiture ou une flotte personnelle.

**[Fonctionnalité #14]** : Accueil orienté "à venir" plutôt qu'historique
_Concept_ : La vue principale met en avant les prochaines échéances et alertes actives, pas l'historique. L'app devient un assistant préventif plutôt qu'un carnet de bord numérique.
_Nouveauté_ : Change le rapport psychologique à l'app — on l'ouvre pour savoir quoi faire, pas pour consulter le passé.

---

## Contraintes architecturales

**[Contrainte #1]** : Stockage texte/chiffres uniquement
Pas de fichiers, pas de photos, pas de PDF. Architecture simple, légère, facile à synchroniser et maintenir. Focus sur la valeur core.

**[Contrainte #2]** : Compte utilisateur minimaliste
Authentification simple — email + mot de passe ou connexion locale. Pas de profil social, pas d'infos superflues. Objectif : synchronisation inter-appareils uniquement.

**[Contrainte #3]** : Zéro fonctionnalité sociale
Pas de partage, pas de comparaison entre utilisateurs, pas de communauté. Application personnelle et privée.

---

## Future Feature (Post-MVP)

**[Future Feature #1]** : Export / résumé véhicule
_Concept_ : Génération d'un résumé structuré de l'historique d'entretien et des coûts. Utile pour la revente ou pour avoir une vue synthétique. Texte simple.
_Priorité_ : Post-MVP.

---

## Priorisation

### MVP Core — Sans ça l'app n'existe pas

| Priorité | Fonctionnalité |
|---|---|
| 1 | #2 Onboarding progressif |
| 2 | #1 Notifications adaptatives |
| 3 | #3 Base de données d'intervalles de référence |
| 4 | #9 Timeline événements à venir |
| 5 | #11 Alertes calendaires |
| 6 | #4 Coût par entretien |
| 7 | #5 Module Carburant rapide |
| 8 | #6 Tableau de bord des coûts |
| 9 | #12 Vue d'accueil configurable |
| 10 | #14 Accueil orienté "à venir" |

### MVP Enrichi — Fort différenciateur

| Priorité | Fonctionnalité |
|---|---|
| 11 | #7 Coût au kilomètre |
| 12 | #13 Estimation temporelle des alertes km |
| 13 | #8 Score de santé du véhicule |

### Post-MVP

| Fonctionnalité |
|---|
| FF1 Export / résumé véhicule |

---

## Synthèse de session

**Percée créative principale :** Le passage d'une logique "carnet de bord" (consultation du passé) à une logique "assistant préventif" (anticipation de l'avenir) est le positionnement différenciant fort de l'app.

**Pattern structurant identifié :** Toutes les décisions prises convergent vers un principe de **minimalisme fonctionnel** — onboarding progressif, stockage simple, compte léger, zéro social. L'app doit être légère, rapide à utiliser, et précieuse sans friction.

**Question ouverte non traitée :** Les technologies à utiliser (stack native, framework cross-platform, backend) n'ont pas été explorées — sujet à traiter dans une prochaine session ou directement en architecture.
