/**
 * @file src/app/api/auth/logout/route.js
 * @description
 * Route interne Next.js pour déconnecter un utilisateur Kasa.
 */

import { NextResponse } from 'next/server';

import { AUTH_COOKIE_NAME } from '@/lib/authConstants';

/**
 * Route POST /api/auth/logout
 *
 * @returns {Response}
 */
export async function POST() {
	const response = NextResponse.json(
		{
			success: true,
		},
		{ status: 200 },
	);

	response.cookies.set({
		name: AUTH_COOKIE_NAME,
		value: '',
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		path: '/',
		maxAge: 0,
	});

	return response;
}
