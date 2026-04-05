/**
 * @file src/app/loading.js
 * @description
 * Etat de chargement global de la page d'accueil.
 */

import styles from './loading.module.css';

export default function Loading() {
	return (
		<div className={styles.content} aria-hidden="true">
			<section className={styles.heroSkeleton} />

			<section className={styles.section}>
				<div className={styles.grid}>
					{Array.from({ length: 6 }).map((_, index) => (
						<div key={`home-skeleton-1-${index}`} className={styles.cardSkeleton} />
					))}
				</div>
			</section>

			<section className={styles.section}>
				<div className={styles.grid}>
					{Array.from({ length: 6 }).map((_, index) => (
						<div key={`home-skeleton-2-${index}`} className={styles.cardSkeleton} />
					))}
				</div>
			</section>
		</div>
	);
}
