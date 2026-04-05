/**
 * @file src/lib/apiClient.js
 * @description
 * Client HTTP générique pour communiquer avec l'API backend Kasa.
 *
 * IMPORTANT :
 * Ce client est adapté aux appels exécutés côté serveur
 * (Server Components, route handlers Next.js, logique serveur).
 *
 * Il construit une URL absolue à partir de l'URL de base du backend,
 * ce qui évite les erreurs de type :
 * "Failed to parse URL from /api/..."
 *
 * Exemple :
 * apiRequest('/api/properties')
 * -> "http://localhost:3000/api/properties"
 *
 * Ce client est donc le bon choix lorsque le code s'exécute dans le runtime
 * serveur Next.js / Node.js et doit joindre directement le backend Express.
 *
 * Côté navigateur, pour appeler les routes internes Next.js "/api/*",
 * préférer internalApiClient.
 */

import { getApiBaseUrl } from '@/lib/env';

/**
 * Erreur HTTP structurée levée par le client API.
 */
export class ApiClientError extends Error {
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

/**
 * @param {string} path
 * @returns {string}
 */
function normalizePath(path) {
	if (typeof path !== 'string' || path.trim() === '') {
		throw new Error('API path is required.');
	}

	return path.startsWith('/') ? path : `/${path}`;
}

/**
 * @param {Object} options
 * @param {Object} [options.headers={}]
 * @param {string|null} [options.token=null]
 * @param {boolean} [options.hasJsonBody=false]
 * @returns {Object}
 */
function buildHeaders({ headers = {}, token = null, hasJsonBody = false }) {
	const finalHeaders = {
		Accept: 'application/json',
		...headers,
	};

	if (hasJsonBody && !finalHeaders['Content-Type']) {
		finalHeaders['Content-Type'] = 'application/json';
	}

	if (token) {
		finalHeaders.Authorization = `Bearer ${token}`;
	}

	return finalHeaders;
}

/**
 * @param {Response} response
 * @returns {Promise<Object|Array|null>}
 */
async function parseJsonSafe(response) {
	return response.json().catch(() => null);
}

/**
 * Envoie une requête HTTP vers le backend Kasa.
 *
 * @param {string} path
 * @param {Object} [options={}]
 * @param {string} [options.method='GET']
 * @param {Object|Array|null} [options.body=null]
 * @param {Object} [options.headers={}]
 * @param {string|null} [options.token=null]
 * @param {RequestCache} [options.cache='no-store']
 * @returns {Promise<Object|Array|null>}
 * @throws {ApiClientError}
 */
export async function apiRequest(
	path,
	{
		method = 'GET',
		body = null,
		headers = {},
		token = null,
		cache = 'no-store',
	} = {},
) {
	const apiBaseUrl = getApiBaseUrl();
	const normalizedPath = normalizePath(path);
	const upperMethod = method.toUpperCase();
	const hasJsonBody =
		body !== null && upperMethod !== 'GET' && upperMethod !== 'HEAD';

	const response = await fetch(`${apiBaseUrl}${normalizedPath}`, {
		method: upperMethod,
		cache,
		headers: buildHeaders({ headers, token, hasJsonBody }),
		body: hasJsonBody ? JSON.stringify(body) : undefined,
	});

	const data = await parseJsonSafe(response);

	if (!response.ok) {
		const message =
			typeof data?.message === 'string' && data.message.trim() !== ''
				? data.message.trim()
				: typeof data?.error === 'string' && data.error.trim() !== ''
					? data.error.trim()
					: `HTTP ${response.status}`;

		throw new ApiClientError(message, {
			status: response.status,
			data,
		});
	}

	return data;
}
