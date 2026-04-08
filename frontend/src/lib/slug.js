/**
 * @file src/lib/slug.js
 * @description
 * Helpers de construction et de lecture des segments d'URL hybrides id-slug.
 */

/**
 * Transforme un texte en slug lisible pour l'URL.
 *
 * @param {string} value
 * @returns {string}
 */
export function slugify(value) {
	if (typeof value !== 'string') {
		return '';
	}

	return value
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.replace(/-{2,}/g, '-');
}

/**
 * Construit un segment d'URL hybride id-slug.
 *
 * @param {string|number|null|undefined} id
 * @param {string} title
 * @returns {string}
 */
export function buildPropertyRouteSegment(id, title) {
	const normalizedId = String(id ?? '').trim();
	const slug = slugify(title);

	if (normalizedId === '') {
		return '';
	}

	return slug === '' ? normalizedId : `${normalizedId}-${slug}`;
}

/**
 * Extrait l'id technique depuis un segment hybride id-slug.
 *
 * @param {string} routeSegment
 * @returns {string}
 */
export function extractPropertyIdFromRouteSegment(routeSegment) {
	if (typeof routeSegment !== 'string') {
		return '';
	}

	const normalizedSegment = routeSegment.trim();

	if (normalizedSegment === '') {
		return '';
	}

	const separatorIndex = normalizedSegment.indexOf('-');

	if (separatorIndex === -1) {
		return normalizedSegment;
	}

	return normalizedSegment.slice(0, separatorIndex).trim();
}
