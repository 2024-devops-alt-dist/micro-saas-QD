# Client — Initialisation avec Vite (React + TypeScript)

Prérequis : Node.js (>=16 recommandé) et npm installés.

1) Créer le projet avec Vite
- Lance la commande puis répond aux invites (choisir "React" puis "TypeScript") :

```bash
npm create vite@latest client
```

2) Entrer dans le dossier et installer les dépendances

```bash
cd client
npm install
```

3) Installer les types React (utile pour TypeScript)

```bash
npm install --save-dev @types/react @types/react-dom
```

4) Démarrer le serveur de développement

```bash
npm run dev
```

Ouvrir l'URL indiquée (généralement http://localhost:5173).

5) Construire et prévisualiser la version de production

```bash
npm run build
npm run preview
```

6) Intégrer Tailwind CSS (optionnel)
- Installer Tailwind et créer la config PostCSS :

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

- Configurer `tailwind.config.js` — inscrire les fichiers sources :

```js
// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
}
```

- Ajouter les directives Tailwind dans `src/index.css` :

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- Aucun plugin Tailwind spécifique n’est nécessaire dans `vite.config.ts`.

7) Git — initialiser et créer une branche

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
# créer une branche pour la page/composant
git checkout -b Page/TestConnexion
```

8) Conseils rapides
- ESLint / Prettier : ajouter et configurer selon vos préférences.
- Type-check : si vous activez des règles ESLint dépendantes du type, configurez `tsconfig.app.json` et passez par `eslint --ext .ts,.tsx`.
- Docker : si vous avez un Dockerfile, build puis run selon votre CI/CD.

Ceci décrit les étapes minimales pour initialiser et lancer le client React + TypeScript créé avec Vite.