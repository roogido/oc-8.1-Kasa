/**
 * @file src/app/login/page.js
 * @description
 * Page de connexion Kasa.
 */

'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { loginUser } from '@/services/authService';

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
 * Page de connexion.
 *
 * @returns {JSX.Element}
 */
export default function LoginPage() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const redirectPath = useMemo(() => {
		return getSafeNextPath(searchParams.get('next'));
	}, [searchParams]);

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	async function handleSubmit(event) {
		event.preventDefault();

		const normalizedEmail = email.trim().toLowerCase();
		const normalizedPassword = password;

		if (normalizedEmail === '' || normalizedPassword.trim() === '') {
			setErrorMessage('Adresse email et mot de passe requis.');
			return;
		}

		setIsSubmitting(true);
		setErrorMessage('');

		try {
			await loginUser({
				email: normalizedEmail,
				password: normalizedPassword,
			});

			router.replace(redirectPath);
			router.refresh();
		} catch (error) {
			setErrorMessage(
				error instanceof Error
					? error.message
					: 'Impossible de se connecter.',
			);
		} finally {
			setIsSubmitting(false);
		}
	}

	const signInHref =
		redirectPath !== '/'
			? `/sign-in?next=${encodeURIComponent(redirectPath)}`
			: '/sign-in';

	return (
		<section className={styles.section} aria-labelledby="login-title">
			<div className={styles.panel}>
				<header className={styles.intro}>
					<h1 id="login-title" className={styles.title}>
						Heureux de vous revoir
					</h1>

					<p className={styles.description}>
						Connectez-vous pour retrouver vos réservations, vos
						annonces et tout ce qui rend vos séjours uniques.
					</p>
				</header>

				<form className={styles.form} onSubmit={handleSubmit} noValidate>
					<div className={styles.field}>
						<label htmlFor="email" className={styles.label}>
							Adresse email
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
							autoComplete="current-password"
							className={styles.input}
							value={password}
							onChange={(event) => setPassword(event.target.value)}
							aria-invalid={errorMessage !== ''}
						/>
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
							{isSubmitting ? 'Connexion...' : 'Se connecter'}
						</button>

						<div className={styles.links}>
							<Link href="/" className={styles.textLink}>
								Mot de passe oublié
							</Link>

							<Link href={signInHref} className={styles.textLink}>
								Pas encore de compte ? Inscrivez-vous
							</Link>
						</div>
					</div>
				</form>
			</div>
		</section>
	);
}
