/**
 * @file src/components/property-add/AddPropertyHostCard/AddPropertyHostCard.js
 * @description
 * Carte hôte pour la page "Ajout propriété".
 */

import PropertyAddField from '@/components/property-add/PropertyAddField/PropertyAddField';
import PropertyAddSectionCard from '@/components/property-add/PropertyAddSectionCard/PropertyAddSectionCard';
import PropertyAddUploadField from '@/components/property-add/PropertyAddUploadField/PropertyAddUploadField';

import styles from './AddPropertyHostCard.module.css';

/**
 * Carte de l'hôte.
 *
 * @returns {JSX.Element}
 */
export default function AddPropertyHostCard() {
	return (
		<PropertyAddSectionCard className={styles.card}>
			<div className={styles.inner}>
				<PropertyAddField
					id="host-name"
					label="Nom de l’hôte"
				/>

				<PropertyAddUploadField
					id="host-profile-picture"
					label="Photo de profil"
					addText="+Ajouter une image"
				/>
			</div>
		</PropertyAddSectionCard>
	);
}
