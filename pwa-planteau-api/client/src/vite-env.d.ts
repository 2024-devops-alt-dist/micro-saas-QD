/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_API_URL?: string;
  // Ajoute ici toutes tes variables VITE_...
}

interface ImportMeta {
  env: ImportMetaEnv;
}
