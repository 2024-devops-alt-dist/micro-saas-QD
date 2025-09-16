# Client — React + Vite + Tailwind CSS

Courte description  
Frontend React créé avec Vite et stylisé avec Tailwind CSS. Ce fichier décrit l'installation, les commandes de développement, build et quelques conseils de dépannage sur Windows (PowerShell).

Prérequis
- Node.js >= 16
- npm (ou pnpm/yarn)
- (Optionnel) Docker pour construire/servir l'image production

Installation (depuis le dossier racine du repo)
1. Aller dans le dossier client
```powershell
cd "c:\Users\qdegli-esposti\OneDrive - COEXYA GROUP\Desktop\Coexya\micro-saas-QD\pwa-planteau-api\client"
```

2. Installer les dépendances
```powershell
npm install
```

Configurer Tailwind (si non déjà configuré)
1. Installer Tailwind et plugins PostCSS
```powershell
npm install -D tailwindcss postcss autoprefixer
```

2. Générer la config Tailwind + PostCSS
- Si `npx tailwindcss init -p` renvoie une erreur, utiliser :
```powershell
npm exec tailwindcss init -p
```
ou forcer la version :
```powershell
npx tailwindcss@latest init -p
```

3. Vérifier / ajouter :
- tailwind.config.cjs — content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"]
- src/index.css — doit contenir :
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
- Importer `./index.css` dans `src/main.jsx` ou `src/main.tsx`

Commandes utiles (développement et production)
- Lancer le serveur de développement (Vite, HMR)
```powershell
npm run dev
# Ouvrir l'URL affichée (ex: http://localhost:5173)
```

- Build pour la production
```powershell
npm run build
```

- Tester le build localement
```powershell
npm run preview
```

Docker (exemples courts)
- Build et run image (exemple multi-stage)
```powershell
docker build -t my-client:latest .
docker run -p 80:80 my-client:latest
```

- Avec Docker Compose (depuis la racine si compose.yml configuré)
```powershell
docker-compose -f compose.yml up --build
```

Dépannage rapide
- Vérifier versions :
```powershell
node -v
npm -v
```
- Si `npx` échoue pour des binaires locaux, essayer `npm exec <cmd>` ou nettoyer le cache npm :
```powershell
npm cache clean --force
npm install
```
- Si Tailwind n'apparaît pas, vérifier que `index.css` est importé dans `main.jsx` et que `tailwind.config.cjs` couvre vos fichiers (`content`).

Structure recommandée
- index.html
- src/
  - main.jsx
  - index.css
  - App.jsx
  - components/
  - pages/

Notes
- Assurez-vous d'importer `index.css` dans l'entrée React pour activer Tailwind.
- Adapter les scripts et Dockerfile selon votre CI/CD et besoins de proxy vers l'API.

Liens utiles
- Vite: https://vitejs.dev/
- Tailwind CSS: https://tailwindcss.com/docs/installation