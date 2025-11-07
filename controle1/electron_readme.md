# Bobberchat - Application Electron

## Objectifs

Application de messagerie instantanée en temps réel construite avec Electron, permettant:

- Connexion/inscription des utilisateurs avec authentification JWT
- Création et gestion de groupes de discussion (publics et privés)
- Messagerie en temps réel via WebSockets
- Gestion de thèmes (dark/light mode)
- Chargement lazy des messages (pagination infinie)
- Interface utilisateur moderne et responsive

---

## Choix techniques et architecture

### Stack technique

- **Runtime**: Electron v30.0.1
- **Frontend**: React 18.2.0 avec Vite
- **Langage**: JavaScript/TypeScript (ESNext + TS pour types)
- **Styling**: Styled Components + CSS personnalisé
- **State Management**: React Hooks (Context API)
- **Communication temps réel**: WebSockets natifs
- **Tests**: Jest + Babel
- **Build**: Electron Forge avec makers multi-plateformes

### Architecture applicative

```
┌─────────────────────────────────────────────────────────┐
│                    Main Process                         │
│  (main.ts - Electron, IPC, Notifications natives)       │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ IPC / Preload
                     │
┌────────────────────▼────────────────────────────────────┐
│                 Renderer Process                        │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │            App.jsx (Root)                       │    │
│  │  ┌──────────────────────────────────────────┐   │    │
│  │  │   AuthContext (useAuth)                  │   │    │
│  │  │   - Login/Register/Logout                │   │    │
│  │  │   - JWT Token Management                 │   │    │
│  │  │   - Theme Management                     │   │    │
│  │  └──────────────────────────────────────────┘   │    │
│  │                                                 │    │
│  │  ┌──────────────┐  ┌──────────────────────┐     │    │
│  │  │   Sidebar    │  │  FilsConversation    │     │    │
│  │  │              │  │                      │     │    │
│  │  │  - Groupes   │  │  - Messages          │     │    │
│  │  │  - Creation  │  │  - Lazy Loading      │     │    │
│  │  │  - Nav       │  │  - WebSocket Live    │     │    │
│  │  └──────────────┘  └──────────────────────┘     │    │
│  │                                                 │    │
│  │  ┌──────────────────────────────────────────┐   │    │
│  │  │        Utilisateurs (User List)          │   │    │
│  │  └──────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │               Services Layer                    │    │
│  │  - authService: Login, Register, Refresh Token  │    │
│  │  - messageService: CRUD messages                │    │
│  │  - groupService: CRUD groupes                   │    │
│  │  - userService: CRUD utilisateurs               │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │             Custom Hooks                        │    │
│  │  - useAuth: Authentication state                │    │
│  │  - useMessages: Messages + WebSocket            │    │
│  │  - useGroups: Groups management                 │    │
│  │  - useUsers: Users list                         │    │
│  └─────────────────────────────────────────────────┘    │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTP/HTTPS + WebSocket
                     │
┌────────────────────▼────────────────────────────────────┐
│               Backend API (Express)                     │
│  - REST API (JWT auth, CRUD)                            │
│  - WebSockets (temps réel)                              │
│  - PostgreSQL + Redis                                   │
└─────────────────────────────────────────────────────────┘
```

### Architecture des dossiers

```
src/
├── API/                    # Utilitaires API
├── components/             # Composants UI réutilisables
│   ├── Sidebar.jsx
│   ├── Topbar.jsx
│   └── Logout.jsx
├── contexts/               # React Context (state global)
│   └── AuthContext.jsx
├── Form/                   # Formulaires
│   └── FormCreerGroupe.jsx
├── Groupes/                # Gestion des groupes
│   ├── Groupe.jsx
│   ├── AddGroup.jsx
│   └── AjouterDansGroupe.jsx
├── hooks/                  # Custom React Hooks
│   ├── useAuth.js
│   ├── useMessages.js
│   ├── useGroups.js
│   └── useUsers.js
├── Messages/               # Composants messagerie
│   ├── FilsConversation.jsx
│   ├── Bulle.jsx
│   ├── BulleAutre.jsx
│   ├── BarreChat.jsx
│   ├── Typing.jsx
│   └── Loader.jsx
├── Notifications/          # Système de notifications
│   └── notifier.js
├── services/               # Services API
│   ├── authService.js
│   ├── messageService.js
│   ├── groupService.js
│   └── userService.js
├── Styles/                 # Feuilles de style
│   ├── styles.css
│   ├── light.css
│   └── LogoutButton.css
├── Users/                  # Gestion utilisateurs
│   ├── Login.jsx
│   ├── Register.jsx
│   └── Utilisateurs.jsx
├── Mock/                   # Données de test
│   ├── MockGroupe.js
│   ├── MockMessage.js
│   └── MockUtilisateurs.js
└── __tests__/              # Tests unitaires
    ├── MockGroupe.test.js
    ├── MockMessage.test.js
    └── MockUtilisateurs.test.js

electron/
├── main.ts                 # Main process Electron
└── preload.mjs             # Preload script (IPC bridge)
```

### Flux de données

**Authentification:**
1. User → Login/Register → authService
2. Backend → JWT (accessToken + refreshToken via httpOnly cookie)
3. AuthContext stocke user + token → localStorage
4. Tous les appels API utilisent `fetchWithAuth` (auto-refresh si 401)

**Messagerie temps réel:**
1. Connexion WebSocket au montage de `useMessages`
2. Envoi message → HTTP POST → Backend → Broadcast WebSocket
3. Réception → `ws.onmessage` → Ajout au state local
4. Lazy loading: scroll → `loadMoreMessages` → fetch historique

**Gestion groupes:**
1. Création groupe → POST `/api/groups`
2. Ajout membre → POST `/api/groups/:id/members`
3. Liste groupes → GET `/api/groups` (publics) + `/groups/private/:userId`

---

## Prérequis

- **Node.js**: >= 18.x (recommandé 20.x)
- **npm**: >= 9.x ou **yarn** >= 1.22.x
- **Système d'exploitation**:
  - Windows 10/11 (pour build Windows)
  - macOS 10.15+ (pour build macOS)
  - Linux (Debian/Ubuntu ou Fedora/RHEL pour build .deb/.rpm)

---

## Installation

1. **Cloner le repository**

```bash
git clone https://github.com/JMOYSAN/JMLBFS_PROJETMULTI.git
cd JMLBFS_PROJETMULTI
git checkout main
```

2. **Installer les dépendances**

```bash
npm install
```

3. **Configurer les variables d'environnement**

Créer un fichier `.env` à la racine du projet:

```env
VITE_API_URL=https://bobberchat.com
WEBSOCKET_URL=wss://bobberchat.com/ws
GITHUB_TOKEN=your_github_token_here  # Optionnel, pour publier releases
```

> ⚠️ **Sécurité**: Ne jamais commiter le fichier `.env` avec des tokens réels!

---

## Lancement en développement

### Mode développement avec hot-reload

```bash
npm run dev
```

Cette commande:
- Lance Vite dev server sur `http://localhost:5173`
- Ouvre l'application Electron avec DevTools activés
- Active le hot-reload pour React

### Démarrer avec Electron Forge

```bash
npm run start
```

Alternative qui utilise Electron Forge pour lancer l'app.

---

## Build et distribution

### Build multi-plateformes

**Windows (depuis Windows ou Linux/macOS avec Wine)**

```bash
npm run build:win
```

Artifacts générés dans:
```
out/make/squirrel.windows/x64/
├── Setup.exe                    # Installateur
└── RELEASES
```

**macOS (depuis macOS uniquement)**

```bash
npm run build:mac
```

Artifacts générés dans:
```
out/make/
└── zip/darwin/x64/
    └── controle1-darwin-x64-0.0.0.zip
```

**Linux (.deb pour Debian/Ubuntu)**

```bash
npm run build:linux
```

Artifacts générés dans:
```
out/make/
├── deb/x64/
│   └── controle1_0.0.0_amd64.deb
└── rpm/x64/
    └── controle1-0.0.0-1.x86_64.rpm
```

### Build toutes plateformes

```bash
npm run make
```

> **Note**: Pour build macOS, vous devez être sur macOS. Pour Windows, Wine peut être utilisé mais macOS natif n'est pas recommandé pour cross-compilation.

### Publier sur GitHub Releases

```bash
npm run publish
```

Nécessite:
- Variable `GITHUB_TOKEN` configurée dans `.env`
- Repo configuré dans `forge.config.cjs` (déjà fait)

---

## Tests

### Exécuter les tests

```bash
npm test
```

Tests actuels:
- `MockGroupe.test.js`: Validation structure des groupes mockés
- `MockMessage.test.js`: Validation structure des messages mockés
- `MockUtilisateurs.test.js`: Validation structure des utilisateurs mockés

### Configuration des tests

Tests configurés avec:
- **Jest** pour le test runner
- **Babel** pour transpiler ESM → CommonJS
- Environment: Node.js

Fichiers de config:
- `jest.config.js`
- `babel.config.cjs`

---

## Guide utilisateur BETA

### Connexion et inscription

#### Première utilisation

1. **Lancer l'application**
   - Double-cliquer sur l'exécutable installé
   - Ou lancer via `npm run dev` en développement

2. **Créer un compte**
   - Cliquer sur "S'inscrire" ou "Register"
   - Entrer un nom d'utilisateur unique
   - Choisir un mot de passe sécurisé (min 6 caractères)
   - Cliquer sur "Créer un compte"

3. **Se connecter**
   - Entrer votre nom d'utilisateur
   - Entrer votre mot de passe
   - Cliquer sur "Connexion"

> 💡 **Astuce**: Votre session reste active même après fermeture de l'app (stockage local du token JWT).

#### Déconnexion

- Cliquer sur le bouton **"Déconnexion"** en haut de l'interface
- Ou via le menu Application → Quit

---

### 💬 Navigation et utilisation

#### Interface principale

L'application est divisée en 3 zones:

```
┌─────────────┬──────────────────────┬────────────────┐
│             │                      │                │
│  Liste      │   Fil de             │   Liste        │
│  Groupes    │   Conversation       │   Membres      │
│             │                      │                │
│  - Public   │   Messages en        │  - Utilisateur │
│  - Private  │   temps réel         │  - Status      │
│             │                      │                │
│  + Créer    │   Input message      │   + Inviter    │
│             │                      │                │
└─────────────┴──────────────────────┴────────────────┘
```

#### Rejoindre un groupe

**Groupes publics:**
1. Voir la liste dans la sidebar gauche
2. Cliquer sur un groupe pour le rejoindre
3. Commencer à chatter immédiatement

**Groupes privés:**
1. Doivent être créés par un utilisateur
2. Invitation nécessaire pour rejoindre

#### Créer un groupe

1. Cliquer sur **"+ Créer un groupe"** dans la sidebar
2. Remplir le formulaire:
   - Nom du groupe
   - Type: Public ou Privé
   - Sélectionner les participants (si privé)
3. Cliquer sur "Créer"

#### Envoyer des messages

1. Sélectionner un groupe dans la sidebar
2. Taper votre message dans le champ en bas
3. Appuyer sur **Entrée** ou cliquer sur **"Envoyer"**

#### Charger l'historique

- Scroller vers le haut dans le fil de conversation
- Les messages plus anciens se chargent automatiquement (pagination infinie)

#### Changer de thème

- Cliquer sur votre profil ou icône thème
- Sélectionner **"Mode clair"** ou **"Mode sombre"**
- Le thème est sauvegardé pour vos prochaines sessions

---

### 🆘 Canaux de support

#### Problèmes techniques

Si vous rencontrez des bugs ou problèmes:

1. **Vérifier votre connexion internet**
   - L'app nécessite une connexion active pour les WebSockets

2. **Redémarrer l'application**
   - Fermer complètement et relancer

3. **Vérifier les logs**
   - Ouvrir DevTools: Menu → Open DevTools
   - Consulter la console pour erreurs

#### Contact support

- **Email**: bobbertechnician@gmail.com

#### Limitations connues (BETA)

- Pas de support fichiers/images actuellement
- Pas de recherche dans l'historique
- Notifications limitées aux messages directs
- Performance: Historique limité à ~1000 messages par groupe

---

## 🔧 Variables d'environnement

| Variable | Description | Valeur par défaut | Requis |
|----------|-------------|-------------------|--------|
| `VITE_API_URL` | URL de l'API backend | `https://bobberchat.com` | ✅ |
| `WEBSOCKET_URL` | URL WebSocket serveur | `wss://bobberchat.com/ws` | ✅ |
| `GITHUB_TOKEN` | Token pour publier releases | - | ❌ |

### Créer un `.env.example`

```env
# Backend API
VITE_API_URL=https://bobberchat.com

# WebSocket Server
WEBSOCKET_URL=wss://bobberchat.com/ws

# GitHub Release Publishing (optionnel)
GITHUB_TOKEN=your_token_here
```

---

## 📜 Scripts disponibles

| Script | Description |
|--------|-------------|
| `npm run dev` | Lance l'app en mode développement avec hot-reload |
| `npm run build` | Build TypeScript + Vite + Electron Builder |
| `npm run preview` | Preview du build Vite |
| `npm run lint` | Lint du code avec ESLint |
| `npm test` | Exécute les tests Jest |
| `npm run start` | Lance l'app via Electron Forge |
| `npm run package` | Package l'app sans créer d'installateur |
| `npm run make` | Crée les installateurs pour toutes plateformes |
| `npm run publish` | Publie sur GitHub Releases |
| `npm run build:win` | Build pour Windows (.exe) |
| `npm run build:linux` | Build pour Linux (.deb + .rpm) |
| `npm run build:mac` | Build pour macOS (.zip) |

---

## Notes de développement

### Debugging

- **Ouvrir DevTools**: Menu → Open DevTools
- **Logs WebSocket**: Voir console pour `[useMessages] WS connected`
- **Network**: Inspecter requêtes HTTP dans DevTools Network tab

### Architecture de sécurité

- **Tokens JWT**: AccessToken (court terme) + RefreshToken (cookie httpOnly)
- **Auto-refresh**: Si 401, tente refresh automatique via `/auth/refresh`
- **Storage**: User + token en localStorage (attention XSS)

### Performances

- **Lazy loading**: 20 messages chargés initialement, puis 20 par scroll
- **WebSocket**: 1 connexion par user, fermée proprement au unmount
- **React optimisations**: useCallback, useMemo pour éviter re-renders

---

## Auteurs

- Joaquim Moysan
- Lyam Bathalon  
- François Santerre

---