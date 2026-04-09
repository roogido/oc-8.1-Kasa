/**
 * @file src/components/property/PropertyCard/PropertyCard.js
 * @description
 * Carte de logement de la page d'accueil.
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';

import { useFavorites } from '@/hooks/useFavorites';
import FavoriteToggleButton from '@/components/property/FavoriteToggleButton/FavoriteToggleButton';

import styles from './PropertyCard.module.css';

/**
 * Carte de logement.
 *
 * @param {Object} props
 * @param {string} props.propertyId
 * @param {string} props.title
 * @param {string} props.location
 * @param {number} props.price
 * @param {string|Object} props.image
 * @param {string} props.imageAlt
 * @param {string} props.href
 * @returns {JSX.Element}
 */
export default function PropertyCard({
	propertyId,
	title,
	location,
	price,
	image,
	imageAlt,
	href,
}) {
	const { isFavorite, toggleFavorite } = useFavorites();

	const isLocallyFavorite = isFavorite(propertyId);

	function handleFavoriteClick(event) {
		event.preventDefault();
		event.stopPropagation();

		toggleFavorite(propertyId);
	}

	return (
		<article className={styles.card}>
			<Link href={href} className={styles.cardLink}>
				<div className={styles.imageWrapper}>
					<Image
						src={image}
						alt={imageAlt}
						fill
						sizes="(max-width: 767px) 100vw, 355px"
						className={styles.image}
					/>

					<FavoriteToggleButton
						isActive={isLocallyFavorite}
						onClick={handleFavoriteClick}
						addLabel="Ajouter ce logement aux favoris"
						removeLabel="Retirer ce logement des favoris"
					/>
				</div>

				<div className={styles.content}>
					<div className={styles.textContainer}>
						<h2 className={styles.title}>{title}</h2>
						<p className={styles.location}>{location}</p>
					</div>

					<p className={styles.priceLine}>
						<span className={styles.price}>{price}€</span>{' '}
						<span className={styles.priceUnit}>par nuit</span>
					</p>
				</div>
			</Link>
		</article>
	);
}
