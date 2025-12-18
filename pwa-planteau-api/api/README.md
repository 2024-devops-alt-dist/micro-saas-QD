cd "c:\Users\qdegli-esposti\OneDrive - COEXYA GROUP\Desktop\Coexya\micro-saas-QD\pwa-planteau-api"
mkdir api
cd api

# init npm
npm init -y

# dépendances runtime
npm install express

# dépendances dev (TypeScript, TS runner, types)
npm install -D typescript ts-node-dev @types/node @types/express

# créer l'initial tsconfig
npx tsc --init

# installer les types pour node si nécessaire (déjà dans dev deps)

## Fixtures (données de test)

Ce projet contient un script TypeScript pour insérer des données de test (Household, User, Plant, Tasks, Note) dans la base de données via Prisma.

Pré-requis
- Node.js version compatible avec les dépendances du projet (ex: v20.17.0).
- Une base PostgreSQL accessible et la variable d'environnement `DATABASE_URL` correctement configurée dans `pwa-planteau-api/api/.env`.

Commandes utiles (depuis le dossier `pwa-planteau-api/api`)

1) Installer les dépendances

```bash
npm install
```

2) Appliquer les migrations Prisma (crée et applique les migrations nécessaires)

```bash
# Depuis pwa-planteau-api/api
npx prisma migrate dev --name <nom_de_la_migration>
```

3) Générer / régénérer le client Prisma (optionnel, migrate le fait automatiquement)

```bash
npx prisma generate
```

4) Lancer le script de fixtures

```bash
npm run create-fixtures
```
 

