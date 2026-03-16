---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-02b-vision', 'step-02c-executive-summary']
inputDocuments: ['_bmad-output/brainstorming/brainstorming-session-2026-03-16-1000.md']
workflowType: 'prd'
briefCount: 0
researchCount: 0
brainstormingCount: 1
projectDocsCount: 0
classification:
  projectType: mobile_app_cross_platform
  stack: React Native
  domain: productivite_personnelle_vehicules
  complexity: faible_a_moyenne
  projectContext: greenfield
  architecture: offline_first_sync_cloud_optionnel
  scopeMVP: '1-5 véhicules, particuliers uniquement'
---

# Product Requirements Document - meca-track

**Auteur :** Alexandre
**Date :** 2026-03-16

## Résumé Exécutif

meca-track est une application mobile React Native (iOS & Android) destinée aux particuliers souhaitant suivre l'entretien et les coûts de leurs véhicules sans charge mentale. L'app résout un problème universel et sous-servi : l'oubli des échéances d'entretien. Elle ne remplace pas les documents physiques — elle porte à la place de l'utilisateur la responsabilité de se souvenir de ce qui doit être fait, et quand.

La cible principale est tout propriétaire d'un ou plusieurs véhicules (voiture, moto, utilitaire, deux-roues...) qui fait consciencieusement ses entretiens mais perd le fil des échéances. Le moment de valeur est la notification proactive : "votre révision approche dans 500 km" — reçue sans que l'utilisateur ait eu à y penser.

### Ce qui rend meca-track spécial

Les alternatives existantes (carnet papier, Excel, apps de gestion de flotte pro) imposent soit une charge cognitive permanente, soit une complexité inadaptée à l'usage personnel. meca-track adopte une posture d'**assistant préventif minimaliste** : l'utilisateur saisit ses données consciencieusement une fois, l'app se charge du reste. L'architecture offline-first garantit un fonctionnement sans connexion ; la synchronisation cloud est optionnelle. Le périmètre volontairement limité (texte et chiffres uniquement, pas de stockage de fichiers, pas de fonctionnalités sociales) est une force, pas une contrainte — il garantit légèreté, fiabilité et adoption rapide.

## Classification du Projet

- **Type :** Application mobile cross-platform — React Native (iOS + Android)
- **Domaine :** Productivité personnelle / gestion de véhicules tous types
- **Complexité :** Faible à moyenne (offline-first + sync cloud optionnel)
- **Contexte :** Greenfield
- **Scope MVP :** 1 à 5 véhicules, particuliers uniquement


