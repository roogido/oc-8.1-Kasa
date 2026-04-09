/**
 * @file src/context/FavoritesContext.js
 * @description
 * Contexte global léger pour partager l'état des favoris dans l'application.
 */

'use client';

import { createContext, useCallback, useEffect, useMemo, useState } from 'react';

import {
	addFavorite as addFavoriteToStorage,
	getFavoriteIds,
	isFavorite as isFavoriteInStorage,
	removeFavorite as removeFavoriteFromStorage,
	toggleFavorite as toggleFavoriteInStorage,
} from '@/services/favoriteStorageService';

export const FavoritesContext = createContext(null);

/**
 * Provider global des favoris.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 */
export function FavoritesProvider({ children }) {
	const [favoriteIds, setFavoriteIds] = useState(() => getFavoriteIds());

	useEffect(() => {
		function handleStorage(event) {
			if (event.key !== 'kasa:favorites') {
				return;
			}

			setFavoriteIds(getFavoriteIds());
		}

		window.addEventListener('storage', handleStorage);

		return () => {
			window.removeEventListener('storage', handleStorage);
		};
	}, []);

	const isFavorite = useCallback((propertyId) => {
		return isFavoriteInStorage(propertyId);
	}, []);

	const addFavorite = useCallback((propertyId) => {
		const nextFavoriteIds = addFavoriteToStorage(propertyId);
		setFavoriteIds(nextFavoriteIds);
		return nextFavoriteIds;
	}, []);

	const removeFavorite = useCallback((propertyId) => {
		const nextFavoriteIds = removeFavoriteFromStorage(propertyId);
		setFavoriteIds(nextFavoriteIds);
		return nextFavoriteIds;
	}, []);

	const toggleFavorite = useCallback((propertyId) => {
		const nextState = toggleFavoriteInStorage(propertyId);
		setFavoriteIds(nextState.favoriteIds);
		return nextState;
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
