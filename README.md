# JMLBFS_PROJETMJLTI

# Contrôle 1 – Application de chat (5 %)

**Cours :** 420-5A6-ST – A25  
**Date de remise :** 7 septembre 2025, 23h59  

---

## 1. Mise en contexte
Vous devez créer une application de clavardage **desktop multi-plateforme**.  
Le serveur backend n’est pas encore disponible (il sera développé dans un contrôle suivant).  
Pour cette itération, vous devez **simuler le serveur (mocks)** côté client, tout en préparant l’architecture pour remplacer facilement ces mocks par un vrai backend plus tard.

---

## 2. Règles du projet de session
- Travail d’équipe : **3 – 5 personnes maximum**.  
- Projet sur **GitHub** : dépôt privé, pas de fork.  
- **Pas de commit coauteurs** : chaque commit doit être fait par un seul membre.  
- **Pull requests obligatoires** : pas de push direct sur `main` ou `develop`.  
- **Communication** : utilisez les issues GitHub/Teams pour discussions et tâches.  
- **Teams** : vous devez demander à rejoindre votre canal Teams de projet.  
- **Calendrier** : plan de travail avec jalons et tâches assignées.

---

## 3. Remise de planification
Avant de commencer le projet, vous devez remettre un **document de planification** contenant :  
- Un calendrier de travail avec jalons et tâches assignées.  
- La liste des membres de l’équipe.  
- Ajout d’**OlivierFortin** et de l’équipe comme collaborateurs sur GitHub.  
- Un plan de communication pour le projet (issues, pull requests, etc.).  

📌 **Échéance : avant le 23 août 2025**

---

## 4. Contraintes et plateformes
- Fonctionne sur **macOS, Windows et Linux**.  
- Fournir un **build de production pour chaque OS**.  
- **Technologies au choix :**  
  - Langage : **TypeScript ou JavaScript**  
  - UI : **Electron** (avec ou sans React, Vite, Vanilla, Preact acceptés)  
- **Interdits :**  
  - Icône Electron par défaut en production  
  - Menus non contrôlés  

---

## 5. Architecture (découplage prêt pour backend réel)
- Séparer **UI / métier / transport** :  
  - **UI** : composants, vues, interactions  
  - **Modèles & logique** : `Message`, `Channel`, `User`, formatage, tri, pagination, états  
  - **Communication serveur** : `ChatGateway` (interface unique, actuellement mockée)  

- **MockGateway** doit simuler :  
  - Salons publics/privés (invitation locale simulée)  
  - DM (messages privés)  
  - Présence (online/offline) et indicateur *typing*  
  - Réception/émission temps réel (timers/événements, latence simulée)  
  - États réseau (connecté/déconnecté/reconnexion)  

- **Persistance locale** : mémoire et/ou sauvegarde (JSON, SQLite, IndexedDB)  

---

## 6. Fonctionnalités minimales (MVP)
1. Authentification basique : choix d’un pseudo (unique localement) + session locale.  
2. Salons : lister, créer, rejoindre ; salon privé avec invitation simulée.  
3. Messages : envoi/réception, horodatage, auteur.  
4. DM : conversation privée simulée.  
5. Présence & *typing* visibles.  
6. Historique & pagination : chargement progressif.  
7. Statut réseau : connecté/déconnecté/reconnexion simulés.  
8. Notifications système : réception de messages hors focus.  
9. Design : thème par défaut, apparence professionnelle (icône, menus personnalisés).  

---

## 7. Exigences techniques
- Scripts reproductibles : `dev`, `build:<os>`, `lint`, `test`.  
- Qualité : **ESLint + Prettier**.  
- Tests unitaires : au minimum sur la couche métier et `MockGateway`.  
- Sécurité basique :  
  - Sanitisation (anti-XSS)  
  - Pas de secrets commités  
  - Logs sobres  
- Internationalisation minimale : **FR obligatoire, EN bonus**.  

---

## 8. Libertés encadrées
- **Langage** : TypeScript ou JavaScript  
- **UI** : avec ou sans React  
- **Persistance** : libre (fichier, SQLite, IndexedDB)  

---

## 9. Livrables
- **README clair**, incluant :  
  1. Objectifs du projet  
  2. Choix techniques (JS/TS, React ou non) + schéma d’architecture  
  3. Prérequis  
  4. Installation  
  5. Lancement en dev  
  6. Build par OS + emplacement des artifacts  
  7. Scénarios de test (réseau down, latence, typing, invitation)  
  8. Limites connues  
  9. Pistes d’amélioration (avant backend réel)  

- **Versionnage :** branches + tags sémantiques, `package.json` à jour  
- **Builds** : artifacts pour macOS, Windows et Linux  

---

## 10. Critères d’évaluation

### Partie individuelle (5 pts)
- **Communication (2 pts)**  
  - 0 : absente  
  - 1 : minimale  
  - 2 : régulière, active  
- **Contribution (3 pts)**  
  - 0 : absente  
  - 1 : partielle (peu de commits/code)  
  - 2 : modeste (quelques commits, petite quantité de code)  
  - 3 : significative (plusieurs commits, code de qualité)  

### Partie collective (5 pts)
- Évaluation selon le barème du département.  
- Remise des fichiers **avant le 7 septembre 2025, 23h59**.  
- Correction interactive le **8 septembre 2025 en classe**.  
- Présence **obligatoire** de tous les membres (sinon note = 0).  
- **Aucun retard accepté.**  

---

## 11. Checklist d’acceptation
- Démarrage via README sans aide.  
- Création pseudo → rejoindre/créer salon → messages en temps réel simulés.  
- DM fonctionnels.  
- Présence + typing visibles.  
- Icône/statut réseau simulés.  
- Notifications OS OK.  
- Builds disponibles pour 3 OS.  
- Pas d’éléments Electron par défaut (icône personnalisée).  
- Tags & versions cohérents.  
