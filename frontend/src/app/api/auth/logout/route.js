/**
 * @file src/app/api/auth/logout/route.js
 * @description
 * Route interne Next.js pour déconnecter un utilisateur Kasa.
 */

import { NextResponse } from 'next/server';

import {
	AUTH_COOKIE_NAME,
	AUTH_COOKIE_PATH,
	AUTH_COOKIE_SAME_SITE,
	AUTH_USER_ID_COOKIE_NAME,
} from '@/lib/authConstants';

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
		sameSite: AUTH_COOKIE_SAME_SITE,
		secure: process.env.NODE_ENV === 'production',
		path: AUTH_COOKIE_PATH,
		maxAge: 0,
	});

	response.cookies.set({
		name: AUTH_USER_ID_COOKIE_NAME,
		value: '',
		httpOnly: true,
		sameSite: AUTH_COOKIE_SAME_SITE,
		secure: process.env.NODE_ENV === 'production',
		path: AUTH_COOKIE_PATH,
		maxAge: 0,
	});

	return response;
}
