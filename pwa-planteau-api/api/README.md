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
Prérequis
- `Node.js` : version compatible avec les dépendances (recommandé : Node >= 18, testé ici avec Node 24). 
- Une base PostgreSQL accessible et la variable d'environnement `DATABASE_URL` correctement configurée dans le fichier `pwa-planteau-api/api/.env`.

Commandes utiles (exécuter depuis le dossier `pwa-planteau-api/api`)

1) Installer les dépendances

```bash
npm install
```

2) Appliquer les migrations Prisma (crée et applique les migrations nécessaires)

```bash
# Développement local : crée et applique une migration, et régénère le client
npx prisma migrate dev --name <nom_de_la_migration>

# En CI / production : applique les migrations déjà générées
npx prisma migrate deploy
```

3) Générer / régénérer le client Prisma

```bash
# Généralement `migrate dev` génère automatiquement le client.
# Utiliser si vous avez modifié `schema.prisma` sans lancer `migrate dev`.
npx prisma generate
```

4) Explorer la base (Prisma Studio)

```bash
npx prisma studio
```

5) Lancer le script de fixtures

```bash
# Assurez-vous d'avoir appliqué les migrations et configuré DATABASE_URL
npm run create-fixtures
```

 

