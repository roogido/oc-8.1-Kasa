/**
 * @file src/app/Providers.js
 * @description
 * Point d'entrée client des providers globaux de l'application.
 */

'use client';

import { FavoritesProvider } from '@/context/FavoritesContext';

/**
 * Agrège les providers globaux côté client.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 */
export default function Providers({ children }) {
	return <FavoritesProvider>{children}</FavoritesProvider>;
}
