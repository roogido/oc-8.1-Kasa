/**
 * @file src/services/favoriteStorageService.js
 * @description
 * Gestion locale et persistante des favoris via localStorage.
 */

const FAVORITES_STORAGE_KEY = 'kasa:favorites';

/**
 * Normalise un identifiant de propriété.
 *
 * @param {string|number|null|undefined} propertyId
 * @returns {string}
 */
function normalizePropertyId(propertyId) {
	return String(propertyId ?? '').trim();
}

/**
 * Vérifie si localStorage est disponible.
 *
 * @returns {boolean}
 */
function canUseLocalStorage() {
	return (
		typeof window !== 'undefined' &&
		typeof window.localStorage !== 'undefined'
	);
}

/**
 * Lit la valeur brute stockée.
 *
 * @returns {unknown}
 */
function readRawFavorites() {
	if (!canUseLocalStorage()) {
		return [];
	}

	try {
		const rawValue = window.localStorage.getItem(FAVORITES_STORAGE_KEY);

		if (!rawValue) {
			return [];
		}

		return JSON.parse(rawValue);
	} catch {
		return [];
	}
}

/**
 * Retourne une liste d'identifiants favoris propre et dédupliquée.
 *
 * @returns {string[]}
 */
export function getFavoriteIds() {
	const rawFavorites = readRawFavorites();

	if (!Array.isArray(rawFavorites)) {
		return [];
	}

	return [
		...new Set(
			rawFavorites
				.map((propertyId) => normalizePropertyId(propertyId))
				.filter((propertyId) => propertyId !== ''),
		),
	];
}

/**
 * Persiste une liste d'identifiants favoris.
 *
 * @param {string[]} favoriteIds
 * @returns {void}
 */
function saveFavoriteIds(favoriteIds) {
	if (!canUseLocalStorage()) {
		return;
	}

	window.localStorage.setItem(
		FAVORITES_STORAGE_KEY,
		JSON.stringify(favoriteIds),
	);
}

/**
 * Retourne true si un logement est favori.
 *
 * @param {string|number|null|undefined} propertyId
 * @returns {boolean}
 */
export function isFavorite(propertyId) {
	const normalizedPropertyId = normalizePropertyId(propertyId);

	if (normalizedPropertyId === '') {
		return false;
	}

	return getFavoriteIds().includes(normalizedPropertyId);
}

/**
 * Ajoute un logement aux favoris.
 *
 * @param {string|number|null|undefined} propertyId
 * @returns {string[]}
 */
export function addFavorite(propertyId) {
	const normalizedPropertyId = normalizePropertyId(propertyId);

	if (normalizedPropertyId === '') {
		return getFavoriteIds();
	}

	const nextFavoriteIds = [
		...new Set([...getFavoriteIds(), normalizedPropertyId]),
	];

	saveFavoriteIds(nextFavoriteIds);
	return nextFavoriteIds;
}

/**
 * Retire un logement des favoris.
 *
 * @param {string|number|null|undefined} propertyId
 * @returns {string[]}
 */
export function removeFavorite(propertyId) {
	const normalizedPropertyId = normalizePropertyId(propertyId);

	if (normalizedPropertyId === '') {
		return getFavoriteIds();
	}

	const nextFavoriteIds = getFavoriteIds().filter(
		(favoriteId) => favoriteId !== normalizedPropertyId,
	);

	saveFavoriteIds(nextFavoriteIds);
	return nextFavoriteIds;
}

/**
 * Bascule l'état favori d'un logement.
 *
 * @param {string|number|null|undefined} propertyId
 * @returns {{ favoriteIds: string[], isFavorite: boolean }}
 */
export function toggleFavorite(propertyId) {
	const normalizedPropertyId = normalizePropertyId(propertyId);

	if (normalizedPropertyId === '') {
		return {
			favoriteIds: getFavoriteIds(),
			isFavorite: false,
		};
	}

	if (isFavorite(normalizedPropertyId)) {
		return {
			favoriteIds: removeFavorite(normalizedPropertyId),
			isFavorite: false,
		};
	}

	return {
		favoriteIds: addFavorite(normalizedPropertyId),
		isFavorite: true,
	};
}
