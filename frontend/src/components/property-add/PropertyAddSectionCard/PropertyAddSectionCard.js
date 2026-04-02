/**
 * @file src/components/property-add/PropertyAddSectionCard/PropertyAddSectionCard.js
 * @description
 * Carte de base réutilisable pour la page "Ajout propriété".
 */

import styles from './PropertyAddSectionCard.module.css';

/**
 * Carte de section réutilisable.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className='']
 * @returns {JSX.Element}
 */
export default function PropertyAddSectionCard({
	children,
	className = '',
}) {
	const classes = [styles.card, className].filter(Boolean).join(' ');

	return <section className={classes}>{children}</section>;
}
