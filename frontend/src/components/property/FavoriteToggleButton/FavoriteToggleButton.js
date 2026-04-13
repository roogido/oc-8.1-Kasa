/**
 * @file src/components/property/FavoriteToggleButton/FavoriteToggleButton.js
 * @description
 * Bouton coeur partagé pour la gestion des favoris.
 */

'use client';

import { Heart } from 'lucide-react';

import styles from './FavoriteToggleButton.module.css';

/**
 * Bouton coeur partagé.
 *
 * @param {Object} props
 * @param {boolean} props.isActive
 * @param {() => void} props.onClick
 * @param {string} props.addLabel
 * @param {string} props.removeLabel
 * @param {string} [props.className='']
 * @returns {JSX.Element}
 */
export default function FavoriteToggleButton({
	isActive,
	onClick,
	addLabel,
	removeLabel,
	className = '',
}) {
	return (
		<button
			type="button"
			className={`${styles.button} ${
				isActive ? styles.buttonActive : ''
			} ${className}`.trim()}
			aria-label={isActive ? removeLabel : addLabel}
			aria-pressed={isActive}
			onClick={onClick}
		>
			<Heart
				className={styles.icon}
				size={16}
				strokeWidth={1.5}
				aria-hidden="true"
			/>
		</button>
	);
}
