# Étape 1: Utiliser l'image officielle Node.js comme base
FROM node:24-alpine

# Étape 2: Créer et définir le répertoire de travail dans le conteneur
WORKDIR /app

RUN npm install -g prisma

# Étape 3: Copier les fichiers package.json et package-lock.json (ou yarn.lock) dans le conteneur
COPY package*.json ./

# Étape 4: Installer les dépendances de l'application
RUN npm install

# Étape 5: Copier tous les fichiers source dans le conteneur
COPY . .

# Étape 6: Exposer le port que l'API va utiliser
EXPOSE 3000

# Étape 7: Démarrer le serveur
CMD ["npm", "run", "dev"]