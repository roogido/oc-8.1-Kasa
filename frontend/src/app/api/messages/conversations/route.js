/**
 * @file src/app/api/messages/conversations/route.js
 * @description
 * Routes internes Next.js pour la liste des conversations
 * et l'ouverture / recuperation d'une conversation.
 */

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { apiRequest, ApiClientError } from '@/lib/apiClient';
import {
	AUTH_COOKIE_NAME,
	AUTH_USER_ID_COOKIE_NAME,
} from '@/lib/authConstants';

/**
 * Retourne un id utilisateur numerique valide a partir du cookie.
 *
 * @param {string|undefined} value
 * @returns {number|null}
 */
function parseCurrentUserId(value) {
	const numericValue = Number.parseInt(String(value ?? '').trim(), 10);

	return Number.isInteger(numericValue) && numericValue > 0
		? numericValue
		: null;
}

/**
 * Retourne le token d'authentification depuis les cookies.
 *
 * @param {Awaited<ReturnType<typeof cookies>>} cookieStore
 * @returns {string}
 */
function getAuthToken(cookieStore) {
	return cookieStore.get(AUTH_COOKIE_NAME)?.value?.trim() ?? '';
}

/**
 * Construit la reponse 401 standard.
 *
 * @returns {Response}
 */
function buildUnauthorizedResponse() {
	return NextResponse.json(
		{
			success: false,
			message: 'Authentification requise.',
		},
		{ status: 401 },
	);
}

/**
 * Route GET /api/messages/conversations
 *
 * @returns {Promise<Response>}
 */
export async function GET() {
	const cookieStore = await cookies();
	const token = getAuthToken(cookieStore);
	const currentUserId = parseCurrentUserId(
		cookieStore.get(AUTH_USER_ID_COOKIE_NAME)?.value,
	);

	if (token === '') {
		return buildUnauthorizedResponse();
	}

	try {
		const conversations = await apiRequest('/api/messages/conversations', {
			method: 'GET',
			token,
			cache: 'no-store',
		});

		return NextResponse.json(
			{
				success: true,
				data: {
					conversations: Array.isArray(conversations)
						? conversations
						: [],
					currentUserId,
				},
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
				message: 'Impossible de recuperer les conversations.',
			},
			{ status: 500 },
		);
	}
}

/**
 * Route POST /api/messages/conversations
 *
 * @param {Request} request
 * @returns {Promise<Response>}
 */
export async function POST(request) {
	const cookieStore = await cookies();
	const token = getAuthToken(cookieStore);
	const currentUserId = parseCurrentUserId(
		cookieStore.get(AUTH_USER_ID_COOKIE_NAME)?.value,
	);

	if (token === '') {
		return buildUnauthorizedResponse();
	}

	try {
		const body = await request.json().catch(() => null);
		const propertyId =
			typeof body?.property_id === 'string' ? body.property_id.trim() : '';

		if (propertyId === '') {
			return NextResponse.json(
				{
					success: false,
					message: 'property_id est requis.',
				},
				{ status: 400 },
			);
		}

		const conversation = await apiRequest('/api/messages/conversations', {
			method: 'POST',
			token,
			body: {
				property_id: propertyId,
			},
			cache: 'no-store',
		});

		return NextResponse.json(
			{
				success: true,
				data: {
					conversation,
					currentUserId,
				},
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
				message: "Impossible d'ouvrir la conversation.",
			},
			{ status: 500 },
		);
	}
}
