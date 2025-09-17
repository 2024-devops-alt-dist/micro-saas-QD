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