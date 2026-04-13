/**
 * @file src/lib/internalApiClient.js
 * @description
 * Client HTTP léger pour les routes internes Next.js.
 *
 * IMPORTANT :
 * Ce client est destiné en priorité aux appels effectués depuis le navigateur
 * (composants client, effets, interactions utilisateur).
 *
 * Il accepte des chemins relatifs de type "/api/...".
 * Dans ce cas, c'est le navigateur qui résout automatiquement l'URL complète
 * à partir de l'origine courante.
 *
 * Exemple :
 * "/api/properties" -> "http://localhost:3001/api/properties"
 *
 * À ne pas utiliser tel quel dans un Server Component ou dans du code exécuté
 * côté serveur si le fetch repose sur une URL relative, car le runtime serveur
 * ne résout pas implicitement l'origine courante comme le navigateur.
 *
 * En contexte serveur, préférer :
 * - soit un appel direct au backend via apiClient ;
 * - soit une URL absolue explicitement construite.
 */

/**
 * @param {Response} response
 * @returns {Promise<Object|Array|null>}
 */
async function parseJsonSafe(response) {
	return response.json().catch(() => null);
}

/**
 * @param {Object|Array|null} data
 * @param {Response} response
 * @returns {string}
 */
function getErrorMessage(data, response) {
	if (typeof data?.message === 'string' && data.message.trim() !== '') {
		return data.message.trim();
	}

	if (typeof data?.error === 'string' && data.error.trim() !== '') {
		return data.error.trim();
	}

	return `HTTP ${response.status}`;
}

/**
 * @param {boolean} hasJsonBody
 * @returns {Object}
 */
function buildHeaders(hasJsonBody) {
	const headers = {
		Accept: 'application/json',
	};

	if (hasJsonBody) {
		headers['Content-Type'] = 'application/json';
	}

	return headers;
}

/**
 * Envoie une requête vers une route interne Next.js.
 *
 * @param {string} path
 * @param {Object} [options={}]
 * @param {string} [options.method='GET']
 * @param {Object|Array|null} [options.body=null]
 * @returns {Promise<Object|Array|null>}
 * @throws {Error}
 */
export async function internalApiRequest(
	path,
	{ method = 'GET', body = null } = {},
) {
	if (typeof path !== 'string' || path.trim() === '') {
		throw new Error('Internal API path is required.');
	}

	if (!path.startsWith('/api/')) {
		throw new Error('Internal API path must start with /api/.');
	}

	const upperMethod = method.toUpperCase();
	const hasJsonBody =
		body !== null && upperMethod !== 'GET' && upperMethod !== 'HEAD';

	const response = await fetch(path, {
		method: upperMethod,
		credentials: 'same-origin',
		headers: buildHeaders(hasJsonBody),
		body: hasJsonBody ? JSON.stringify(body) : undefined,
	});

	const data = await parseJsonSafe(response);

	if (!response.ok) {
		throw new Error(getErrorMessage(data, response));
	}

	return data;
}
