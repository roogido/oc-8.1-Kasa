/**
 * @file src/services/propertyService.js
 * @description
 * Services métier liés aux propriétés.
 */

import { apiRequest } from '@/lib/apiClient';

/**
 * Retourne une image sûre pour la card.
 *
 * @param {Object} property
 * @returns {string}
 */
function getPropertyCardImage(property) {
	if (typeof property?.cover === 'string' && property.cover.trim() !== '') {
		return property.cover.trim();
	}

	if (
		Array.isArray(property?.pictures) &&
		typeof property.pictures[0] === 'string' &&
		property.pictures[0].trim() !== ''
	) {
		return property.pictures[0].trim();
	}

	return '/placeholder-property.png';
}

/**
 * Retourne un texte alternatif cohérent.
 *
 * @param {Object} property
 * @returns {string}
 */
function getPropertyCardAlt(property) {
	if (typeof property?.title === 'string' && property.title.trim() !== '') {
		return `Photo du logement ${property.title.trim()}`;
	}

	return 'Photo du logement';
}

/**
 * Mappe une propriété backend vers le contrat UI de la Home.
 *
 * @param {Object} property
 * @returns {Object}
 */
export function mapPropertyToHomeCard(property) {
	const id = property?.id;
	const slug =
		typeof property?.slug === 'string' && property.slug.trim() !== ''
			? property.slug.trim()
			: String(id ?? '');

	return {
		id: String(id ?? slug),
		title:
			typeof property?.title === 'string' && property.title.trim() !== ''
				? property.title.trim()
				: 'Logement',
		location:
			typeof property?.location === 'string' &&
			property.location.trim() !== ''
				? property.location.trim()
				: 'Localisation non renseignée',
		price: Number.isFinite(property?.price_per_night)
			? property.price_per_night
			: 0,
		image: getPropertyCardImage(property),
		imageAlt: getPropertyCardAlt(property),
		href: `/properties/${encodeURIComponent(slug)}`,
	};
}

/**
 * Point d'entrée
 * Récupère les propriétés pour la Home.
 *
 * @returns {Promise<Object[]>}
 */
export async function getHomeProperties() {
	const properties = await apiRequest('/api/properties', {
		method: 'GET',
		cache: 'no-store',
	});

	const normalizedProperties = Array.isArray(properties) ? properties : [];

	return normalizedProperties
		.map(mapPropertyToHomeCard)
		.sort((propertyA, propertyB) => propertyA.price - propertyB.price);
}
