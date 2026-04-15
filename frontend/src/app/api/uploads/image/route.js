/**
 * @file src/app/api/uploads/image/route.js
 * @description
 * Route interne Next.js pour uploader une image vers le backend Kasa.
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { getApiBaseUrl } from '@/lib/env';
import { AUTH_COOKIE_NAME } from '@/lib/authConstants';

/**
 * Parse la réponse JSON sans lever d'erreur si le corps est vide.
 *
 * @param {Response} response
 * @returns {Promise<Object|null>}
 */
async function parseJsonSafe(response) {
	return response.json().catch(() => null);
}

/**
 * Normalise une chaîne.
 *
 * @param {unknown} value
 * @returns {string}
 */
function normalizeString(value) {
	return typeof value === 'string' ? value.trim() : '';
}

/**
 * Route POST /api/uploads/image
 *
 * @param {Request} request
 * @returns {Promise<NextResponse>}
 */
export async function POST(request) {
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

		const incomingFormData = await request.formData();
		const file = incomingFormData.get('file');
		const purpose = normalizeString(incomingFormData.get('purpose'));
		const propertyId = normalizeString(incomingFormData.get('property_id'));

		if (!(file instanceof File)) {
			return NextResponse.json(
				{
					success: false,
					message: "Le fichier d'image est requis.",
				},
				{ status: 400 },
			);
		}

		const outgoingFormData = new FormData();
		outgoingFormData.append('file', file);

		if (purpose !== '') {
			outgoingFormData.append('purpose', purpose);
		}

		if (propertyId !== '') {
			outgoingFormData.append('property_id', propertyId);
		}

		const response = await fetch(`${getApiBaseUrl()}/api/uploads/image`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: outgoingFormData,
			cache: 'no-store',
		});

		const data = await parseJsonSafe(response);

		if (!response.ok) {
			return NextResponse.json(
				{
					success: false,
					message:
						typeof data?.message === 'string' &&
						data.message.trim() !== ''
							? data.message
							: "Impossible d'uploader l'image.",
				},
				{ status: response.status },
			);
		}

		return NextResponse.json(
			{
				success: true,
				data,
			},
			{ status: 201 },
		);
	} catch {
		return NextResponse.json(
			{
				success: false,
				message: "Impossible d'uploader l'image.",
			},
			{ status: 500 },
		);
	}
}
