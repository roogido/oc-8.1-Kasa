/**
 * @file src/components/property-add/PropertyAddUploadField/PropertyAddUploadField.js
 * @description
 * Champ d'upload réutilisable pour la page "Ajout propriété".
 */

import styles from './PropertyAddUploadField.module.css';
import { Plus } from 'lucide-react';

/**
 * Champ d'upload avec bouton plus.
 *
 * @param {Object} props
 * @param {string} props.id
 * @param {string} props.label
 * @param {string} [props.addText='']
 * @returns {JSX.Element}
 */
export default function PropertyAddUploadField({ id, label, addText = '' }) {
	return (
		<div className={styles.field}>
			<label className={styles.label} htmlFor={id}>
				{label}
			</label>

			<div className={styles.row}>
				<input
					id={id}
					name={id}
					type="text"
					className={styles.control}
					aria-label={label}
				/>

				<button
					type="button"
					className={styles.addButton}
					aria-label={`Ajouter pour ${label}`}
				>
					<Plus className={styles.addIcon} aria-hidden="true" />
				</button>
			</div>

			{addText !== '' ? (
				<button type="button" className={styles.linkButton}>
					{addText}
				</button>
			) : null}
		</div>
	);
}
