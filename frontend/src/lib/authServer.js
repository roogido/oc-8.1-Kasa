/**
 * @file src/lib/authServer.js
 * @description
 * Helpers serveur liés à l'utilisateur authentifié.
 */

import 'server-only';

import { cookies } from 'next/headers';

import { apiRequest, ApiClientError } from '@/lib/apiClient';
import {
	AUTH_COOKIE_NAME,
	AUTH_USER_ID_COOKIE_NAME,
} from '@/lib/authConstants';

/**
 * Retourne l'utilisateur courant côté serveur.
 *
 * @returns {Promise<Object|null>}
 */
export async function getServerCurrentUser() {
	try {
		const cookieStore = await cookies();
		const authToken = cookieStore.get(AUTH_COOKIE_NAME)?.value ?? '';
		const userId = cookieStore.get(AUTH_USER_ID_COOKIE_NAME)?.value ?? '';

		if (authToken.trim() === '' || userId.trim() === '') {
			return null;
		}

		const user = await apiRequest(
			`/api/users/${encodeURIComponent(userId.trim())}`,
			{
				method: 'GET',
				token: authToken,
				cache: 'no-store',
			},
		);

		return user && typeof user === 'object' ? user : null;
	} catch (error) {
		if (error instanceof ApiClientError) {
			return null;
		}

		return null;
	}
}

/**
 * Retourne true si l'utilisateur peut gérer des propriétés.
 *
 * @param {Object|null} user
 * @returns {boolean}
 */
export function canManageProperties(user) {
	const role = typeof user?.role === 'string' ? user.role.trim() : '';

	return role === 'owner' || role === 'admin';
}
