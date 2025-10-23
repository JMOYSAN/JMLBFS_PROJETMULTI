# Client Desktop - Application de Clavardage Multi-Plateforme

## 📋 Table des matières
- [Description](#description)
- [Choix Techniques](#choix-techniques)
- [Architecture](#architecture)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Lancement](#lancement)
- [Lancement](#lancement)
- [Build Production](#build-production)
- [Fonctionnalités](#fonctionnalités)
- [Scénarios de Test](#scénarios-de-test)
- [Limitations](#limitations)

## 📖 Description

Application de clavardage desktop multi-plateforme développée avec Electron et React. Permet la communication en temps réel avec support des salons publics/privés, messages privés (DM), présence utilisateur et notifications système.

## 🔧 Choix Techniques

### Framework UI: Electron + React
**Justification:**
- **Multi-plateforme**: Un seul codebase pour macOS, Windows et Linux
- **React**: Composants réutilisables, gestion d'état efficace, écosystème mature
- **Performance**: Virtual DOM pour des mises à jour UI optimales
- **Développement rapide**: Hot reload, dev tools, large communauté

### Langage: JavaScript/TypeScript
**Justification:**
- **Cohérence du stack**: Même langage côté client et serveur
- **Typage fort (TypeScript)**: Réduction des bugs, meilleure maintenabilité
- **Écosystème**: Accès à npm et ses milliers de packages

### État & Routing
- **React Context / Redux**: Gestion d'état globale pour l'authentification et les messages
- **React Router**: Navigation entre les vues (connexion, chat, configuration)

### Communication Temps Réel
- **Socket.io Client**: Communication bidirectionnelle avec l'API
- **Axios**: Requêtes HTTP REST vers l'API

### Persistance Locale
- **LocalStorage**: Sauvegarde du token JWT et préférences utilisateur
- **IndexedDB**: Cache des messages pour mode hors ligne (optionnel)

## 🏗️ Architecture

### Schéma d'Architecture de l'Application

```
┌─────────────────────────────────────────────────────────┐
│                  Application Electron                   │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │           Main Process (Node.js)                │    │
│  │  - Gestion fenêtres                             │    │
│  │  - Menu personnalisé                            │    │
│  │  - Notifications système                        │    │
│  │  - Auto-updater                                 │    │
│  └────────┬───────────────────────────────────────┘    │
│           │                                             │
│  ┌────────▼───────────────────────────────────────┐    │
│  │         Renderer Process (React)                │    │
│  │                                                  │    │
│  │  ┌──────────────────────────────────────────┐  │    │
│  │  │            UI Components                  │  │    │
│  │  │  ┌────────┐  ┌────────┐  ┌────────┐     │  │    │
│  │  │  │ Login  │  │  Chat  │  │ Config │     │  │    │
│  │  │  │  View  │  │  View  │  │  Panel │     │  │    │
│  │  │  └────────┘  └────────┘  └────────┘     │  │    │
│  │  └──────────────┬───────────────────────────┘  │    │
│  │                 │                               │    │
│  │  ┌──────────────▼───────────────────────────┐  │    │
│  │  │         State Management                  │  │    │
│  │  │  - User State                             │  │    │
│  │  │  - Messages State                         │  │    │
│  │  │  - Channels State                         │  │    │
│  │  │  - UI State                               │  │    │
│  │  └──────────────┬───────────────────────────┘  │    │
│  │                 │                               │    │
│  │  ┌──────────────▼───────────────────────────┐  │    │
│  │  │         Services Layer                    │  │    │
│  │  │  ┌──────────────┐  ┌──────────────┐     │  │    │
│  │  │  │ API Service  │  │ WS Service   │     │  │    │
│  │  │  │  (HTTP)      │  │ (Socket.io)  │     │  │    │
│  │  │  └──────────────┘  └──────────────┘     │  │    │
│  │  └──────────────┬───────────────────────────┘  │    │
│  └─────────────────┼──────────────────────────────┘    │
└────────────────────┼─────────────────────────────────┘
                     │
                     │ HTTP + WebSocket
                     │
         ┌───────────▼────────────┐
         │      API Backend       │
         │   (Express + Redis)    │
         └────────────────────────┘
```

### Structure des Dossiers

```
src/
├── main/                    # Electron Main Process
│   ├── index.js            # Point d'entrée principal
│   ├── menu.js             # Menu personnalisé
│   └── notifications.js    # Gestion notifications
│
├── renderer/               # React App (Renderer Process)
│   ├── components/         # Composants réutilisables
│   │   ├── Chat/
│   │   │   ├── MessageList.jsx
│   │   │   ├── MessageInput.jsx
│   │   │   └── TypingIndicator.jsx
│   │   ├── Channels/
│   │   │   ├── ChannelList.jsx
│   │   │   └── ChannelItem.jsx
│   │   ├── Auth/
│   │   │   ├── LoginForm.jsx
│   │   │   └── RegisterForm.jsx
│   │   └── Config/
│   │       └── ConfigPanel.jsx
│   │
│   ├── services/           # Services de communication
│   │   ├── api.js          # Client HTTP (Axios)
│   │   ├── socket.js       # Client WebSocket
│   │   └── storage.js      # Persistance locale
│   │
│   ├── context/            # Context providers
│   │   ├── AuthContext.jsx
│   │   ├── ChatContext.jsx
│   │   └── ConfigContext.jsx
│   │
│   ├── hooks/              # Custom hooks
│   │   ├── useAuth.js
│   │   ├── useMessages.js
│   │   └── useWebSocket.js
│   │
│   ├── utils/              # Utilitaires
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   └── sanitizers.js
│   │
│   ├── App.jsx             # Composant racine
│   └── index.jsx           # Point d'entrée React
│
└── preload/                # Preload script (sécurité)
    └── index.js
```

## 📋 Prérequis

### Pour le développement
- **Node.js**: Version 18.x ou supérieure
- **npm**: Version 9.x ou supérieure
- **Git**: Pour cloner le repository

### Pour l'exécution
- **Système d'exploitation**: macOS 10.13+, Windows 10+ ou Linux (Ubuntu 18.04+)
- **API Backend**: L'API doit être accessible (voir README API)

## 🚀 Installation

1. **Cloner le repository**
```bash
git clone https://github.com/JMOYSAN/JMLBFS_PROJETMULTI.git
cd JMLBFS_PROJETMULTI
git checkout Develop
```

2. **Installer les dépendances**
```bash
npm install
```

## 🎯 Lancement

### Mode Développement

```bash
# Démarrer l'application en mode dev (avec hot reload)
npm run dev
```

L'application se lance automatiquement. Les modifications du code sont appliquées en temps réel.

### Scripts disponibles

```bash
# Lancer l'application
npm start

# Mode développement avec hot reload
npm run dev

# Linter (ESLint)
npm run lint

# Formatter (Prettier)
npm run format

# Tests unitaires
npm test

# Tests avec couverture
npm run test:coverage
```

## 📦 Build Production

### Build pour toutes les plateformes

```bash
# Build pour macOS
npm run build:mac

# Build pour Windows
npm run build:win

# Build pour Linux
npm run build:linux

# Build pour toutes les plateformes
npm run build:all
```

### Emplacement des artifacts

Les builds de production se trouvent dans le dossier `dist/` :

```
dist/
├── mac/
│   └── ChatApp-1.0.0.dmg           # Installateur macOS
├── win/
│   └── ChatApp-Setup-1.0.0.exe     # Installateur Windows
└── linux/
    ├── ChatApp-1.0.0.AppImage       # Linux AppImage
    └── ChatApp-1.0.0.deb            # Package Debian
```

### Tailles approximatives des builds
- **macOS**: ~150 MB
- **Windows**: ~130 MB
- **Linux**: ~140 MB

## ✨ Fonctionnalités

### 🔐 Authentification
- [x] Inscription avec email et mot de passe
- [x] Connexion avec validation
- [x] Déconnexion
- [x] Persistance de session (token JWT)
- [x] Choix du pseudo unique

### 💬 Communication
- [x] **Salons publics**: Rejoindre et créer des salons accessibles à tous
- [x] **Salons privés**: Créer des salons avec invitation
- [x] **Messages privés (DM)**: Conversations one-to-one
- [x] **Messages en temps réel**: Réception instantanée via WebSocket
- [x] **Horodatage**: Affichage de la date/heure des messages
- [x] **Historique**: Chargement progressif des messages passés
- [x] **Pagination**: Navigation dans l'historique

### 👥 Présence
- [x] **Statut en ligne/hors ligne**: Indicateur visuel pour chaque utilisateur
- [x] **Indicateur de frappe**: "X est en train d'écrire..."
- [x] **Dernière connexion**: Affichage du dernier accès

### ⚙️ Configuration
- [x] **Panneau de configuration**: Interface dédiée aux paramètres
- [x] **Choix du thème**: Mode clair/sombre
- [x] **Sélection du salon par défaut**: Salon d'ouverture automatique
- [x] **Gestion du profil**: Modifier username et email
- [x] **Notifications**: Activer/désactiver les notifications

### 🔔 Notifications
- [x] **Notifications système**: Alertes natives de l'OS
- [x] **Notifications hors focus**: Même quand l'app est en arrière-plan
- [x] **Badge de compteur**: Nombre de messages non lus

### 🎨 Interface
- [x] **Icône personnalisée**: Pas d'icône Electron par défaut
- [x] **Menu personnalisé**: Menu adapté à l'application
- [x] **Design responsive**: Interface adaptative
- [x] **Thème clair/sombre**: Changement à la volée

### 🌐 Gestion Réseau
- [x] **Indicateur de connexion**: Statut réseau visible
- [x] **Gestion déconnexion**: Détection de perte de connexion
- [x] **Reconnexion automatique**: Tentatives de reconnexion
- [x] **Mode hors ligne**: Cache local pour consultation

### 🔒 Sécurité
- [x] **Sanitisation XSS**: Protection contre les injections
- [x] **Validation des entrées**: Vérification côté client
- [x] **Stockage sécurisé**: Pas de secrets en clair
- [x] **CSP (Content Security Policy)**: Politique de sécurité stricte

## ⚠️ Limitations Connues

### Fonctionnalités
- **Appels audio/vidéo**: Non implémentés
- **Partage de fichiers**: Pas encore disponible
- **Réactions aux messages**: À venir
- **Recherche avancée**: Recherche basique uniquement
- **Threads**: Pas de fils de discussion

### Technique
- **Mode hors ligne**: Cache limité, pas de queue de messages
- **Compression images**: Pas d'optimisation automatique
- **Chiffrement E2E**: Non implémenté pour les DM
- **Synchronisation multi-devices**: Limitée

### Performance
- **Charge mémoire**: Peut augmenter avec beaucoup de messages en cache
- **Pagination**: Chargement initial peut être lent pour gros historiques
- **Animations**: Peuvent ralentir sur machines anciennes

### Sécurité
- **Rate limiting**: Pas de limite côté client
- **Validation avancée**: Validation basique uniquement
- **CSP**: Configuration à améliorer

## 🐛 Problèmes Connus

| Problème | Impact | Workaround |
|----------|--------|------------|
| Notifications macOS Big Sur+ | Requiert autorisation | Accepter dans Préférences Système |
| Menu context sur Linux | Parfois décalé | Relancer l'application |
| Reconnexion WebSocket | Peut prendre 5-10s | Patienter ou relancer |
| Cache IndexedDB | Peut devenir volumineux | Vider cache dans config |

## 🔧 Dépannage

### L'application ne se lance pas
```bash
# Supprimer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Erreur de connexion à l'API
1. Vérifier que l'API est démarrée: `docker-compose ps`
2. Vérifier l'URL dans `.env`: `VITE_API_URL`
3. Tester l
