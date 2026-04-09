/**
 * @file src/components/favorites/FavoritePropertyCard/FavoritePropertyCard.js
 * @description
 * Carte de bien pour la page Favoris.
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';

import FavoriteToggleButton from '@/components/property/FavoriteToggleButton/FavoriteToggleButton';

import styles from './FavoritePropertyCard.module.css';

/**
 * Carte d'un bien favori.
 *
 * @param {Object} props
 * @param {string} props.propertyId
 * @param {string} props.title
 * @param {string} props.location
 * @param {number} props.price
 * @param {string} props.imageAlt
 * @param {string} props.href
 * @param {*} props.image
 * @param {(propertyId: string) => void} props.onRemoveFavorite
 * @returns {JSX.Element}
 */
export default function FavoritePropertyCard({
	propertyId,
	title,
	location,
	price,
	image,
	imageAlt,
	href,
	onRemoveFavorite,
}) {
	function handleRemoveFavorite(event) {
		event.preventDefault();
		event.stopPropagation();

		onRemoveFavorite(propertyId);
	}

	return (
		<article className={styles.card}>
			<Link href={href} className={styles.mediaLink}>
				<div className={styles.media}>
					<Image
						src={image}
						alt={imageAlt}
						fill
						sizes="(max-width: 767px) 355px, 355px"
						className={styles.image}
					/>

					<FavoriteToggleButton
						isActive={true}
						onClick={handleRemoveFavorite}
						addLabel={`Ajouter ${title} aux favoris`}
						removeLabel={`Retirer ${title} des favoris`}
					/>
				</div>
			</Link>

			<div className={styles.details}>
				<div className={styles.textBlock}>
					<h2 className={styles.title}>{title}</h2>
					<p className={styles.location}>{location}</p>
				</div>

				<div className={styles.priceRow}>
					<span className={styles.price}>{price}€</span>
					<span className={styles.priceSuffix}>par nuit</span>
				</div>
			</div>
		</article>
	);
}
