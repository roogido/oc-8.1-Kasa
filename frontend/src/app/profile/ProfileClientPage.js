/**
 * @file src/app/profile/ProfileClientPage.js
 * @description
 * Vue client de la page profil.
 */

'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import defaultAvatarNeutral from '@/assets/images/profile/default-avatar-neutral.png';
import { normalizeBackendImageUrl } from '@/lib/imageUrl';
import { updateCurrentProfile } from '@/services/profileService';
import { deleteUploadedImages, uploadImage } from '@/services/uploadService';

import styles from './page.module.css';

/**
 * Retourne un libellé de rôle lisible.
 *
 * @param {string} role
 * @returns {string}
 */
function getRoleLabel(role) {
	if (role === 'owner') {
		return 'Propriétaire';
	}

	if (role === 'admin') {
		return 'Administrateur';
	}

	return 'Client';
}

/**
 * Vue client de la page profil.
 *
 * @param {Object} props
 * @param {Object} props.currentUser
 * @returns {JSX.Element}
 */
export default function ProfileClientPage({ currentUser }) {
	const router = useRouter();

	const initialName =
		typeof currentUser?.name === 'string' ? currentUser.name.trim() : '';

	const initialPicture =
		typeof currentUser?.picture === 'string'
			? currentUser.picture.trim()
			: '';

	const currentRole =
		typeof currentUser?.role === 'string'
			? currentUser.role.trim()
			: 'client';

	const isClientRole = currentRole === 'client';

	const [savedName, setSavedName] = useState(initialName);
	const [savedPicture, setSavedPicture] = useState(initialPicture);

	const [name, setName] = useState(initialName);
	const [picture, setPicture] = useState(initialPicture);

	const [errorMessage, setErrorMessage] = useState('');
	const [successMessage, setSuccessMessage] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isUploadingPicture, setIsUploadingPicture] = useState(false);

	const savedPictureRef = useRef(initialPicture);
	const pendingPictureRef = useRef('');

	const previewImageUrl = useMemo(() => {
		if (picture !== '') {
			return normalizeBackendImageUrl(
				picture,
				isClientRole ? defaultAvatarNeutral.src : '',
			);
		}

		if (isClientRole) {
			return defaultAvatarNeutral.src;
		}

		return '';
	}, [isClientRole, picture]);

	const isFormDirty = useMemo(() => {
		return (
			name.trim() !== savedName.trim() ||
			picture.trim() !== savedPicture.trim()
		);
	}, [name, picture, savedName, savedPicture]);

	useEffect(() => {
		savedPictureRef.current = savedPicture;
	}, [savedPicture]);

	useEffect(() => {
		if (isClientRole) {
			pendingPictureRef.current = '';
			return;
		}

		if (picture !== '' && picture !== savedPicture) {
			pendingPictureRef.current = picture;
			return;
		}

		pendingPictureRef.current = '';
	}, [isClientRole, picture, savedPicture]);

	useEffect(() => {
		return () => {
			const pendingPicture = pendingPictureRef.current;
			const committedPicture = savedPictureRef.current;

			if (pendingPicture !== '' && pendingPicture !== committedPicture) {
				void deleteUploadedImages({
					urls: [pendingPicture],
					keepalive: true,
				}).catch(() => {});
			}
		};
	}, []);

	async function handlePictureUpload(file) {
		if (isClientRole) {
			return;
		}

		const previousDraftPicture = picture.trim();
		const committedPicture = savedPicture.trim();

		setErrorMessage('');
		setSuccessMessage('');
		setIsUploadingPicture(true);

		try {
			const uploadResult = await uploadImage({
				file,
				purpose: 'user-picture',
			});

			const nextPicture =
				typeof uploadResult?.url === 'string'
					? uploadResult.url.trim()
					: '';

			if (nextPicture === '') {
				throw new Error("L'URL de la photo de profil est invalide.");
			}

			if (
				previousDraftPicture !== '' &&
				previousDraftPicture !== committedPicture &&
				previousDraftPicture !== nextPicture
			) {
				try {
					await deleteUploadedImages({
						urls: [previousDraftPicture],
					});
				} catch {
					// Nettoyage best-effort : ne bloque pas le nouvel upload.
				}
			}

			setPicture(nextPicture);
		} catch (error) {
			setErrorMessage(
				error instanceof Error
					? error.message
					: "Impossible d'uploader la photo de profil.",
			);
		} finally {
			setIsUploadingPicture(false);
		}
	}

	async function handleSubmit(event) {
		event.preventDefault();

		const normalizedName = name.trim();
		const previousSavedPicture = savedPicture.trim();
		const nextPicture = picture.trim();

		if (normalizedName === '') {
			setErrorMessage('Le nom du profil est requis.');
			return;
		}

		setIsSubmitting(true);
		setErrorMessage('');
		setSuccessMessage('');

		try {
			const updatedUser = await updateCurrentProfile({
				name: normalizedName,
				picture: nextPicture,
			});

			const updatedName =
				typeof updatedUser?.name === 'string' &&
				updatedUser.name.trim() !== ''
					? updatedUser.name.trim()
					: normalizedName;

			const updatedPicture =
				typeof updatedUser?.picture === 'string'
					? updatedUser.picture.trim()
					: nextPicture;

			if (
				!isClientRole &&
				previousSavedPicture !== '' &&
				updatedPicture !== '' &&
				previousSavedPicture !== updatedPicture
			) {
				try {
					await deleteUploadedImages({
						urls: [previousSavedPicture],
					});
				} catch {
					// Nettoyage best-effort : ne bloque pas le succès profil.
				}
			}

			setSavedName(updatedName);
			setSavedPicture(updatedPicture);
			setName(updatedName);
			setPicture(updatedPicture);

			setSuccessMessage('Votre profil a été mis à jour avec succès.');
			router.refresh();
		} catch (error) {
			if (
				!isClientRole &&
				nextPicture !== '' &&
				nextPicture !== savedPicture
			) {
				try {
					await deleteUploadedImages({
						urls: [nextPicture],
					});
				} catch {
					// Nettoyage best-effort : ne masque pas l'erreur principale.
				}
			}

			setPicture(savedPicture);
			setName(savedName);

			setErrorMessage(
				error instanceof Error
					? error.message
					: 'Impossible de mettre à jour le profil.',
			);
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<section className={styles.section} aria-labelledby="profile-title">
			<div className={styles.panel}>
				<header className={styles.intro}>
					<h1 id="profile-title" className={styles.title}>
						Mon profil
					</h1>

					<p className={styles.description}>
						Mettez à jour votre nom et votre photo de profil.
					</p>
				</header>

				<form
					className={styles.form}
					onSubmit={handleSubmit}
					noValidate
					autoComplete="off"
				>
					<div className={styles.field}>
						<label htmlFor="profile-name" className={styles.label}>
							Nom
						</label>

						<input
							id="profile-name"
							name="profile-name"
							type="text"
							autoComplete="name"
							className={styles.input}
							value={name}
							onChange={(event) => setName(event.target.value)}
							aria-invalid={errorMessage !== ''}
						/>
					</div>

					<div className={styles.field}>
						<label htmlFor="profile-role" className={styles.label}>
							Rôle
						</label>

						<input
							id="profile-role"
							name="profile-role"
							type="text"
							className={styles.input}
							value={getRoleLabel(currentRole)}
							readOnly
						/>
					</div>

					<div className={styles.avatarCard}>
						<div className={styles.avatarHeader}>
							<div className={styles.avatarTextBlock}>
								<h2 className={styles.avatarTitle}>
									Photo de profil
								</h2>
								<p className={styles.avatarDescription}>
									{isClientRole
										? "Les comptes client utilisent actuellement un avatar standard si aucune photo n'est déjà enregistrée."
										: 'Ajoutez ou remplacez votre photo actuelle.'}
								</p>
							</div>

							{!isClientRole ? (
								<label className={styles.uploadButton}>
									<input
										type="file"
										accept="image/*"
										className={styles.hiddenInput}
										onChange={(event) => {
											const file =
												event.target.files?.[0] ?? null;

											if (file !== null) {
												handlePictureUpload(file);
											}

											event.target.value = '';
										}}
										disabled={isUploadingPicture}
									/>
									{isUploadingPicture
										? 'Téléchargement...'
										: 'Modifier la photo'}
								</label>
							) : (
								<p className={styles.avatarNotice}>
									Modification non disponible pour ce type de
									compte.
								</p>
							)}
						</div>

						{previewImageUrl !== '' ? (
							<div className={styles.avatarPreview}>
								<Image
									key={previewImageUrl}
									src={previewImageUrl}
									alt={`Photo de profil de ${
										name.trim() !== ''
											? name.trim()
											: "l'utilisateur"
									}`}
									width={96}
									height={96}
                                    loading="eager"
									className={styles.avatarImage}
								/>
							</div>
						) : (
							<p className={styles.emptyAvatarText}>
								Aucune photo de profil pour le moment.
							</p>
						)}
					</div>

					{errorMessage !== '' ? (
						<p role="alert" className={styles.errorMessage}>
							{errorMessage}
						</p>
					) : null}

					{successMessage !== '' ? (
						<p role="status" className={styles.successMessage}>
							{successMessage}
						</p>
					) : null}

					<div className={styles.actions}>
						<button
							type="submit"
							className={styles.submitButton}
							disabled={
								!isFormDirty ||
								isSubmitting ||
								isUploadingPicture
							}
						>
							{isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
						</button>
					</div>
				</form>
			</div>
		</section>
	);
}
