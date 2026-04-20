/**
 * @file src/app/api/messages/conversations/[conversationId]/route.test.js
 * @description
 * Tests unitaires de la route interne Next.js :
 * GET /api/messages/conversations/[conversationId]
 *
 * Ce fichier vérifie notamment :
 *      - l'absence de cookie d'authentification ;
 *      - la validation de conversationId ;
 *      - la récupération correcte du détail d'une conversation ;
 *      - la propagation des erreurs backend.
 *
 * Exécution de ce fichier :
 *      npm run test -- src/app/api/messages/conversations/[conversationId]/route.test.js
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
		 * Crée une erreur API simulée pour les tests.
		 *
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
import { apiRequest, ApiClientError } from '@/lib/apiClient';
import { GET } from './route';

/**
 * Fabrique un cookie store simulé pour les routes Next.js.
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
 * Fabrique un contexte Next.js avec params résolus en Promise,
 * comme dans l'exécution réelle d'App Router.
 *
 * @param {string|undefined} conversationId
 * @returns {{ params: Promise<{ conversationId: string|undefined }> }}
 */
function createRouteContext(conversationId) {
	return {
		params: Promise.resolve({
			conversationId,
		}),
	};
}

describe('src/app/api/messages/conversations/[conversationId]/route.js', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('GET', () => {
		it("retourne 401 si l'utilisateur n'a pas de cookie d'authentification", async () => {
			// Cas testé :
			// la route doit refuser l'accès si le cookie JWT est absent.
			cookies.mockResolvedValue(createCookieStore());

			const response = await GET(
				{},
				createRouteContext('1'),
			);

			expect(response).toEqual({
				status: 401,
				body: {
					success: false,
					message: 'Authentification requise.',
				},
			});

			expect(apiRequest).not.toHaveBeenCalled();
		});

		it('retourne 400 si conversationId est absent', async () => {
			// Cas testé :
			// la route doit valider la présence du paramètre d'URL.
			cookies.mockResolvedValue(
				createCookieStore({
					kasa_auth_token: 'token-valide',
					kasa_auth_user_id: '29',
				}),
			);

			const response = await GET(
				{},
				createRouteContext(undefined),
			);

			expect(response).toEqual({
				status: 400,
				body: {
					success: false,
					message: 'conversationId est requis.',
				},
			});

			expect(apiRequest).not.toHaveBeenCalled();
		});

		it('retourne 400 si conversationId est vide', async () => {
			// Cas testé :
			// un paramètre vide ou composé seulement d'espaces
			// doit être rejeté avant l'appel backend.
			cookies.mockResolvedValue(
				createCookieStore({
					kasa_auth_token: 'token-valide',
					kasa_auth_user_id: '29',
				}),
			);

			const response = await GET(
				{},
				createRouteContext('   '),
			);

			expect(response).toEqual({
				status: 400,
				body: {
					success: false,
					message: 'conversationId est requis.',
				},
			});

			expect(apiRequest).not.toHaveBeenCalled();
		});

		it("retourne 200 avec le détail de la conversation et l'identifiant utilisateur courant", async () => {
			// Cas testé :
			// la route récupère correctement le détail d'une conversation
			// et le réemballe dans le format attendu côté frontend.
			cookies.mockResolvedValue(
				createCookieStore({
					kasa_auth_token: 'token-valide',
					kasa_auth_user_id: '29',
				}),
			);

			apiRequest.mockResolvedValueOnce({
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
			});

			const response = await GET(
				{},
				createRouteContext('1'),
			);

			expect(apiRequest).toHaveBeenCalledWith(
				'/api/messages/conversations/1',
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
			});
		});

		it("retourne currentUserId à null si le cookie d'utilisateur est invalide", async () => {
			// Cas testé :
			// la route doit continuer à fonctionner même si le cookie
			// utilisateur n'est pas exploitable.
			cookies.mockResolvedValue(
				createCookieStore({
					kasa_auth_token: 'token-valide',
					kasa_auth_user_id: 'abc',
				}),
			);

			apiRequest.mockResolvedValueOnce({
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
				last_message_preview: null,
				last_message_at: null,
				messages: [],
			});

			const response = await GET(
				{},
				createRouteContext('1'),
			);

			expect(response).toEqual({
				status: 200,
				body: {
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
							last_message_preview: null,
							last_message_at: null,
							messages: [],
						},
						currentUserId: null,
					},
				},
			});
		});

		it('propage une erreur 403 renvoyée par le backend', async () => {
			// Cas testé :
			// la route doit conserver le code et le message d'une
			// interdiction d'accès renvoyée par l'API backend.
			cookies.mockResolvedValue(
				createCookieStore({
					kasa_auth_token: 'token-valide',
					kasa_auth_user_id: '29',
				}),
			);

			apiRequest.mockRejectedValueOnce(
				new ApiClientError('Forbidden', { status: 403 }),
			);

			const response = await GET(
				{},
				createRouteContext('1'),
			);

			expect(response).toEqual({
				status: 403,
				body: {
					success: false,
					message: 'Forbidden',
				},
			});
		});

		it('propage une erreur 404 renvoyée par le backend', async () => {
			// Cas testé :
			// la route doit transmettre correctement le cas où
			// la conversation n'existe pas.
			cookies.mockResolvedValue(
				createCookieStore({
					kasa_auth_token: 'token-valide',
					kasa_auth_user_id: '29',
				}),
			);

			apiRequest.mockRejectedValueOnce(
				new ApiClientError('Conversation not found', {
					status: 404,
				}),
			);

			const response = await GET(
				{},
				createRouteContext('999'),
			);

			expect(response).toEqual({
				status: 404,
				body: {
					success: false,
					message: 'Conversation not found',
				},
			});
		});

		it('retourne 500 en cas d’erreur inattendue', async () => {
			// Cas testé :
			// si une erreur non maîtrisée survient, la route doit
			// renvoyer un message générique côté frontend.
			cookies.mockResolvedValue(
				createCookieStore({
					kasa_auth_token: 'token-valide',
					kasa_auth_user_id: '29',
				}),
			);

			apiRequest.mockRejectedValueOnce(new Error('Erreur inconnue'));

			const response = await GET(
				{},
				createRouteContext('1'),
			);

			expect(response).toEqual({
				status: 500,
				body: {
					success: false,
					message: 'Impossible de recuperer la conversation.',
				},
			});
		});
	});
});
