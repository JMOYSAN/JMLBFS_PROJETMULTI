# Projet de session – Application de clavardage (Contrôle 1)

## Objectifs du projet
Développer une application de clavardage **desktop multiplateforme** (Windows, macOS, Linux) en utilisant **Electron** et **React avec JavaScript**.  
Pour ce contrôle, le serveur backend n’est pas encore disponible. L’application doit donc :  
- Simuler un serveur via un **MockGateway**.  
- Préparer une architecture modulaire afin de remplacer facilement les mocks par un vrai backend dans une future itération.  

---

## Choix techniques
- **Langage** : JavaScript  
- **Framework UI** : React + Vite  
- **Shell multiplateforme** : Electron  
- **Tests unitaires** : Jest  
- **Linting / Formatage** : ESLint + Prettier  
- **Build** : Electron Forge + electron-builder  

### Schéma d’architecture
```
UI (React Components)
│
├── App.jsx / main.jsx
│
├── Components
│ ├── Button.jsx
│ ├── Login.jsx
│ ├── Groupe.jsx
│ └── (autres composants)
│
├── Form
│ └── FormCreerGroupe.jsx
│
├── Messages
│ └── MessageList.jsx
│
├── Users
│ └── UserList.jsx
│
├── Notifications
│ └── NotificationHandler.jsx
│
├── Styles
│ └── styles.css
│
└── Gateway
  ├── MockGateway
  ├── MockGroupe.js
  ├── MockMessage.js
  └── GetUtilisateurs.js

Tests unitaires
│
└── tests/
├── MockGroupe.test.js
├── MockMessage.test.js
└── MockUtilisateurs.test.js
```

---

## Prérequis
- Node.js (>= 18.x recommandé)  
- npm ou yarn  
- Git  

---

## Installation
```bash
git clone <url-du-dépôt>
cd <nom-du-projet>
npm install
```

---

## Lancement en développement
```bash
npm run dev
```

---

## Build par OS
- **Windows** :  
  ```bash
  npm run build:win
  ```
  → Résultats disponibles dans `/out/controle1-win32-x64/controle1.exe`

- **Linux** :  
  ```bash
  npm run build:linux
  ```
  → Résultats disponibles dans `/out/controle1-linux-x64/` (AppImage, deb ou rpm selon config).

- **macOS** :  
  ```bash
  npm run build:mac
  ```
  → Résultats disponibles dans `/out/controle1-darwin-x64/controle1.app`

---

## Scénarios de test
 Le programme utilise le framework Jest pour les tests unitaires.  
 Pour lancer les tests :
```bash
npm run test
```

---

## Limites connues
- Pas de backend réel (Mock uniquement).  
- Persistance limitée (Local storage).  
- Fonctionnalités réseau simulées.  
---

## Pistes d’amélioration
- Implémentation du vrai backend.  
- Persistance robuste (SQLite, IndexedDB).  
- Internationalisation (EN en plus de FR).  
- UI plus personnalisée (thèmes).  

---

## Versionnage
- Branches :
  - `main` → version stable  
  - `develop` → intégration  
- PR obligatoires (pas de push direct).
- `package.json` maintenu à jour.  
### Builds

Après exécution des scripts `npm run make` ou `npm run build:<os>`, les artefacts de build sont générés automatiquement.

- **Windows** : `out/make/squirrel.windows/x64/` → contient le setup `.exe`
- **macOS** : `out/make/zip/darwin/x64/` → contient l’application `.app`
- **Linux** : `out/make/deb/x64/` → contient le paquet `.deb`

Chaque OS produit un fichier installable ou exécutable prêt à tester.
