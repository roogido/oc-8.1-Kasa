/**
 * @file src/data/homeContent.js
 * @description
 * Contenus éditoriaux statiques de la page d'accueil Kasa.
 */

import homeHeroDesktop from '@/assets/images/home/home-hero-desktop.png';

export const homeHeroContent = {
	title: 'Chez vous, partout et ailleurs',
	subtitle:
		'Avec Kasa, vivez des séjours uniques dans des hébergements chaleureux, sélectionnés avec soin par nos hôtes.',
	image: homeHeroDesktop,
	imageAlt: '',
};

export const homeHowItWorksContent = {
	title: 'Comment ça marche ?',
	subtitle:
		'Que vous partiez pour un week-end improvisé, des vacances en famille ou un voyage professionnel, Kasa vous aide à trouver un lieu qui vous ressemble.',
	items: [
		{
			id: 'how-it-works-01',
			title: 'Recherchez',
			description:
				'Entrez votre destination, vos dates et laissez Kasa faire le reste.',
		},
		{
			id: 'how-it-works-02',
			title: 'Réservez',
			description:
				'Profitez d’une plateforme sécurisée et de profils d’hôtes vérifiés.',
		},
		{
			id: 'how-it-works-03',
			title: "Vivez l'expérience",
			description:
				'Soyez chez vous, partout, dans un logement pensé pour votre séjour.',
		},
	],
};
