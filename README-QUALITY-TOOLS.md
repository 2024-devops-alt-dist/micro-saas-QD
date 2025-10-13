# í³‹ Guide des Outils de QualitÃ©

Configuration automatisÃ©e pour garantir un code propre et cohÃ©rent.

## í» ï¸ Outils UtilisÃ©s

- **ESLint** : DÃ©tection d'erreurs et bonnes pratiques
- **Prettier** : Formatage automatique du code
- **Husky** : Hooks Git automatiques
- **Commitlint** : Validation des messages de commit
- **Lint-staged** : Analyse uniquement des fichiers modifiÃ©s

## íº€ Installation Rapide

```bash
# Cloner et installer
git clone <repo-url>
cd micro-saas-qd
npm run install:all

# Configuration Husky
npm install
git config core.hooksPath .husky
```

## í³ Scripts Essentiels

```bash
# VÃ©rifier la qualitÃ© globale
npm run quality:check

# Corriger automatiquement
npm run quality:fix

# Lancer le projet
npm run dev
```

## í²¬ Format des Commits

### âœ… Formats Valides
```bash
git commit -m "feat: add user authentication"
git commit -m "fix: resolve login bug"
git commit -m "docs: update README"
git commit -m "chore: update dependencies"
```

### âŒ Formats Invalides
```bash
git commit -m "fix bug"        # Manque les deux-points
git commit -m "added feature"  # Mauvais type
```

### Types Disponibles
- `feat` : Nouvelle fonctionnalitÃ©
- `fix` : Correction de bug
- `docs` : Documentation
- `chore` : Maintenance
- `refactor` : Refactoring
- `test` : Tests

## í´„ Workflow Automatique

1. **Modifier** du code TypeScript/React
2. **Commit** avec le bon format
3. **Hooks automatiques** :
   - ESLint analyse et corrige
   - Prettier formate le code
   - Commitlint valide le message
4. **Commit acceptÃ©** si tout passe

## í°› DÃ©pannage

### Hooks ne marchent pas ?
```bash
git config core.hooksPath .husky
chmod +x .husky/pre-commit .husky/commit-msg
```

### Erreurs de dÃ©pendances ?
```bash
npm run install:all
```

### Bypass temporaire (urgence) ?
```bash
git commit -m "emergency fix" --no-verify
```

## í³ Structure

```
micro-saas-qd/
â”œâ”€â”€ .husky/              # Hooks Git
â”œâ”€â”€ package.json         # Scripts globaux
â”œâ”€â”€ *config.js          # Configuration outils
â””â”€â”€ pwa-planteau-api/
    â”œâ”€â”€ client/         # React + TypeScript
    â””â”€â”€ api/           # Node.js + Express
```

## âœ… Avantages

- í´’ **QualitÃ© garantie** Ã  chaque commit
- í´ **Code cohÃ©rent** dans l'Ã©quipe
- íº€ **Corrections automatiques**
- í³– **Historique lisible**

---

**La qualitÃ© est maintenant automatique ! í¾‰**
