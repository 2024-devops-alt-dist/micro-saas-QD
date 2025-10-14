# ��� Guide des Outils de Qualité

Configuration automatisée pour garantir un code propre et cohérent.

## ���️ Outils Utilisés

- **ESLint** : Détection d'erreurs et bonnes pratiques
- **Prettier** : Formatage automatique du code
- **Husky** : Hooks Git automatiques
- **Commitlint** : Validation des messages de commit
- **Lint-staged** : Analyse uniquement des fichiers modifiés

## ��� Installation Rapide

```bash
# Cloner et installer
git clone <repo-url>
cd MICRO-SAAS-QD
npm run install

cd pwa-planteau-api
npm run install

# Configuration Husky
npm install
git config core.hooksPath .husky
```
## Pense à remplir les .env
Pense à bien créer tes .env en fonction des .env.example. Il y en a un dans pwa-planteau-api, un dans client et un dans api. 

▶️ Lancer avec Docker Compose
```
docker-compose up -d
```

## ��� Scripts Essentiels

```bash
# Cloner et installer les dépendances dans api et client
cd api
npm run install

cd client
npm run install

# Vérifier la qualité globale
npm run quality:check

# Corriger automatiquement
npm run quality:fix

# Lancer le projet
npm run dev
```

## 📜 Détail des scripts

| Script             | Description                                                        |
|--------------------|--------------------------------------------------------------------|
| `dev`              | Démarre le serveur de développement                                |
| `build`            | Compile TypeScript et construit le projet                          |
| `preview`          | Lance un serveur local pour prévisualiser le build                 |
| `lint`             | Analyse le code avec ESLint                                        |
| `lint:fix`         | Corrige automatiquement les erreurs ESLint                         |
| `format`           | Formate le code avec Prettier                                      |
| `format:check`     | Vérifie le formatage Prettier sans modifier les fichiers           |
| `quality`          | Lint + vérification du formatage                                   |
| `quality:fix`      | Lint + correction du formatage                                     |
| `type-check`       | Vérifie les types TypeScript sans générer de fichiers              |

## ��� Format des Commits

### ✅ Formats Valides
```bash
git commit -m "feat: add user authentication"
git commit -m "fix: resolve login bug"
git commit -m "docs: update README"
git commit -m "chore: update dependencies"
```

### ❌ Formats Invalides
```bash
git commit -m "fix bug"        # Manque les deux-points
git commit -m "added feature"  # Mauvais type
```

### Types Disponibles
- `feat` : Nouvelle fonctionnalité
- `fix` : Correction de bug
- `docs` : Documentation
- `chore` : Maintenance
- `refactor` : Refactoring
- `test` : Tests

## ��� Workflow Automatique

1. **Modifier** du code TypeScript/React
2. **Commit** avec le bon format
3. **Hooks automatiques** :
   - ESLint analyse et corrige
   - Prettier formate le code
   - Commitlint valide le message
4. **Commit accepté** si tout passe

## ��� Structure

```
micro-saas-qd/
├── .husky/              # Hooks Git
├── package.json         # Scripts globaux
├── *config.js          # Configuration outils
└── pwa-planteau-api/
    ├── client/         # React + TypeScript
    └── api/           # Node.js + Express
```

