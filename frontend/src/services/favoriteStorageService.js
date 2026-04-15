/**
 * @file src/services/favoriteStorageService.js
 * @description
 * Gestion locale et persistante des favoris via localStorage.
 */

const FAVORITES_STORAGE_KEY_PREFIX = 'kasa:favorites';
const FAVORITES_UPDATED_EVENT = 'kasa:favorites-updated';

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
 * Normalise une portée de stockage.
 *
 * @param {string|null|undefined} storageScope
 * @returns {string}
 */
function normalizeStorageScope(storageScope) {
	if (typeof storageScope !== 'string') {
		return 'guest';
	}

	const normalizedScope = storageScope.trim();

	return normalizedScope !== '' ? normalizedScope : 'guest';
}

/**
 * Retourne la clé localStorage de favoris pour une portée donnée.
 *
 * @param {string} [storageScope='guest']
 * @returns {string}
 */
export function getFavoritesStorageKey(storageScope = 'guest') {
	return `${FAVORITES_STORAGE_KEY_PREFIX}:${normalizeStorageScope(
		storageScope,
	)}`;
}

/**
 * Vérifie si localStorage est réellement utilisable.
 *
 * @returns {boolean}
 */
function canUseLocalStorage() {
	try {
		if (typeof window === 'undefined' || !window.localStorage) {
			return false;
		}

		const testKey = '__storage_test__';
		window.localStorage.setItem(testKey, '1');
		window.localStorage.removeItem(testKey);

		return true;
	} catch {
		return false;
	}
}

/**
 * Émet un événement local lorsque les favoris changent.
 *
 * @param {string} [storageScope='guest']
 * @returns {void}
 */
function emitFavoritesUpdated(storageScope = 'guest') {
	if (typeof window === 'undefined') {
		return;
	}

	window.dispatchEvent(
		new CustomEvent(FAVORITES_UPDATED_EVENT, {
			detail: {
				storageScope: normalizeStorageScope(storageScope),
			},
		}),
	);
}

/**
 * Lit la valeur brute stockée.
 *
 * @param {string} [storageScope='guest']
 * @returns {unknown}
 */
function readRawFavorites(storageScope = 'guest') {
	if (!canUseLocalStorage()) {
		return [];
	}

	try {
		const rawValue = window.localStorage.getItem(
			getFavoritesStorageKey(storageScope),
		);

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
 * @param {string} [storageScope='guest']
 * @returns {string[]}
 */
export function getFavoriteIds(storageScope = 'guest') {
	const rawFavorites = readRawFavorites(storageScope);

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
 * @param {string} [storageScope='guest']
 * @returns {void}
 */
function saveFavoriteIds(favoriteIds, storageScope = 'guest') {
	if (!canUseLocalStorage()) {
		return;
	}

	window.localStorage.setItem(
		getFavoritesStorageKey(storageScope),
		JSON.stringify(favoriteIds),
	);

	emitFavoritesUpdated(storageScope);
}

/**
 * Retourne true si un logement est favori.
 *
 * @param {string|number|null|undefined} propertyId
 * @param {string} [storageScope='guest']
 * @returns {boolean}
 */
export function isFavorite(propertyId, storageScope = 'guest') {
	const normalizedPropertyId = normalizePropertyId(propertyId);

	if (normalizedPropertyId === '') {
		return false;
	}

	return getFavoriteIds(storageScope).includes(normalizedPropertyId);
}

/**
 * Ajoute un logement aux favoris.
 *
 * @param {string|number|null|undefined} propertyId
 * @param {string} [storageScope='guest']
 * @returns {string[]}
 */
export function addFavorite(propertyId, storageScope = 'guest') {
	const normalizedPropertyId = normalizePropertyId(propertyId);

	if (normalizedPropertyId === '') {
		return getFavoriteIds(storageScope);
	}

	const nextFavoriteIds = [
		...new Set([
			...getFavoriteIds(storageScope),
			normalizedPropertyId,
		]),
	];

	saveFavoriteIds(nextFavoriteIds, storageScope);
	return nextFavoriteIds;
}

/**
 * Retire un logement des favoris.
 *
 * @param {string|number|null|undefined} propertyId
 * @param {string} [storageScope='guest']
 * @returns {string[]}
 */
export function removeFavorite(propertyId, storageScope = 'guest') {
	const normalizedPropertyId = normalizePropertyId(propertyId);

	if (normalizedPropertyId === '') {
		return getFavoriteIds(storageScope);
	}

	const nextFavoriteIds = getFavoriteIds(storageScope).filter(
		(favoriteId) => favoriteId !== normalizedPropertyId,
	);

	saveFavoriteIds(nextFavoriteIds, storageScope);
	return nextFavoriteIds;
}

/**
 * Bascule l'état favori d'un logement.
 *
 * @param {string|number|null|undefined} propertyId
 * @param {string} [storageScope='guest']
 * @returns {{ favoriteIds: string[], isFavorite: boolean }}
 */
export function toggleFavorite(propertyId, storageScope = 'guest') {
	const normalizedPropertyId = normalizePropertyId(propertyId);

	if (normalizedPropertyId === '') {
		return {
			favoriteIds: getFavoriteIds(storageScope),
			isFavorite: false,
		};
	}

	if (isFavorite(normalizedPropertyId, storageScope)) {
		return {
			favoriteIds: removeFavorite(normalizedPropertyId, storageScope),
			isFavorite: false,
		};
	}

	return {
		favoriteIds: addFavorite(normalizedPropertyId, storageScope),
		isFavorite: true,
	};
}

/**
 * Retourne le nom de l'événement local de mise à jour des favoris.
 *
 * @returns {string}
 */
export function getFavoritesUpdatedEventName() {
	return FAVORITES_UPDATED_EVENT;
}
