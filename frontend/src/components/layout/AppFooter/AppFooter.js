/**
 * @file src/components/layout/AppFooter/AppFooter.js
 * @description
 * Pied de page global de l'application Kasa.
 */

import Logo from '@/components/ui/Logo/Logo';

import styles from './AppFooter.module.css';

/**
 * Footer global Kasa.
 *
 * @returns {JSX.Element}
 */
export default function AppFooter() {
	return (
		<footer className={styles.footer}>
			<div className={styles.inner}>
				<div className={styles.logoWrapper}>
					<Logo variant="footer" />
				</div>

				<p className={styles.text}>© 2026 Kasa. All rights reserved</p>
			</div>
		</footer>
	);
}
