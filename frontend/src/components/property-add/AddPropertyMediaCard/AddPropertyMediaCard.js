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
 * @param {Object} props
 * @param {string} props.coverValue
 * @param {string} props.galleryValue
 * @param {(file: File) => Promise<void> | void} props.onCoverUpload
 * @param {(file: File) => Promise<void> | void} props.onGalleryUpload
 * @param {boolean} [props.isUploadingCover=false]
 * @param {boolean} [props.isUploadingGallery=false]
 * @returns {JSX.Element}
 */
export default function AddPropertyMediaCard({
	coverValue,
	galleryValue,
	onCoverUpload,
	onGalleryUpload,
	isUploadingCover = false,
	isUploadingGallery = false,
}) {
	return (
		<PropertyAddSectionCard className={styles.card}>
			<div className={styles.inner}>
				<PropertyAddUploadField
					id="property-cover-image"
					label="Image de couverture"
					value={coverValue}
					onFileSelect={onCoverUpload}
					isUploading={isUploadingCover}
				/>

				<PropertyAddUploadField
					id="property-gallery-image"
					label="Image du logement"
					addText="+Ajouter une image"
					value={galleryValue}
					onFileSelect={onGalleryUpload}
					isUploading={isUploadingGallery}
				/>
			</div>
		</PropertyAddSectionCard>
	);
}
