/**
 * @file src/components/property-add/AddPropertyMediaCard/AddPropertyMediaCard.js
 * @description
 * Carte médias du bien pour la page "Ajout propriété".
 */

import PropertyAddSectionCard from '@/components/property-add/PropertyAddSectionCard/PropertyAddSectionCard';
import PropertyAddUploadField from '@/components/property-add/PropertyAddUploadField/PropertyAddUploadField';

import styles from './AddPropertyMediaCard.module.css';

/**
 * Carte des médias du bien.
 *
 * @returns {JSX.Element}
 */
export default function AddPropertyMediaCard() {
	return (
		<PropertyAddSectionCard className={styles.card}>
			<div className={styles.inner}>
				<PropertyAddUploadField
					id="property-cover-image"
					label="Image de couverture"
				/>

				<PropertyAddUploadField
					id="property-gallery-image"
					label="Image du logement"
					addText="+Ajouter une image"
				/>
			</div>
		</PropertyAddSectionCard>
	);
}
