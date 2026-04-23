/**
 * @file  src/app/api/auth/request-reset/route.js
 * @description
 * Route interne Next.js pour demander une réinitialisation du mot de passe.
 */

import { NextResponse } from 'next/server';

import { apiRequest, ApiClientError } from '@/lib/apiClient';

/**
 * Valide et normalise le payload de demande de réinitialisation.
 *
 * @param {Object|null} body
 * @returns {{ email: string }}
 */
function normalizeRequestResetPayload(body) {
	const email =
		typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';

	return { email };
}

/**
 * Retourne un message francisé à partir d'une erreur backend.
 *
 * @param {string} message
 * @returns {string}
 */
function getRequestResetErrorMessage(message) {
	switch (message) {
		case 'email is required':
			return "L'adresse e-mail est requise.";

		case 'password reset email send failed':
			return 'Le service de réinitialisation par e-mail est temporairement indisponible. Merci de réessayer plus tard.';

		default:
			return message;
	}
}

/**
 * Route POST /api/auth/request-reset
 *
 * @param {Request} request
 * @returns {Promise<Response>}
 */
export async function POST(request) {
	try {
		const body = await request.json().catch(() => null);
		const { email } = normalizeRequestResetPayload(body);

		if (email === '') {
			return NextResponse.json(
				{
					success: false,
					message: "L'adresse e-mail est requise.",
				},
				{ status: 400 },
			);
		}

		await apiRequest('/auth/request-reset', {
			method: 'POST',
			body: { email },
			cache: 'no-store',
		});

		return NextResponse.json(
			{
				success: true,
				data: {
					message:
						'Si cette adresse existe, un lien de réinitialisation a été envoyé.',
				},
			},
			{ status: 200 },
		);
	} catch (error) {
		if (error instanceof ApiClientError) {
			if (error.status === 503) {
				return NextResponse.json(
					{
						success: false,
						message:
							'Le service de réinitialisation par e-mail est temporairement indisponible. Merci de réessayer plus tard.',
					},
					{ status: 503 },
				);
			}

			return NextResponse.json(
				{
					success: false,
					message: getRequestResetErrorMessage(error.message),
				},
				{ status: error.status },
			);
		}

		return NextResponse.json(
			{
				success: false,
				message:
					'Impossible de traiter la demande de réinitialisation.',
			},
			{ status: 500 },
		);
	}
}
