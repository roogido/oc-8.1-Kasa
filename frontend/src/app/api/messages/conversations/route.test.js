/**
 * @file src/app/api/messages/conversations/route.test.js
 * @description
 * Tests unitaires des routes internes Next.js de messagerie :
 *      - GET /api/messages/conversations
 *      - POST /api/messages/conversations
 *
 * Ce fichier teste notamment :
 *      - l'absence de cookie d'authentification ;
 *      - la récupération correcte des conversations ;
 *      - la validation de property_id ;
 *      - la propagation des erreurs backend.
 *
 * Exécution de ce fichier :
 *      npm run test -- src/app/api/messages/conversations/route.test.js
 *
 * Exécution de tous les tests :
 *      npm run test
 *
 * Mode watch :
 *      npm run test -- --watch
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/headers', () => ({
	cookies: vi.fn(),
}));

vi.mock('next/server', () => ({
	NextResponse: {
		json: vi.fn((body, init = {}) => ({
			status: init.status ?? 200,
			body,
		})),
	},
}));

vi.mock('@/lib/authConstants', () => ({
	AUTH_COOKIE_NAME: 'kasa_auth_token',
	AUTH_USER_ID_COOKIE_NAME: 'kasa_auth_user_id',
}));

vi.mock('@/lib/apiClient', () => {
	class ApiClientError extends Error {
		/**
		 * @param {string} message
		 * @param {Object} [options={}]
		 * @param {number} [options.status=500]
		 * @param {Object|Array|null} [options.data=null]
		 */
		constructor(message, { status = 500, data = null } = {}) {
			super(message);
			this.name = 'ApiClientError';
			this.status = status;
			this.data = data;
		}
	}

	return {
		apiRequest: vi.fn(),
		ApiClientError,
	};
});

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { apiRequest, ApiClientError } from '@/lib/apiClient';
import { GET, POST } from './route';

/**
 * Retourne un cookie store simulé.
 *
 * @param {Object} values
 * @returns {{ get: (name: string) => ({ value: string }|undefined) }}
 */
function createCookieStore(values = {}) {
	return {
		get(name) {
			const value = values[name];

			if (typeof value !== 'string') {
				return undefined;
			}

			return { value };
		},
	};
}

/**
 * Retourne une fausse requête Next.js pour les routes POST.
 *
 * @param {Object|null} body
 * @returns {{ json: Function }}
 */
function createJsonRequest(body) {
	return {
		json: vi.fn().mockResolvedValue(body),
	};
}

describe('src/app/api/messages/conversations/route.js', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('GET', () => {
		it("retourne 401 si le cookie d'authentification est absent", async () => {
			cookies.mockResolvedValue(createCookieStore());

			const response = await GET();

			expect(response).toEqual({
				status: 401,
				body: {
					success: false,
					message: 'Authentification requise.',
				},
			});

			expect(apiRequest).not.toHaveBeenCalled();
		});

		it('retourne 200 avec une liste de conversations et currentUserId', async () => {
			cookies.mockResolvedValue(
				createCookieStore({
					kasa_auth_token: 'token-valide',
					kasa_auth_user_id: '29',
				}),
			);

			apiRequest.mockResolvedValueOnce([
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
			]);

			const response = await GET();

			expect(apiRequest).toHaveBeenCalledWith(
				'/api/messages/conversations',
				{
					method: 'GET',
					token: 'token-valide',
					cache: 'no-store',
				},
			);

			expect(response).toEqual({
				status: 200,
				body: {
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
			});
		});

		it('retourne une liste vide si le backend ne renvoie pas un tableau', async () => {
			cookies.mockResolvedValue(
				createCookieStore({
					kasa_auth_token: 'token-valide',
					kasa_auth_user_id: '29',
				}),
			);

			apiRequest.mockResolvedValueOnce(null);

			const response = await GET();

			expect(response).toEqual({
				status: 200,
				body: {
					success: true,
					data: {
						conversations: [],
						currentUserId: 29,
					},
				},
			});
		});

		it('propage le code et le message d’une erreur backend', async () => {
			cookies.mockResolvedValue(
				createCookieStore({
					kasa_auth_token: 'token-valide',
					kasa_auth_user_id: '29',
				}),
			);

			apiRequest.mockRejectedValueOnce(
				new ApiClientError('Forbidden', { status: 403 }),
			);

			const response = await GET();

			expect(response).toEqual({
				status: 403,
				body: {
					success: false,
					message: 'Forbidden',
				},
			});
		});

		it('retourne 500 sur erreur inattendue', async () => {
			cookies.mockResolvedValue(
				createCookieStore({
					kasa_auth_token: 'token-valide',
					kasa_auth_user_id: '29',
				}),
			);

			apiRequest.mockRejectedValueOnce(new Error('Erreur inconnue'));

			const response = await GET();

			expect(response).toEqual({
				status: 500,
				body: {
					success: false,
					message: 'Impossible de recuperer les conversations.',
				},
			});
		});

		it('retourne currentUserId à null si le cookie utilisateur est invalide', async () => {
			cookies.mockResolvedValue(
				createCookieStore({
					kasa_auth_token: 'token-valide',
					kasa_auth_user_id: 'abc',
				}),
			);

			apiRequest.mockResolvedValueOnce([]);

			const response = await GET();

			expect(response).toEqual({
				status: 200,
				body: {
					success: true,
					data: {
						conversations: [],
						currentUserId: null,
					},
				},
			});
		});
	});

	describe('POST', () => {
		it("retourne 401 si le cookie d'authentification est absent", async () => {
			cookies.mockResolvedValue(createCookieStore());

			const request = createJsonRequest({
				property_id: 'c67ab8a7',
			});

			const response = await POST(request);

			expect(response).toEqual({
				status: 401,
				body: {
					success: false,
					message: 'Authentification requise.',
				},
			});

			expect(apiRequest).not.toHaveBeenCalled();
		});

		it('retourne 400 si property_id est absent', async () => {
			cookies.mockResolvedValue(
				createCookieStore({
					kasa_auth_token: 'token-valide',
					kasa_auth_user_id: '29',
				}),
			);

			const request = createJsonRequest({});

			const response = await POST(request);

			expect(response).toEqual({
				status: 400,
				body: {
					success: false,
					message: 'property_id est requis.',
				},
			});

			expect(apiRequest).not.toHaveBeenCalled();
		});

		it('retourne 400 si property_id est vide', async () => {
			cookies.mockResolvedValue(
				createCookieStore({
					kasa_auth_token: 'token-valide',
					kasa_auth_user_id: '29',
				}),
			);

			const request = createJsonRequest({
				property_id: '   ',
			});

			const response = await POST(request);

			expect(response).toEqual({
				status: 400,
				body: {
					success: false,
					message: 'property_id est requis.',
				},
			});

			expect(apiRequest).not.toHaveBeenCalled();
		});

		it('ouvre ou récupère une conversation et retourne 200', async () => {
			cookies.mockResolvedValue(
				createCookieStore({
					kasa_auth_token: 'token-valide',
					kasa_auth_user_id: '29',
				}),
			);

			apiRequest.mockResolvedValueOnce({
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
			});

			const request = createJsonRequest({
				property_id: '  c67ab8a7  ',
			});

			const response = await POST(request);

			expect(apiRequest).toHaveBeenCalledWith(
				'/api/messages/conversations',
				{
					method: 'POST',
					token: 'token-valide',
					body: {
						property_id: 'c67ab8a7',
					},
					cache: 'no-store',
				},
			);

			expect(response).toEqual({
				status: 200,
				body: {
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
			});
		});

		it('propage une erreur 404 du backend', async () => {
			cookies.mockResolvedValue(
				createCookieStore({
					kasa_auth_token: 'token-valide',
					kasa_auth_user_id: '29',
				}),
			);

			apiRequest.mockRejectedValueOnce(
				new ApiClientError('Property not found', { status: 404 }),
			);

			const request = createJsonRequest({
				property_id: 'property-inexistante',
			});

			const response = await POST(request);

			expect(response).toEqual({
				status: 404,
				body: {
					success: false,
					message: 'Property not found',
				},
			});
		});

		it('retourne 500 sur erreur inattendue', async () => {
			cookies.mockResolvedValue(
				createCookieStore({
					kasa_auth_token: 'token-valide',
					kasa_auth_user_id: '29',
				}),
			);

			apiRequest.mockRejectedValueOnce(new Error('Erreur inconnue'));

			const request = createJsonRequest({
				property_id: 'c67ab8a7',
			});

			const response = await POST(request);

			expect(response).toEqual({
				status: 500,
				body: {
					success: false,
					message: "Impossible d'ouvrir la conversation.",
				},
			});
		});

		it('retourne currentUserId à null si le cookie utilisateur est absent', async () => {
			cookies.mockResolvedValue(
				createCookieStore({
					kasa_auth_token: 'token-valide',
				}),
			);

			apiRequest.mockResolvedValueOnce({
				id: 12,
			});

			const request = createJsonRequest({
				property_id: 'c67ab8a7',
			});

			const response = await POST(request);

			expect(response).toEqual({
				status: 200,
				body: {
					success: true,
					data: {
						conversation: {
							id: 12,
						},
						currentUserId: null,
					},
				},
			});
		});
	});
});
