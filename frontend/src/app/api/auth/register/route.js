/**
 * @file src/app/api/auth/register/route.js
 * @description
 * Route interne Next.js pour inscrire un utilisateur Kasa.
 */

import { NextResponse } from 'next/server';

import { apiRequest, ApiClientError } from '@/lib/apiClient';

const AUTH_COOKIE_NAME = 'kasa_auth_token';
const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

/**
 * Valide et normalise le payload d'inscription.
 *
 * @param {Object|null} body
 * @returns {{ name: string, email: string, password: string }}
 */
function normalizeRegisterPayload(body) {
	const firstName =
		typeof body?.firstName === 'string' ? body.firstName.trim() : '';
	const lastName =
		typeof body?.lastName === 'string' ? body.lastName.trim() : '';
	const email =
		typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
	const password =
		typeof body?.password === 'string' ? body.password : '';

	const name = [firstName, lastName].filter(Boolean).join(' ').trim();

	return { name, email, password };
}

/**
 * Route POST /api/auth/register
 *
 * @param {Request} request
 * @returns {Promise<Response>}
 */
export async function POST(request) {
	try {
		const body = await request.json().catch(() => null);
		const { name, email, password } = normalizeRegisterPayload(body);

		if (name === '' || email === '' || password.trim() === '') {
			return NextResponse.json(
				{
					success: false,
					message: 'Nom, adresse email et mot de passe requis.',
				},
				{ status: 400 },
			);
		}

		const data = await apiRequest('/auth/register', {
			method: 'POST',
			body: { name, email, password },
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
					message: 'Réponse d’inscription invalide.',
				},
				{ status: 502 },
			);
		}

		const response = NextResponse.json(
			{
				success: true,
				data: { user },
			},
			{ status: 201 },
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
				message: 'Impossible de créer le compte.',
			},
			{ status: 500 },
		);
	}
}
