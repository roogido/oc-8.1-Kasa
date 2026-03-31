/**
 * @file src/components/ui/Logo/Logo.js
 * @description
 * Affiche le logo Kasa selon le contexte et le viewport.
 */

import Image from 'next/image';
import Link from 'next/link';

import logoFooter from '@/assets/images/shared/logo-footer.png';
import logoHeaderDesktop from '@/assets/images/shared/logo-header-desktop.png';
import logoHeaderMobile from '@/assets/images/shared/logo-header-mobile.png';

import styles from './Logo.module.css';

/**
 * Retourne l'image a utiliser selon la variante et le viewport.
 *
 * @param {string} variant
 * @param {boolean} isMobile
 * @returns {StaticImageData}
 */
function getLogoSource(variant, isMobile) {
	if (variant === 'footer') {
		return logoFooter;
	}

	return isMobile ? logoHeaderMobile : logoHeaderDesktop;
}

/**
 * Logo reutilisable Kasa.
 *
 * @param {Object} props
 * @param {'header'|'footer'} [props.variant='header']
 * @param {boolean} [props.isMobile=false]
 * @param {boolean} [props.priority=false]
 * @param {string} [props.href='/']
 * @param {string} [props.className='']
 * @returns {JSX.Element}
 */
export default function Logo({
	variant = 'header',
	isMobile = false,
	priority = false,
	href = '/',
	className = '',
}) {
	const src = getLogoSource(variant, isMobile);
	const alt = 'Kasa';

	return (
		<Link
			href={href}
			className={`${styles.logoLink} ${className}`.trim()}
			aria-label="Retour a l'accueil"
		>
			<Image
				src={src}
				alt={alt}
				priority={priority}
				className={styles.logoImage}
			/>
		</Link>
	);
}
