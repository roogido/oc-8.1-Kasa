/**
 * @file src/app/api/users/me/route.js
 * @description
 * Route interne Next.js pour lire et mettre a jour l'utilisateur courant.
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { apiRequest, ApiClientError } from '@/lib/apiClient';
import {
	AUTH_COOKIE_NAME,
	AUTH_USER_ID_COOKIE_NAME,
} from '@/lib/authConstants';

/**
 * Retourne le token et l'id utilisateur depuis les cookies.
 *
 * @returns {Promise<{ token: string, userId: string }>}
 */
async function readAuthCookies() {
	const cookieStore = await cookies();

	return {
		token: cookieStore.get(AUTH_COOKIE_NAME)?.value ?? '',
		userId: cookieStore.get(AUTH_USER_ID_COOKIE_NAME)?.value ?? '',
	};
}

/**
 * Valide et normalise le payload de mise a jour.
 *
 * @param {Object|null} body
 * @returns {{ hasName: boolean, hasPicture: boolean, payload: Object }}
 */
function normalizeUpdatePayload(body) {
	const payload = {};

	const hasName = Object.prototype.hasOwnProperty.call(body ?? {}, 'name');
	const hasPicture = Object.prototype.hasOwnProperty.call(body ?? {}, 'picture');

	if (hasName) {
		payload.name = typeof body?.name === 'string' ? body.name.trim() : '';
	}

	if (hasPicture) {
		payload.picture =
			typeof body?.picture === 'string' ? body.picture.trim() : '';
	}

	return { hasName, hasPicture, payload };
}

/**
 * Route GET /api/users/me
 *
 * @returns {Promise<Response>}
 */
export async function GET() {
	try {
		const { token, userId } = await readAuthCookies();

		if (token.trim() === '' || userId.trim() === '') {
			return NextResponse.json(
				{
					success: false,
					message: 'Non authentifie.',
				},
				{ status: 401 },
			);
		}

		const user = await apiRequest(
			`/api/users/${encodeURIComponent(userId.trim())}`,
			{
				method: 'GET',
				token,
				cache: 'no-store',
			},
		);

		return NextResponse.json(
			{
				success: true,
				data: { user },
			},
			{ status: 200 },
		);
	} catch (error) {
		if (error instanceof ApiClientError) {
			return NextResponse.json(
				{
					success: false,
					message: error.message,
				},
				{ status: error.status },
			);
		}

		return NextResponse.json(
			{
				success: false,
				message: 'Impossible de recuperer le profil.',
			},
			{ status: 500 },
		);
	}
}

/**
 * Route PATCH /api/users/me
 *
 * @param {Request} request
 * @returns {Promise<Response>}
 */
export async function PATCH(request) {
	try {
		const { token, userId } = await readAuthCookies();

		if (token.trim() === '' || userId.trim() === '') {
			return NextResponse.json(
				{
					success: false,
					message: 'Non authentifie.',
				},
				{ status: 401 },
			);
		}

		const body = await request.json().catch(() => null);
		const { hasName, hasPicture, payload } = normalizeUpdatePayload(body);

		if (!hasName && !hasPicture) {
			return NextResponse.json(
				{
					success: false,
					message: 'Aucun champ de profil a mettre a jour.',
				},
				{ status: 400 },
			);
		}

		if (hasName && payload.name === '') {
			return NextResponse.json(
				{
					success: false,
					message: 'Le nom du profil est requis.',
				},
				{ status: 400 },
			);
		}

		const user = await apiRequest(
			`/api/users/${encodeURIComponent(userId.trim())}`,
			{
				method: 'PATCH',
				body: payload,
				token,
				cache: 'no-store',
			},
		);

		return NextResponse.json(
			{
				success: true,
				data: { user },
			},
			{ status: 200 },
		);
	} catch (error) {
		if (error instanceof ApiClientError) {
			return NextResponse.json(
				{
					success: false,
					message: error.message,
				},
				{ status: error.status },
			);
		}

		return NextResponse.json(
			{
				success: false,
				message: 'Impossible de mettre a jour le profil.',
			},
			{ status: 500 },
		);
	}
}
