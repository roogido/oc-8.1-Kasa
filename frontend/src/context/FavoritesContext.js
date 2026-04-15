/**
 * @file src/context/FavoritesContext.js
 * @description
 * Contexte global léger pour partager l'état des favoris dans l'application.
 */

'use client';

import {
	createContext,
	useCallback,
	useMemo,
	useSyncExternalStore,
} from 'react';

import {
	addFavorite as addFavoriteToStorage,
	getFavoriteIds,
	getFavoritesStorageKey,
	getFavoritesUpdatedEventName,
	removeFavorite as removeFavoriteFromStorage,
	toggleFavorite as toggleFavoriteInStorage,
} from '@/services/favoriteStorageService';

export const FavoritesContext = createContext(null);

const EMPTY_FAVORITES_SNAPSHOT = '[]';

/**
 * Abonne React aux changements de favoris pour une portée donnée.
 *
 * @param {string} storageScope
 * @param {() => void} onStoreChange
 * @returns {() => void}
 */
function subscribeFavorites(storageScope, onStoreChange) {
	if (typeof window === 'undefined') {
		return () => {};
	}

	const customEventName = getFavoritesUpdatedEventName();
	const expectedStorageKey = getFavoritesStorageKey(storageScope);

	/**
	 * Réagit à une mise à jour locale ou inter-onglet.
	 *
	 * @param {Event} event
	 * @returns {void}
	 */
	function handleChange(event) {
		if (
			typeof StorageEvent !== 'undefined' &&
			event instanceof StorageEvent
		) {
			if (event.key !== null && event.key !== expectedStorageKey) {
				return;
			}
		}

		if (
			typeof CustomEvent !== 'undefined' &&
			event instanceof CustomEvent &&
			typeof event.detail?.storageScope === 'string' &&
			event.detail.storageScope !== storageScope
		) {
			return;
		}

		onStoreChange();
	}

	window.addEventListener('storage', handleChange);
	window.addEventListener(customEventName, handleChange);

	return () => {
		window.removeEventListener('storage', handleChange);
		window.removeEventListener(customEventName, handleChange);
	};
}

/**
 * Retourne le snapshot brut courant des favoris côté client.
 *
 * @param {string} storageScope
 * @returns {string}
 */
function getFavoritesSnapshot(storageScope) {
	if (typeof window === 'undefined' || !window.localStorage) {
		return EMPTY_FAVORITES_SNAPSHOT;
	}

	return (
		window.localStorage.getItem(getFavoritesStorageKey(storageScope)) ??
		EMPTY_FAVORITES_SNAPSHOT
	);
}

/**
 * Retourne le snapshot initial côté serveur.
 *
 * @returns {string}
 */
function getFavoritesServerSnapshot() {
	return EMPTY_FAVORITES_SNAPSHOT;
}

/**
 * Provider global des favoris.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.storageScope='guest']
 * @returns {JSX.Element}
 */
export function FavoritesProvider({
	children,
	storageScope = 'guest',
}) {
	const normalizedStorageScope =
		typeof storageScope === 'string' && storageScope.trim() !== ''
			? storageScope.trim()
			: 'guest';

	const subscribe = useCallback(
		(onStoreChange) =>
			subscribeFavorites(normalizedStorageScope, onStoreChange),
		[normalizedStorageScope],
	);

	const getSnapshot = useCallback(
		() => getFavoritesSnapshot(normalizedStorageScope),
		[normalizedStorageScope],
	);

	const rawFavoriteIds = useSyncExternalStore(
		subscribe,
		getSnapshot,
		getFavoritesServerSnapshot,
	);

	const favoriteIds = useMemo(() => {
		try {
			const parsedValue = JSON.parse(rawFavoriteIds);

			if (!Array.isArray(parsedValue)) {
				return [];
			}

			return [
				...new Set(
					parsedValue
						.map((propertyId) => String(propertyId ?? '').trim())
						.filter((propertyId) => propertyId !== ''),
				),
			];
		} catch {
			return [];
		}
	}, [rawFavoriteIds]);

	const favoriteCount = favoriteIds.length;

	const isFavorite = useCallback(
		(propertyId) => {
			const normalizedPropertyId = String(propertyId ?? '').trim();

			if (normalizedPropertyId === '') {
				return false;
			}

			return favoriteIds.includes(normalizedPropertyId);
		},
		[favoriteIds],
	);

	const addFavorite = useCallback(
		(propertyId) => {
			return addFavoriteToStorage(propertyId, normalizedStorageScope);
		},
		[normalizedStorageScope],
	);

	const removeFavorite = useCallback(
		(propertyId) => {
			return removeFavoriteFromStorage(propertyId, normalizedStorageScope);
		},
		[normalizedStorageScope],
	);

	const toggleFavorite = useCallback(
		(propertyId) => {
			return toggleFavoriteInStorage(propertyId, normalizedStorageScope);
		},
		[normalizedStorageScope],
	);

	const value = useMemo(
		() => ({
			favoriteIds,
			favoriteCount,
			isFavorite,
			addFavorite,
			removeFavorite,
			toggleFavorite,
		}),
		[
			favoriteIds,
			favoriteCount,
			isFavorite,
			addFavorite,
			removeFavorite,
			toggleFavorite,
		],
	);

	return (
		<FavoritesContext.Provider value={value}>
			{children}
		</FavoritesContext.Provider>
	);
}
