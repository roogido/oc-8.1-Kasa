/**
 * @file src/app/sign-in/page.js
 * @description
 * Page d'inscription Kasa.
 */

import Link from 'next/link';
import styles from './page.module.css';

/**
 * Page d'inscription.
 *
 * @returns {JSX.Element}
 */
export default function SignInPage() {
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

				<form className={styles.form} action="#" method="post">
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
						/>
					</div>

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
							autoComplete="new-password"
							className={styles.input}
						/>
					</div>

					<div className={styles.checkboxRow}>
						<input
							id="terms"
							name="terms"
							type="checkbox"
							className={styles.checkbox}
						/>

						<label htmlFor="terms" className={styles.checkboxLabel}>
							J&apos;accepte les conditions générales
							d&apos;utilisation
						</label>
					</div>
				</form>

				<div className={styles.actions}>
					<button type="button" className={styles.submitButton}>
						S&apos;inscrire
					</button>

					<Link href="/login" className={styles.textLink}>
						Déjà membre ? Se connecter
					</Link>
				</div>
			</div>
		</section>
	);
}
