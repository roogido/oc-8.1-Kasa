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
 * @param {string} [props.favoritesScope='guest']
 * @returns {JSX.Element}
 */
export default function Providers({
	children,
	favoritesScope = 'guest',
}) {
	return (
		<FavoritesProvider storageScope={favoritesScope}>
			{children}
		</FavoritesProvider>
	);
}
