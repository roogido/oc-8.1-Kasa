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
	getFavoritesUpdatedEventName,
	removeFavorite as removeFavoriteFromStorage,
	toggleFavorite as toggleFavoriteInStorage,
} from '@/services/favoriteStorageService';

export const FavoritesContext = createContext(null);

const EMPTY_FAVORITES_SNAPSHOT = '[]';

/**
 * Abonne React aux changements de favoris.
 *
 * @param {() => void} onStoreChange
 * @returns {() => void}
 */
function subscribeFavorites(onStoreChange) {
	if (typeof window === 'undefined') {
		return () => {};
	}

	const customEventName = getFavoritesUpdatedEventName();

	function handleChange() {
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
 * @returns {string}
 */
function getFavoritesSnapshot() {
	if (typeof window === 'undefined' || !window.localStorage) {
		return EMPTY_FAVORITES_SNAPSHOT;
	}

	return (
		window.localStorage.getItem('kasa:favorites') ??
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
 * @returns {JSX.Element}
 */
export function FavoritesProvider({ children }) {
	const rawFavoriteIds = useSyncExternalStore(
		subscribeFavorites,
		getFavoritesSnapshot,
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

	const addFavorite = useCallback((propertyId) => {
		return addFavoriteToStorage(propertyId);
	}, []);

	const removeFavorite = useCallback((propertyId) => {
		return removeFavoriteFromStorage(propertyId);
	}, []);

	const toggleFavorite = useCallback((propertyId) => {
		return toggleFavoriteInStorage(propertyId);
	}, []);

	const value = useMemo(
		() => ({
			favoriteIds,
			isFavorite,
			addFavorite,
			removeFavorite,
			toggleFavorite,
		}),
		[favoriteIds, isFavorite, addFavorite, removeFavorite, toggleFavorite],
	);

	return (
		<FavoritesContext.Provider value={value}>
			{children}
		</FavoritesContext.Provider>
	);
}
