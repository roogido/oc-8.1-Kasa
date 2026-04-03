/**
 * @file src/components/property/PropertyInfoCard/PropertyInfoCard.js
 * @description
 * Carte d'informations du logement.
 */

import PropertyChipList from '@/components/property/PropertyChipList/PropertyChipList';

import styles from './PropertyInfoCard.module.css';

/**
 * Carte d'informations logement.
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {string} props.location
 * @param {string} props.description
 * @param {string[]} props.equipments
 * @param {string[]} props.categories
 * @returns {JSX.Element}
 */
export default function PropertyInfoCard({
	title,
	location,
	description,
	equipments,
	categories,
}) {
	return (
		<article className={styles.card}>
			<div className={styles.identitySection}>
				<div className={styles.headingBlock}>
					<h1 className={styles.title}>{title}</h1>

					<div className={styles.locationRow}>
						<span className={styles.locationIcon} aria-hidden="true">
							&#9673;
						</span>
						<p className={styles.location}>{location}</p>
					</div>
				</div>

				<p className={styles.description}>{description}</p>
			</div>

			<PropertyChipList title="Équipements" items={equipments} />

			<PropertyChipList
				title="Catégorie"
				items={categories}
				variant="row"
			/>
		</article>
	);
}
