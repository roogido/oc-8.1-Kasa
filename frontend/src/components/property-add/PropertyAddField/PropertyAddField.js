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
 * @param {string} [props.value='']
 * @param {(value: string) => void} [props.onChange]
 * @param {boolean} [props.readOnly=false]
 * @returns {JSX.Element}
 */
export default function PropertyAddField({
	id,
	label,
	placeholder = '',
	as = 'input',
	rows = 5,
	type = 'text',
	value = '',
	onChange,
	readOnly = false,
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
					value={value}
					onChange={(event) => onChange?.(event.target.value)}
					readOnly={readOnly}
				/>
			) : (
				<input
					id={id}
					name={id}
					type={type}
					placeholder={placeholder}
					className={styles.control}
					value={value}
					onChange={(event) => onChange?.(event.target.value)}
					readOnly={readOnly}
				/>
			)}
		</div>
	);
}
