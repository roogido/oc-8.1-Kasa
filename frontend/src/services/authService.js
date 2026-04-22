/**
 * @file src/services/authService.js
 * @description
 * Services d'authentification cote front via routes internes Next.js.
 */

import { internalApiRequest } from '@/lib/internalApiClient';

/**
 * Verifie que le role d'inscription est autorise.
 *
 * @param {string} role
 * @returns {'client'|'owner'}
 */
function normalizeRegistrationRole(role) {
	return role === 'owner' ? 'owner' : 'client';
}

/**
 * Tente de connecter un utilisateur.
 *
 * @param {Object} params
 * @param {string} params.email
 * @param {string} params.password
 * @returns {Promise<Object|null>}
 */
export async function loginUser({ email, password }) {
	const data = await internalApiRequest('/api/auth/login', {
		method: 'POST',
		body: { email, password },
	});

	return data?.data?.user ?? null;
}

/**
 * Tente d'inscrire un utilisateur.
 *
 * @param {Object} params
 * @param {string} params.firstName
 * @param {string} params.lastName
 * @param {string} params.email
 * @param {string} params.password
 * @param {string} [params.role='client']
 * @returns {Promise<Object|null>}
 */
export async function registerUser({
	firstName,
	lastName,
	email,
	password,
	role = 'client',
}) {
	const data = await internalApiRequest('/api/auth/register', {
		method: 'POST',
		body: {
			firstName,
			lastName,
			email,
			password,
			role: normalizeRegistrationRole(role),
		},
	});

	return data?.data?.user ?? null;
}

/**
 * Retourne l'utilisateur courant.
 *
 * @returns {Promise<Object|null>}
 */
export async function getCurrentUser() {
	const data = await internalApiRequest('/api/auth/me', {
		method: 'GET',
	});

	return data?.data?.user ?? null;
}

/**
 * Deconnecte l'utilisateur courant.
 *
 * @returns {Promise<void>}
 */
export async function logoutUser() {
	await internalApiRequest('/api/auth/logout', {
		method: 'POST',
	});
}

export async function requestPasswordReset({ email }) {
	const data = await internalApiRequest('/api/auth/request-reset', {
		method: 'POST',
		body: { email },
	});

	return data?.data?.message ?? '';
}

export async function resetPasswordWithToken({ token, password }) {
	const data = await internalApiRequest('/api/auth/reset-password', {
		method: 'POST',
		body: { token, password },
	});

	return data?.data?.message ?? '';
}
