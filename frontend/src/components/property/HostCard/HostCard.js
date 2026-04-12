/**
 * @file src/components/property/HostCard/HostCard.js
 * @description
 * Carte hôte de la page détail logement.
 */

import Image from 'next/image';

import HostContactActions from '@/components/property/HostContactActions/HostContactActions';

import styles from './HostCard.module.css';

/**
 * Carte hôte.
 *
 * @param {Object} props
 * @param {string} props.name
 * @param {number} props.rating
 * @param {StaticImageData|string} props.avatar
 * @param {string} props.avatarAlt
 * @param {boolean} [props.isAuthenticated=false]
 * @returns {JSX.Element}
 */
export default function HostCard({
	name,
	rating,
	avatar,
	avatarAlt,
	isAuthenticated = false,
}) {
	return (
		<aside className={styles.card}>
			<h2 className={styles.title}>Votre hôte</h2>

			<div className={styles.profileRow}>
				<div className={styles.avatarWrapper}>
					<Image
						src={avatar}
						alt={avatarAlt}
						fill
						sizes="82px"
						className={styles.avatar}
					/>
				</div>

				<p className={styles.name}>{name}</p>

				<div className={styles.ratingBadge}>
					<span className={styles.ratingStar} aria-hidden="true">
						★
					</span>
					<span className={styles.ratingValue}>{rating}</span>
				</div>
			</div>

			<HostContactActions isAuthenticated={isAuthenticated} />
		</aside>
	);
}
