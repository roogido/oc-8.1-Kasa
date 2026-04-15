/**
 * @file src/lib/imageUrl.js
 * @description
 * Helpers de normalisation des URLs d'images backend.
 */

import { getApiBaseUrl } from '@/lib/env';

/**
 * Retourne une URL d'image exploitable côté frontend.
 *
 * @param {string} source
 * @param {string} [fallback='/placeholder-property.png']
 * @returns {string}
 */
export function normalizeBackendImageUrl(
	source,
	fallback = '/placeholder-property.png',
) {
	if (typeof source !== 'string' || source.trim() === '') {
		return fallback;
	}

	const normalizedSource = source.trim();

	if (
		normalizedSource.startsWith('http://') ||
		normalizedSource.startsWith('https://')
	) {
		return normalizedSource;
	}

	if (normalizedSource.startsWith('/uploads/')) {
		return `${getApiBaseUrl()}${normalizedSource}`;
	}

	return normalizedSource;
}
