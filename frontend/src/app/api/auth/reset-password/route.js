/**
 * @file src/app/api/auth/reset-password/route.js
 * @description
 *
 */

import { NextResponse } from 'next/server';

import { apiRequest, ApiClientError } from '@/lib/apiClient';

/**
 * Valide et normalise le payload de reinitialisation.
 *
 * @param {Object|null} body
 * @returns {{ token: string, password: string }}
 */
function normalizeResetPasswordPayload(body) {
	const token = typeof body?.token === 'string' ? body.token.trim() : '';
	const password = typeof body?.password === 'string' ? body.password : '';

	return { token, password };
}

/**
 * Retourne un message francise a partir d'une erreur backend.
 *
 * @param {string} message
 * @returns {string}
 */
function getResetPasswordErrorMessage(message) {
	switch (message) {
		case 'token and password are required':
			return 'Le jeton et le nouveau mot de passe sont requis.';

		case 'invalid or expired token':
			return 'Le lien de reinitialisation est invalide ou expire.';

		case 'password must be at least 8 characters':
			return 'Le mot de passe doit contenir au moins 8 caracteres.';

		case 'password must contain at least one lowercase letter':
			return 'Le mot de passe doit contenir au moins une lettre minuscule.';

		case 'password must contain at least one uppercase letter':
			return 'Le mot de passe doit contenir au moins une lettre majuscule.';

		case 'password must contain at least one digit':
			return 'Le mot de passe doit contenir au moins un chiffre.';

		case 'password must contain at least one special character':
			return 'Le mot de passe doit contenir au moins un caractere special.';

		default:
			return message;
	}
}

/**
 * Route POST /api/auth/reset-password
 *
 * @param {Request} request
 * @returns {Promise<Response>}
 */
export async function POST(request) {
	try {
		const body = await request.json().catch(() => null);
		const { token, password } = normalizeResetPasswordPayload(body);

		if (token === '' || password.trim() === '') {
			return NextResponse.json(
				{
					success: false,
					message: 'Le jeton et le nouveau mot de passe sont requis.',
				},
				{ status: 400 },
			);
		}

		await apiRequest('/auth/reset-password', {
			method: 'POST',
			body: { token, password },
			cache: 'no-store',
		});

		return NextResponse.json(
			{
				success: true,
				data: {
					message: 'Votre mot de passe a bien ete reinitialise.',
				},
			},
			{ status: 200 },
		);
	} catch (error) {
		if (error instanceof ApiClientError) {
			return NextResponse.json(
				{
					success: false,
					message: getResetPasswordErrorMessage(error.message),
				},
				{ status: error.status },
			);
		}

		return NextResponse.json(
			{
				success: false,
				message: 'Impossible de reinitialiser le mot de passe.',
			},
			{ status: 500 },
		);
	}
}
