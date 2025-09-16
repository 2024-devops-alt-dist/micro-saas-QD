
# client — React + Vite + Tailwind CSS (v4.1)

Un README concis et adapté à l'état actuel du projet : Vite + React avec Tailwind CSS v4.1 installé via PostCSS.

**Prérequis**
- Node.js (recommandé >= 18)
- npm
- (Optionnel) Docker

---

## Installation

Ouvrez un terminal et placez-vous dans le dossier `client` :

```powershell
cd "c:\Users\qdegli-esposti\OneDrive - COEXYA GROUP\Desktop\Coexya\micro-saas-QD\pwa-planteau-api\client"
npm install
```

---

## Commandes courantes

- Développement (serveur Vite) :
```powershell
npm run dev
```

- Build production :
```powershell
npm run build
```

- Tester le build localement :
```powershell
npm run preview
```

---

## Configuration Tailwind (v4.1)

Fichiers clés (doivent exister et être configurés) :

- `postcss.config.cjs` → doit utiliser `@tailwindcss/postcss` :

```javascript
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```

- `tailwind.config.cjs` → `content` doit couvrir `index.html` et `src/**/*` :

```javascript
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: { extend: {} },
  plugins: [],
}
```

- `src/index.css` → syntaxe v4 :

```css
@import "tailwindcss/preflight";
@import "tailwindcss/theme";
@import "tailwindcss/utilities";
/* Vos styles personnalisés dessous */
```

- `src/main.jsx` doit importer `./index.css` (déjà en place).

---

## Vite

Le plugin `@tailwindcss/vite` est optionnel. Dans cette configuration nous utilisons Tailwind via PostCSS (plugin `@tailwindcss/postcss`) :

`vite.config.js` doit contenir au moins :

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

---

## Docker (optionnel)

Exemple Dockerfile multi-stage (build puis Nginx) :

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## Vérification rapide que Tailwind fonctionne

1. Dans `src/App.jsx` ajoutez (ou modifiez) un composant test :

```jsx
export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <h1 className="text-5xl font-bold text-blue-600">Tailwind OK</h1>
    </div>
  )
}
```

2. Lancer :

```powershell
npm run dev
# Ouvrir l'URL indiquée (ex: http://localhost:5173)
```

Si le style s'applique (tailwind classes visibles), tout est correct.

---

## Erreurs courantes et résolutions (déjà rencontrées)

- `Unknown word "use strict"` ou erreurs PostCSS : assurez-vous de ne pas importer `tailwindcss` en tant que JS (supprimez `@import "tailwindcss"` dans tout fichier CSS). Utilisez les imports v4 (`preflight`, `theme`, `utilities`).
- `Missing "./components" specifier` : le package `tailwindcss` v4 n'exporte pas `./components`. Utilisez `@import "tailwindcss/theme"` au lieu de `components`.
- `@tailwindcss/vite` provoque des erreurs d'export : retirez le plugin de `vite.config.js` et utilisez `@tailwindcss/postcss`.

---

## Git

- Garder versionnés : `src/`, `package.json`, `package-lock.json`, `Dockerfile`, `tailwind.config.cjs`, `postcss.config.cjs`, `README.md`.
- Ignorer : `node_modules/`, `dist/`, `.env`, `.vite/`, `*.log`, `.cache/`.

