# Kasa

## Description du projet

Kasa est une plateforme de location courte durée entre particuliers.

Le projet est composé de deux applications distinctes :
- un frontend en Next.js / React ;
- un backend API séparé, utilisé pour la gestion des logements, de l'authentification, des profils, des uploads et des autres données métier.

Le frontend permet notamment :
- d'afficher une liste de logements sur la page d'accueil ;
- de consulter le détail d'une propriété ;
- de gérer des favoris côté frontend avec persistance locale ;
- de créer un compte, se connecter et gérer son profil ;
- d'ajouter une propriété selon le rôle utilisateur ;
- d'exposer un sitemap, un robots.txt et des métadonnées SEO adaptées.

## Pré-requis pour l'installation

Avant de commencer, vérifier que les éléments suivants sont installés sur la machine :
- Node.js ;
- npm ;
- Git.

Prévoir également :
- le dépôt complet du projet avec les dossiers `frontend` et `backend` ;
- les variables d'environnement nécessaires au frontend ;
- les variables d'environnement nécessaires au backend, selon la configuration de l'API.

## Installation

Depuis la racine du projet :

```bash
cd backend
npm install

cd ../frontend
npm install
```

Créer ensuite le fichier d'environnement du frontend :

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```

Un fichier d'exemple peut être versionné dans le projet :

```text
frontend/.env.local.example
```

Remarque importante :
- `NEXT_PUBLIC_API_BASE_URL` correspond à l'URL de l'API backend ;
- `NEXT_PUBLIC_SITE_URL` correspond à l'URL publique du frontend ;
- la configuration exacte du backend dépend de ses propres variables d'environnement.

## Lancement du projet

### 1. Lancer le backend

Depuis le dossier `backend`, lancer l'API avec le script prévu dans le projet.

```bash
cd backend
npm start
```

### 2. Lancer le frontend

Depuis le dossier `frontend`, lancer Next.js :

```bash
cd frontend
npm run dev
```

Dans la configuration locale actuellement utilisée :
- l'API backend répond sur `http://localhost:3000` ;
- le frontend répond sur `http://localhost:3001`.

## Structure simplifiée du projet

```text
Kasa/
├── backend/
└── frontend/
```

Côté frontend, l'application utilise l'App Router de Next.js avec notamment :
- une page d'accueil ;
- une page À propos ;
- une page détail propriété ;
- une page favoris ;
- des pages de connexion, inscription et profil ;
- une page d'ajout de propriété ;
- un sitemap et un robots.txt générés côté application.

## SEO et données structurées

Le frontend inclut :
- des métadonnées Next.js par page ;
- un `sitemap.xml` ;
- un `robots.txt` ;
- des données structurées `schema.org` en JSON-LD sur les pages pertinentes.

Les pages privées ou utilitaires comme la connexion, l'inscription, le profil, les favoris ou l'ajout de propriété sont marquées en `noindex`.

## Notes utiles

- Le frontend et le backend sont découplés.
- Certaines routes frontend passent par des routes internes Next.js pour les flux sensibles, notamment l'authentification.
- En production, il est recommandé d'utiliser une URL publique dédiée pour le frontend et une URL distincte pour l'API backend.

## Exemple de déploiement cible

Exemple d'architecture cohérente :
- frontend : `https://kasa.ashva.fr`
- API backend : `https://api.kasa.ashva.fr`

Dans ce cas, les variables d'environnement frontend devront être adaptées en conséquence.
