/**
 * @file src/app/reset-password/ResetPasswordClientView.js
 * @description
 * Vue cliente de la page de réinitialisation du mot de passe.
 */

'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { resetPasswordWithToken } from '@/services/authService';
import {
	PASSWORD_MIN_LENGTH,
	PASSWORD_REQUIREMENTS_TEXT,
	getPasswordValidationError,
} from '@/lib/passwordValidation';

import styles from '@/app/auth-form.module.css';

export default function ResetPasswordClientView() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const token = useMemo(() => {
		const rawToken = searchParams.get('token');

		return typeof rawToken === 'string' ? rawToken.trim() : '';
	}, [searchParams]);

	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
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

	function handlePasswordChange(event) {
		setPassword(event.target.value);
		resetMessages();
	}

	function handleConfirmPasswordChange(event) {
		setConfirmPassword(event.target.value);
		resetMessages();
	}

	async function handleSubmit(event) {
		event.preventDefault();

		if (token === '') {
			setErrorMessage(
				'Le lien de réinitialisation est invalide ou incomplet.',
			);
			return;
		}

		const normalizedPassword = password;
		const normalizedConfirmPassword = confirmPassword;

		if (
			normalizedPassword.trim() === '' ||
			normalizedConfirmPassword.trim() === ''
		) {
			setErrorMessage(
				'Le nouveau mot de passe et sa confirmation sont requis.',
			);
			return;
		}

		if (normalizedPassword !== normalizedConfirmPassword) {
			setErrorMessage(
				'Le mot de passe et sa confirmation ne correspondent pas.',
			);
			return;
		}

		const passwordValidationError =
			getPasswordValidationError(normalizedPassword);

		if (passwordValidationError !== '') {
			setErrorMessage(passwordValidationError);
			return;
		}

		setIsSubmitting(true);
		setErrorMessage('');
		setSuccessMessage('');

		try {
			const message = await resetPasswordWithToken({
				token,
				password: normalizedPassword,
			});

			setSuccessMessage(
				message !== ''
					? message
					: 'Votre mot de passe a bien été réinitialisé.',
			);

			setPassword('');
			setConfirmPassword('');

			window.setTimeout(() => {
				router.replace('/login');
			}, 1500);
		} catch (error) {
			setErrorMessage(
				error instanceof Error
					? error.message
					: 'Impossible de réinitialiser le mot de passe.',
			);
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<section
			className={styles.section}
			aria-labelledby="reset-password-title"
		>
			<div className={styles.panel}>
				<header className={styles.intro}>
					<h1 id="reset-password-title" className={styles.title}>
						Réinitialiser le mot de passe
					</h1>

					<p className={styles.description}>
						Définissez un nouveau mot de passe pour accéder de
						nouveau à votre compte Kasa.
					</p>
				</header>

				<form
					className={styles.form}
					onSubmit={handleSubmit}
					noValidate
				>
					<div className={styles.field}>
						<label htmlFor="password" className={styles.label}>
							Nouveau mot de passe
						</label>

						<div className={styles.passwordField}>
							<input
								id="password"
								name="password"
								type={isPasswordVisible ? 'text' : 'password'}
								autoComplete="new-password"
								className={`${styles.input} ${styles.passwordInput}`}
								value={password}
								onChange={handlePasswordChange}
								minLength={PASSWORD_MIN_LENGTH}
								aria-invalid={errorMessage !== ''}
								aria-describedby="reset-password-requirements"
							/>

							<button
								type="button"
								className={styles.passwordToggleButton}
								aria-label={
									isPasswordVisible
										? 'Masquer le mot de passe'
										: 'Afficher le mot de passe'
								}
								aria-pressed={isPasswordVisible}
								onClick={() =>
									setIsPasswordVisible(
										(previousState) => !previousState,
									)
								}
							>
								{isPasswordVisible ? (
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
							id="reset-password-requirements"
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
							Confirmer le mot de passe
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
										? 'Masquer la confirmation du mot de passe'
										: 'Afficher la confirmation du mot de passe'
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
								? 'Réinitialisation...'
								: 'Définir le nouveau mot de passe'}
						</button>

						<div className={styles.links}>
							<Link href="/login" className={styles.textLink}>
								Retour à la connexion
							</Link>
						</div>
					</div>
				</form>
			</div>
		</section>
	);
}
