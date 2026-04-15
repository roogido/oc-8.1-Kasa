/**
 * @file src/components/layout/AppHeader/AppHeader.js
 * @description
 * En-tête global de l'application Kasa.
 */

'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
	CircleUserRound,
	Heart,
	LogIn,
	LogOut,
	Menu,
	MessageSquare,
	UserPlus,
} from 'lucide-react';

import Logo from '@/components/ui/Logo/Logo';
import MobileMenu from '@/components/layout/MobileMenu/MobileMenu';
import MessagesDesktopModal from '@/components/messages/MessagesDesktopModal/MessagesDesktopModal';
import { logoutUser } from '@/services/authService';
import {
	buildLoginMessagesHref,
	removeOpenMessagesParam,
} from '@/lib/messagesNavigation';
import { normalizeBackendImageUrl } from '@/lib/imageUrl';

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
 * @param {boolean} [props.isAuthenticated=false]
 * @param {Object|null} [props.currentUser=null]
 * @returns {JSX.Element}
 */
export default function AppHeader({
	isAuthenticated = false,
	currentUser = null,
}) {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const router = useRouter();

	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isMessagesModalOpen, setIsMessagesModalOpen] = useState(() => {
		if (typeof window === 'undefined') {
			return false;
		}

		return (
			isAuthenticated &&
			searchParams.get('openMessages') === '1' &&
			window.innerWidth >= 768
		);
	});

	const [isLoggingOut, setIsLoggingOut] = useState(false);

	const searchParamsString = searchParams.toString();
	const shouldOpenMessages = searchParams.get('openMessages') === '1';

	const currentUserRole =
		typeof currentUser?.role === 'string' ? currentUser.role.trim() : '';

	const canManageProperties =
		currentUserRole === 'owner' || currentUserRole === 'admin';

	const currentUserName =
		typeof currentUser?.name === 'string' && currentUser.name.trim() !== ''
			? currentUser.name.trim()
			: 'Mon profil';

	const currentUserPicture =
		typeof currentUser?.picture === 'string' &&
		currentUser.picture.trim() !== ''
			? normalizeBackendImageUrl(currentUser.picture, '')
			: '';

	const loginMessagesHref = useMemo(() => {
		return buildLoginMessagesHref(pathname, searchParamsString);
	}, [pathname, searchParamsString]);

	const cleanedCurrentPath = useMemo(() => {
		return removeOpenMessagesParam(pathname, searchParamsString);
	}, [pathname, searchParamsString]);

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

	useEffect(() => {
		if (!isAuthenticated || !shouldOpenMessages) {
			return;
		}

		if (window.innerWidth >= 768) {
			router.replace(cleanedCurrentPath, { scroll: false });
			return;
		}

		router.replace('/messages');
	}, [cleanedCurrentPath, isAuthenticated, router, shouldOpenMessages]);

	async function handleLogout() {
		if (isLoggingOut) {
			return;
		}

		setIsLoggingOut(true);

		try {
			await logoutUser();
			setIsMobileMenuOpen(false);
			setIsMessagesModalOpen(false);
			router.push('/');
			router.refresh();
		} catch {
			setIsLoggingOut(false);
		}
	}

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
							{canManageProperties ? (
								<Link
									href="/add-property"
									className={styles.addPropertyLink}
								>
									+Ajouter un logement
								</Link>
							) : null}

							<div
								className={styles.userActions}
								aria-label="Actions utilisateur"
							>
								<div className={styles.iconGroup}>
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

									{isAuthenticated ? (
										<button
											type="button"
											className={styles.iconButton}
											aria-label="Messagerie"
											aria-expanded={isMessagesModalOpen}
											aria-haspopup="dialog"
											onClick={() =>
												setIsMessagesModalOpen(true)
											}
										>
											<MessageSquare
												size={16}
												strokeWidth={1.75}
											/>
										</button>
									) : (
										<Link
											href={loginMessagesHref}
											className={styles.iconButton}
											aria-label="Se connecter pour accéder à la messagerie"
										>
											<MessageSquare
												size={16}
												strokeWidth={1.75}
											/>
										</Link>
									)}
								</div>

								<span
									className={styles.separator}
									aria-hidden="true"
								/>

								<div className={styles.iconGroup}>
									{isAuthenticated ? (
										<>
											<Link
												href="/profile"
												className={styles.iconButton}
												aria-label={`Profil de ${currentUserName}`}
												title={currentUserName}
											>
												{currentUserPicture !== '' ? (
													<Image
														src={currentUserPicture}
														alt={`Photo de profil de ${currentUserName}`}
														width={16}
														height={16}
														className={styles.profileAvatar}
													/>
												) : (
													<CircleUserRound
														size={16}
														strokeWidth={1.75}
													/>
												)}
											</Link>

											<span
												className={styles.separator}
												aria-hidden="true"
											/>

											<button
												type="button"
												className={styles.iconButton}
												aria-label="Se déconnecter"
												onClick={handleLogout}
												disabled={isLoggingOut}
											>
												<LogOut
													size={16}
													strokeWidth={1.75}
												/>
											</button>
										</>
									) : (
										<>
											<Link
												href="/login"
												className={styles.iconButton}
												aria-label="Se connecter"
											>
												<LogIn
													size={16}
													strokeWidth={1.75}
												/>
											</Link>

											<span
												className={styles.separator}
												aria-hidden="true"
											/>

											<Link
												href="/sign-in"
												className={styles.iconButton}
												aria-label="S'inscrire"
											>
												<UserPlus
													size={16}
													strokeWidth={1.75}
												/>
											</Link>
										</>
									)}
								</div>
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
						isAuthenticated={isAuthenticated}
						isLoggingOut={isLoggingOut}
						currentUser={currentUser}
						canManageProperties={canManageProperties}
						onClose={() => setIsMobileMenuOpen(false)}
						onLogout={handleLogout}
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
