/**
 * @file src/components/property-add/PropertyAddField/PropertyAddField.js
 * @description
 * Champ réutilisable avec label pour la page "Ajout propriété".
 */

import styles from './PropertyAddField.module.css';

/**
 * Champ de formulaire réutilisable.
 *
 * @param {Object} props
 * @param {string} props.id
 * @param {string} props.label
 * @param {string} [props.placeholder='']
 * @param {string} [props.as='input']
 * @param {number} [props.rows=5]
 * @param {string} [props.type='text']
 * @returns {JSX.Element}
 */
export default function PropertyAddField({
	id,
	label,
	placeholder = '',
	as = 'input',
	rows = 5,
	type = 'text',
}) {
	const isTextarea = as === 'textarea';

	return (
		<div className={styles.field}>
			<label className={styles.label} htmlFor={id}>
				{label}
			</label>

			{isTextarea ? (
				<textarea
					id={id}
					name={id}
					rows={rows}
					placeholder={placeholder}
					className={`${styles.control} ${styles.textarea}`}
				/>
			) : (
				<input
					id={id}
					name={id}
					type={type}
					placeholder={placeholder}
					className={styles.control}
				/>
			)}
		</div>
	);
}
