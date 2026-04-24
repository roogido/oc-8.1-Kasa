# Kasa

Plateforme de réservation de logements développée avec Next.js, React et une API Express/SQLite.

Ce projet a été réalisé dans le cadre du parcours OpenClassrooms. Il couvre les fonctionnalités principales autour de l'affichage des logements, des favoris, de l'authentification, de la messagerie, de l'ajout de propriété, de l'upload d'images et des parcours de mot de passe.

## Version en ligne

- Frontend : https://kasa.ashva.fr
- API backend : https://api.kasa.ashva.fr

## Dépôt GitHub

- Dépôt du projet : https://github.com/roogido/oc-8.1-Kasa

## Fonctionnalités couvertes

### Côté utilisateur

- Affichage de la liste des logements avec image, titre, prix et favoris.
- Affichage du détail d'un logement avec galerie, description, équipements et tags.
- Ajout et suppression de favoris avec persistance locale par utilisateur.
- Inscription et connexion sécurisées.
- Confirmation d'inscription par e-mail lorsque la configuration SMTP est disponible.
- Parcours « mot de passe oublié », réinitialisation par jeton et changement de mot de passe.
- Messagerie entre client et hôte.

### Côté hôte

- Création d'une propriété.
- Upload d'une image de couverture et d'images de galerie.
- Sélection d'équipements et de catégories.
- Contrôles sur la taille des fichiers et le nombre maximal d'images.

### Qualité et exploitation

- SEO : métadonnées, sitemap, robots.txt et données structurées.
- Accessibilité et responsive desktop / tablette / mobile.
- Gestion des erreurs 404 et 500.
- Tests unitaires sur les éléments critiques du projet.

## Architecture du projet

Le projet est organisé sous la forme d'un monorepo simple :

```text
Kasa
|-- backend                          -> API REST Node.js / Express / SQLite
`-- frontend                         -> Application Next.js / React
    |-- docs                         -> Notes, brouillons et exports de travail
    |-- public                       -> Ressources statiques publiques
    `-- src
        |-- app                      -> Pages, layouts et routes API internes Next.js
        |-- assets                   -> Images et ressources intégrées au code source
        |-- components               -> Composants UI et métier réutilisables
        |-- context                  -> Contextes React partagés
        |-- data                     -> Données statiques locales
        |-- hooks                    -> Hooks React personnalisés
        |-- lib                      -> Utilitaires techniques et helpers
        |-- services                 -> Services d'accès API et logique cliente
        `-- tests                    -> Infrastructure de tests frontend
```

Le frontend repose sur l'**App Router** de Next.js et s'appuie notamment sur :

- des pages publiques : accueil, à propos, détail logement ;
- des pages utilisateur : connexion, inscription, mot de passe oublié,
  réinitialisation du mot de passe, profil, changement du mot de passe,
  favoris ;
- une page d'ajout de propriété ;
- une messagerie ;
- des routes API internes Next.js pour certains flux sensibles.

## Prérequis

### Requis

- Node.js 18 ou plus récent.
- npm compatible avec Node.js 18 ou plus récent.
- Git requis pour cloner le dépôt.

### Recommandés

- Un environnement local avec deux terminaux : un pour le backend, un pour le frontend.
- Un service SMTP Brevo si tu veux tester les e-mails transactionnels.

## Cloner le projet

```bash
git clone https://github.com/roogido/oc-8.1-Kasa.git
cd oc-8.1-Kasa
```

## Installation

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

## Configuration

### Backend

Créer un fichier `backend/.env` à partir de `backend/.env.example`.

Variables principales :

- `PORT` : port local de l'API.
- `JWT_SECRET` : secret de signature des jetons JWT.
- `UPLOAD_MAX_FILE_SIZE_BYTES` : taille maximale d'un fichier uploadé.
- `PROPERTY_MAX_IMAGES` : nombre maximal d'images par propriété.
- `FRONTEND_BASE_URL` : URL du frontend utilisée dans les liens envoyés par e-mail.

Configuration SMTP Brevo :

- Les variables SMTP sont optionnelles mais recommandées.
- Si elles sont absentes, les parcours métier restent fonctionnels.
- En revanche, aucun e-mail de confirmation d'inscription ni de réinitialisation ne pourra être envoyé.

Exemple de fichier `backend/.env` :

```dotenv
# Paramètres généraux du serveur et de l'authentification JWT.
PORT=3000
JWT_SECRET="change-me-in-production"

# Limites d'upload des médias des propriétés.
UPLOAD_MAX_FILE_SIZE_BYTES=5242880
PROPERTY_MAX_IMAGES=10

# Configuration SMTP Brevo pour les e-mails transactionnels (optionnelle mais recommandée).
# Si elle est absente, les parcours métier restent fonctionnels, mais aucun e-mail
# de confirmation d'inscription ni de réinitialisation ne pourra être envoyé.
BREVO_SMTP_HOST=smtp-relay.brevo.com
BREVO_SMTP_PORT=587
BREVO_SMTP_USER=""
BREVO_SMTP_PASS=""
MAIL_FROM_NAME="Kasa"
MAIL_FROM_EMAIL="no-reply@example.com"

# URL publique du frontend utilisée dans les liens envoyés par e-mail.
FRONTEND_BASE_URL=http://localhost:3001
```

### Frontend

Copier `frontend/.env.local.example` vers `frontend/.env.local`.

Variables principales :

- `NEXT_PUBLIC_SITE_URL` : URL publique locale du frontend.
- `API_BASE_URL` : URL de l'API backend utilisée par les routes internes Next.js.
- `NEXT_PUBLIC_API_BASE_URL` : URL de l'API backend exposée côté frontend si nécessaire.
- `NEXT_PUBLIC_UPLOAD_MAX_FILE_SIZE_BYTES` : taille maximale d'un fichier côté interface.
- `NEXT_PUBLIC_PROPERTY_MAX_IMAGES` : nombre maximal d'images par propriété côté interface.

Exemple de fichier `frontend/.env.local` :

```dotenv
# Paramètres généraux du frontend et de l'accès à l'API backend.
NEXT_PUBLIC_SITE_URL=http://localhost:3001
API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000

# Limites d'upload des médias des propriétés.
NEXT_PUBLIC_UPLOAD_MAX_FILE_SIZE_BYTES=5242880
NEXT_PUBLIC_PROPERTY_MAX_IMAGES=10
```

## Lancement en local

### 1. Démarrer le backend

Depuis `backend/` :

```bash
npm start
```

API locale par défaut :

```text
http://localhost:3000
```

### 2. Démarrer le frontend

Depuis `frontend/` :

```bash
npm run dev
```

Frontend local par défaut :

```text
http://localhost:3001
```

## Endpoints et documentation API

Une fois le backend lancé, la documentation de l'API est disponible ici :

```text
http://localhost:3000/docs.html
```

## Upload d'images

Le backend prend en charge l'upload d'images via l'endpoint prévu pour les médias.

Règles principales :

- taille maximale paramétrable par variable d'environnement ;
- nombre maximal d'images par propriété paramétrable ;
- nettoyage des fichiers uploadés abandonnés lorsque le flux est interrompu côté interface.

## Authentification et sécurité

Le projet met en place :

- authentification par JWT ;
- routes internes côté frontend pour les flux sensibles ;
- stockage sécurisé du jeton dans un cookie `httpOnly` via les routes internes Next.js ;
- validation renforcée du mot de passe ;
- limitation de débit sur certaines routes sensibles d'authentification.

## Tests

Des tests unitaires sont présents sur plusieurs blocs critiques du projet.

Selon le périmètre du dossier concerné, les commandes de test peuvent être lancées depuis le frontend ou via des scripts dédiés côté backend.

Exemples :

### Frontend

```bash
cd frontend
npm run test
```

### Backend - script de vérification ciblé

```bash
cd backend
node scripts/tests/test-auth-rate-limit.js
```

## Déploiement

Le projet est déployé en production avec :

- frontend sur Vercel ;
- API backend déployée sur un serveur dédié.

Les détails sensibles d'infrastructure ne sont pas documentés ici.

## Auteur

Salem Hadjali
