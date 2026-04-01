/**
 * @file src/components/property/PropertyChipList/PropertyChipList.js
 * @description
 * Liste de puces de la page detail logement.
 */

import PropertyChip from '@/components/property/PropertyChip/PropertyChip';

import styles from './PropertyChipList.module.css';

/**
 * Liste de puces.
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {string[]} props.items
 * @param {string} [props.variant='grid']
 * @returns {JSX.Element}
 */
export default function PropertyChipList({
	title,
	items,
	variant = 'grid',
}) {
	const listClassName =
		variant === 'row' ? styles.rowList : styles.gridList;

	return (
		<section className={styles.section}>
			<h3 className={styles.title}>{title}</h3>

			<ul className={listClassName}>
				{items.map((item) => (
					<PropertyChip key={item} label={item} />
				))}
			</ul>
		</section>
	);
}
