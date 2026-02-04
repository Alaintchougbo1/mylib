# Library Management System

Système complet de gestion de bibliothèque en ligne avec backend Symfony (API REST) et frontend Next.js.

## 📚 Description

Ce projet est un système de gestion de bibliothèque permettant :
- Aux **usagers** : consulter les livres disponibles et faire des demandes d'emprunt
- Aux **administrateurs** : gérer les livres, les utilisateurs et les demandes d'emprunt

## 🛠️ Technologies Utilisées

### Backend
- **Symfony 6.4** - Framework PHP
- **Doctrine ORM** - Gestion de la base de données
- **MySQL 8.0** - Base de données
- **JWT (lexik/jwt-authentication-bundle)** - Authentification
- **Nelmio API Doc Bundle** - Documentation Swagger

### Frontend
- **Next.js 14+** avec App Router
- **TypeScript** - Typage statique
- **React** - Bibliothèque UI

### DevOps
- **Docker & Docker Compose** - Containerisation
- **phpMyAdmin** - Administration de la base de données

## 📁 Structure du Projet

```
library-management-system/
├── backend/                    # API Symfony
│   ├── src/
│   │   ├── Controller/        # Controllers API
│   │   ├── Entity/            # Entités Doctrine (User, Livre, Demande)
│   │   ├── Repository/        # Repositories
│   │   ├── Service/           # Logique métier
│   │   ├── DTO/               # Data Transfer Objects
│   │   ├── Exception/         # Exceptions custom
│   │   └── Security/          # Configuration sécurité
│   ├── config/
│   ├── migrations/
│   └── ...
├── frontend/                   # Application Next.js (à venir)
├── docker-compose.yml
├── .env.example
└── README.md
```

## 🚀 Installation

### Prérequis

- **Docker** et **Docker Compose** installés
- **PHP 8.2+** (pour développement local hors Docker)
- **Composer** (pour développement local hors Docker)
- **Node.js 20+** (pour le frontend)

### Étapes d'Installation

#### 1. Cloner le Dépôt

```bash
git clone <url-du-repo>
cd library-management-system
```

#### 2. Configuration de l'Environnement

Copier le fichier `.env.example` :

```bash
cp .env.example .env
```

#### 3. Lancer Docker

```bash
docker-compose up -d
```

Cela démarre :
- **MySQL** sur le port `3306`
- **Backend Symfony** sur le port `8000`
- **Frontend Next.js** sur le port `3000` (quand disponible)
- **phpMyAdmin** sur le port `8080`

#### 4. Installer les Dépendances Backend

```bash
cd backend
composer install
```

#### 5. Générer les Clés JWT

```bash
mkdir -p config/jwt
openssl genpkey -out config/jwt/private.pem -aes256 -algorithm rsa -pkeyopt rsa_keygen_bits:4096 -pass pass:your-jwt-passphrase
openssl pkey -in config/jwt/private.pem -passin pass:your-jwt-passphrase -out config/jwt/public.pem -pubout
```

**Note :** Assurez-vous que le passphrase correspond à `JWT_PASSPHRASE` dans votre `.env`.

#### 6. Exécuter les Migrations

```bash
php bin/console doctrine:migrations:migrate
```

#### 7. (Optionnel) Charger des Données de Test (Fixtures)

Pour charger des données de démonstration (utilisateurs, livres, demandes) :

```bash
# Avec Docker
docker-compose exec backend php bin/console doctrine:fixtures:load

# Sans Docker
php bin/console doctrine:fixtures:load
```

**⚠️ Attention** : Cette commande supprimera toutes les données existantes et les remplacera par les données de test.

Les fixtures créent automatiquement :
- **3 utilisateurs** :
  - Admin : `admin@library.com` / `admin123456` (ROLE_ADMIN)
  - User1 : `user1@test.com` / `pass123456` (ROLE_USER)
  - User2 : `user2@test.com` / `pass123456` (ROLE_USER)
- **12 livres** de programmation (Clean Code, Design Patterns, etc.)
- **5 demandes d'emprunt** avec différents statuts (en_attente, approuvee, refusee, retournee)

## 📡 API Endpoints

### Authentification

| Méthode | Endpoint | Description | Accès |
|---------|----------|-------------|-------|
| POST | `/api/auth/register` | Inscription (ROLE_USER par défaut) | Public |
| POST | `/api/auth/login` | Connexion | Public |
| GET | `/api/auth/me` | Informations utilisateur connecté | Authentifié |

### Livres

| Méthode | Endpoint | Description | Accès |
|---------|----------|-------------|-------|
| GET | `/api/livres` | Liste des livres (filtres: titre, auteur, disponible) | Authentifié |
| GET | `/api/livres/{id}` | Détails d'un livre | Authentifié |
| POST | `/api/livres` | Créer un livre | ADMIN |
| PUT | `/api/livres/{id}` | Modifier un livre | ADMIN |
| DELETE | `/api/livres/{id}` | Supprimer un livre | ADMIN |

### Utilisateurs

| Méthode | Endpoint | Description | Accès |
|---------|----------|-------------|-------|
| GET | `/api/utilisateurs` | Liste des utilisateurs | ADMIN |
| GET | `/api/utilisateurs/{id}` | Détails d'un utilisateur | ADMIN |
| POST | `/api/utilisateurs` | Créer un utilisateur | ADMIN |
| PUT | `/api/utilisateurs/{id}` | Modifier un utilisateur | ADMIN |
| DELETE | `/api/utilisateurs/{id}` | Supprimer un utilisateur | ADMIN |

### Demandes d'Emprunt

| Méthode | Endpoint | Description | Accès |
|---------|----------|-------------|-------|
| GET | `/api/demandes` | Liste des demandes (USER: ses demandes, ADMIN: toutes) | Authentifié |
| GET | `/api/demandes/{id}` | Détails d'une demande | Authentifié |
| POST | `/api/demandes` | Créer une demande | USER |
| PUT | `/api/demandes/{id}` | Modifier le statut d'une demande | ADMIN |
| DELETE | `/api/demandes/{id}` | Supprimer une demande | ADMIN |

### Statistiques

| Méthode | Endpoint | Description | Accès |
|---------|----------|-------------|-------|
| GET | `/api/statistiques` | Statistiques de la bibliothèque | ADMIN |

## 📖 Documentation Swagger

Une fois le backend démarré, accédez à la documentation Swagger interactive :

```
http://localhost:8000/api/doc
```

## 🔐 Authentification

L'API utilise **JWT (JSON Web Tokens)** pour l'authentification.

### Flux d'Authentification

1. **Inscription** : `POST /api/auth/register`
   ```json
   {
     "email": "user@example.com",
     "password": "password123",
     "nom": "Dupont",
     "prenom": "Jean"
   }
   ```

2. **Connexion** : `POST /api/auth/login`
   ```json
   {
     "email": "user@example.com",
     "password": "password123"
   }
   ```

   Réponse :
   ```json
   {
     "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
     "user": { ... }
   }
   ```

3. **Utiliser le Token**

   Ajoutez le token dans l'en-tête `Authorization` de chaque requête :
   ```
   Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
   ```

## 👥 Rôles et Permissions

- **ROLE_USER** (Usager)
  - Consulter les livres
  - Créer des demandes d'emprunt
  - Consulter ses propres demandes

- **ROLE_ADMIN** (Administrateur)
  - Toutes les permissions de ROLE_USER
  - Gérer les livres (CRUD)
  - Gérer les utilisateurs (CRUD)
  - Approuver/refuser les demandes
  - Consulter les statistiques

## 💾 Base de Données

### Entités

#### User
- `id`, `email` (unique), `password` (hashé), `nom`, `prenom`
- `role` : `ROLE_USER` | `ROLE_ADMIN`
- `created_at`, `updated_at`

#### Livre
- `id`, `titre`, `auteur`, `isbn` (unique, nullable)
- `description` (nullable), `disponible` (boolean)
- `created_at`, `updated_at`

#### Demande
- `id`, `user_id` (FK), `livre_id` (FK)
- `statut` : `en_attente` | `approuvee` | `refusee` | `retournee`
- `date_demande`, `date_retour` (nullable), `commentaire` (nullable)
- `created_at`, `updated_at`

### Logique de Disponibilité

- Quand une demande est **approuvée** → le livre devient **non disponible**
- Quand une demande passe à **retournée** → le livre redevient **disponible**
- Quand une demande approuvée est **refusée** ou **supprimée** → le livre redevient **disponible**

## 🧪 Tests

### Tester l'API avec cURL

#### Inscription
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@library.com",
    "password": "admin123",
    "nom": "Admin",
    "prenom": "Super"
  }'
```

#### Connexion
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@library.com",
    "password": "admin123"
  }'
```

#### Récupérer les Livres
```bash
curl -X GET http://localhost:8000/api/livres \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🐳 Commandes Docker Utiles

```bash
# Démarrer les services
docker-compose up -d

# Arrêter les services
docker-compose down

# Voir les logs
docker-compose logs -f backend

# Redémarrer un service
docker-compose restart backend

# Accéder au conteneur backend
docker-compose exec backend bash

# Reconstruire les images
docker-compose build
```

## 📊 Accès phpMyAdmin

Pour gérer visuellement la base de données :

```
URL: http://localhost:8080
Serveur: mysql
Utilisateur: library_user
Mot de passe: library_password
```

## 🔧 Développement

### Architecture

Le backend suit une architecture en couches :

1. **Controller** : Gestion des requêtes HTTP et validation
2. **Service** : Logique métier
3. **Repository** : Accès aux données
4. **Entity** : Modèles de données
5. **DTO** : Transfert de données (input/output)

### Conventions de Code

- **PSR-12** pour le style de code PHP
- **Strict Types** activé dans tous les fichiers PHP
- **DTOs** pour toutes les entrées/sorties API
- **Documentation** PHPDoc pour toutes les classes et méthodes
- **Messages de commit** conventionnels (feat, fix, docs, refactor, chore)

### Workflow Git

```
main          ← Production (code final)
  ↑
staging       ← Tests/validation
  ↑
release       ← Préparation release
  ↑
feature       ← Intégration des features
  ↑
feat/*        ← Développement
```

## 📝 Identifiants de Test

**Important :** Vous devez créer manuellement vos utilisateurs via l'API. Voici des exemples :

### Administrateur
```json
{
  "email": "admin@library.com",
  "password": "admin123",
  "nom": "Admin",
  "prenom": "Super",
  "role": "ROLE_ADMIN"
}
```

### Usager
```json
{
  "email": "user@library.com",
  "password": "user123",
  "nom": "Dupont",
  "prenom": "Jean"
}
```

## 🤝 Contribution

Ce projet est un test de recrutement personnel. Les contributions externes ne sont pas acceptées.

## 📄 Licence

Projet personnel - Tous droits réservés

## ⚠️ Notes Importantes

- Les mots de passe sont hashés avec Symfony PasswordHasher (bcrypt)
- Les tokens JWT expirent après 3600 secondes (1 heure)
- La passphrase JWT par défaut est `your-jwt-passphrase` (à changer en production)
- Les migrations doivent être exécutées avant le premier lancement

## 📧 Contact

Pour toute question concernant ce projet, veuillez créer une issue sur GitHub.

---

**Développé par Alain Tchougbo**
