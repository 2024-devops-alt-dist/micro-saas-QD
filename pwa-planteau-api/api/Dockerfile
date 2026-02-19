# Étape 1: Utiliser l'image officielle Node.js comme base
FROM node:24-alpine

# Étape 2: Créer et définir le répertoire de travail dans le conteneur
WORKDIR /app

RUN npm install -g prisma@7.3.0

# Étape 3: Copier les fichiers package.json et package-lock.json (ou yarn.lock) dans le conteneur
COPY package*.json ./

# Étape 4: Installer les dépendances de l'application
RUN npm install

# Étape 5: Copier tous les fichiers source dans le conteneur
COPY . .

RUN mkdir -p public/uploads

# Étape 6: Exposer le port que l'API va utiliser
EXPOSE 3000

# Étape 7: Démarrer le serveur
CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && npm run start"]