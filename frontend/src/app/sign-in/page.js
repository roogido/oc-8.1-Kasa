/**
 * @file src/app/sign-in/page.js
 * @description
 * Page d'inscription Kasa.
 */

'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { registerUser } from '@/services/authService';

import styles from './page.module.css';

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
	const [role, setRole] = useState('client');
	const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

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

		if (!hasAcceptedTerms) {
			setErrorMessage(
				"Vous devez accepter les conditions générales d'utilisation.",
			);
			return;
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
			setErrorMessage(
				error instanceof Error
					? error.message
					: 'Impossible de créer le compte.',
			);
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
							onChange={(event) => setEmail(event.target.value)}
							aria-invalid={errorMessage !== ''}
						/>
					</div>

					<div className={styles.field}>
						<label htmlFor="password" className={styles.label}>
							Mot de passe
						</label>

						<input
							id="password"
							name="password"
							type="password"
							autoComplete="new-password"
							className={styles.input}
							value={password}
							onChange={(event) =>
								setPassword(event.target.value)
							}
							aria-invalid={errorMessage !== ''}
						/>
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
										<span className={styles.roleOptionTitle}>
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
										<span className={styles.roleOptionTitle}>
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
