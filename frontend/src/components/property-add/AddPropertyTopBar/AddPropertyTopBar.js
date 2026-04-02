/**
 * @file src/components/property-add/AddPropertyTopBar/AddPropertyTopBar.js
 * @description
 * Barre haute de la page "Ajout propriété".
 */

import Link from 'next/link';

import styles from './AddPropertyTopBar.module.css';

/**
 * Barre haute de la page.
 *
 * @returns {JSX.Element}
 */
export default function AddPropertyTopBar() {
	return (
		<div className={styles.wrapper}>
			<Link href="/" className={styles.backButton}>
				<span className={styles.backIcon} aria-hidden="true">
					←
				</span>
				<span>Retour</span>
			</Link>

			<div className={styles.titleRow}>
				<h1 className={styles.title}>Ajouter une propriété</h1>

				<button type="button" className={styles.submitButton}>
					Ajouter
				</button>
			</div>
		</div>
	);
}
