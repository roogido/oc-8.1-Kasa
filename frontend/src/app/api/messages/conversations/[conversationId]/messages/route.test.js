/**
 * @file src/app/api/messages/conversations/[conversationId]/messages/route.test.js
 * @description
 * Tests unitaires de la route interne Next.js :
 * POST /api/messages/conversations/[conversationId]/messages
 *
 * Ce fichier vérifie notamment :
 *      - l'absence de cookie d'authentification ;
 *      - la validation de conversationId ;
 *      - la validation du corps du message ;
 *      - l'envoi correct du message vers le backend ;
 *      - la propagation des erreurs backend.
 *
 * Exécution de ce fichier :
 *      npm run test -- src/app/api/messages/conversations/[conversationId]/messages/route.test.js
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
import { POST } from './route';

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
 * Fabrique une requête JSON simulée pour les routes POST.
 *
 * @param {Object|null} body
 * @returns {{ json: Function }}
 */
function createJsonRequest(body) {
	return {
		json: vi.fn().mockResolvedValue(body),
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

describe('src/app/api/messages/conversations/[conversationId]/messages/route.js', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('POST', () => {
		it("retourne 401 si l'utilisateur n'a pas de cookie d'authentification", async () => {
			// Cas testé :
			// la route doit refuser l'envoi si le cookie JWT est absent.
			cookies.mockResolvedValue(createCookieStore());

			const request = createJsonRequest({
				body: 'Bonjour',
			});

			const response = await POST(request, createRouteContext('1'));

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

			const request = createJsonRequest({
				body: 'Bonjour',
			});

			const response = await POST(request, createRouteContext(undefined));

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
			// un identifiant vide ou composé uniquement d'espaces
			// doit être rejeté avant l'appel backend.
			cookies.mockResolvedValue(
				createCookieStore({
					kasa_auth_token: 'token-valide',
					kasa_auth_user_id: '29',
				}),
			);

			const request = createJsonRequest({
				body: 'Bonjour',
			});

			const response = await POST(request, createRouteContext('   '));

			expect(response).toEqual({
				status: 400,
				body: {
					success: false,
					message: 'conversationId est requis.',
				},
			});

			expect(apiRequest).not.toHaveBeenCalled();
		});

		it('retourne 400 si le corps du message est absent', async () => {
			// Cas testé :
			// la route doit refuser un payload sans propriété body.
			cookies.mockResolvedValue(
				createCookieStore({
					kasa_auth_token: 'token-valide',
					kasa_auth_user_id: '29',
				}),
			);

			const request = createJsonRequest({});

			const response = await POST(request, createRouteContext('1'));

			expect(response).toEqual({
				status: 400,
				body: {
					success: false,
					message: 'Le corps du message est requis.',
				},
			});

			expect(apiRequest).not.toHaveBeenCalled();
		});

		it('retourne 400 si le corps du message est vide', async () => {
			// Cas testé :
			// la route doit refuser un message vide ou composé d'espaces.
			cookies.mockResolvedValue(
				createCookieStore({
					kasa_auth_token: 'token-valide',
					kasa_auth_user_id: '29',
				}),
			);

			const request = createJsonRequest({
				body: '   ',
			});

			const response = await POST(request, createRouteContext('1'));

			expect(response).toEqual({
				status: 400,
				body: {
					success: false,
					message: 'Le corps du message est requis.',
				},
			});

			expect(apiRequest).not.toHaveBeenCalled();
		});

		it("retourne 201 avec le message créé et l'identifiant utilisateur courant", async () => {
			// Cas testé :
			// la route envoie correctement le message au backend
			// et retourne le payload attendu côté frontend.
			cookies.mockResolvedValue(
				createCookieStore({
					kasa_auth_token: 'token-valide',
					kasa_auth_user_id: '29',
				}),
			);

			apiRequest.mockResolvedValueOnce({
				id: 5,
				sender_user_id: 29,
				body: 'Bonjour, votre logement est-il disponible ?',
				created_at: '2026-04-20 10:30:00',
				read_at: null,
			});

			const request = createJsonRequest({
				body: '  Bonjour, votre logement est-il disponible ?  ',
			});

			const response = await POST(request, createRouteContext('1'));

			expect(apiRequest).toHaveBeenCalledWith(
				'/api/messages/conversations/1/messages',
				{
					method: 'POST',
					token: 'token-valide',
					body: {
						body: 'Bonjour, votre logement est-il disponible ?',
					},
					cache: 'no-store',
				},
			);

			expect(response).toEqual({
				status: 201,
				body: {
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
			});
		});

		it("retourne currentUserId à null si le cookie d'utilisateur est absent", async () => {
			// Cas testé :
			// la route doit continuer à fonctionner même si le cookie
			// utilisateur n'est pas disponible.
			cookies.mockResolvedValue(
				createCookieStore({
					kasa_auth_token: 'token-valide',
				}),
			);

			apiRequest.mockResolvedValueOnce({
				id: 5,
				sender_user_id: 29,
				body: 'Bonjour',
				created_at: '2026-04-20 10:30:00',
				read_at: null,
			});

			const request = createJsonRequest({
				body: 'Bonjour',
			});

			const response = await POST(request, createRouteContext('1'));

			expect(response).toEqual({
				status: 201,
				body: {
					success: true,
					data: {
						message: {
							id: 5,
							sender_user_id: 29,
							body: 'Bonjour',
							created_at: '2026-04-20 10:30:00',
							read_at: null,
						},
						currentUserId: null,
					},
				},
			});
		});

		it('propage une erreur 403 renvoyée par le backend', async () => {
			// Cas testé :
			// la route doit transmettre correctement une interdiction
			// d'envoi renvoyée par l'API backend.
			cookies.mockResolvedValue(
				createCookieStore({
					kasa_auth_token: 'token-valide',
					kasa_auth_user_id: '29',
				}),
			);

			apiRequest.mockRejectedValueOnce(
				new ApiClientError('Forbidden', { status: 403 }),
			);

			const request = createJsonRequest({
				body: 'Bonjour',
			});

			const response = await POST(request, createRouteContext('1'));

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

			const request = createJsonRequest({
				body: 'Bonjour',
			});

			const response = await POST(request, createRouteContext('999'));

			expect(response).toEqual({
				status: 404,
				body: {
					success: false,
					message: 'Conversation not found',
				},
			});
		});

		it("retourne 500 en cas d'erreur inattendue", async () => {
			// Cas testé :
			// si une erreur non prévue survient, la route doit
			// renvoyer un message générique côté frontend.
			cookies.mockResolvedValue(
				createCookieStore({
					kasa_auth_token: 'token-valide',
					kasa_auth_user_id: '29',
				}),
			);

			apiRequest.mockRejectedValueOnce(new Error('Erreur inconnue'));

			const request = createJsonRequest({
				body: 'Bonjour',
			});

			const response = await POST(request, createRouteContext('1'));

			expect(response).toEqual({
				status: 500,
				body: {
					success: false,
					message: "Impossible d'envoyer le message.",
				},
			});
		});
	});
});
