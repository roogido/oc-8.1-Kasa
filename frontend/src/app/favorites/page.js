/**
 * @file src/app/favorites/page.js
 * @description
 * Page Favoris du projet Kasa.
 */

import FavoritesClientView from './FavoritesClientView';

export const metadata = {
    title: 'Vos favoris',
    description: 'Retrouvez les logements que vous avez ajoutés à vos favoris.',
    robots: {
        index: false,
        follow: false,
    },
};

export default function FavoritesPage() {
    return <FavoritesClientView />;
}
