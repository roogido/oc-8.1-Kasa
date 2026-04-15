/**
 * @file src/components/property-add/PropertyAddUploadField/PropertyAddUploadField.js
 * @description
 * Champ d'upload réutilisable pour la page "Ajout propriété".
 */

'use client';

import { useRef } from 'react';
import { Plus } from 'lucide-react';

import styles from './PropertyAddUploadField.module.css';

/**
 * Champ d'upload avec bouton plus.
 *
 * @param {Object} props
 * @param {string} props.id
 * @param {string} props.label
 * @param {string} [props.addText='']
 * @param {string} [props.value='']
 * @param {(file: File) => Promise<void> | void} [props.onFileSelect]
 * @param {boolean} [props.isUploading=false]
 * @returns {JSX.Element}
 */
export default function PropertyAddUploadField({
	id,
	label,
	addText = '',
	value = '',
	onFileSelect,
	isUploading = false,
}) {
	const fileInputRef = useRef(null);

	/**
	 * Ouvre le sélecteur de fichier.
	 *
	 * @returns {void}
	 */
	function openFilePicker() {
		fileInputRef.current?.click();
	}

	/**
	 * Gère la sélection de fichier.
	 *
	 * @param {React.ChangeEvent<HTMLInputElement>} event
	 * @returns {Promise<void>}
	 */
	async function handleFileChange(event) {
		const file = event.target.files?.[0] ?? null;

		if (file === null) {
			return;
		}

		await onFileSelect?.(file);
		event.target.value = '';
	}

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
					value={value}
					readOnly
				/>

				<button
					type="button"
					className={styles.addButton}
					aria-label={`Ajouter pour ${label}`}
					onClick={openFilePicker}
					disabled={isUploading}
				>
					<Plus className={styles.addIcon} aria-hidden="true" />
				</button>
			</div>

			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				className={styles.srOnlyInput}
				onChange={handleFileChange}
				tabIndex={-1}
			/>

			{addText !== '' ? (
				<button
					type="button"
					className={styles.linkButton}
					onClick={openFilePicker}
					disabled={isUploading}
				>
					{isUploading ? 'Téléchargement...' : addText}
				</button>
			) : null}
		</div>
	);
}
