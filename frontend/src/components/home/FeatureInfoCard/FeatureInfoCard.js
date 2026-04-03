/**
 * @file src/components/home/FeatureInfoCard/FeatureInfoCard.js
 * @description
 * Carte d'information du bloc "Comment ça marche ?".
 */

import styles from './FeatureInfoCard.module.css';

/**
 * Carte d'information.
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {string} props.description
 * @returns {JSX.Element}
 */
export default function FeatureInfoCard({ title, description }) {
	return (
		<article className={styles.card}>
			<div className={styles.content}>
				<h3 className={styles.title}>{title}</h3>
				<p className={styles.description}>{description}</p>
			</div>
		</article>
	);
}
