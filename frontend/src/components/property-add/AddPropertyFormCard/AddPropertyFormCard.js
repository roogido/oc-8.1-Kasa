/**
 * @file src/components/property-add/AddPropertyFormCard/AddPropertyFormCard.js
 * @description
 * Carte "Informations du bien" pour la page "Ajout propriété".
 */

import PropertyAddField from '@/components/property-add/PropertyAddField/PropertyAddField';
import PropertyAddSectionCard from '@/components/property-add/PropertyAddSectionCard/PropertyAddSectionCard';

import styles from './AddPropertyFormCard.module.css';

/**
 * Carte des informations principales du bien.
 *
 * @returns {JSX.Element}
 */
export default function AddPropertyFormCard() {
	return (
		<PropertyAddSectionCard className={styles.card}>
			<div className={styles.inner}>
				<PropertyAddField
					id="property-title"
					label="Titre de la propriété"
					placeholder="Ex : Appartement cosy au coeur de paris"
				/>

				<PropertyAddField
					id="property-description"
					label="Description"
					as="textarea"
					placeholder="Décrivez votre propriété en détail..."
				/>

				<PropertyAddField
					id="property-postcode"
					label="Code postal"
				/>

				<PropertyAddField
					id="property-location"
					label="Localisation"
				/>
			</div>
		</PropertyAddSectionCard>
	);
}
