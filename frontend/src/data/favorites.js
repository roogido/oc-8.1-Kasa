/**
 * @file src/data/favorites.js
 * @description
 * Données mockées de la page Favoris.
 */

import homeListingCard01 from '@/assets/images/home/home-listing-card-01.png';
import homeListingCard02 from '@/assets/images/home/home-listing-card-02.png';
import homeListingCard03 from '@/assets/images/home/home-listing-card-03.png';

export const favoritesIntroContent = {
	title: 'Vos favoris',
	description:
		'Retrouvez ici tous les logements que vous avez aimés. Prêts à réserver ? Un simple clic et votre prochain séjour est en route.',
};

export const favoriteProperties = [
	{
		id: 'favorite-01',
		title: 'Appartement cosy',
		location: 'Ile de France - Paris 17e',
		price: 100,
		image: homeListingCard01,
		imageAlt: 'Image favori 01',
		href: '/property/apartment-cosy',
	},
	{
		id: 'favorite-02',
		title: 'Magnifique appartement proche Canal Saint Martin',
		location: 'Ile de France - Paris 10e',
		price: 110,
		image: homeListingCard02,
		imageAlt: 'Image favori 02',
		href: '/property/canal-saint-martin',
	},
	{
		id: 'favorite-03',
		title: 'Studio de charme - Buttes Chaumont',
		location: 'Ile de France - Paris 20e',
		price: 120,
		image: homeListingCard03,
		imageAlt: 'Image favori 03',
		href: '/property/buttes-chaumont',
	},
];
