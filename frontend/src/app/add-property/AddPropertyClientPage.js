/**
 * @file src/app/add-property/AddPropertyClientPage.js
 * @description
 * Vue client de la page "Ajout propriete".
 */

'use client';

import { useMemo, useState } from 'react';

import AddPropertyCategoriesCard from '@/components/property-add/AddPropertyCategoriesCard/AddPropertyCategoriesCard';
import AddPropertyEquipmentsCard from '@/components/property-add/AddPropertyEquipmentsCard/AddPropertyEquipmentsCard';
import AddPropertyFormCard from '@/components/property-add/AddPropertyFormCard/AddPropertyFormCard';
import AddPropertyHostCard from '@/components/property-add/AddPropertyHostCard/AddPropertyHostCard';
import AddPropertyMediaCard from '@/components/property-add/AddPropertyMediaCard/AddPropertyMediaCard';
import AddPropertyTopBar from '@/components/property-add/AddPropertyTopBar/AddPropertyTopBar';

import { createProperty } from '@/services/propertyCreationService';
import { uploadImage } from '@/services/uploadService';

import styles from './page.module.css';

/**
 * Etat initial du formulaire.
 */
const INITIAL_FORM_STATE = {
	title: '',
	description: '',
	postcode: '',
	location: '',
	cover: '',
	pictures: [],
	equipments: [],
	tags: [],
	customCategory: '',
};

/**
 * Vue client de la page "Ajout propriete".
 *
 * @param {Object} props
 * @param {Object} props.currentUser
 * @returns {JSX.Element}
 */
export default function AddPropertyClientPage({ currentUser }) {
	const [formData, setFormData] = useState(INITIAL_FORM_STATE);
	const [submitErrorMessage, setSubmitErrorMessage] = useState('');
	const [submitSuccessMessage, setSubmitSuccessMessage] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isUploadingCover, setIsUploadingCover] = useState(false);
	const [isUploadingGallery, setIsUploadingGallery] = useState(false);

	const isBusy =
		isSubmitting ||
		isUploadingCover ||
		isUploadingGallery;

	const currentUserId = String(currentUser?.id ?? '').trim();
	const currentUserName =
		typeof currentUser?.name === 'string' && currentUser.name.trim() !== ''
			? currentUser.name.trim()
			: 'Hote';

	const currentUserRole =
		typeof currentUser?.role === 'string' ? currentUser.role.trim() : '';

	const currentUserPicture =
		typeof currentUser?.picture === 'string' &&
		currentUser.picture.trim() !== ''
			? currentUser.picture.trim()
			: '';

	const galleryDisplayValue = useMemo(() => {
		if (formData.pictures.length === 0) {
			return '';
		}

		return `${formData.pictures.length} image(s) telechargee(s)`;
	}, [formData.pictures]);

	/**
	 * Met a jour un champ simple du formulaire.
	 *
	 * @param {string} fieldName
	 * @param {string} value
	 * @returns {void}
	 */
	function handleFieldChange(fieldName, value) {
		setSubmitErrorMessage('');
		setSubmitSuccessMessage('');

		setFormData((previousState) => ({
			...previousState,
			[fieldName]: value,
		}));
	}

	/**
	 * Bascule un equipement.
	 *
	 * @param {string} equipment
	 * @returns {void}
	 */
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

	/**
	 * Bascule une categorie.
	 *
	 * @param {string} tag
	 * @returns {void}
	 */
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

	/**
	 * Ajoute une categorie personnalisee.
	 *
	 * @returns {void}
	 */
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

	/**
	 * Upload l'image de couverture.
	 *
	 * @param {File} file
	 * @returns {Promise<void>}
	 */
	async function handleCoverUpload(file) {
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

	/**
	 * Upload une image de galerie.
	 *
	 * @param {File} file
	 * @returns {Promise<void>}
	 */
	async function handleGalleryUpload(file) {
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

	/**
	 * Soumet le formulaire.
	 *
	 * @param {React.FormEvent<HTMLFormElement>} event
	 * @returns {Promise<void>}
	 */
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

		if (currentUserId === '') {
			setSubmitErrorMessage(
				"Impossible d'identifier l'hote connecte.",
			);
			return;
		}

		if (normalizedTitle === '') {
			setSubmitErrorMessage('Le titre de la propriete est requis.');
			return;
		}

		const payload = {
			title: normalizedTitle,
			host_id: currentUserId,
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

			setSubmitSuccessMessage('La propriete a ete creee avec succes.');
			setFormData(INITIAL_FORM_STATE);
		} catch (error) {
			setSubmitErrorMessage(
				error instanceof Error
					? error.message
					: 'Impossible de creer la propriete.',
			);
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<div className={styles.page}>
			<div className={styles.container}>
				<form id="add-property-form" onSubmit={handleSubmit} className={styles.form}>
					<AddPropertyTopBar isSubmitting={isBusy} />

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
							}}
							onFieldChange={handleFieldChange}
						/>

						<div className={styles.stack}>
							<AddPropertyMediaCard
								coverValue={formData.cover}
								galleryValue={galleryDisplayValue}
								onCoverUpload={handleCoverUpload}
								onGalleryUpload={handleGalleryUpload}
								isUploadingCover={isUploadingCover}
								isUploadingGallery={isUploadingGallery}
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
