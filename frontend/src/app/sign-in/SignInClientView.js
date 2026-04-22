/**
 * @file src/app/sign-in/SignInClientView.js
 * @description
 * Vue cliente de la page d'inscription Kasa.
 */

'use client';

import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { registerUser } from '@/services/authService';

import styles from './page.module.css';

const PASSWORD_MIN_LENGTH = 8;
const LOWERCASE_PATTERN = /[a-z]/;
const UPPERCASE_PATTERN = /[A-Z]/;
const DIGIT_PATTERN = /\d/;
const SPECIAL_CHARACTER_PATTERN = /[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/;

const OBVIOUSLY_FAKE_EMAIL_DOMAINS = new Set([
	'example.com',
	'example.net',
	'example.org',
	'invalid',
	'localhost',
]);

/**
 * Retourne une destination interne sûre après authentification.
 *
 * @param {string|null} nextPath
 * @returns {string}
 */
function getSafeNextPath(nextPath) {
	if (typeof nextPath !== 'string') {
		return '/';
	}

	const trimmedPath = nextPath.trim();

	if (
		trimmedPath === '' ||
		!trimmedPath.startsWith('/') ||
		trimmedPath.startsWith('//')
	) {
		return '/';
	}

	return trimmedPath;
}

/**
 * Vérifie que le rôle choisi est autorisé.
 *
 * @param {string} role
 * @returns {string}
 */
function normalizeRole(role) {
	return role === 'owner' ? 'owner' : 'client';
}

/**
 * Retourne un message d'erreur clair si le mot de passe
 * ne respecte pas la politique de robustesse attendue.
 *
 * @param {string} password
 * @returns {string}
 */
function getPasswordValidationError(password) {
	if (password.length < PASSWORD_MIN_LENGTH) {
		return `Le mot de passe doit contenir au moins ${PASSWORD_MIN_LENGTH} caractères.`;
	}

	if (!LOWERCASE_PATTERN.test(password)) {
		return 'Le mot de passe doit contenir au moins une lettre minuscule.';
	}

	if (!UPPERCASE_PATTERN.test(password)) {
		return 'Le mot de passe doit contenir au moins une lettre majuscule.';
	}

	if (!DIGIT_PATTERN.test(password)) {
		return 'Le mot de passe doit contenir au moins un chiffre.';
	}

	if (!SPECIAL_CHARACTER_PATTERN.test(password)) {
		return 'Le mot de passe doit contenir au moins un caractère spécial, par exemple : ! @ # $ % & * ?';
	}

	return '';
}

/**
 * Retourne le domaine normalisé d'une adresse e-mail.
 *
 * @param {string} email
 * @returns {string}
 */
function getEmailDomain(email) {
	const normalizedEmail = String(email || '')
		.trim()
		.toLowerCase();
	const atIndex = normalizedEmail.lastIndexOf('@');

	if (atIndex === -1) {
		return '';
	}

	return normalizedEmail.slice(atIndex + 1);
}

/**
 * Détecte une adresse e-mail manifestement factice.
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

	return "Adresse e-mail de test détectée. Vous pouvez poursuivre l'inscription, mais vous ne recevrez pas les e-mails de confirmation ou d'information.";
}

/**
 * Traduit les messages d'erreur backend connus
 * en messages français lisibles pour l'utilisateur.
 *
 * @param {unknown} error
 * @returns {string}
 */
function getRegistrationErrorMessage(error) {
	if (!(error instanceof Error)) {
		return 'Impossible de créer le compte.';
	}

	switch (error.message) {
		case 'name is required':
			return 'Le nom est requis.';

		case 'email is required':
			return "L'adresse e-mail est requise.";

		case 'email already registered':
			return 'Cette adresse e-mail est déjà utilisée.';

		case 'password must be at least 8 characters':
			return 'Le mot de passe doit contenir au moins 8 caractères.';

		case 'password must contain at least one lowercase letter':
			return 'Le mot de passe doit contenir au moins une lettre minuscule.';

		case 'password must contain at least one uppercase letter':
			return 'Le mot de passe doit contenir au moins une lettre majuscule.';

		case 'password must contain at least one digit':
			return 'Le mot de passe doit contenir au moins un chiffre.';

		case 'password must contain at least one special character':
			return 'Le mot de passe doit contenir au moins un caractère spécial.';

		default:
			return error.message;
	}
}

/**
 * Page d'inscription.
 *
 * @returns {JSX.Element}
 */
export default function SignInPage() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const redirectPath = useMemo(() => {
		return getSafeNextPath(searchParams.get('next'));
	}, [searchParams]);

	const [lastName, setLastName] = useState('');
	const [firstName, setFirstName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const [role, setRole] = useState('client');
	const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const emailWarningMessage = useMemo(() => {
		return getEmailWarningMessage(email);
	}, [email]);

	/**
	 * Met à jour l'adresse e-mail et efface le message d'erreur courant.
	 *
	 * @param {React.ChangeEvent<HTMLInputElement>} event
	 * @returns {void}
	 */
	function handleEmailChange(event) {
		setEmail(event.target.value);

		if (errorMessage !== '') {
			setErrorMessage('');
		}
	}

	/**
	 * Met à jour le mot de passe et efface le message d'erreur courant.
	 *
	 * @param {React.ChangeEvent<HTMLInputElement>} event
	 * @returns {void}
	 */
	function handlePasswordChange(event) {
		setPassword(event.target.value);

		if (errorMessage !== '') {
			setErrorMessage('');
		}
	}

	async function handleSubmit(event) {
		event.preventDefault();

		const normalizedLastName = lastName.trim();
		const normalizedFirstName = firstName.trim();
		const normalizedEmail = email.trim().toLowerCase();
		const normalizedPassword = password;
		const normalizedRole = normalizeRole(role);

		if (
			normalizedLastName === '' ||
			normalizedFirstName === '' ||
			normalizedEmail === '' ||
			normalizedPassword.trim() === ''
		) {
			setErrorMessage('Tous les champs sont requis.');
			return;
		}

		const passwordValidationError =
			getPasswordValidationError(normalizedPassword);

		if (passwordValidationError !== '') {
			setErrorMessage(passwordValidationError);
			return;
		}

		if (!hasAcceptedTerms) {
			setErrorMessage(
				"Vous devez accepter les conditions générales d'utilisation.",
			);
			return;
		}

		if (
			process.env.NODE_ENV !== 'production' &&
			isObviouslyFakeEmailAddress(normalizedEmail)
		) {
			console.warn(
				"Adresse e-mail de test détectée à l'inscription :",
				normalizedEmail,
			);
		}

		setIsSubmitting(true);
		setErrorMessage('');

		try {
			await registerUser({
				firstName: normalizedFirstName,
				lastName: normalizedLastName,
				email: normalizedEmail,
				password: normalizedPassword,
				role: normalizedRole,
			});

			router.replace(redirectPath);
			router.refresh();
		} catch (error) {
			setErrorMessage(getRegistrationErrorMessage(error));
		} finally {
			setIsSubmitting(false);
		}
	}

	const loginHref =
		redirectPath !== '/'
			? `/login?next=${encodeURIComponent(redirectPath)}`
			: '/login';

	return (
		<section className={styles.section} aria-labelledby="sign-in-title">
			<div className={styles.panel}>
				<header className={styles.intro}>
					<h1 id="sign-in-title" className={styles.title}>
						Rejoignez la communauté Kasa
					</h1>

					<p className={styles.description}>
						Créez votre compte et commencez à voyager autrement :
						réservez des logements uniques, découvrez de nouvelles
						destinations et partagez vos propres lieux avec
						d&apos;autres voyageurs.
					</p>
				</header>

				<form
					className={styles.form}
					onSubmit={handleSubmit}
					noValidate
				>
					<div className={styles.field}>
						<label htmlFor="lastName" className={styles.label}>
							Nom
						</label>

						<input
							id="lastName"
							name="lastName"
							type="text"
							autoComplete="family-name"
							className={styles.input}
							value={lastName}
							onChange={(event) =>
								setLastName(event.target.value)
							}
							aria-invalid={errorMessage !== ''}
						/>
					</div>

					<div className={styles.field}>
						<label htmlFor="firstName" className={styles.label}>
							Prénom
						</label>

						<input
							id="firstName"
							name="firstName"
							type="text"
							autoComplete="given-name"
							className={styles.input}
							value={firstName}
							onChange={(event) =>
								setFirstName(event.target.value)
							}
							aria-invalid={errorMessage !== ''}
						/>
					</div>

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
									? 'email-warning'
									: undefined
							}
						/>

						{emailWarningMessage !== '' ? (
							<p
								id="email-warning"
								className={styles.emailWarning}
								role="status"
							>
								{emailWarningMessage}
							</p>
						) : null}
					</div>

					<div className={styles.field}>
						<label htmlFor="password" className={styles.label}>
							Mot de passe
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
								aria-describedby="password-requirements"
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
							id="password-requirements"
							className={styles.passwordHint}
						>
							Le mot de passe doit contenir au moins
							<strong> 8 caractères</strong>, avec au moins
							<strong> une minuscule</strong>,
							<strong> une majuscule</strong>,
							<strong> un chiffre</strong> et
							<strong> un caractère spécial</strong>.
						</p>
					</div>

					<fieldset className={styles.roleFieldset}>
						<legend className={styles.roleLegend}>
							Quel type de compte souhaitez-vous créer ?
						</legend>

						<div className={styles.roleCard}>
							<div className={styles.roleOptions}>
								<label className={styles.roleOption}>
									<input
										type="radio"
										name="role"
										value="client"
										checked={role === 'client'}
										onChange={(event) =>
											setRole(event.target.value)
										}
										className={styles.roleRadio}
									/>

									<div className={styles.roleOptionContent}>
										<span
											className={styles.roleOptionTitle}
										>
											Vous êtes locataire / client
										</span>
										<span className={styles.roleOptionText}>
											Vous cherchez un logement et
											souhaitez réserver des séjours.
										</span>
									</div>
								</label>

								<label className={styles.roleOption}>
									<input
										type="radio"
										name="role"
										value="owner"
										checked={role === 'owner'}
										onChange={(event) =>
											setRole(event.target.value)
										}
										className={styles.roleRadio}
									/>

									<div className={styles.roleOptionContent}>
										<span
											className={styles.roleOptionTitle}
										>
											Vous êtes propriétaire
										</span>
										<span className={styles.roleOptionText}>
											Vous souhaitez publier et gérer des
											logements.
										</span>
									</div>
								</label>
							</div>
						</div>
					</fieldset>

					<div
						className={styles.dataNotice}
						role="note"
						aria-label="Information sur l'utilisation de vos données"
					>
						<div className={styles.dataNoticeHeader}>
							<ShieldCheck
								className={styles.dataNoticeIcon}
								aria-hidden="true"
							/>
							<span className={styles.dataNoticeTitle}>
								Information sur vos données
							</span>
						</div>

						<p className={styles.dataNoticeText}>
							Les données recueillies sur ce formulaire sont
							utilisées pour créer et gérer votre compte Kasa. Les
							champs obligatoires sont nécessaires à
							l&apos;inscription. Vous pouvez demander
							l&apos;accès, la rectification ou la suppression de
							vos données conformément à la réglementation
							applicable.
						</p>
					</div>

					<div className={styles.checkboxRow}>
						<input
							id="terms"
							name="terms"
							type="checkbox"
							className={styles.checkbox}
							checked={hasAcceptedTerms}
							onChange={(event) =>
								setHasAcceptedTerms(event.target.checked)
							}
						/>

						<label htmlFor="terms" className={styles.checkboxLabel}>
							J&apos;accepte les conditions générales
							d&apos;utilisation
						</label>
					</div>

					{errorMessage !== '' ? (
						<p role="alert" className={styles.errorMessage}>
							{errorMessage}
						</p>
					) : null}

					<div className={styles.actions}>
						<button
							type="submit"
							className={styles.submitButton}
							disabled={isSubmitting}
						>
							{isSubmitting ? 'Inscription...' : "S'inscrire"}
						</button>

						<Link href={loginHref} className={styles.textLink}>
							Déjà membre ? Se connecter
						</Link>
					</div>
				</form>
			</div>
		</section>
	);
}
