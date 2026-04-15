/**
 * @file src/services/profileService.js
 * @description
 * Services front lies au profil de l'utilisateur courant.
 */

import { internalApiRequest } from '@/lib/internalApiClient';

/**
 * Retourne l'utilisateur courant pour la page profil.
 *
 * @returns {Promise<Object|null>}
 */
export async function getCurrentProfile() {
	const data = await internalApiRequest('/api/users/me', {
		method: 'GET',
	});

	return data?.data?.user ?? null;
}

/**
 * Met a jour le profil courant.
 *
 * @param {Object} payload
 * @param {string} [payload.name]
 * @param {string} [payload.picture]
 * @returns {Promise<Object|null>}
 */
export async function updateCurrentProfile(payload) {
	const data = await internalApiRequest('/api/users/me', {
		method: 'PATCH',
		body: payload,
	});

	return data?.data?.user ?? null;
}
