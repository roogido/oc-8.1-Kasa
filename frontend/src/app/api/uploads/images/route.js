/**
 * @file src/app/api/uploads/images/route.js
 * @description
 * Route interne Next.js pour supprimer une ou plusieurs images backend.
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { getApiBaseUrl } from '@/lib/env';
import { AUTH_COOKIE_NAME } from '@/lib/authConstants';

/**
 * Parse une reponse JSON sans lever d'erreur si le corps est vide.
 *
 * @param {Response} response
 * @returns {Promise<Object|null>}
 */
async function parseJsonSafe(response) {
	return response.json().catch(() => null);
}

/**
 * Route DELETE /api/uploads/images
 *
 * @param {Request} request
 * @returns {Promise<Response>}
 */
export async function DELETE(request) {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get(AUTH_COOKIE_NAME)?.value ?? '';

		if (token.trim() === '') {
			return NextResponse.json(
				{
					success: false,
					message: 'Non authentifie.',
				},
				{ status: 401 },
			);
		}

		const body = await request.json().catch(() => null);

		const response = await fetch(`${getApiBaseUrl()}/api/uploads/images`, {
			method: 'DELETE',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(body ?? {}),
			cache: 'no-store',
		});

		const data = await parseJsonSafe(response);

		if (!response.ok && response.status !== 207) {
			return NextResponse.json(
				{
					success: false,
					message:
						typeof data?.message === 'string' &&
						data.message.trim() !== ''
							? data.message
							: "Impossible de supprimer l'image.",
				},
				{ status: response.status },
			);
		}

		return NextResponse.json(
			{
				success: true,
				data,
			},
			{ status: response.status },
		);
	} catch {
		return NextResponse.json(
			{
				success: false,
				message: "Impossible de supprimer l'image.",
			},
			{ status: 500 },
		);
	}
}
