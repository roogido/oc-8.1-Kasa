/**
 * @file src/components/layout/MobileMenu/MobileMenu.js
 * @description
 * Menu mobile de l'application Kasa.
 */

import Link from 'next/link';
import { X } from 'lucide-react';

import Logo from '@/components/ui/Logo/Logo';
import Button from '@/components/ui/Button/Button';

import styles from './MobileMenu.module.css';

/**
 * Retourne la classe d'état d'un lien de navigation.
 *
 * @param {string} href
 * @param {string} currentPath
 * @returns {string}
 */
function getNavLinkStateClass(href, currentPath) {
	return href === currentPath ? styles.navLinkActive : '';
}

/**
 * Menu mobile Kasa.
 *
 * @param {Object} props
 * @param {string} [props.currentPath='/']
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @returns {JSX.Element|null}
 */
export default function MobileMenu({
	currentPath = '/',
	isOpen,
	onClose,
}) {
	if (!isOpen) {
		return null;
	}

	return (
		<div
			id="mobile-menu-panel"
			className={styles.panel}
			role="dialog"
			aria-modal="false"
			aria-label="Menu mobile"
		>
			<div className={styles.topBar}>
				<div className={styles.logoWrapper}>
					<Logo variant="header" isMobile priority />
				</div>

				<button
					type="button"
					className={styles.closeButton}
					aria-label="Fermer le menu"
					onClick={onClose}
				>
					<X size={20} strokeWidth={2.2} />
				</button>
			</div>

			<nav className={styles.nav} aria-label="Navigation mobile">
				<ul className={styles.navList}>
					<li>
						<Link
							href="/"
							className={`${styles.navLink} ${getNavLinkStateClass('/', currentPath)}`.trim()}
							onClick={onClose}
						>
							Accueil
						</Link>
					</li>

					<li>
						<Link
							href="/about"
							className={`${styles.navLink} ${getNavLinkStateClass('/about', currentPath)}`.trim()}
							onClick={onClose}
						>
							À propos
						</Link>
					</li>

					<li>
						<Link
							href="/messages"
							className={styles.navLink}
							onClick={onClose}
						>
							Messagerie
						</Link>
					</li>

					<li>
						<Link
							href="/favorites"
							className={styles.navLink}
							onClick={onClose}
						>
							Favoris
						</Link>
					</li>
				</ul>
			</nav>

			<div className={styles.ctaWrapper}>
				<Button href="/add-property" variant="primary" size="md">
					Ajouter un logement
				</Button>
			</div>
		</div>
	);
}
