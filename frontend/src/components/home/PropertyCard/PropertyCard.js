/**
 * @file src/components/home/PropertyCard/PropertyCard.js
 * @description
 * Carte de logement de la page d'accueil.
 */

import Link from 'next/link';
import Image from 'next/image';

import styles from './PropertyCard.module.css';

/**
 * Carte de logement.
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {string} props.location
 * @param {number} props.price
 * @param {string} props.image
 * @param {string} props.imageAlt
 * @param {string} props.href
 * @returns {JSX.Element}
 */
export default function PropertyCard({
	title,
	location,
	price,
	image,
	imageAlt,
	href,
}) {
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
