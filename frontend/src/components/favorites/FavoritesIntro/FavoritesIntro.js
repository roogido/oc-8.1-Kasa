/**
 * @file src/components/favorites/FavoritesIntro/FavoritesIntro.js
 * @description
 * Intro de la page Favoris.
 */

import styles from './FavoritesIntro.module.css';

/**
 * Bloc d'introduction de la page Favoris.
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {string} props.description
 * @returns {JSX.Element}
 */
export default function FavoritesIntro({ title, description }) {
	return (
		<section className={styles.intro}>
			<div className={styles.content}>
				<h1 className={styles.title}>{title}</h1>
				<p className={styles.description}>{description}</p>
			</div>
		</section>
	);
}
