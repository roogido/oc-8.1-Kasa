/**
 * @file src/app/api/auth/login/route.js
 * @description
 * Route interne Next.js pour authentifier un utilisateur Kasa.
 */

import { NextResponse } from 'next/server';

import { apiRequest, ApiClientError } from '@/lib/apiClient';
import {
	AUTH_COOKIE_MAX_AGE_SECONDS,
	AUTH_COOKIE_NAME,
	AUTH_COOKIE_PATH,
	AUTH_COOKIE_SAME_SITE,
	AUTH_USER_ID_COOKIE_NAME,
} from '@/lib/authConstants';

/**
 * Valide et normalise le payload de connexion.
 *
 * @param {Object|null} body
 * @returns {{ email: string, password: string }}
 */
function normalizeLoginPayload(body) {
	const email =
		typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
	const password =
		typeof body?.password === 'string' ? body.password : '';

	return { email, password };
}

/**
 * Route POST /api/auth/login
 *
 * @param {Request} request
 * @returns {Promise<Response>}
 */
export async function POST(request) {
	try {
		const body = await request.json().catch(() => null);
		const { email, password } = normalizeLoginPayload(body);

		if (email === '' || password.trim() === '') {
			return NextResponse.json(
				{
					success: false,
					message: 'Adresse e-mail et mot de passe requis.',
				},
				{ status: 400 },
			);
		}

		const data = await apiRequest('/auth/login', {
			method: 'POST',
			body: { email, password },
			cache: 'no-store',
		});

		const token =
			typeof data?.token === 'string' && data.token.trim() !== ''
				? data.token.trim()
				: '';
		const user = data?.user ?? null;
		const userId = String(user?.id ?? '').trim();

		if (token === '' || !user || typeof user !== 'object' || userId === '') {
			return NextResponse.json(
				{
					success: false,
					message: "Réponse d'authentification invalide.",
				},
				{ status: 502 },
			);
		}

		const response = NextResponse.json(
			{
				success: true,
				data: { user },
			},
			{ status: 200 },
		);

		response.cookies.set({
			name: AUTH_COOKIE_NAME,
			value: token,
			httpOnly: true,
			sameSite: AUTH_COOKIE_SAME_SITE,
			secure: process.env.NODE_ENV === 'production',
			path: AUTH_COOKIE_PATH,
			maxAge: AUTH_COOKIE_MAX_AGE_SECONDS,
		});

		response.cookies.set({
			name: AUTH_USER_ID_COOKIE_NAME,
			value: userId,
			httpOnly: true,
			sameSite: AUTH_COOKIE_SAME_SITE,
			secure: process.env.NODE_ENV === 'production',
			path: AUTH_COOKIE_PATH,
			maxAge: AUTH_COOKIE_MAX_AGE_SECONDS,
		});

		return response;
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
				message: 'Impossible de se connecter.',
			},
			{ status: 500 },
		);
	}
}
