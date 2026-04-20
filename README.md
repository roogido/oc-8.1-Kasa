# Kasa

## Description du projet

Kasa est une plateforme de location courte durée entre particuliers.

Le projet est structuré autour de deux applications distinctes :

- un **frontend** développé avec **Next.js** et **React** ;
- un **backend API** développé séparément pour la gestion des logements, de l'authentification, des profils, des uploads, des favoris, des avis et de la messagerie.

Ce projet est réalisé dans le cadre de la formation **Développeur d'Application Full-Stack - OpenClassrooms**.

## Fonctionnalités principales

Le frontend permet notamment de :

- afficher la liste des logements sur la page d'accueil ;
- consulter le détail d'une propriété ;
- ajouter ou retirer un logement des favoris ;
- créer un compte, se connecter et se déconnecter ;
- gérer son profil utilisateur ;
- ajouter une propriété selon le rôle utilisateur ;
- accéder à une messagerie liée aux logements ;
- exposer un `sitemap.xml`, un `robots.txt` et des métadonnées SEO adaptées.

## Pré-requis

Avant de commencer, vérifier que les éléments suivants sont installés sur la machine :

- **Node.js** ;
- **npm** ;
- **Git**.

Prévoir également :

- le dépôt complet du projet ;
- les variables d'environnement du frontend ;
- les variables d'environnement du backend selon la configuration utilisée.

## Installation

Depuis la racine du projet :

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Configuration du frontend

Créer ensuite le fichier `frontend/.env.local`.

### Exemple : frontend local + API locale

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3001
API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

### Exemple : frontend local + API distante

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3001
API_BASE_URL=https://api.kasa.ashva.fr
NEXT_PUBLIC_API_BASE_URL=https://api.kasa.ashva.fr
```

### Exemple : production

```env
NEXT_PUBLIC_SITE_URL=https://kasa.ashva.fr
API_BASE_URL=https://api.kasa.ashva.fr
NEXT_PUBLIC_API_BASE_URL=https://api.kasa.ashva.fr
```

### Rôle des variables

- `NEXT_PUBLIC_SITE_URL` correspond à l'URL publique du frontend ;
- `API_BASE_URL` correspond à l'URL de l'API utilisée côté serveur Next.js ;
- `NEXT_PUBLIC_API_BASE_URL` correspond à l'URL publique de l'API utilisée côté navigateur.

Un fichier d'exemple peut être versionné dans le projet :

```text
frontend/.env.local.example
```

## Lancement du projet

### 1. Lancer le backend

Depuis le dossier `backend` :

```bash
cd backend
npm start
```

### 2. Lancer le frontend

Depuis le dossier `frontend` :

```bash
cd frontend
npm run dev
```

## Accès à l'application

En environnement local standard :

- **Frontend** : `http://localhost:3001`
- **Backend API** : `http://localhost:3000`
- **Documentation API (Swagger UI)** : `http://localhost:3000/docs.html`
- **Spécification OpenAPI** : `http://localhost:3000/openapi.json`

Pour plus de détails sur le backend, son schéma, ses routes API et sa configuration, consulter également :

```text
backend/README.md
```

## Architecture du projet

```text
Kasa
|-- backend                         -> API REST Node.js / Express / SQLite
|-- docs                            -> Notes, brouillons et exports de travail
|-- public                          -> Ressources statiques publiques
`-- src
    |-- app                         -> Pages, layouts et routes API internes Next.js
    |-- assets                      -> Images et ressources intégrées au code source
    |-- components                  -> Composants UI et métier réutilisables
    |-- context                     -> Contextes React partagés
    |-- data                        -> Données statiques locales
    |-- hooks                       -> Hooks React personnalisés
    |-- lib                         -> Utilitaires techniques et helpers
    |-- services                    -> Services d'accès API et logique cliente
    `-- tests                       -> Infrastructure de tests frontend
```

Le frontend repose sur l'**App Router** de Next.js et s'appuie notamment sur :

- des pages publiques : accueil, à propos, détail logement ;
- des pages utilisateur : connexion, inscription, profil, favoris ;
- une page d'ajout de propriété ;
- une messagerie ;
- des routes API internes Next.js pour certains flux sensibles.

## Tests

Le projet inclut des tests unitaires côté frontend, notamment sur des blocs fonctionnels importants de l'application.

Exemples :

- galerie de photos ;
- gestion des favoris ;
- services frontend ;
- composants liés aux interactions principales.

L'infrastructure de tests s'appuie notamment sur :

- **Vitest** ;
- **MSW** pour le mock réseau dans les tests frontend.

Selon la configuration du projet, les tests peuvent être lancés depuis le dossier `frontend` avec une commande du type :

```bash
npm run test
```

Si le script diffère, vérifier le `package.json` du frontend.

## SEO et données structurées

Le frontend inclut :

- des métadonnées Next.js par page ;
- un `sitemap.xml` ;
- un `robots.txt` ;
- des données structurées `schema.org` en JSON-LD sur les pages pertinentes.

Les pages privées ou utilitaires comme la connexion, l'inscription, le profil, les favoris, la messagerie ou l'ajout de propriété sont marquées en `noindex`.

## Notes utiles

- Le frontend et le backend sont découplés.
- Certaines routes frontend passent par des routes API internes Next.js pour les flux sensibles, notamment l'authentification, le profil, la messagerie et certains échanges avec le backend.
- La documentation interactive de l'API est disponible via Swagger UI.
- Le backend gère les logements, les utilisateurs, les favoris, les uploads, les avis et la messagerie.

## Exemple de déploiement cible

Exemple d'architecture cohérente :

- **Frontend** : `https://kasa.ashva.fr`
- **API backend** : `https://api.kasa.ashva.fr`

Dans ce cas, les variables d'environnement du frontend doivent être adaptées en conséquence.

## Stack technique

### Frontend

- **Next.js** (App Router)
- **React**
- **React DOM**
- **CSS Modules**
- **next/image**
- **lucide-react**
- **Vitest**
- **MSW**

### Backend

- **Node.js**
- **Express**
- **SQLite**
- **JWT**
- **OpenAPI**
- **Swagger UI**

### Outillage

- **Git**
- **GitHub**
- **Vercel** pour le frontend
- **VPS Debian** pour l'API distante selon l'environnement

## Auteur

Salem Hadjali
