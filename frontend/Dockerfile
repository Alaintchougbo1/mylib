FROM node:20-alpine

# Configuration du répertoire de travail
WORKDIR /app

# Copie des fichiers package.json et package-lock.json
COPY package*.json ./

# Installation des dépendances (si package.json existe)
RUN if [ -f package.json ]; then npm install; fi

# Copie du reste des fichiers
COPY . .

# Exposition du port
EXPOSE 3000

# Commande par défaut
CMD ["npm", "run", "dev"]
