/**
 * @file src/hooks/useFavorites.js
 * @description
 * Hook d'accès au contexte global des favoris.
 */

'use client';

import { useContext } from 'react';
import { FavoritesContext } from '@/context/FavoritesContext';

/**
 * Retourne l'API des favoris partagés.
 *
 * @returns {Object}
 * @throws {Error}
 */
export function useFavorites() {
	const context = useContext(FavoritesContext);

	if (context === null) {
		throw new Error(
			"useFavorites doit être utilisé à l'intérieur de <FavoritesProvider>.",
		);
	}

	return context;
}
