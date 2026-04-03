/**
 * @file src/data/propertyDetails.js
 * @description
 * Données mockées de la page détail logement de Kasa.
 */

import propertyGallery01 from '@/assets/images/property/property-gallery-01.png';
import propertyGallery02 from '@/assets/images/property/property-gallery-02.png';
import propertyGallery03 from '@/assets/images/property/property-gallery-03.png';
import propertyGallery04 from '@/assets/images/property/property-gallery-04.png';
import propertyGallery05 from '@/assets/images/property/property-gallery-05.png';
import hostAvatarNathalieJean from '@/assets/images/property/host-avatar-nathalie-jean.png';

export const propertyDetailsById = {
	'property-01': {
		id: 'property-01',
		title: 'Appartement cosy',
		location: 'Île de France - Paris 17e',
		description:
			"Votre maison loin de chez vous. Que vous veniez de l'autre bout du monde, ou juste de quelques stations de RER, vous vous sentirez chez vous dans notre appartement.",
		equipments: [
			'Cafetière',
			'Bouilloire',
			'Vaisselle',
			'Micro-onde',
			'Sèche-linge',
			'Sèche-cheveux',
			'Lit pour bébé',
			'Télévision',
		],
		categories: ['Batignolle', 'Montmartre'],
		gallery: {
			featuredImage: {
				src: propertyGallery01,
				alt: 'Image logement 01',
			},
			thumbnails: [
				{
					id: 'thumb-01',
					src: propertyGallery02,
					alt: 'Image logement 02',
				},
				{
					id: 'thumb-02',
					src: propertyGallery03,
					alt: 'Image logement 03',
				},
				{
					id: 'thumb-03',
					src: propertyGallery04,
					alt: 'Image logement 04',
				},
				{
					id: 'thumb-04',
					src: propertyGallery05,
					alt: 'Image logement 05',
				},
			],
		},
		host: {
			name: 'Nathalie Jean',
			rating: 3,
			avatar: hostAvatarNathalieJean,
			avatarAlt: 'Photo hôte 01',
		},
	},
};
