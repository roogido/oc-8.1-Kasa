/**
 * @file src/app/api/messages/conversations/[conversationId]/read/route.js
 * @description
 * Route interne Next.js pour marquer comme lus les messages d'une conversation.
 */

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { apiRequest, ApiClientError } from '@/lib/apiClient';
import { AUTH_COOKIE_NAME } from '@/lib/authConstants';

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
 * Route POST /api/messages/conversations/[conversationId]/read
 *
 * @param {Request} _request
 * @param {{ params: Promise<{ conversationId: string }> | { conversationId: string } }} context
 * @returns {Promise<Response>}
 */
export async function POST(_request, context) {
	const cookieStore = await cookies();
	const token = getAuthToken(cookieStore);

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

		const result = await apiRequest(
			`/api/messages/conversations/${conversationId}/read`,
			{
				method: 'POST',
				token,
				cache: 'no-store',
			},
		);

		return NextResponse.json(
			{
				success: true,
				data: {
					result,
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
				message: "Impossible de marquer les messages comme lus.",
			},
			{ status: 500 },
		);
	}
}
