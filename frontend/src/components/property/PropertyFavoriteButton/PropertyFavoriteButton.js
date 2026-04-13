/**
 * @file src/components/property/PropertyFavoriteButton/PropertyFavoriteButton.js
 * @description
 * Bouton client de gestion des favoris sur la fiche détail logement.
 */

'use client';

import { useFavorites } from '@/hooks/useFavorites';
import FavoriteToggleButton from '@/components/property/FavoriteToggleButton/FavoriteToggleButton';

import styles from './PropertyFavoriteButton.module.css';

/**
 * Bouton favori de la fiche détail.
 *
 * @param {Object} props
 * @param {string} props.propertyId
 * @returns {JSX.Element}
 */
export default function PropertyFavoriteButton({ propertyId }) {
	const { isFavorite, toggleFavorite } = useFavorites();

	const isLocallyFavorite = isFavorite(propertyId);

	function handleClick() {
		toggleFavorite(propertyId);
	}

	return (
		<div className={styles.wrapper}>
			<FavoriteToggleButton
				isActive={isLocallyFavorite}
				onClick={handleClick}
				addLabel="Ajouter ce logement aux favoris"
				removeLabel="Retirer ce logement des favoris"
				className={styles.button}
			/>
		</div>
	);
}
