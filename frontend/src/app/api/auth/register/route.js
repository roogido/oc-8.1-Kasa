/**
 * @file src/app/api/auth/register/route.js
 * @description
 * Route interne Next.js pour inscrire un utilisateur Kasa.
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
 * Retourne un role d'inscription autorise.
 *
 * @param {unknown} role
 * @returns {'client'|'owner'|''}
 */
function normalizeRegistrationRole(role) {
	if (typeof role !== 'string') {
		return 'client';
	}

	const normalizedRole = role.trim().toLowerCase();

	if (normalizedRole === 'client' || normalizedRole === 'owner') {
		return normalizedRole;
	}

	if (normalizedRole === '') {
		return 'client';
	}

	return '';
}

/**
 * Valide et normalise le payload d'inscription.
 *
 * @param {Object|null} body
 * @returns {{ name: string, email: string, password: string, role: string }}
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
	const role = normalizeRegistrationRole(body?.role);

	const name = [firstName, lastName].filter(Boolean).join(' ').trim();

	return { name, email, password, role };
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
		const { name, email, password, role } = normalizeRegisterPayload(body);

		if (name === '' || email === '' || password.trim() === '') {
			return NextResponse.json(
				{
					success: false,
					message: 'Nom, adresse e-mail et mot de passe requis.',
				},
				{ status: 400 },
			);
		}

		if (role === '') {
			return NextResponse.json(
				{
					success: false,
					message:
						"Le role d'inscription doit etre 'client' ou 'owner'.",
				},
				{ status: 400 },
			);
		}

		const data = await apiRequest('/auth/register', {
			method: 'POST',
			body: { name, email, password, role },
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
					message: "Reponse d'inscription invalide.",
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
				message: 'Impossible de creer le compte.',
			},
			{ status: 500 },
		);
	}
}
