/**
 * @file src/components/property/PropertyInfoCard/PropertyInfoCard.js
 * @description
 * Carte d'informations du logement.
 */

import { MapPin } from 'lucide-react';

import Collapse from '@/components/disclosure/Collapse/Collapse';
import PropertyChipList from '@/components/property/PropertyChipList/PropertyChipList';
import PropertyFavoriteButton from '@/components/property/PropertyFavoriteButton/PropertyFavoriteButton';

import styles from './PropertyInfoCard.module.css';

/**
 * Carte d'informations logement.
 *
 * @param {Object} props
 * @param {string} props.propertyId
 * @param {string} props.title
 * @param {string} props.location
 * @param {string} props.description
 * @param {string[]} props.equipments
 * @param {string[]} props.categories
 * @returns {JSX.Element}
 */
export default function PropertyInfoCard({
	propertyId,
	title,
	location,
	description,
	equipments,
	categories,
}) {
	return (
		<article className={styles.card}>
			<div className={styles.headingRow}>
				<div className={styles.headingBlock}>
					<h1 className={styles.title}>{title}</h1>

					<div className={styles.locationRow}>
						<MapPin
							className={styles.locationIcon}
							aria-hidden="true"
						/>
						<p className={styles.location}>{location}</p>
					</div>
				</div>

				<PropertyFavoriteButton propertyId={propertyId} />
			</div>

			<div className={styles.collapseGroup}>
				<Collapse title="Description" defaultOpen={true}>
					<p className={styles.description}>{description}</p>
				</Collapse>

				<Collapse title="Équipements">
					<PropertyChipList title="" items={equipments} />
				</Collapse>

				<Collapse title="Catégorie">
					<PropertyChipList
						title=""
						items={categories}
						variant="row"
					/>
				</Collapse>
			</div>
		</article>
	);
}
