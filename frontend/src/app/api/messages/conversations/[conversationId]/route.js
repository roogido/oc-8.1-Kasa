/**
 * @file src/app/api/messages/conversations/[conversationId]/route.js
 * @description
 * Route interne Next.js pour lire le detail d'une conversation.
 */

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { apiRequest, ApiClientError } from '@/lib/apiClient';
import {
	AUTH_COOKIE_NAME,
	AUTH_USER_ID_COOKIE_NAME,
} from '@/lib/authConstants';

/**
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
 * @param {Awaited<ReturnType<typeof cookies>>} cookieStore
 * @returns {string}
 */
function getAuthToken(cookieStore) {
	return cookieStore.get(AUTH_COOKIE_NAME)?.value?.trim() ?? '';
}

/**
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
 * Route GET /api/messages/conversations/[conversationId]
 *
 * @param {Request} _request
 * @param {{ params: Promise<{ conversationId: string }> | { conversationId: string } }} context
 * @returns {Promise<Response>}
 */
export async function GET(_request, context) {
	const cookieStore = await cookies();
	const token = getAuthToken(cookieStore);
	const currentUserId = parseCurrentUserId(
		cookieStore.get(AUTH_USER_ID_COOKIE_NAME)?.value,
	);

	if (token === '') {
		return buildUnauthorizedResponse();
	}

	try {
		const resolvedParams = await context.params;
		const conversationId =
			typeof resolvedParams?.conversationId === 'string'
				? resolvedParams.conversationId.trim()
				: '';

		if (conversationId === '') {
			return NextResponse.json(
				{
					success: false,
					message: 'conversationId est requis.',
				},
				{ status: 400 },
			);
		}

		const conversation = await apiRequest(
			`/api/messages/conversations/${conversationId}`,
			{
				method: 'GET',
				token,
				cache: 'no-store',
			},
		);

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
				message: 'Impossible de recuperer la conversation.',
			},
			{ status: 500 },
		);
	}
}
