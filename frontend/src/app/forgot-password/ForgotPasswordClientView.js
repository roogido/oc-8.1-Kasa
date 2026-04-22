/**
 * @file src/app/forgot-password/ForgotPasswordClientView.js
 * @description
 *
 */

'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

import { requestPasswordReset } from '@/services/authService';

import styles from '@/app/auth-form.module.css';

const OBVIOUSLY_FAKE_EMAIL_DOMAINS = new Set([
	'example.com',
	'example.net',
	'example.org',
	'invalid',
	'localhost',
]);

/**
 * Retourne le domaine normalise d'une adresse e-mail.
 *
 * @param {string} email
 * @returns {string}
 */
function getEmailDomain(email) {
	const normalizedEmail = String(email || '').trim().toLowerCase();
	const atIndex = normalizedEmail.lastIndexOf('@');

	if (atIndex === -1) {
		return '';
	}

	return normalizedEmail.slice(atIndex + 1);
}

/**
 * Detecte une adresse e-mail manifestement factice.
 *
 * @param {string} email
 * @returns {boolean}
 */
function isObviouslyFakeEmailAddress(email) {
	const domain = getEmailDomain(email);

	if (domain === '') {
		return false;
	}

	if (OBVIOUSLY_FAKE_EMAIL_DOMAINS.has(domain)) {
		return true;
	}

	if (domain.endsWith('.test')) {
		return true;
	}

	if (domain.endsWith('.localhost')) {
		return true;
	}

	return false;
}

/**
 * Retourne un message d'avertissement non bloquant
 * si l'adresse e-mail semble factice.
 *
 * @param {string} email
 * @returns {string}
 */
function getEmailWarningMessage(email) {
	if (!isObviouslyFakeEmailAddress(email)) {
		return '';
	}

	return "Adresse e-mail de test detectee. Vous pouvez poursuivre, mais aucun e-mail reel de reinitialisation ne pourra etre recu.";
}

export default function ForgotPasswordClientView() {
	const [email, setEmail] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [successMessage, setSuccessMessage] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const emailWarningMessage = useMemo(() => {
		return getEmailWarningMessage(email);
	}, [email]);

	function handleEmailChange(event) {
		setEmail(event.target.value);

		if (errorMessage !== '') {
			setErrorMessage('');
		}

		if (successMessage !== '') {
			setSuccessMessage('');
		}
	}

	async function handleSubmit(event) {
		event.preventDefault();

		const normalizedEmail = email.trim().toLowerCase();

		if (normalizedEmail === '') {
			setErrorMessage("L'adresse e-mail est requise.");
			return;
		}

		setIsSubmitting(true);
		setErrorMessage('');
		setSuccessMessage('');

		try {
			const message = await requestPasswordReset({
				email: normalizedEmail,
			});

			setSuccessMessage(
				message !== ''
					? message
					: "Si cette adresse existe, un lien de reinitialisation a ete envoye.",
			);
		} catch (error) {
			setErrorMessage(
				error instanceof Error
					? error.message
					: 'Impossible de traiter la demande de reinitialisation.',
			);
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<section
			className={styles.section}
			aria-labelledby="forgot-password-title"
		>
			<div className={styles.panel}>
				<header className={styles.intro}>
					<h1
						id="forgot-password-title"
						className={styles.title}
					>
						Mot de passe oublie
					</h1>

					<p className={styles.description}>
						Renseigne l&apos;adresse e-mail associee a ton compte.
						Si elle existe, nous t&apos;enverrons un lien de
						reinitialisation.
					</p>
				</header>

				<form
					className={styles.form}
					onSubmit={handleSubmit}
					noValidate
				>
					<div className={styles.field}>
						<label htmlFor="email" className={styles.label}>
							Adresse e-mail
						</label>

						<input
							id="email"
							name="email"
							type="email"
							autoComplete="email"
							className={styles.input}
							value={email}
							onChange={handleEmailChange}
							aria-invalid={errorMessage !== ''}
							aria-describedby={
								emailWarningMessage !== ''
									? 'forgot-password-email-warning'
									: undefined
							}
						/>

						{emailWarningMessage !== '' ? (
							<p
								id="forgot-password-email-warning"
								className={styles.warningMessage}
								role="status"
							>
								{emailWarningMessage}
							</p>
						) : null}
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
							disabled={isSubmitting}
						>
							{isSubmitting
								? 'Envoi en cours...'
								: 'Envoyer le lien'}
						</button>

						<div className={styles.links}>
							<Link href="/login" className={styles.textLink}>
								Retour a la connexion
							</Link>
						</div>
					</div>
				</form>
			</div>
		</section>
	);
}
