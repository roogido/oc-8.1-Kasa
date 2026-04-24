/**
 * @file src/app/add-property/AddPropertyClientPage.js
 * @description
 * Vue client de la page "Ajout propriété".
 */

'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import AddPropertyCategoriesCard from '@/components/property-add/AddPropertyCategoriesCard/AddPropertyCategoriesCard';
import AddPropertyEquipmentsCard from '@/components/property-add/AddPropertyEquipmentsCard/AddPropertyEquipmentsCard';
import AddPropertyFormCard from '@/components/property-add/AddPropertyFormCard/AddPropertyFormCard';
import AddPropertyHostCard from '@/components/property-add/AddPropertyHostCard/AddPropertyHostCard';
import AddPropertyMediaCard from '@/components/property-add/AddPropertyMediaCard/AddPropertyMediaCard';
import AddPropertyTopBar from '@/components/property-add/AddPropertyTopBar/AddPropertyTopBar';

import { createProperty } from '@/services/propertyCreationService';
import {
	deleteUploadedImages,
	uploadImage,
} from '@/services/uploadService';

import styles from './page.module.css';

const PROPERTY_MAX_IMAGES = Number.parseInt(
	process.env.NEXT_PUBLIC_PROPERTY_MAX_IMAGES || '10',
	10,
);

const UPLOAD_MAX_FILE_SIZE_BYTES = Number.parseInt(
	process.env.NEXT_PUBLIC_UPLOAD_MAX_FILE_SIZE_BYTES || String(5 * 1024 * 1024),
	10,
);

/**
 * Retourne un état initial neuf du formulaire.
 *
 * @returns {Object}
 */
function createInitialFormState() {
	return {
		title: '',
		description: '',
		postcode: '',
		location: '',
		pricePerNight: '80',
		cover: '',
		pictures: [],
		equipments: [],
		tags: [],
		customCategory: '',
	};
}

/**
 * Retourne le nombre total d'images actuellement sélectionnées.
 *
 * @param {Object} formData
 * @returns {number}
 */
function getTotalImagesCount(formData) {
	return (formData.cover !== '' ? 1 : 0) + formData.pictures.length;
}

/**
 * Retourne une taille en mégaoctets lisible.
 *
 * @param {number} bytes
 * @returns {string}
 */
function formatMegabytes(bytes) {
	return String(Math.round((bytes / (1024 * 1024)) * 10) / 10);
}

/**
 * Vue client de la page "Ajout propriété".
 *
 * @param {Object} props
 * @param {Object} props.currentUser
 * @returns {JSX.Element}
 */
export default function AddPropertyClientPage({ currentUser }) {
	const [formData, setFormData] = useState(() => createInitialFormState());
	const [submitErrorMessage, setSubmitErrorMessage] = useState('');
	const [submitSuccessMessage, setSubmitSuccessMessage] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isUploadingCover, setIsUploadingCover] = useState(false);
	const [isUploadingGallery, setIsUploadingGallery] = useState(false);

	const draftMediaRef = useRef({
		cover: '',
		pictures: [],
	});

	const isBusy =
		isSubmitting ||
		isUploadingCover ||
		isUploadingGallery;

	const currentUserId = String(currentUser?.id ?? '').trim();
	const currentUserName =
		typeof currentUser?.name === 'string' && currentUser.name.trim() !== ''
			? currentUser.name.trim()
			: 'Hôte';

	const currentUserRole =
		typeof currentUser?.role === 'string' ? currentUser.role.trim() : '';

	const currentUserPicture =
		typeof currentUser?.picture === 'string' &&
		currentUser.picture.trim() !== ''
			? currentUser.picture.trim()
			: '';

	const hasTitle = formData.title.trim() !== '';
	const canSubmit = hasTitle && !isBusy;
	const isMediaDisabled = !hasTitle || isBusy;
	const totalImagesCount = getTotalImagesCount(formData);
	const remainingImagesCount = Math.max(
		0,
		PROPERTY_MAX_IMAGES - totalImagesCount,
	);

	const coverHelperText = isMediaDisabled
		? "Renseignez d'abord le titre pour activer l'ajout d'images."
		: `Maximum ${PROPERTY_MAX_IMAGES} image(s) au total, couverture incluse. Taille maximale : ${formatMegabytes(UPLOAD_MAX_FILE_SIZE_BYTES)} Mo par fichier.`;

	const galleryHelperText = isMediaDisabled
		? "Renseignez d'abord le titre pour activer l'ajout d'images."
		: `${totalImagesCount} / ${PROPERTY_MAX_IMAGES} image(s). ${remainingImagesCount} emplacement(s) restant(s). Taille maximale : ${formatMegabytes(UPLOAD_MAX_FILE_SIZE_BYTES)} Mo par fichier.`;

	const galleryDisplayValue = useMemo(() => {
		if (formData.pictures.length === 0) {
			return '';
		}

		return `${formData.pictures.length} image(s) téléchargée(s)`;
	}, [formData.pictures]);

	useEffect(() => {
		draftMediaRef.current = {
			cover: formData.cover,
			pictures: formData.pictures,
		};
	}, [formData.cover, formData.pictures]);

	useEffect(() => {
		return () => {
			const draftCover = draftMediaRef.current.cover;
			const draftPictures = draftMediaRef.current.pictures;

			const urlsToDelete = [
				...(draftCover !== '' ? [draftCover] : []),
				...draftPictures,
			];

			if (urlsToDelete.length === 0) {
				return;
			}

			void deleteUploadedImages({
				urls: urlsToDelete,
				keepalive: true,
			}).catch(() => {});
		};
	}, []);

	function handleFieldChange(fieldName, value) {
		setSubmitErrorMessage('');
		setSubmitSuccessMessage('');

		setFormData((previousState) => ({
			...previousState,
			[fieldName]: value,
		}));
	}

	function handleToggleEquipment(equipment) {
		setSubmitErrorMessage('');
		setSubmitSuccessMessage('');

		setFormData((previousState) => {
			const nextEquipments = previousState.equipments.includes(equipment)
				? previousState.equipments.filter((item) => item !== equipment)
				: [...previousState.equipments, equipment];

			return {
				...previousState,
				equipments: nextEquipments,
			};
		});
	}

	function handleToggleTag(tag) {
		setSubmitErrorMessage('');
		setSubmitSuccessMessage('');

		setFormData((previousState) => {
			const nextTags = previousState.tags.includes(tag)
				? previousState.tags.filter((item) => item !== tag)
				: [...previousState.tags, tag];

			return {
				...previousState,
				tags: nextTags,
			};
		});
	}

	function handleAddCustomCategory() {
		const nextCategory = formData.customCategory.trim();

		if (nextCategory === '') {
			return;
		}

		setSubmitErrorMessage('');
		setSubmitSuccessMessage('');

		setFormData((previousState) => {
			if (previousState.tags.includes(nextCategory)) {
				return {
					...previousState,
					customCategory: '',
				};
			}

			return {
				...previousState,
				tags: [...previousState.tags, nextCategory],
				customCategory: '',
			};
		});
	}

	async function handleCoverUpload(file) {
		if (!hasTitle) {
			setSubmitErrorMessage(
				"Renseignez d'abord le titre de la propriété avant d'ajouter des images.",
			);
			return;
		}

		if (file.size > UPLOAD_MAX_FILE_SIZE_BYTES) {
			setSubmitErrorMessage(
				`L'image de couverture dépasse la taille maximale autorisée de ${formatMegabytes(UPLOAD_MAX_FILE_SIZE_BYTES)} Mo.`,
			);
			return;
		}

		const previousCover = formData.cover;
		const canReplaceExistingCover = previousCover !== '';
		const wouldExceedMaxImages =
			!canReplaceExistingCover &&
			getTotalImagesCount(formData) >= PROPERTY_MAX_IMAGES;

		if (wouldExceedMaxImages) {
			setSubmitErrorMessage(
				`Vous pouvez ajouter au maximum ${PROPERTY_MAX_IMAGES} image(s) par propriété, couverture incluse.`,
			);
			return;
		}

		setSubmitErrorMessage('');
		setSubmitSuccessMessage('');
		setIsUploadingCover(true);

		try {
			const uploadResult = await uploadImage({
				file,
				purpose: 'property-cover',
			});

			const nextCover =
				typeof uploadResult?.url === 'string'
					? uploadResult.url.trim()
					: '';

			if (nextCover === '') {
				throw new Error("L'URL de couverture est invalide.");
			}

			if (previousCover !== '' && previousCover !== nextCover) {
				try {
					await deleteUploadedImages({
						urls: [previousCover],
					});
				} catch {
					// Nettoyage best-effort : ne bloque pas le remplacement.
				}
			}

			setFormData((previousState) => ({
				...previousState,
				cover: nextCover,
			}));
		} catch (error) {
			setSubmitErrorMessage(
				error instanceof Error
					? error.message
					: "Impossible d'uploader l'image de couverture.",
			);
		} finally {
			setIsUploadingCover(false);
		}
	}

	async function handleRemoveCover() {
		const coverToDelete = formData.cover.trim();

		if (coverToDelete === '') {
			return;
		}

		setSubmitErrorMessage('');
		setSubmitSuccessMessage('');

		try {
			await deleteUploadedImages({
				urls: [coverToDelete],
			});
		} catch {
			// Nettoyage best-effort : on retire quand même du brouillon.
		}

		setFormData((previousState) => ({
			...previousState,
			cover: '',
		}));
	}

	async function handleGalleryUpload(file) {
		if (!hasTitle) {
			setSubmitErrorMessage(
				"Renseignez d'abord le titre de la propriété avant d'ajouter des images.",
			);
			return;
		}

		if (file.size > UPLOAD_MAX_FILE_SIZE_BYTES) {
			setSubmitErrorMessage(
				`L'image dépasse la taille maximale autorisée de ${formatMegabytes(UPLOAD_MAX_FILE_SIZE_BYTES)} Mo.`,
			);
			return;
		}

		if (getTotalImagesCount(formData) >= PROPERTY_MAX_IMAGES) {
			setSubmitErrorMessage(
				`Vous pouvez ajouter au maximum ${PROPERTY_MAX_IMAGES} image(s) par propriété, couverture incluse.`,
			);
			return;
		}

		setSubmitErrorMessage('');
		setSubmitSuccessMessage('');
		setIsUploadingGallery(true);

		try {
			const uploadResult = await uploadImage({
				file,
				purpose: 'property-picture',
			});

			const nextPicture =
				typeof uploadResult?.url === 'string'
					? uploadResult.url.trim()
					: '';

			if (nextPicture === '') {
				throw new Error("L'URL de l'image du logement est invalide.");
			}

			setFormData((previousState) => ({
				...previousState,
				pictures: [...previousState.pictures, nextPicture],
			}));
		} catch (error) {
			setSubmitErrorMessage(
				error instanceof Error
					? error.message
					: "Impossible d'uploader l'image du logement.",
			);
		} finally {
			setIsUploadingGallery(false);
		}
	}

	async function handleRemoveGalleryImage(pictureUrl) {
		const normalizedUrl =
			typeof pictureUrl === 'string' ? pictureUrl.trim() : '';

		if (normalizedUrl === '') {
			return;
		}

		setSubmitErrorMessage('');
		setSubmitSuccessMessage('');

		try {
			await deleteUploadedImages({
				urls: [normalizedUrl],
			});
		} catch {
			// Nettoyage best-effort : on retire quand même du brouillon.
		}

		setFormData((previousState) => ({
			...previousState,
			pictures: previousState.pictures.filter(
				(item) => item !== normalizedUrl,
			),
		}));
	}

	async function handleSubmit(event) {
		event.preventDefault();

		setSubmitErrorMessage('');
		setSubmitSuccessMessage('');

		if (isBusy) {
			setSubmitErrorMessage(
				'Veuillez attendre la fin des uploads en cours.',
			);
			return;
		}

		const normalizedTitle = formData.title.trim();
		const normalizedDescription = formData.description.trim();
		const normalizedLocation = formData.location.trim();
		const normalizedPrice = Number(formData.pricePerNight);
		const totalImages = getTotalImagesCount(formData);

		if (currentUserId === '') {
			setSubmitErrorMessage(
				"Impossible d'identifier l'hôte connecté.",
			);
			return;
		}

		if (normalizedTitle === '') {
			setSubmitErrorMessage('Le titre de la propriété est requis.');
			return;
		}

		if (!Number.isFinite(normalizedPrice) || normalizedPrice <= 0) {
			setSubmitErrorMessage(
				'Le prix par nuit doit être supérieur à 0.',
			);
			return;
		}

		if (totalImages > PROPERTY_MAX_IMAGES) {
			setSubmitErrorMessage(
				`Vous pouvez ajouter au maximum ${PROPERTY_MAX_IMAGES} image(s) par propriété, couverture incluse.`,
			);
			return;
		}

		const payload = {
			title: normalizedTitle,
			host_id: currentUserId,
			price_per_night: normalizedPrice,
		};

		if (normalizedDescription !== '') {
			payload.description = normalizedDescription;
		}

		if (normalizedLocation !== '') {
			payload.location = normalizedLocation;
		}

		if (formData.cover !== '') {
			payload.cover = formData.cover;
		}

		if (formData.pictures.length > 0) {
			payload.pictures = formData.pictures;
		}

		if (formData.equipments.length > 0) {
			payload.equipments = formData.equipments;
		}

		if (formData.tags.length > 0) {
			payload.tags = formData.tags;
		}

		setIsSubmitting(true);

		try {
			await createProperty(payload);

			setSubmitSuccessMessage('La propriété a été créée avec succès.');
			setFormData(createInitialFormState());
		} catch (error) {
			setSubmitErrorMessage(
				error instanceof Error
					? error.message
					: 'Impossible de créer la propriété.',
			);
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<div className={styles.page}>
			<div className={styles.container}>
				<form
					id="add-property-form"
					onSubmit={handleSubmit}
					className={styles.form}
				>
					<AddPropertyTopBar
						isSubmitting={isBusy}
						isDisabled={!canSubmit}
					/>

					{submitErrorMessage !== '' ? (
						<p role="alert" className={styles.errorMessage}>
							{submitErrorMessage}
						</p>
					) : null}

					{submitSuccessMessage !== '' ? (
						<p role="status" className={styles.successMessage}>
							{submitSuccessMessage}
						</p>
					) : null}

					<div className={styles.row}>
						<AddPropertyFormCard
							values={{
								title: formData.title,
								description: formData.description,
								postcode: formData.postcode,
								location: formData.location,
								pricePerNight: formData.pricePerNight,
							}}
							onFieldChange={handleFieldChange}
						/>

						<div className={styles.stack}>
							<AddPropertyMediaCard
								coverValue={formData.cover}
								coverPreviewUrl={formData.cover}
								galleryValue={galleryDisplayValue}
								galleryImages={formData.pictures}
								onCoverUpload={handleCoverUpload}
								onGalleryUpload={handleGalleryUpload}
								onRemoveCover={handleRemoveCover}
								onRemoveGalleryImage={handleRemoveGalleryImage}
								isUploadingCover={isUploadingCover}
								isUploadingGallery={isUploadingGallery}
								isDisabled={isMediaDisabled}
								coverHelperText={coverHelperText}
								galleryHelperText={galleryHelperText}
							/>

							<AddPropertyHostCard
								hostName={currentUserName}
								hostPicture={currentUserPicture}
								role={currentUserRole}
							/>
						</div>
					</div>

					<div className={styles.row}>
						<AddPropertyEquipmentsCard
							selectedEquipments={formData.equipments}
							onToggleEquipment={handleToggleEquipment}
						/>

						<AddPropertyCategoriesCard
							selectedTags={formData.tags}
							customCategory={formData.customCategory}
							onCustomCategoryChange={(value) =>
								handleFieldChange('customCategory', value)
							}
							onAddCustomCategory={handleAddCustomCategory}
							onToggleTag={handleToggleTag}
						/>
					</div>
				</form>
			</div>
		</div>
	);
}
