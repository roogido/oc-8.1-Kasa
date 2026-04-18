/**
 * @file src/app/global-error.js
 * @description
 * Page de repli globale pour les erreurs critiques de l'application.
 *
 * Ce composant prend le relais lorsque l'erreur se produit à un niveau
 * plus global que error.js, notamment dans le layout racine ou dans
 * l'enveloppe structurelle principale de l'application.
 *
 * Il doit définir explicitement les balises <html> et <body>, car il
 * remplace entièrement le rendu normal de l'application lorsque ce type
 * d'erreur survient.
 *
 * Cette implémentation reprend volontairement le même habillage que
 * la page 404 et que error.js, afin de conserver :
 *      - une identité visuelle homogène ;
 *      - des actions simples ;
 *      - des redirections sûres ;
 *      - une expérience utilisateur cohérente même en cas d'échec critique.
 */

'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Inter } from 'next/font/google';

import './globals.css';
import styles from './not-found.module.css';

const inter = Inter({
	subsets: ['latin'],
	weight: ['100', '200', '300', '400', '500', '600', '700', '900'],
	display: 'swap',
});

/**
 * Fallback d'erreur global.
 *
 * @param {Object} props
 * @param {Error & { digest?: string }} props.error
 * @returns {JSX.Element}
 */
export default function GlobalError({ error }) {
	useEffect(() => {
		console.error('Erreur critique capturée par global-error.js :', error);
	}, [error]);

	return (
		<html lang="fr" data-scroll-behavior="smooth">
			<body className={inter.className}>
				<div className="site-shell">
					<main className="site-main">
						<div className={styles.main}>
							<section
								className={styles.section}
								aria-labelledby="global-error-title"
							>
								<div className={styles.content}>
									<div className={styles.textBlock}>
										<h1
											id="global-error-title"
											className={styles.code}
										>
											500
										</h1>

										<p className={styles.message}>
											{
												"Une erreur critique est survenue. L'application n'a pas pu être chargée correctement."
											}
										</p>
									</div>

									<div className={styles.actions}>
										<Link
											href="/"
											className={styles.actionButton}
										>
											Accueil
										</Link>

										<Link
											href="/about"
											className={styles.actionButton}
										>
											À propos
										</Link>
									</div>
								</div>
							</section>
						</div>
					</main>
				</div>
			</body>
		</html>
	);
}
