/**
 * @file src/services/propertyCreationService.js
 * @description
 * Service de creation de propriete via la route interne Next.js.
 */

import { internalApiRequest } from '@/lib/internalApiClient';

/**
 * Cree une propriete via la route interne Next.js.
 *
 * @param {Object} payload
 * @returns {Promise<Object|null>}
 */
export async function createProperty(payload) {
	const data = await internalApiRequest('/api/properties', {
		method: 'POST',
		body: payload,
	});

	return data?.data?.property ?? null;
}
