/**
 * @file src/data/home.js
 * @description
 * Donnees mockees de la page d'accueil Kasa.
 */

import homeHeroDesktop from '@/assets/images/home/home-hero-desktop.png';

import homeListingCard01 from '@/assets/images/home/home-listing-card-01.png';
import homeListingCard02 from '@/assets/images/home/home-listing-card-02.png';
import homeListingCard03 from '@/assets/images/home/home-listing-card-03.png';
import homeListingCard04 from '@/assets/images/home/home-listing-card-04.png';
import homeListingCard05 from '@/assets/images/home/home-listing-card-05.png';
import homeListingCard06 from '@/assets/images/home/home-listing-card-06.png';
import homeListingCard07 from '@/assets/images/home/home-listing-card-07.png';
import homeListingCard08 from '@/assets/images/home/home-listing-card-08.png';
import homeListingCard09 from '@/assets/images/home/home-listing-card-09.png';
import homeListingCard10 from '@/assets/images/home/home-listing-card-10.png';
import homeListingCard11 from '@/assets/images/home/home-listing-card-11.png';
import homeListingCard12 from '@/assets/images/home/home-listing-card-12.png';

export const homeHeroContent = {
	title: 'Chez vous, partout et ailleurs',
	subtitle:
		'Avec Kasa, vivez des sejours uniques dans des hebergements chaleureux, selectionnes avec soin par nos hotes.',
	image: homeHeroDesktop,
	imageAlt: 'Image hero home',
};

export const featuredPropertiesSectionOne = [
	{
		id: 'property-01',
		title: 'Appartement cosy',
		location: 'Ile de France - Paris 17e',
		price: 100,
		image: homeListingCard01,
		imageAlt: 'Image card home 01',
		href: '/properties/property-01',
	},
	{
		id: 'property-02',
		title: 'Magnifique appartement proche Canal Saint Martin',
		location: 'Ile de France - Paris 10e',
		price: 110,
		image: homeListingCard02,
		imageAlt: 'Image card home 02',
		href: '/properties/property-02',
	},
	{
		id: 'property-03',
		title: 'Studio de charme - Buttes Chaumont',
		location: 'Ile de France - Paris 20e',
		price: 120,
		image: homeListingCard03,
		imageAlt: 'Image card home 03',
		href: '/properties/property-03',
	},
	{
		id: 'property-04',
		title: 'Nid douillet au coeur du 11eme',
		location: 'Ile de France - Paris 11e',
		price: 130,
		image: homeListingCard04,
		imageAlt: 'Image card home 04',
		href: '/properties/property-04',
	},
	{
		id: 'property-05',
		title: 'Appartement de Standing - 10e',
		location: 'Ile de France - Paris 10e',
		price: 140,
		image: homeListingCard05,
		imageAlt: 'Image card home 05',
		href: '/properties/property-05',
	},
	{
		id: 'property-06',
		title: "Studio d'artiste",
		location: 'Ile de France - Paris 18e',
		price: 150,
		image: homeListingCard06,
		imageAlt: 'Image card home 06',
		href: '/properties/property-06',
	},
];

export const featuredPropertiesSectionTwo = [
	{
		id: 'property-07',
		title: 'Appartement cosy',
		location: 'Ile de France - Paris 17e',
		price: 100,
		image: homeListingCard07,
		imageAlt: 'Image card home 07',
		href: '/properties/property-07',
	},
	{
		id: 'property-08',
		title: 'Magnifique appartement proche Canal Saint Martin',
		location: 'Ile de France - Paris 10e',
		price: 110,
		image: homeListingCard08,
		imageAlt: 'Image card home 08',
		href: '/properties/property-08',
	},
	{
		id: 'property-09',
		title: 'Studio de charme - Buttes Chaumont',
		location: 'Ile de France - Paris 20e',
		price: 120,
		image: homeListingCard09,
		imageAlt: 'Image card home 09',
		href: '/properties/property-09',
	},
	{
		id: 'property-10',
		title: 'Nid douillet au coeur du 11eme',
		location: 'Ile de France - Paris 11e',
		price: 130,
		image: homeListingCard10,
		imageAlt: 'Image card home 10',
		href: '/properties/property-10',
	},
	{
		id: 'property-11',
		title: 'Appartement de Standing - 10e',
		location: 'Ile de France - Paris 10e',
		price: 140,
		image: homeListingCard11,
		imageAlt: 'Image card home 11',
		href: '/properties/property-11',
	},
	{
		id: 'property-12',
		title: "Studio d'artiste",
		location: 'Ile de France - Paris 18e',
		price: 150,
		image: homeListingCard12,
		imageAlt: 'Image card home 12',
		href: '/properties/property-12',
	},
];

export const homeHowItWorksContent = {
	title: 'Comment ca marche ?',
	subtitle:
		'Que vous partiez pour un week-end improvise, des vacances en famille ou un voyage professionnel, Kasa vous aide a trouver un lieu qui vous ressemble.',
	items: [
		{
			id: 'how-it-works-01',
			title: 'Recherchez',
			description:
				'Entrez votre destination, vos dates et laissez Kasa faire le reste',
		},
		{
			id: 'how-it-works-02',
			title: 'Reservez',
			description:
				'Profitez d une plateforme securisee et de profils d hotes verifies.',
		},
		{
			id: 'how-it-works-03',
			title: "Vivez l'experience",
			description:
				'Soyez chez vous, partout, dans un logement pense pour votre sejour.',
		},
	],
};
