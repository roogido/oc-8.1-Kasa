/**
 * @file src/data/about.js
 * @description
 * Donnees mockees de la page A propos Kasa.
 */

import aboutBannerDesktop01 from '@/assets/images/about/about-banner-desktop-01.png';
import aboutBannerDesktop02 from '@/assets/images/about/about-banner-desktop-02.png';

export const aboutPageContent = {
	title: 'À propos',
	introParagraphsDesktop: [
		'Chez Kasa, nous croyons que chaque voyage mérite un lieu unique où se sentir bien.',
		"Depuis notre création, nous mettons en relation des voyageurs en quête d'authenticité avec des hôtes passionnés qui aiment partager leur région et leurs bonnes adresses.",
	],
	introParagraphsMobile: [
		"Chez Kasa, nous croyons que chaque voyage mérite un lieu unique où se sentir bien. Depuis notre création, nous mettons en relation des voyageurs en quête d'authenticité avec des hôtes passionnés qui aiment partager leur région et leurs bonnes adresses.",
	],
	heroImage: {
		src: aboutBannerDesktop01,
		alt: 'Image a propos 01',
	},
	missionTitle: 'Notre mission est simple :',
	missionItemsDesktop: [
		"Offrir une plateforme fiable et simple d'utilisation",
		'Proposer des hébergements variés et de qualité',
		'Favoriser des échanges humains et chaleureux entre hôtes et voyageurs',
	],
	missionItemsMobile: [
		"Offrir une plateforme fiable et simple d'utilisation",
		'Proposer des hébergements variés et de qualité',
		'Favoriser des échanges humains et chaleureux entre hôtes et voyageurs',
	],
	missionImage: {
		src: aboutBannerDesktop02,
		alt: 'Image a propos 02',
	},
	highlight:
		'Que vous cherchiez un appartement cosy en centre-ville, une maison en bord de mer ou un chalet à la montagne, Kasa vous accompagne pour que chaque séjour devienne un souvenir inoubliable.',
};
