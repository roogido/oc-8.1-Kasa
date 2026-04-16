/**
 * @file src/lib/env.js
 * @description
 * Centralise l'accès aux variables d'environnement de l'application.
 */

const DEFAULT_API_BASE_URL = 'http://localhost:3000';
const DEFAULT_SITE_URL = 'http://localhost:3001';

/**
 * Normalise une URL en supprimant les slashs finaux.
 *
 * @param {string} url
 * @returns {string}
 */
function normalizeUrl(url) {
	return url.replace(/\/+$/, '');
}

/**
 * Retourne l'URL de base de l'API backend Kasa.
 *
 * @returns {string} URL de base de l'API
 * @throws {Error} Si aucune URL n'est définie en production
 */
export function getApiBaseUrl() {
	const url =
		process.env.API_BASE_URL ||
		process.env.NEXT_PUBLIC_API_BASE_URL ||
		(process.env.NODE_ENV === 'development'
			? DEFAULT_API_BASE_URL
			: null);

	if (!url) {
		throw new Error(
			'API_BASE_URL ou NEXT_PUBLIC_API_BASE_URL doit etre definie en production.',
		);
	}

	return normalizeUrl(url);
}

/**
 * Retourne l'URL publique du site frontend.
 *
 * @returns {string} URL publique du site
 * @throws {Error} Si aucune URL n'est définie en production
 */
export function getSiteUrl() {
	const url =
		process.env.SITE_URL ||
		process.env.NEXT_PUBLIC_SITE_URL ||
		(process.env.NODE_ENV === 'development'
			? DEFAULT_SITE_URL
			: null);

	if (!url) {
		throw new Error(
			'SITE_URL ou NEXT_PUBLIC_SITE_URL doit etre definie en production.',
		);
	}

	return normalizeUrl(url);
}

/**
 * Construit une URL absolue du site frontend.
 *
 * @param {string} [path='/']
 * @returns {string}
 */
export function buildAbsoluteSiteUrl(path = '/') {
	const siteUrl = getSiteUrl();

	if (typeof path !== 'string' || path.trim() === '') {
		return siteUrl;
	}

	const normalizedPath = path.trim();

	if (/^https?:\/\//i.test(normalizedPath)) {
		return normalizedPath;
	}

	return new URL(
		normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`,
		siteUrl,
	).toString();
}
