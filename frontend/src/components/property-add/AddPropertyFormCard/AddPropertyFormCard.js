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
 * @param {Object} props
 * @param {Object} props.values
 * @param {(fieldName: string, value: string) => void} props.onFieldChange
 * @returns {JSX.Element}
 */
export default function AddPropertyFormCard({ values, onFieldChange }) {
	return (
		<PropertyAddSectionCard className={styles.card}>
			<div className={styles.inner}>
				<PropertyAddField
					id="property-title"
					label="Titre de la propriété"
					placeholder="Ex : Appartement cosy au cœur de Paris"
					value={values.title}
					onChange={(value) => onFieldChange('title', value)}
				/>

				<PropertyAddField
					id="property-description"
					label="Description"
					as="textarea"
					placeholder="Décrivez votre propriété en détail..."
					value={values.description}
					onChange={(value) => onFieldChange('description', value)}
				/>

				<PropertyAddField
					id="property-price-per-night"
					label="Prix par nuit (€)"
					type="number"
					placeholder="80"
					value={values.pricePerNight}
					onChange={(value) => onFieldChange('pricePerNight', value)}
				/>

				<PropertyAddField
					id="property-postcode"
					label="Code postal"
					value={values.postcode}
					onChange={(value) => onFieldChange('postcode', value)}
				/>

				<PropertyAddField
					id="property-location"
					label="Localisation"
					value={values.location}
					onChange={(value) => onFieldChange('location', value)}
				/>
			</div>
		</PropertyAddSectionCard>
	);
}
