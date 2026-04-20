/**
 * @file src/services/messageService.test.js
 * @description
 * Tests unitaires du service frontend de messagerie.
 *
 * Ce fichier teste :
 *      - l'ouverture d'une conversation ;
 *      - la liste des conversations ;
 *      - le détail d'une conversation ;
 *      - l'envoi d'un message ;
 *      - le marquage comme lus.
 *
 * Exécution de ce fichier :
 *       npm run test -- src/services/messageService.test.js
 *
 * Exécution de tous les tests :
 *      npm run test
 *
 * Mode watch :
 *      npm run test -- --watch
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
	getConversationDetail,
	listConversations,
	markConversationAsRead,
	openConversation,
	sendConversationMessage,
} from './messageService';

/**
 * Fabrique une réponse fetch JSON simulée.
 *
 * @param {Object} options
 * @param {boolean} [options.ok=true]
 * @param {number} [options.status=200]
 * @param {Object|Array|null} [options.data=null]
 * @returns {Object}
 */
function createMockJsonResponse({ ok = true, status = 200, data = null } = {}) {
	return {
		ok,
		status,
		json: vi.fn().mockResolvedValue(data),
	};
}

describe('messageService', () => {
	beforeEach(() => {
		global.fetch = vi.fn();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('ouvre une conversation pour un logement et retourne les données utiles', async () => {
		global.fetch.mockResolvedValueOnce(
			createMockJsonResponse({
				ok: true,
				status: 200,
				data: {
					success: true,
					data: {
						conversation: {
							id: 12,
							property: {
								id: 'c67ab8a7',
								title: 'Appartement cosy',
								cover: '/uploads/property-cover.jpg',
							},
							client: {
								id: 29,
								name: 'Annie Davis',
								picture: null,
							},
							host: {
								id: 1,
								name: 'Nathalie Jean',
								picture: null,
							},
							last_message_at: null,
							last_message_preview: null,
						},
						currentUserId: 29,
					},
				},
			}),
		);

		const result = await openConversation('c67ab8a7');

		expect(global.fetch).toHaveBeenCalledWith(
			'/api/messages/conversations',
			{
				method: 'POST',
				credentials: 'same-origin',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					property_id: 'c67ab8a7',
				}),
			},
		);

		expect(result).toEqual({
			conversation: {
				id: 12,
				property: {
					id: 'c67ab8a7',
					title: 'Appartement cosy',
					cover: '/uploads/property-cover.jpg',
				},
				client: {
					id: 29,
					name: 'Annie Davis',
					picture: null,
				},
				host: {
					id: 1,
					name: 'Nathalie Jean',
					picture: null,
				},
				last_message_at: null,
				last_message_preview: null,
			},
			currentUserId: 29,
		});
	});

	it("rejette l'ouverture d'une conversation si propertyId est vide", async () => {
		await expect(openConversation('   ')).rejects.toThrow(
			'propertyId is required.',
		);

		expect(global.fetch).not.toHaveBeenCalled();
	});

	it("propage une erreur métier lors de l'ouverture d'une conversation", async () => {
		global.fetch.mockResolvedValueOnce(
			createMockJsonResponse({
				ok: false,
				status: 404,
				data: {
					success: false,
					message: 'Property not found',
				},
			}),
		);

		await expect(openConversation('property-inexistante')).rejects.toThrow(
			'Property not found',
		);
	});

	it("liste les conversations de l'utilisateur courant", async () => {
		global.fetch.mockResolvedValueOnce(
			createMockJsonResponse({
				ok: true,
				status: 200,
				data: {
					success: true,
					data: {
						conversations: [
							{
								id: 1,
								property: {
									id: 'c67ab8a7',
									title: 'Appartement cosy',
									cover: '/uploads/property-cover.jpg',
								},
								other_user: {
									id: 1,
									name: 'Nathalie Jean',
									picture: null,
								},
								last_message_preview: 'Bonjour',
								last_message_at: '2026-04-20 09:00:00',
								unread_count: 2,
							},
						],
						currentUserId: 29,
					},
				},
			}),
		);

		const result = await listConversations();

		expect(global.fetch).toHaveBeenCalledWith(
			'/api/messages/conversations',
			{
				method: 'GET',
				credentials: 'same-origin',
				headers: {
					Accept: 'application/json',
				},
				body: undefined,
			},
		);

		expect(result).toEqual({
			conversations: [
				{
					id: 1,
					property: {
						id: 'c67ab8a7',
						title: 'Appartement cosy',
						cover: '/uploads/property-cover.jpg',
					},
					other_user: {
						id: 1,
						name: 'Nathalie Jean',
						picture: null,
					},
					last_message_preview: 'Bonjour',
					last_message_at: '2026-04-20 09:00:00',
					unread_count: 2,
				},
			],
			currentUserId: 29,
		});
	});

	it('retourne une liste vide si le payload conversations est absent', async () => {
		global.fetch.mockResolvedValueOnce(
			createMockJsonResponse({
				ok: true,
				status: 200,
				data: {
					success: true,
					data: {
						currentUserId: 29,
					},
				},
			}),
		);

		const result = await listConversations();

		expect(result).toEqual({
			conversations: [],
			currentUserId: 29,
		});
	});

	it("récupère le détail d'une conversation", async () => {
		global.fetch.mockResolvedValueOnce(
			createMockJsonResponse({
				ok: true,
				status: 200,
				data: {
					success: true,
					data: {
						conversation: {
							id: 1,
							property: {
								id: 'c67ab8a7',
								title: 'Appartement cosy',
								cover: '/uploads/property-cover.jpg',
							},
							client: {
								id: 29,
								name: 'Annie Davis',
								picture: null,
							},
							host: {
								id: 1,
								name: 'Nathalie Jean',
								picture: null,
							},
							last_message_preview: 'Bonjour',
							last_message_at: '2026-04-20 09:00:00',
							messages: [
								{
									id: 4,
									sender_user_id: 29,
									body: 'Bonjour',
									created_at: '2026-04-20 09:00:00',
									read_at: null,
								},
							],
						},
						currentUserId: 29,
					},
				},
			}),
		);

		const result = await getConversationDetail(1);

		expect(global.fetch).toHaveBeenCalledWith(
			'/api/messages/conversations/1',
			{
				method: 'GET',
				credentials: 'same-origin',
				headers: {
					Accept: 'application/json',
				},
				body: undefined,
			},
		);

		expect(result).toEqual({
			conversation: {
				id: 1,
				property: {
					id: 'c67ab8a7',
					title: 'Appartement cosy',
					cover: '/uploads/property-cover.jpg',
				},
				client: {
					id: 29,
					name: 'Annie Davis',
					picture: null,
				},
				host: {
					id: 1,
					name: 'Nathalie Jean',
					picture: null,
				},
				last_message_preview: 'Bonjour',
				last_message_at: '2026-04-20 09:00:00',
				messages: [
					{
						id: 4,
						sender_user_id: 29,
						body: 'Bonjour',
						created_at: '2026-04-20 09:00:00',
						read_at: null,
					},
				],
			},
			currentUserId: 29,
		});
	});

	it("rejette le détail d'une conversation si conversationId est vide", async () => {
		await expect(getConversationDetail('   ')).rejects.toThrow(
			'conversationId is required.',
		);

		expect(global.fetch).not.toHaveBeenCalled();
	});

	it('envoie un message dans une conversation', async () => {
		global.fetch.mockResolvedValueOnce(
			createMockJsonResponse({
				ok: true,
				status: 201,
				data: {
					success: true,
					data: {
						message: {
							id: 5,
							sender_user_id: 29,
							body: 'Bonjour, votre logement est-il disponible ?',
							created_at: '2026-04-20 10:30:00',
							read_at: null,
						},
						currentUserId: 29,
					},
				},
			}),
		);

		const result = await sendConversationMessage(
			1,
			'  Bonjour, votre logement est-il disponible ?  ',
		);

		expect(global.fetch).toHaveBeenCalledWith(
			'/api/messages/conversations/1/messages',
			{
				method: 'POST',
				credentials: 'same-origin',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					body: 'Bonjour, votre logement est-il disponible ?',
				}),
			},
		);

		expect(result).toEqual({
			message: {
				id: 5,
				sender_user_id: 29,
				body: 'Bonjour, votre logement est-il disponible ?',
				created_at: '2026-04-20 10:30:00',
				read_at: null,
			},
			currentUserId: 29,
		});
	});

	it("rejette l'envoi si le corps du message est vide", async () => {
		await expect(sendConversationMessage(1, '   ')).rejects.toThrow(
			'Message body is required.',
		);

		expect(global.fetch).not.toHaveBeenCalled();
	});

	it('marque une conversation comme lue', async () => {
		global.fetch.mockResolvedValueOnce(
			createMockJsonResponse({
				ok: true,
				status: 200,
				data: {
					success: true,
					data: {
						result: {
							ok: true,
							updated: 3,
						},
					},
				},
			}),
		);

		const result = await markConversationAsRead(1);

		expect(global.fetch).toHaveBeenCalledWith(
			'/api/messages/conversations/1/read',
			{
				method: 'POST',
				credentials: 'same-origin',
				headers: {
					Accept: 'application/json',
				},
				body: undefined,
			},
		);

		expect(result).toEqual({
			ok: true,
			updated: 3,
		});
	});

	it('retourne des valeurs par défaut si la réponse read est incomplète', async () => {
		global.fetch.mockResolvedValueOnce(
			createMockJsonResponse({
				ok: true,
				status: 200,
				data: {
					success: true,
					data: {},
				},
			}),
		);

		const result = await markConversationAsRead(1);

		expect(result).toEqual({
			ok: false,
			updated: 0,
		});
	});

	it("propage une erreur d'autorisation sur markConversationAsRead", async () => {
		global.fetch.mockResolvedValueOnce(
			createMockJsonResponse({
				ok: false,
				status: 403,
				data: {
					success: false,
					message: 'Forbidden',
				},
			}),
		);

		await expect(markConversationAsRead(1)).rejects.toThrow('Forbidden');
	});
});
