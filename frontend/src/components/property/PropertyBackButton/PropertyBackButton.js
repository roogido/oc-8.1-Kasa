/**
 * @file src/components/property/PropertyBackButton/PropertyBackButton.js
 * @description
 * Bouton retour de la page détail logement.
 */

import Link from 'next/link';

import styles from './PropertyBackButton.module.css';

/**
 * Bouton retour.
 *
 * @param {Object} props
 * @param {string} props.href
 * @param {string} [props.label='Retour aux annonces']
 * @returns {JSX.Element}
 */
export default function PropertyBackButton({
	href,
	label = 'Retour aux annonces',
}) {
	return (
		<Link href={href} className={styles.button}>
			<span className={styles.icon} aria-hidden="true">
				&#8592;
			</span>

			<span className={styles.label}>{label}</span>
		</Link>
	);
}
