/**
 * @file src/components/property-add/AddPropertyMediaCard/AddPropertyMediaCard.js
 * @description
 * Carte médias du bien pour la page "Ajout propriété".
 */

import Image from 'next/image';

import PropertyAddSectionCard from '@/components/property-add/PropertyAddSectionCard/PropertyAddSectionCard';
import PropertyAddUploadField from '@/components/property-add/PropertyAddUploadField/PropertyAddUploadField';
import { normalizeBackendImageUrl } from '@/lib/imageUrl';

import styles from './AddPropertyMediaCard.module.css';

/**
 * Carte des médias du bien.
 *
 * @param {Object} props
 * @param {string} props.coverValue
 * @param {string} props.coverPreviewUrl
 * @param {string} props.galleryValue
 * @param {string[]} props.galleryImages
 * @param {(file: File) => Promise<void> | void} props.onCoverUpload
 * @param {(file: File) => Promise<void> | void} props.onGalleryUpload
 * @param {() => Promise<void> | void} props.onRemoveCover
 * @param {(imageUrl: string) => Promise<void> | void} props.onRemoveGalleryImage
 * @param {boolean} [props.isUploadingCover=false]
 * @param {boolean} [props.isUploadingGallery=false]
 * @param {boolean} [props.isDisabled=false]
 * @param {string} [props.coverHelperText='']
 * @param {string} [props.galleryHelperText='']
 * @returns {JSX.Element}
 */
export default function AddPropertyMediaCard({
	coverValue,
	coverPreviewUrl,
	galleryValue,
	galleryImages,
	onCoverUpload,
	onGalleryUpload,
	onRemoveCover,
	onRemoveGalleryImage,
	isUploadingCover = false,
	isUploadingGallery = false,
	isDisabled = false,
	coverHelperText = '',
	galleryHelperText = '',
}) {
	const normalizedCoverPreviewUrl =
		typeof coverPreviewUrl === 'string' && coverPreviewUrl.trim() !== ''
			? normalizeBackendImageUrl(coverPreviewUrl, '')
			: '';

	return (
		<PropertyAddSectionCard className={styles.card}>
			<div className={styles.inner}>
				<PropertyAddUploadField
					id="property-cover-image"
					label="Image de couverture"
					value={coverValue}
					onFileSelect={onCoverUpload}
					isUploading={isUploadingCover}
					disabled={isDisabled}
					helperText={coverHelperText}
				/>

				{normalizedCoverPreviewUrl !== '' ? (
					<div className={styles.previewBlock}>
						<div className={styles.singlePreviewRow}>
							<div className={styles.previewThumb}>
								<Image
									src={normalizedCoverPreviewUrl}
									alt="Aperçu de l'image de couverture"
									fill
									sizes="56px"
									className={styles.previewImage}
								/>
							</div>

							<div className={styles.previewMeta}>
								<p className={styles.previewTitle}>
									Couverture actuelle
								</p>
								<button
									type="button"
									className={styles.previewAction}
									onClick={onRemoveCover}
								>
									Supprimer
								</button>
							</div>
						</div>
					</div>
				) : null}

				<PropertyAddUploadField
					id="property-gallery-image"
					label="Image du logement"
					addText="+Ajouter une image"
					value={galleryValue}
					onFileSelect={onGalleryUpload}
					isUploading={isUploadingGallery}
					disabled={isDisabled}
					helperText={galleryHelperText}
				/>

				{galleryImages.length > 0 ? (
					<div className={styles.previewBlock}>
						<div className={styles.galleryPreviewList}>
							{galleryImages.map((imageUrl, index) => {
								const normalizedImageUrl =
									normalizeBackendImageUrl(imageUrl, '');

								return (
									<div
										key={`${imageUrl}-${index}`}
										className={styles.galleryPreviewItem}
									>
										<div className={styles.previewThumb}>
											<Image
												src={normalizedImageUrl}
												alt={`Aperçu de l'image du logement ${index + 1}`}
												fill
												sizes="56px"
												className={styles.previewImage}
											/>
										</div>

										<button
											type="button"
											className={styles.previewAction}
											onClick={() =>
												onRemoveGalleryImage(imageUrl)
											}
										>
											Supprimer
										</button>
									</div>
								);
							})}
						</div>
					</div>
				) : null}
			</div>
		</PropertyAddSectionCard>
	);
}
