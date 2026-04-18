/**
 * @file src/app/error.js
 * @description
 * Page de repli locale pour les erreurs internes capturées par l'App Router.
 *
 * Cette boundary s'applique au segment racine de l'application et à ses
 * sous-routes. Elle permet d'afficher une interface utilisateur propre
 * lorsqu'une erreur inattendue survient pendant le rendu ou l'exécution
 * d'un composant situé dans l'arborescence applicative.
 *
 * Cette page conserve volontairement le même style visuel que la 404
 * afin d'offrir une expérience cohérente :
 *      - même structure ;
 *      - même hiérarchie visuelle ;
 *      - mêmes boutons ;
 *      - mêmes redirections.
 *
 * Remarque :
 *      - ce fichier doit être un composant client ;
 *      - il ne remplace pas global-error.js, qui couvre les erreurs plus
 *        globales, notamment celles liées au layout racine.
 */

'use client';

import { useEffect } from 'react';
import Link from 'next/link';

import styles from './not-found.module.css';

/**
 * Fallback d'erreur applicatif.
 *
 * @param {Object} props
 * @param {Error & { digest?: string }} props.error
 * @returns {JSX.Element}
 */
export default function Error({ error }) {
	useEffect(() => {
		console.error('Erreur applicative capturée par error.js :', error);
	}, [error]);

	return (
		<div className={styles.main}>
			<section className={styles.section} aria-labelledby="error-title">
				<div className={styles.content}>
					<div className={styles.textBlock}>
						<h1 id="error-title" className={styles.code}>
							500
						</h1>

						<p className={styles.message}>
							{
								"Une erreur interne est survenue. Nous n'avons pas pu afficher cette page correctement."
							}
						</p>
					</div>

					<div className={styles.actions}>
						<Link href="/" className={styles.actionButton}>
							Accueil
						</Link>

						<Link href="/about" className={styles.actionButton}>
							À propos
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
}
