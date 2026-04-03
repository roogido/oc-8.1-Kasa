/**
 * @file src/components/layout/AppHeader/AppHeader.js
 * @description
 * En-tête global de l'application Kasa.
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Menu, MessageSquare } from 'lucide-react';

import Logo from '@/components/ui/Logo/Logo';
import MobileMenu from '@/components/layout/MobileMenu/MobileMenu';
import MessagesDesktopModal from '@/components/messages/MessagesDesktopModal/MessagesDesktopModal';

import styles from './AppHeader.module.css';

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
 * Header global Kasa.
 *
 * @returns {JSX.Element}
 */
export default function AppHeader() {
	const pathname = usePathname();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isMessagesModalOpen, setIsMessagesModalOpen] = useState(false);

	useEffect(() => {
		function handleEscape(event) {
			if (event.key === 'Escape') {
				setIsMobileMenuOpen(false);
				setIsMessagesModalOpen(false);
			}
		}

		window.addEventListener('keydown', handleEscape);

		return () => {
			window.removeEventListener('keydown', handleEscape);
		};
	}, []);

	useEffect(() => {
		function handleResize() {
			if (window.innerWidth > 767) {
				setIsMobileMenuOpen(false);
				return;
			}

			setIsMessagesModalOpen(false);
		}

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return (
		<>
			<header className={styles.header}>
				<div className={styles.headerContainer}>
					<div
						className={`${styles.menuSurface} ${
							isMobileMenuOpen ? styles.menuSurfaceHidden : ''
						}`.trim()}
					>
						<div className={styles.leftGroup}>
							<Link
								href="/"
								className={`${styles.navLink} ${getNavLinkStateClass('/', pathname)}`.trim()}
							>
								Accueil
							</Link>

							<Link
								href="/about"
								className={`${styles.navLink} ${getNavLinkStateClass('/about', pathname)}`.trim()}
							>
								À propos
							</Link>
						</div>

						<div className={styles.logoDesktop}>
							<Logo variant="header" priority />
						</div>

						<div className={styles.logoMobile}>
							<Logo variant="header" isMobile priority />
						</div>

						<div className={styles.rightGroup}>
							<Link
								href="/add-property"
								className={styles.addPropertyLink}
							>
								+Ajouter un logement
							</Link>

							<div
								className={styles.iconGroup}
								aria-label="Actions utilisateur"
							>
								<Link
									href="/favorites"
									className={styles.iconButton}
									aria-label="Favoris"
								>
									<Heart size={16} strokeWidth={1.75} />
								</Link>

								<span
									className={styles.separator}
									aria-hidden="true"
								/>

								<button
									type="button"
									className={styles.iconButton}
									aria-label="Messagerie"
									aria-expanded={isMessagesModalOpen}
									aria-haspopup="dialog"
									onClick={() => setIsMessagesModalOpen(true)}
								>
									<MessageSquare
										size={16}
										strokeWidth={1.75}
									/>
								</button>
							</div>
						</div>

						{!isMobileMenuOpen && (
							<button
								type="button"
								className={styles.mobileMenuButton}
								aria-label="Ouvrir le menu"
								aria-expanded={isMobileMenuOpen}
								aria-controls="mobile-menu-panel"
								onClick={() => setIsMobileMenuOpen(true)}
							>
								<Menu size={20} strokeWidth={2.2} />
							</button>
						)}
					</div>

					<MobileMenu
						currentPath={pathname}
						isOpen={isMobileMenuOpen}
						onClose={() => setIsMobileMenuOpen(false)}
					/>
				</div>
			</header>

			{isMessagesModalOpen ? (
				<MessagesDesktopModal
					onClose={() => setIsMessagesModalOpen(false)}
				/>
			) : null}
		</>
	);
}
