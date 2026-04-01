/**
 * @file src/app/login/page.js
 * @description
 * Page de connexion Kasa.
 */

import Link from 'next/link';

import AppFooter from '@/components/layout/AppFooter/AppFooter';
import AppHeader from '@/components/layout/AppHeader/AppHeader';

import styles from './page.module.css';

/**
 * Page de connexion.
 *
 * @returns {JSX.Element}
 */
export default function LoginPage() {
	return (
		<div className="page-shell">
			<AppHeader currentPath="" />

			<main className="page-main">
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

						<form className={styles.form} action="#" method="post">
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
								/>
							</div>
						</form>

						<div className={styles.actions}>
							<button type="button" className={styles.submitButton}>
								Se connecter
							</button>

							<div className={styles.links}>
								<Link href="/" className={styles.textLink}>
									Mot de passe oublié
								</Link>

								<Link href="/" className={styles.textLink}>
									Pas encore de compte ? Inscrivez-vous
								</Link>
							</div>
						</div>
					</div>
				</section>
			</main>

			<AppFooter />
		</div>
	);
}
