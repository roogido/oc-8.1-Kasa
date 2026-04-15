/**
 * @file src/components/layout/MobileMenu/MobileMenu.js
 * @description
 * Menu mobile de l'application Kasa.
 */

import Link from 'next/link';
import {
	CircleUserRound,
	LogIn,
	LogOut,
	UserPlus,
	X,
} from 'lucide-react';

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
 * @param {boolean} [props.isAuthenticated=false]
 * @param {boolean} [props.isLoggingOut=false]
 * @param {Object|null} [props.currentUser=null]
 * @param {boolean} [props.canManageProperties=false]
 * @param {Function} props.onClose
 * @param {Function} props.onLogout
 * @returns {JSX.Element|null}
 */
export default function MobileMenu({
	currentPath = '/',
	isOpen,
	isAuthenticated = false,
	isLoggingOut = false,
	currentUser = null,
	canManageProperties = false,
	onClose,
	onLogout,
}) {
	if (!isOpen) {
		return null;
	}

	const messagingHref = isAuthenticated
		? '/messages'
		: '/login?next=/messages';

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
							href={messagingHref}
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

					{isAuthenticated ? (
						<li>
							<Link
								href="/profile"
								className={styles.navLink}
								onClick={onClose}
							>
								Profil
							</Link>
						</li>
					) : null}
				</ul>
			</nav>

			<div className={styles.authSection}>
				{isAuthenticated ? (
					<button
						type="button"
						className={styles.authButton}
						onClick={onLogout}
						disabled={isLoggingOut}
					>
						<LogOut size={16} strokeWidth={1.75} />
						<span>
							{isLoggingOut ? 'Déconnexion...' : 'Se déconnecter'}
						</span>
					</button>
				) : (
					<>
						<Link
							href="/login"
							className={styles.authLink}
							onClick={onClose}
						>
							<LogIn size={16} strokeWidth={1.75} />
							<span>Se connecter</span>
						</Link>

						<Link
							href="/sign-in"
							className={styles.authLink}
							onClick={onClose}
						>
							<UserPlus size={16} strokeWidth={1.75} />
							<span>{"S'inscrire"}</span>
						</Link>
					</>
				)}
			</div>

			{isAuthenticated ? (
				<div className={styles.authSection}>
					<div className={styles.authLink}>
						<CircleUserRound size={16} strokeWidth={1.75} />
						<span>
							{typeof currentUser?.name === 'string' &&
							currentUser.name.trim() !== ''
								? currentUser.name.trim()
								: 'Utilisateur connecté'}
						</span>
					</div>
				</div>
			) : null}

			{canManageProperties ? (
				<div className={styles.ctaWrapper}>
					<Button href="/add-property" variant="primary" size="md">
						Ajouter un logement
					</Button>
				</div>
			) : null}
		</div>
	);
}
