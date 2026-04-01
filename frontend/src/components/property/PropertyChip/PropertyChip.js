/**
 * @file src/components/property/PropertyChip/PropertyChip.js
 * @description
 * Puce de la page détail logement.
 */

import styles from './PropertyChip.module.css';

/**
 * Puce unitaire.
 *
 * @param {Object} props
 * @param {string} props.label
 * @returns {JSX.Element}
 */
export default function PropertyChip({ label }) {
	return <li className={styles.chip}>{label}</li>;
}
