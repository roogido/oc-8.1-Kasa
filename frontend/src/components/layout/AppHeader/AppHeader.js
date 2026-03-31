/**
 * @file src/components/layout/AppHeader/AppHeader.js
 * @description
 * En-tête global de l'application Kasa.
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, Menu, MessageSquare } from 'lucide-react';

import Logo from '@/components/ui/Logo/Logo';
import MobileMenu from '@/components/layout/MobileMenu/MobileMenu';

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
 * @param {Object} props
 * @param {string} [props.currentPath='/']
 * @returns {JSX.Element}
 */
export default function AppHeader({ currentPath = '/' }) {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	useEffect(() => {
		if (!isMobileMenuOpen) {
			return undefined;
		}

		function handleEscape(event) {
			if (event.key === 'Escape') {
				setIsMobileMenuOpen(false);
			}
		}

		window.addEventListener('keydown', handleEscape);

		return () => {
			window.removeEventListener('keydown', handleEscape);
		};
	}, [isMobileMenuOpen]);

    /**
     * Ferme automatiquement le menu mobile quand on repasse en desktop.
     */
    useEffect(() => {
        function handleResize() {
            if (window.innerWidth > 767) {
                setIsMobileMenuOpen(false);
            }
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

	return (
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
							className={`${styles.navLink} ${getNavLinkStateClass('/', currentPath)}`.trim()}
						>
							Accueil
						</Link>

						<Link
							href="/about"
							className={`${styles.navLink} ${getNavLinkStateClass('/about', currentPath)}`.trim()}
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
						<Link href="/properties/new" className={styles.addPropertyLink}>
							+Ajouter un logement
						</Link>

						<div className={styles.iconGroup} aria-label="Actions utilisateur">
							<button
								type="button"
								className={styles.iconButton}
								aria-label="Favoris"
							>
								<Heart size={16} strokeWidth={1.75} />
							</button>

							<span className={styles.separator} aria-hidden="true" />

							<button
								type="button"
								className={styles.iconButton}
								aria-label="Messagerie"
							>
								<MessageSquare size={16} strokeWidth={1.75} />
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
					currentPath={currentPath}
					isOpen={isMobileMenuOpen}
					onClose={() => setIsMobileMenuOpen(false)}
				/>
			</div>
		</header>
	);
}
