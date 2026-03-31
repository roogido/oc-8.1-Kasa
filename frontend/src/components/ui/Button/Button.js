/**
 * @file src/components/ui/Button/Button.js
 * @description
 * Bouton réutilisable de l'application Kasa.
 */

import Link from 'next/link';

import styles from './Button.module.css';

/**
 * Retourne la liste des classes CSS du bouton.
 *
 * @param {Object} options
 * @param {string} options.variant
 * @param {string} options.size
 * @param {boolean} options.fullWidth
 * @returns {string}
 */
function getButtonClassName({ variant, size, fullWidth }) {
	return [
		styles.button,
		styles[`button--${variant}`],
		styles[`button--${size}`],
		fullWidth ? styles['button--fullWidth'] : '',
	]
		.filter(Boolean)
		.join(' ');
}

/**
 * Bouton ou lien réutilisable.
 *
 * @param {Object} props
 * @param {'button'|'submit'|'reset'} [props.type='button']
 * @param {'primary'|'secondary'|'ghost'|'icon'} [props.variant='primary']
 * @param {'sm'|'md'} [props.size='md']
 * @param {boolean} [props.fullWidth=false]
 * @param {boolean} [props.disabled=false]
 * @param {string|null} [props.href=null]
 * @param {Function} [props.onClick]
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 */
export default function Button({
	type = 'button',
	variant = 'primary',
	size = 'md',
	fullWidth = false,
	disabled = false,
	href = null,
	onClick,
	children,
}) {
	const className = getButtonClassName({ variant, size, fullWidth });

	if (href) {
		return (
			<Link href={href} className={className}>
				{children}
			</Link>
		);
	}

	return (
		<button
			type={type}
			className={className}
			disabled={disabled}
			onClick={onClick}
		>
			{children}
		</button>
	);
}
