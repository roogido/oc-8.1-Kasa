/**
 * @file src/app/not-found.js
 * @description
 * Page 404 globale de Kasa.
 */

import Link from 'next/link';

import AppFooter from '@/components/layout/AppFooter/AppFooter';
import AppHeader from '@/components/layout/AppHeader/AppHeader';

import styles from './not-found.module.css';

/**
 * Page 404.
 *
 * @returns {JSX.Element}
 */
export default function NotFound() {
	return (
		<div className="page-shell">
			<AppHeader currentPath="" />

			<main className={`page-main ${styles.main}`}>
				<section
					className={styles.section}
					aria-labelledby="not-found-title"
				>
					<div className={styles.content}>
						<div className={styles.textBlock}>
							<h1 id="not-found-title" className={styles.code}>
								404
							</h1>

							<p className={styles.message}>
								{
									"Il semble que la page que vous cherchez ait pris des vacances... ou n'ait jamais existé."
								}
							</p>
						</div>

						<div className={styles.actions}>
							<Link href="/" className={styles.actionButton}>
								Accueil
							</Link>

							<Link href="/" className={styles.actionButton}>
								Logements
							</Link>
						</div>
					</div>
				</section>
			</main>

			<AppFooter />
		</div>
	);
}
