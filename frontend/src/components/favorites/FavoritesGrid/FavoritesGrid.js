/**
 * @file src/components/favorites/FavoritesGrid/FavoritesGrid.js
 * @description
 * Grille des cartes de la page Favoris.
 */

import FavoritePropertyCard from '@/components/favorites/FavoritePropertyCard/FavoritePropertyCard';

import styles from './FavoritesGrid.module.css';

/**
 * Grille des favoris.
 *
 * @param {Object} props
 * @param {Array<Object>} props.items
 * @param {(propertyId: string) => void} props.onRemoveFavorite
 * @returns {JSX.Element}
 */
export default function FavoritesGrid({ items, onRemoveFavorite }) {
	return (
		<section className={styles.grid}>
			{items.map((item) => (
				<FavoritePropertyCard
					key={item.id}
					propertyId={item.id}
					title={item.title}
					location={item.location}
					price={item.price}
					image={item.image}
					imageAlt={item.imageAlt}
					href={item.href}
					onRemoveFavorite={onRemoveFavorite}
				/>
			))}
		</section>
	);
}
