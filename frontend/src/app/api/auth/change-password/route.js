/**
 * @file src/app/api/auth/change-password/route.js
 * @description
 *
 */

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { apiRequest, ApiClientError } from '@/lib/apiClient';
import { AUTH_COOKIE_NAME } from '@/lib/authConstants';

/**
 * Valide et normalise le payload de changement de mot de passe.
 *
 * @param {Object|null} body
 * @returns {{ currentPassword: string, newPassword: string }}
 */
function normalizeChangePasswordPayload(body) {
	const currentPassword =
		typeof body?.currentPassword === 'string' ? body.currentPassword : '';
	const newPassword =
		typeof body?.newPassword === 'string' ? body.newPassword : '';

	return { currentPassword, newPassword };
}

/**
 * Retourne un message francisé à partir d'une erreur backend.
 *
 * @param {string} message
 * @returns {string}
 */
function getChangePasswordErrorMessage(message) {
	switch (message) {
		case 'authentication required':
			return 'Vous devez être connecté pour changer votre mot de passe.';

		case 'current password and new password are required':
			return 'Le mot de passe actuel et le nouveau mot de passe sont requis.';

		case 'invalid current password':
			return 'Le mot de passe actuel est incorrect.';

		case 'new password must be different from current password':
			return "Le nouveau mot de passe doit être différent de l'ancien.";

		case 'password must be at least 8 characters':
			return 'Le mot de passe doit contenir au moins 8 caractères.';

		case 'password must contain at least one lowercase letter':
			return 'Le mot de passe doit contenir au moins une lettre minuscule.';

		case 'password must contain at least one uppercase letter':
			return 'Le mot de passe doit contenir au moins une lettre majuscule.';

		case 'password must contain at least one digit':
			return 'Le mot de passe doit contenir au moins un chiffre.';

		case 'password must contain at least one special character':
			return 'Le mot de passe doit contenir au moins un caractère spécial.';

		default:
			return message;
	}
}

/**
 * Route POST /api/auth/change-password
 *
 * @param {Request} request
 * @returns {Promise<Response>}
 */
export async function POST(request) {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get(AUTH_COOKIE_NAME)?.value?.trim() ?? '';

		if (token === '') {
			return NextResponse.json(
				{
					success: false,
					message:
						'Vous devez être connecté pour changer votre mot de passe.',
				},
				{ status: 401 },
			);
		}

		const body = await request.json().catch(() => null);
		const { currentPassword, newPassword } =
			normalizeChangePasswordPayload(body);

		if (currentPassword.trim() === '' || newPassword.trim() === '') {
			return NextResponse.json(
				{
					success: false,
					message:
						'Le mot de passe actuel et le nouveau mot de passe sont requis.',
				},
				{ status: 400 },
			);
		}

		await apiRequest('/auth/change-password', {
			method: 'POST',
			body: { currentPassword, newPassword },
			token,
			cache: 'no-store',
		});

		return NextResponse.json(
			{
				success: true,
				data: {
					message: 'Votre mot de passe a bien été modifié.',
				},
			},
			{ status: 200 },
		);
	} catch (error) {
		if (error instanceof ApiClientError) {
			return NextResponse.json(
				{
					success: false,
					message: getChangePasswordErrorMessage(error.message),
				},
				{ status: error.status },
			);
		}

		return NextResponse.json(
			{
				success: false,
				message: 'Impossible de modifier le mot de passe.',
			},
			{ status: 500 },
		);
	}
}
