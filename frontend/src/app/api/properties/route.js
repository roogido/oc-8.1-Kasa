/**
 * @file src/app/api/properties/route.js
 * @description
 * Route interne Next.js pour récupérer et créer des propriétés.
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { apiRequest, ApiClientError } from '@/lib/apiClient';
import { AUTH_COOKIE_NAME } from '@/lib/authConstants';

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
 * Normalise un nombre optionnel.
 *
 * @param {unknown} value
 * @returns {number|null}
 */
function normalizeOptionalNumber(value) {
	if (value === '' || value === null || value === undefined) {
		return null;
	}

	const parsedValue = Number(value);

	return Number.isFinite(parsedValue) ? parsedValue : null;
}

/**
 * Normalise un tableau de chaînes.
 *
 * @param {unknown} value
 * @returns {string[]}
 */
function normalizeStringArray(value) {
	if (!Array.isArray(value)) {
		return [];
	}

	return value
		.map((item) => normalizeString(item))
		.filter((item) => item !== '');
}

/**
 * Valide et normalise le payload de création de propriété.
 *
 * @param {Object|null} body
 * @returns {Object}
 */
function normalizeCreatePropertyPayload(body) {
	const title = normalizeString(body?.title);
	const description = normalizeString(body?.description);
	const cover = normalizeString(body?.cover);
	const location = normalizeString(body?.location);
	const hostId = normalizeOptionalNumber(body?.host_id ?? body?.hostId);

	const hostName = normalizeString(body?.host?.name ?? body?.hostName);
	const hostPicture = normalizeString(
		body?.host?.picture ?? body?.hostPicture,
	);

	const pricePerNight = normalizeOptionalNumber(
		body?.price_per_night ?? body?.pricePerNight,
	);

	const pictures = normalizeStringArray(body?.pictures);
	const equipments = normalizeStringArray(body?.equipments);
	const tags = normalizeStringArray(body?.tags);

	const payload = {
		title,
	};

	if (description !== '') {
		payload.description = description;
	}

	if (cover !== '') {
		payload.cover = cover;
	}

	if (location !== '') {
		payload.location = location;
	}

	if (pricePerNight !== null) {
		payload.price_per_night = pricePerNight;
	}

	if (hostId !== null) {
		payload.host_id = hostId;
	} else if (hostName !== '') {
		payload.host = {
			name: hostName,
		};

		if (hostPicture !== '') {
			payload.host.picture = hostPicture;
		}
	}

	if (pictures.length > 0) {
		payload.pictures = pictures;
	}

	if (equipments.length > 0) {
		payload.equipments = equipments;
	}

	if (tags.length > 0) {
		payload.tags = tags;
	}

	return payload;
}

/**
 * Route GET /api/properties
 *
 * @returns {Promise<NextResponse>}
 */
export async function GET() {
	try {
		const properties = await apiRequest('/api/properties', {
			method: 'GET',
			cache: 'no-store',
		});

		return NextResponse.json({
			success: true,
			data: {
				properties: Array.isArray(properties) ? properties : [],
			},
		});
	} catch (error) {
		const status =
			error instanceof ApiClientError && Number.isInteger(error.status)
				? error.status
				: 500;

		return NextResponse.json(
			{
				success: false,
				message:
					error instanceof Error
						? error.message
						: 'Impossible de récupérer les propriétés.',
			},
			{ status },
		);
	}
}

/**
 * Route POST /api/properties
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

		const body = await request.json().catch(() => null);
		const payload = normalizeCreatePropertyPayload(body);

		if (payload.title === '') {
			return NextResponse.json(
				{
					success: false,
					message: 'Le titre de la propriété est requis.',
				},
				{ status: 400 },
			);
		}

		if (
			payload.host_id === undefined &&
			(payload.host === undefined || payload.host.name === '')
		) {
			return NextResponse.json(
				{
					success: false,
					message:
						"Un hôte valide est requis pour créer la propriété.",
				},
				{ status: 400 },
			);
		}

		const property = await apiRequest('/api/properties', {
			method: 'POST',
			body: payload,
			token,
			cache: 'no-store',
		});

		return NextResponse.json(
			{
				success: true,
				data: {
					property,
				},
			},
			{ status: 201 },
		);
	} catch (error) {
		const status =
			error instanceof ApiClientError && Number.isInteger(error.status)
				? error.status
				: 500;

		return NextResponse.json(
			{
				success: false,
				message:
					error instanceof Error
						? error.message
						: 'Impossible de créer la propriété.',
			},
			{ status },
		);
	}
}
