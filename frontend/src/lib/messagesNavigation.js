/**
 * @file src/lib/messagesNavigation.js
 * @description
 * Helpers de navigation pour l'intention d'ouverture de la messagerie.
 */

/**
 * Retourne un pathname interne sûr.
 *
 * @param {string} pathname
 * @returns {string}
 */
function getSafeInternalPathname(pathname) {
	if (
		typeof pathname !== 'string' ||
		pathname.trim() === '' ||
		!pathname.startsWith('/') ||
		pathname.startsWith('//')
	) {
		return '/';
	}

	return pathname;
}

/**
 * Construit une URL interne qui conserve la page courante
 * et ajoute l'intention d'ouvrir la messagerie.
 *
 * @param {string} pathname
 * @param {string} [searchParamsString='']
 * @returns {string}
 */
export function buildMessagesIntentPath(
	pathname,
	searchParamsString = '',
) {
	const safePathname = getSafeInternalPathname(pathname);
	const params = new URLSearchParams(searchParamsString);

	params.set('openMessages', '1');

	const queryString = params.toString();

	return queryString === ''
		? safePathname
		: `${safePathname}?${queryString}`;
}

/**
 * Construit un href vers /login avec un paramètre next sûr
 * qui ramène sur la page courante avec l'intention d'ouvrir
 * la messagerie.
 *
 * @param {string} pathname
 * @param {string} [searchParamsString='']
 * @returns {string}
 */
export function buildLoginMessagesHref(
	pathname,
	searchParamsString = '',
) {
	const nextPath = buildMessagesIntentPath(pathname, searchParamsString);

	return `/login?next=${encodeURIComponent(nextPath)}`;
}

/**
 * Supprime le paramètre openMessages d'une URL interne.
 *
 * @param {string} pathname
 * @param {string} [searchParamsString='']
 * @returns {string}
 */
export function removeOpenMessagesParam(
	pathname,
	searchParamsString = '',
) {
	const safePathname = getSafeInternalPathname(pathname);
	const params = new URLSearchParams(searchParamsString);

	params.delete('openMessages');

	const queryString = params.toString();

	return queryString === ''
		? safePathname
		: `${safePathname}?${queryString}`;
}
