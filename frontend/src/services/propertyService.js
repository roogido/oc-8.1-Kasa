/**
 * @file src/services/propertyService.js
 * @description
 * Services métier liés aux propriétés.
 */

import { buildPropertyRouteSegment } from '@/lib/slug';
import { ApiClientError, apiRequest } from '@/lib/apiClient';

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
 * Mappe une propriété backend vers le contrat UI d'une carte de la page Home.
 *
 * @param {Object} property
 * @returns {Object}
 */
export function mapPropertyToHomeCard(property) {
	const id = property?.id;
	const normalizedId = String(id ?? '');
	const routeSegment = buildPropertyRouteSegment(
		normalizedId,
		typeof property?.title === 'string' ? property.title : '',
	);

	return {
		id: normalizedId,
		propertyId: normalizedId,
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
		href: `/properties/${encodeURIComponent(routeSegment)}`,
	};
}

/**
 * Point d'entrée - datas Home
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

/**
 * Retourne la galerie normalisée d'un logement pour le carrousel.
 *
 * @param {Object} property
 * @returns {{ images: Array<{ id: string, src: string, alt: string }> }}
 */
function mapPropertyGallery(property) {
	const pictures = Array.isArray(property?.pictures)
		? property.pictures.filter(
				(picture) =>
					typeof picture === 'string' && picture.trim() !== '',
			)
		: [];

	const cover =
		typeof property?.cover === 'string' && property.cover.trim() !== ''
			? property.cover.trim()
			: null;

	const imageSources = cover ? [cover, ...pictures] : [...pictures];
	const uniqueSources = [...new Set(imageSources)];
	const safeSources =
		uniqueSources.length > 0
			? uniqueSources
			: ['/placeholder-property.png'];

	const title =
		typeof property?.title === 'string' && property.title.trim() !== ''
			? property.title.trim()
			: 'Logement';

	return {
		images: safeSources.map((source, index) => ({
			id: `image-${index + 1}`,
			src: source,
			alt:
				index === 0
					? `Image principale du logement ${title}`
					: `Image ${index + 1} du logement ${title}`,
		})),
	};
}

/**
 * Retourne les informations hôte normalisées.
 *
 * @param {Object} property
 * @returns {{ name: string, rating: number, avatar: string, avatarAlt: string }}
 */
function mapPropertyHost(property) {
	const hostName =
		typeof property?.host?.name === 'string' &&
		property.host.name.trim() !== ''
			? property.host.name.trim()
			: 'Hôte';

	const avatar =
		typeof property?.host?.picture === 'string' &&
		property.host.picture.trim() !== ''
			? property.host.picture.trim()
			: '/placeholder-property.png';

	const rating = Number.isFinite(property?.rating_avg)
		? Math.round(property.rating_avg)
		: 0;

	return {
		name: hostName,
		rating,
		avatar,
		avatarAlt: `Photo de l'hôte ${hostName}`,
	};
}

/**
 * Mappe une propriété backend vers le contrat UI de la page détail.
 *
 * @param {Object} property
 * @returns {Object}
 */
export function mapPropertyToDetailView(property) {
	return {
		id: String(property?.id ?? ''),
		title:
			typeof property?.title === 'string' && property.title.trim() !== ''
				? property.title.trim()
				: 'Logement',
		location:
			typeof property?.location === 'string' &&
			property.location.trim() !== ''
				? property.location.trim()
				: 'Localisation non renseignée',
		description:
			typeof property?.description === 'string' &&
			property.description.trim() !== ''
				? property.description.trim()
				: 'Aucune description disponible.',
		equipments: Array.isArray(property?.equipments)
			? property.equipments.filter(
					(item) => typeof item === 'string' && item.trim() !== '',
				)
			: [],
		categories: Array.isArray(property?.tags)
			? property.tags.filter(
					(item) => typeof item === 'string' && item.trim() !== '',
				)
			: [],
		gallery: mapPropertyGallery(property),
		host: mapPropertyHost(property),
	};
}

/**
 * Point d'entrée - datas détail d'un logement
 * Récupère le détail d'un logement.
 *
 * @param {string} propertyId
 * @returns {Promise<Object|null>}
 */
export async function getPropertyDetail(propertyId) {
	if (typeof propertyId !== 'string' || propertyId.trim() === '') {
		return null;
	}

	try {
		const property = await apiRequest(
			`/api/properties/${encodeURIComponent(propertyId.trim())}`,
			{
				method: 'GET',
				cache: 'no-store',
			},
		);

		if (!property || typeof property !== 'object') {
			return null;
		}

		return mapPropertyToDetailView(property);
	} catch (error) {
		if (error instanceof ApiClientError && error.status === 404) {
			return null;
		}

		throw error;
	}
}
