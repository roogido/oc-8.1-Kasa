/**
 * @file src/app/properties/[propertyId]/loading.js
 * @description
 * Etat de chargement de la page détail logement.
 */

import styles from './loading.module.css';

export default function Loading() {
	return (
		<div className={styles.content} aria-hidden="true">
			<div className={styles.backRow}>
				<div className={styles.backSkeleton} />
			</div>

			<div className={styles.topRow}>
				<div className={styles.gallerySkeleton} />
				<div className={styles.hostSkeleton} />
			</div>

			<div className={styles.infoRow}>
				<div className={styles.infoSkeleton} />
			</div>
		</div>
	);
}
