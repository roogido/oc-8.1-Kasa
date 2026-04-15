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
 * @param {Object} props
 * @param {boolean} [props.isSubmitting=false]
 * @param {boolean} [props.isDisabled=false]
 * @returns {JSX.Element}
 */
export default function AddPropertyTopBar({
	isSubmitting = false,
	isDisabled = false,
}) {
	return (
		<div className={styles.wrapper}>
			<Link href="/" className={styles.backButton}>
				<span className={styles.backIcon} aria-hidden="true">
					&#8592;
				</span>
				<span>Retour</span>
			</Link>

			<div className={styles.titleRow}>
				<h1 className={styles.title}>Ajouter une propriété</h1>

				<button
					type="submit"
					className={styles.submitButton}
					disabled={isSubmitting || isDisabled}
					aria-busy={isSubmitting}
				>
					{isSubmitting ? 'Ajout...' : 'Ajouter'}
				</button>
			</div>
		</div>
	);
}
