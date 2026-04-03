/**
 * @file src/components/ui/PageHeading/PageHeading.js
 * @description
 * Titre réutilisable pour les pages et sections Kasa.
 */

import styles from './PageHeading.module.css';

/**
 * Titre réutilisable.
 *
 * @param {Object} props
 * @param {string} [props.as='h1']
 * @param {'page'|'section'|'hero'|'error'} [props.size='page']
 * @param {'left'|'center'|'right'} [props.align='left']
 * @param {string} [props.className='']
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 */
export default function PageHeading({
	as = 'h1',
	size = 'page',
	align = 'left',
	className = '',
	children,
}) {
	const Tag = as || 'h1';

	return (
		<Tag
			className={[
				styles.heading,
				styles[`heading--${size}`],
				styles[`heading--${align}`],
				className,
			]
				.filter(Boolean)
				.join(' ')}
		>
			{children}
		</Tag>
	);
}
