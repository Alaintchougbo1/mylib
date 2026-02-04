# Library Management System

> Un système moderne de gestion de bibliothèque développé dans le cadre d'un test technique. Ce projet met en œuvre une architecture full-stack complète avec API REST, authentification JWT, et interface utilisateur réactive.

## À propos du projet

Ce système permet de gérer efficacement une bibliothèque en ligne avec deux types d'utilisateurs distincts :

- **Usagers** : Peuvent parcourir le catalogue, rechercher des livres et soumettre des demandes d'emprunt
- **Administrateurs** : Disposent d'un tableau de bord complet pour gérer les livres, les utilisateurs et valider les demandes

Le projet a été conçu avec une attention particulière portée à la sécurité, la maintenabilité du code et l'expérience utilisateur.

## Stack technique

### Backend
- **Symfony 6.4** avec architecture en couches (Controller → Service → Repository → Entity)
- **Doctrine ORM** pour l'abstraction de la base de données
- **MySQL 8.0** comme SGBD
- **JWT Authentication** via `lexik/jwt-authentication-bundle`
- **Swagger/OpenAPI** pour la documentation interactive de l'API

### Frontend
- **Next.js 14+** avec App Router pour le routing moderne
- **TypeScript** en mode strict pour la fiabilité du code
- **React** avec hooks personnalisés pour la logique métier
- **Tailwind CSS** pour le styling

### Infrastructure
- **Docker Compose** pour l'orchestration des services
- **phpMyAdmin** pour l'administration visuelle de la base

## Architecture du projet

```
mylib/
├── backend/
│   ├── src/
│   │   ├── Controller/      # Points d'entrée de l'API (thin controllers)
│   │   ├── Service/         # Logique métier (business logic)
│   │   ├── Repository/      # Accès aux données (custom queries)
│   │   ├── Entity/          # Modèles de données Doctrine
│   │   ├── DTO/             # Data Transfer Objects (validation I/O)
│   │   ├── Security/        # Guards et voters pour l'autorisation
│   │   └── Exception/       # Exceptions métier personnalisées
│   ├── config/
│   ├── migrations/          # Versioning de la base de données
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── app/            # Pages Next.js (App Router)
│   │   ├── components/     # Composants UI réutilisables
│   │   ├── services/       # Appels API (axios/fetch)
│   │   ├── hooks/          # Hooks custom (useAuth, useFetch...)
│   │   ├── context/        # Providers React (AuthContext)
│   │   └── types/          # Définitions TypeScript
│   └── ...
├── docker-compose.yml
├── .env.example
└── README.md
```

## Installation et lancement

### Prérequis

Assurez-vous d'avoir installé :
- Docker & Docker Compose
- (Optionnel) PHP 8.2+ et Composer pour le développement local
- (Optionnel) Node.js 20+ pour le développement frontend

### Installation rapide

1. **Cloner le projet**
   ```bash
   git clone https://github.com/votre-username/mylib.git
   cd mylib
   ```

2. **Configuration de l'environnement**
   ```bash
   cp .env.example .env
   # Éditez .env si nécessaire (ports, credentials MySQL, JWT passphrase)
   ```

3. **Démarrer les services avec Docker**
   ```bash
   docker-compose up -d
   ```
   Cela lance automatiquement :
   - Backend Symfony → `http://localhost:8000`
   - Frontend Next.js → `http://localhost:3000`
   - MySQL → port `3306`
   - phpMyAdmin → `http://localhost:8080`

4. **Installer les dépendances backend**
   ```bash
   cd backend
   composer install
   ```

5. **Générer les clés JWT**
   ```bash
   mkdir -p config/jwt
   
   # Générer la clé privée (vous serez invité à créer un passphrase)
   openssl genpkey -out config/jwt/private.pem -aes256 -algorithm rsa -pkeyopt rsa_keygen_bits:4096
   
   # Générer la clé publique (vous devrez saisir le même passphrase)
   openssl pkey -in config/jwt/private.pem -out config/jwt/public.pem -pubout
   ```
   
    **Important** : Assurez-vous que le passphrase que vous créez correspond bien à la valeur de `JWT_PASSPHRASE` dans votre fichier `.env`.

6. **Appliquer les migrations de base de données**
   ```bash
   php bin/console doctrine:migrations:migrate
   ```

7. **Charger les données de test (optionnel mais recommandé)**
   ```bash
   # Avec Docker
   docker-compose exec backend php bin/console doctrine:fixtures:load
   
   # Ou en local
   php bin/console doctrine:fixtures:load
   ```
   
   Cette commande supprime toutes les données existantes.
   
   Les fixtures créent :
   - **1 administrateur** : `admin@library.com` / `admin123456`
   - **2 utilisateurs test** : `user1@test.com` / `pass123456` et `user2@test.com` / `pass123456`
   - **12 livres** de programmation (Clean Code, Design Patterns, Refactoring, etc.)
   - **5 demandes d'emprunt** avec différents statuts

8. **Accéder à l'application**
   - Frontend : http://localhost:3000
   - API Swagger : http://localhost:8000/api/doc
   - phpMyAdmin : http://localhost:8080 (utilisateur: `library_user`, mot de passe: `library_password`)

## Documentation de l'API

### Authentification

L'API utilise JWT pour sécuriser les endpoints. Le workflow est simple :

1. **S'inscrire** ou **se connecter** pour obtenir un token
2. **Inclure le token** dans l'en-tête `Authorization: Bearer {token}` pour toutes les requêtes protégées

#### Endpoints publics

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/auth/register` | Créer un nouveau compte utilisateur |
| `POST` | `/api/auth/login` | Se connecter et obtenir un JWT |

#### Endpoints authentifiés

| Ressource | Méthode | Endpoint | Rôle requis | Description |
|-----------|---------|----------|-------------|-------------|
| **Profil** | `GET` | `/api/auth/me` | USER, ADMIN | Récupérer ses informations |
| **Livres** | `GET` | `/api/livres` | USER, ADMIN | Lister les livres (avec filtres) |
| | `GET` | `/api/livres/{id}` | USER, ADMIN | Détails d'un livre |
| | `POST` | `/api/livres` | **ADMIN** | Ajouter un livre |
| | `PUT` | `/api/livres/{id}` | **ADMIN** | Modifier un livre |
| | `DELETE` | `/api/livres/{id}` | **ADMIN** | Supprimer un livre |
| **Utilisateurs** | `GET` | `/api/utilisateurs` | **ADMIN** | Lister les utilisateurs |
| | `GET` | `/api/utilisateurs/{id}` | **ADMIN** | Détails d'un utilisateur |
| | `POST` | `/api/utilisateurs` | **ADMIN** | Créer un utilisateur |
| | `PUT` | `/api/utilisateurs/{id}` | **ADMIN** | Modifier un utilisateur |
| | `DELETE` | `/api/utilisateurs/{id}` | **ADMIN** | Supprimer un utilisateur |
| **Demandes** | `GET` | `/api/demandes` | USER, ADMIN | Lister les demandes* |
| | `GET` | `/api/demandes/{id}` | USER, ADMIN | Détails d'une demande |
| | `POST` | `/api/demandes` | **USER** | Créer une demande d'emprunt |
| | `PUT` | `/api/demandes/{id}` | **ADMIN** | Modifier le statut (approuver/refuser) |
| | `DELETE` | `/api/demandes/{id}` | **ADMIN** | Supprimer une demande |
| **Stats** | `GET` | `/api/statistiques` | **ADMIN** | Tableau de bord complet |

\* *Les utilisateurs standard ne voient que leurs propres demandes, les admins voient tout*

### Exemples d'utilisation

#### S'inscrire

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123!",
    "nom": "Doe",
    "prenom": "John"
  }'
```

#### Se connecter

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123!"
  }'
```

Réponse :
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "email": "john.doe@example.com",
    "nom": "Doe",
    "prenom": "John",
    "role": "ROLE_USER"
  }
}
```

#### Rechercher des livres

```bash
curl -X GET "http://localhost:8000/api/livres?titre=clean&disponible=true" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

La documentation complète et interactive est disponible sur **http://localhost:8000/api/doc** (Swagger UI).

## Modèle de données

### Entités principales

#### User
Représente un utilisateur du système (usager ou administrateur).

```php
- id: int (auto)
- email: string (unique, requis)
- password: string (hashé avec bcrypt)
- nom: string
- prenom: string
- role: enum('ROLE_USER', 'ROLE_ADMIN')
- created_at: datetime
- updated_at: datetime
```

#### Livre
Représente un ouvrage de la bibliothèque.

```php
- id: int (auto)
- titre: string (requis)
- auteur: string (requis)
- isbn: string (unique, optionnel)
- description: text (optionnel)
- disponible: boolean (défaut: true)
- created_at: datetime
- updated_at: datetime
```

#### Demande
Représente une demande d'emprunt faite par un utilisateur.

```php
- id: int (auto)
- user: User (ManyToOne)
- livre: Livre (ManyToOne)
- statut: enum('en_attente', 'approuvee', 'refusee', 'retournee')
- date_demande: datetime (auto)
- date_retour: datetime (optionnel)
- commentaire: text (optionnel)
- created_at: datetime
- updated_at: datetime
```

### Règles métier

La disponibilité des livres est gérée automatiquement :

1. **Demande approuvée** → `livre.disponible = false`
2. **Demande marquée comme retournée** → `livre.disponible = true`
3. **Demande approuvée puis refusée/supprimée** → `livre.disponible = true`

Ces règles sont implémentées dans `DemandeService` pour garantir la cohérence des données.

## Sécurité et permissions

### Rôles

- **ROLE_USER** : Utilisateur standard (accès en lecture sur les livres, gestion de ses demandes)
- **ROLE_ADMIN** : Administrateur (accès complet à toutes les ressources)

### Protection des endpoints

Les permissions sont appliquées au niveau des controllers Symfony via :
- Attributs `#[IsGranted]`
- Voters personnalisés pour les règles complexes
- Validation des DTOs avec le composant Symfony Validator

### Bonnes pratiques implémentées

- Mots de passe hashés avec `PasswordHasher` (bcrypt)
- Tokens JWT signés avec RS256 (clés RSA 4096 bits)
- Validation stricte des données d'entrée
- DTOs pour éviter l'exposition directe des entités
- CORS configuré pour autoriser uniquement le frontend

## Tests et validation

### Tester l'API manuellement

La collection Swagger intégrée permet de tester tous les endpoints directement depuis votre navigateur : **http://localhost:8000/api/doc**

### Tests automatisés (à venir)

Le projet est structuré pour faciliter l'ajout de tests :
- Tests unitaires avec PHPUnit (backend)
- Tests d'intégration API avec API Platform Test Client
- Tests E2E avec Playwright (frontend)

## Commandes Docker utiles

```bash
# Démarrer tous les services
docker-compose up -d

# Arrêter tous les services
docker-compose down

# Voir les logs en temps réel
docker-compose logs -f backend
docker-compose logs -f frontend

# Redémarrer un service spécifique
docker-compose restart backend

# Accéder au shell d'un conteneur
docker-compose exec backend bash

# Reconstruire les images après modification
docker-compose build
docker-compose up -d
```

## Développement

### Standards de code

**Backend (PHP/Symfony)**
- PSR-12 pour le style de code
- Strict types activé (`declare(strict_types=1)`)
- PHPDoc complet sur toutes les classes et méthodes
- DTOs pour toutes les entrées/sorties API
- Services injectés via autowiring

**Frontend (TypeScript/React)**
- Mode TypeScript strict (pas de `any`)
- Hooks personnalisés pour la logique métier
- Composants fonctionnels uniquement
- Gestion d'état via Context API
- Appels API centralisés dans `/services`

### Workflow Git

Le projet suit un workflow Git structuré :

```
main          ← Code production (stable)
  ↑
staging       ← Tests et validation
  ↑
release       ← Préparation des releases
  ↑
feature       ← Intégration des features
  ↑
feat/*        ← Développement de features individuelles
```

### Format des commits

Les commits suivent la convention [Conventional Commits](https://www.conventionalcommits.org/) :

```
feat(livres): ajoute le filtrage par auteur
fix(auth): corrige la validation du token expiré
docs(readme): met à jour les instructions d'installation
refactor(demandes): extrait la logique de disponibilité dans un service
chore(docker): met à jour l'image MySQL vers 8.0.35
```

## Contribution

Ce projet a été développé dans le cadre d'un test technique. Il n'accepte pas de contributions externes pour le moment.

Si vous repérez un bug ou avez une suggestion, n'hésitez pas à ouvrir une issue sur GitHub.

## Licence

Ce projet est un travail personnel réalisé pour un test de recrutement.

**Tous droits réservés** - Utilisation, reproduction ou distribution interdites sans autorisation.

## Informations techniques supplémentaires

### Versions des dépendances principales

**Backend**
- PHP 8.2+
- Symfony 6.4.x
- Doctrine ORM 2.x
- lexik/jwt-authentication-bundle 2.x
- nelmio/api-doc-bundle 4.x

**Frontend**
- Next.js 14.x
- React 18.x
- TypeScript 5.x
- Tailwind CSS 3.x

### Variables d'environnement

Un fichier `.env.example` est fourni avec toutes les variables nécessaires. Les principales sont :

```env
# Base de données
DATABASE_URL=mysql://user:password@mysql:3306/library_db

# JWT
JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PASSPHRASE=your-secure-passphrase

# CORS
CORS_ALLOW_ORIGIN=^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$
```

### Limitations connues

- Les tokens JWT expirent après 1 heure (configurable dans `config/packages/lexik_jwt_authentication.yaml`)
- Pas de système de refresh token implémenté (fonctionnalité future)
- Les uploads de fichiers (couvertures de livres) ne sont pas encore supportés

## Remerciements

Merci d'avoir pris le temps d'examiner ce projet. Il a été développé avec soin en respectant les meilleures pratiques de développement full-stack moderne.

---

**Développé par Alain Tchougbo** | [alain.tchougb@epitech.eu](mailto:alain.tchougb@epitech.eu)

*Dernière mise à jour : Février 2026*