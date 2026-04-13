/**
 * @file src/app/api/auth/me/route.js
 * @description
 * Route interne Next.js pour récupérer l'utilisateur connecté.
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { apiRequest, ApiClientError } from '@/lib/apiClient';

const AUTH_COOKIE_NAME = 'kasa_auth_token';

/**
 * Route GET /api/auth/me
 *
 * @returns {Promise<Response>}
 */
export async function GET() {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get(AUTH_COOKIE_NAME)?.value ?? '';

		if (token.trim() === '') {
			return NextResponse.json(
				{
					success: false,
					message: 'Non authentifié.',
				},
				{ status: 401 },
			);
		}

		const data = await apiRequest('/auth/login', {
			method: 'GET',
			token,
			cache: 'no-store',
		});

		const user = data?.user ?? data?.data?.user ?? null;

		if (!user || typeof user !== 'object') {
			return NextResponse.json(
				{
					success: false,
					message: 'Utilisateur introuvable.',
				},
				{ status: 401 },
			);
		}

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
				message: 'Impossible de récupérer la session.',
			},
			{ status: 500 },
		);
	}
}
