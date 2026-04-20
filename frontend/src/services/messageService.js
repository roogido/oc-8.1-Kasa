/**
 * @file src/services/messageService.js
 * @description
 * Services front de messagerie via routes internes Next.js.
 */

import { internalApiRequest } from '@/lib/internalApiClient';

/**
 * @param {unknown} value
 * @returns {string}
 */
function normalizeConversationId(value) {
	return typeof value === 'string'
		? value.trim()
		: String(value ?? '').trim();
}

/**
 * @param {unknown} value
 * @returns {string}
 */
function normalizePropertyId(value) {
	return typeof value === 'string'
		? value.trim()
		: String(value ?? '').trim();
}

/**
 * @param {unknown} value
 * @returns {string}
 */
function normalizeMessageBody(value) {
	return typeof value === 'string' ? value.trim() : '';
}

/**
 * Ouvre une conversation pour un logement ou retourne la conversation existante.
 *
 * @param {string} propertyId
 * @returns {Promise<{ conversation: Object|null, currentUserId: number|null }>}
 */
export async function openConversation(propertyId) {
	const normalizedPropertyId = normalizePropertyId(propertyId);

	if (normalizedPropertyId === '') {
		throw new Error('propertyId is required.');
	}

	const data = await internalApiRequest('/api/messages/conversations', {
		method: 'POST',
		body: {
			property_id: normalizedPropertyId,
		},
	});

	return {
		conversation: data?.data?.conversation ?? null,
		currentUserId:
			typeof data?.data?.currentUserId === 'number'
				? data.data.currentUserId
				: null,
	};
}

/**
 * Liste les conversations de l'utilisateur courant.
 *
 * @returns {Promise<{ conversations: Array<Object>, currentUserId: number|null }>}
 */
export async function listConversations() {
	const data = await internalApiRequest('/api/messages/conversations', {
		method: 'GET',
	});

	return {
		conversations: Array.isArray(data?.data?.conversations)
			? data.data.conversations
			: [],
		currentUserId:
			typeof data?.data?.currentUserId === 'number'
				? data.data.currentUserId
				: null,
	};
}

/**
 * Lit le detail d'une conversation.
 *
 * @param {string|number} conversationId
 * @returns {Promise<{ conversation: Object|null, currentUserId: number|null }>}
 */
export async function getConversationDetail(conversationId) {
	const normalizedConversationId =
		normalizeConversationId(conversationId);

	if (normalizedConversationId === '') {
		throw new Error('conversationId is required.');
	}

	const data = await internalApiRequest(
		`/api/messages/conversations/${normalizedConversationId}`,
		{
			method: 'GET',
		},
	);

	return {
		conversation: data?.data?.conversation ?? null,
		currentUserId:
			typeof data?.data?.currentUserId === 'number'
				? data.data.currentUserId
				: null,
	};
}

/**
 * Envoie un message dans une conversation.
 *
 * @param {string|number} conversationId
 * @param {string} body
 * @returns {Promise<{ message: Object|null, currentUserId: number|null }>}
 */
export async function sendConversationMessage(conversationId, body) {
	const normalizedConversationId =
		normalizeConversationId(conversationId);
	const normalizedBody = normalizeMessageBody(body);

	if (normalizedConversationId === '') {
		throw new Error('conversationId is required.');
	}

	if (normalizedBody === '') {
		throw new Error('Message body is required.');
	}

	const data = await internalApiRequest(
		`/api/messages/conversations/${normalizedConversationId}/messages`,
		{
			method: 'POST',
			body: {
				body: normalizedBody,
			},
		},
	);

	return {
		message: data?.data?.message ?? null,
		currentUserId:
			typeof data?.data?.currentUserId === 'number'
				? data.data.currentUserId
				: null,
	};
}

/**
 * Marque comme lus les messages recus d'une conversation.
 *
 * @param {string|number} conversationId
 * @returns {Promise<{ ok: boolean, updated: number }>}
 */
export async function markConversationAsRead(conversationId) {
	const normalizedConversationId =
		normalizeConversationId(conversationId);

	if (normalizedConversationId === '') {
		throw new Error('conversationId is required.');
	}

	const data = await internalApiRequest(
		`/api/messages/conversations/${normalizedConversationId}/read`,
		{
			method: 'POST',
		},
	);

	return {
		ok: data?.data?.result?.ok === true,
		updated:
			typeof data?.data?.result?.updated === 'number'
				? data.data.result.updated
				: 0,
	};
}
