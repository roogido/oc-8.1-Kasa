/**
 * Fichier : src/app/profile/change-password/ChangePasswordClientView.js
 * @description
 * Vue cliente de la page de changement du mot de passe.
 */

'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { changePassword } from '@/services/authService';
import {
	PASSWORD_MIN_LENGTH,
	PASSWORD_REQUIREMENTS_TEXT,
	getPasswordValidationError,
} from '@/lib/passwordValidation';

import styles from '@/app/auth-form.module.css';

export default function ChangePasswordClientView() {
	const router = useRouter();

	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] =
		useState(false);
	const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
	const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
		useState(false);

	const [errorMessage, setErrorMessage] = useState('');
	const [successMessage, setSuccessMessage] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	function resetMessages() {
		if (errorMessage !== '') {
			setErrorMessage('');
		}

		if (successMessage !== '') {
			setSuccessMessage('');
		}
	}

	function handleCurrentPasswordChange(event) {
		setCurrentPassword(event.target.value);
		resetMessages();
	}

	function handleNewPasswordChange(event) {
		setNewPassword(event.target.value);
		resetMessages();
	}

	function handleConfirmPasswordChange(event) {
		setConfirmPassword(event.target.value);
		resetMessages();
	}

	async function handleSubmit(event) {
		event.preventDefault();

		if (
			currentPassword.trim() === '' ||
			newPassword.trim() === '' ||
			confirmPassword.trim() === ''
		) {
			setErrorMessage('Tous les champs sont requis.');
			return;
		}

		if (newPassword !== confirmPassword) {
			setErrorMessage(
				'Le nouveau mot de passe et sa confirmation ne correspondent pas.',
			);
			return;
		}

		const passwordValidationError = getPasswordValidationError(newPassword);

		if (passwordValidationError !== '') {
			setErrorMessage(passwordValidationError);
			return;
		}

		setIsSubmitting(true);
		setErrorMessage('');
		setSuccessMessage('');

		try {
			const message = await changePassword({
				currentPassword,
				newPassword,
			});

			setSuccessMessage(
				message !== ''
					? message
					: 'Votre mot de passe a bien été modifié.',
			);

			setCurrentPassword('');
			setNewPassword('');
			setConfirmPassword('');

			window.setTimeout(() => {
				router.replace('/profile');
			}, 1500);
		} catch (error) {
			setErrorMessage(
				error instanceof Error
					? error.message
					: 'Impossible de modifier le mot de passe.',
			);
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<section
			className={styles.section}
			aria-labelledby="change-password-title"
		>
			<div className={styles.panel}>
				<header className={styles.intro}>
					<h1 id="change-password-title" className={styles.title}>
						Changer le mot de passe
					</h1>

					<p className={styles.description}>
						Modifiez votre mot de passe en renseignant d&apos;abord
						votre mot de passe actuel, puis un nouveau mot de passe
						sécurisé.
					</p>
				</header>

				<form
					className={styles.form}
					onSubmit={handleSubmit}
					noValidate
				>
					<div className={styles.field}>
						<label
							htmlFor="currentPassword"
							className={styles.label}
						>
							Mot de passe actuel
						</label>

						<div className={styles.passwordField}>
							<input
								id="currentPassword"
								name="currentPassword"
								type={
									isCurrentPasswordVisible
										? 'text'
										: 'password'
								}
								autoComplete="current-password"
								className={`${styles.input} ${styles.passwordInput}`}
								value={currentPassword}
								onChange={handleCurrentPasswordChange}
								aria-invalid={errorMessage !== ''}
							/>

							<button
								type="button"
								className={styles.passwordToggleButton}
								aria-label={
									isCurrentPasswordVisible
										? 'Masquer le mot de passe actuel'
										: 'Afficher le mot de passe actuel'
								}
								aria-pressed={isCurrentPasswordVisible}
								onClick={() =>
									setIsCurrentPasswordVisible(
										(previousState) => !previousState,
									)
								}
							>
								{isCurrentPasswordVisible ? (
									<EyeOff
										className={styles.passwordToggleIcon}
										aria-hidden="true"
									/>
								) : (
									<Eye
										className={styles.passwordToggleIcon}
										aria-hidden="true"
									/>
								)}
							</button>
						</div>
					</div>

					<div className={styles.field}>
						<label htmlFor="newPassword" className={styles.label}>
							Nouveau mot de passe
						</label>

						<div className={styles.passwordField}>
							<input
								id="newPassword"
								name="newPassword"
								type={
									isNewPasswordVisible ? 'text' : 'password'
								}
								autoComplete="new-password"
								className={`${styles.input} ${styles.passwordInput}`}
								value={newPassword}
								onChange={handleNewPasswordChange}
								minLength={PASSWORD_MIN_LENGTH}
								aria-invalid={errorMessage !== ''}
								aria-describedby="change-password-requirements"
							/>

							<button
								type="button"
								className={styles.passwordToggleButton}
								aria-label={
									isNewPasswordVisible
										? 'Masquer le nouveau mot de passe'
										: 'Afficher le nouveau mot de passe'
								}
								aria-pressed={isNewPasswordVisible}
								onClick={() =>
									setIsNewPasswordVisible(
										(previousState) => !previousState,
									)
								}
							>
								{isNewPasswordVisible ? (
									<EyeOff
										className={styles.passwordToggleIcon}
										aria-hidden="true"
									/>
								) : (
									<Eye
										className={styles.passwordToggleIcon}
										aria-hidden="true"
									/>
								)}
							</button>
						</div>

						<p
							id="change-password-requirements"
							className={styles.passwordHint}
						>
							<strong>{PASSWORD_REQUIREMENTS_TEXT}</strong>
						</p>
					</div>

					<div className={styles.field}>
						<label
							htmlFor="confirmPassword"
							className={styles.label}
						>
							Confirmer le nouveau mot de passe
						</label>

						<div className={styles.passwordField}>
							<input
								id="confirmPassword"
								name="confirmPassword"
								type={
									isConfirmPasswordVisible
										? 'text'
										: 'password'
								}
								autoComplete="new-password"
								className={`${styles.input} ${styles.passwordInput}`}
								value={confirmPassword}
								onChange={handleConfirmPasswordChange}
								aria-invalid={errorMessage !== ''}
							/>

							<button
								type="button"
								className={styles.passwordToggleButton}
								aria-label={
									isConfirmPasswordVisible
										? 'Masquer la confirmation du nouveau mot de passe'
										: 'Afficher la confirmation du nouveau mot de passe'
								}
								aria-pressed={isConfirmPasswordVisible}
								onClick={() =>
									setIsConfirmPasswordVisible(
										(previousState) => !previousState,
									)
								}
							>
								{isConfirmPasswordVisible ? (
									<EyeOff
										className={styles.passwordToggleIcon}
										aria-hidden="true"
									/>
								) : (
									<Eye
										className={styles.passwordToggleIcon}
										aria-hidden="true"
									/>
								)}
							</button>
						</div>
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
							className={`${styles.submitButton} ${styles.submitButtonWide}`}
							disabled={isSubmitting}
						>
							{isSubmitting
								? 'Mise à jour...'
								: 'Mettre à jour le mot de passe'}
						</button>

						<div className={styles.links}>
							<Link href="/profile" className={styles.textLink}>
								Retour au profil
							</Link>
						</div>
					</div>
				</form>
			</div>
		</section>
	);
}
