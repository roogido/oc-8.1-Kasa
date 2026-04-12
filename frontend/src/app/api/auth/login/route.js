/**
 * @file src/app/api/auth/login/route.js
 * @description
 * Route interne Next.js pour authentifier un utilisateur Kasa.
 */

import { NextResponse } from 'next/server';

import { apiRequest, ApiClientError } from '@/lib/apiClient';

const AUTH_COOKIE_NAME = 'kasa_auth_token';
const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

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
					message: 'Adresse email et mot de passe requis.',
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

		if (token === '' || !user || typeof user !== 'object') {
			return NextResponse.json(
				{
					success: false,
					message: "Reponse d'authentification invalide.",
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
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production',
			path: '/',
			maxAge: ONE_WEEK_IN_SECONDS,
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
