/**
 * @file src/components/ui/TextBlock/TextBlock.js
 * @description
 * Composant texte réutilisable pour les contenus Kasa.
 */

import styles from './TextBlock.module.css';

/**
 * Bloc de texte réutilisable.
 *
 * @param {Object} props
 * @param {string} [props.as='p']
 * @param {'default'|'muted'|'strong'} [props.tone='default']
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {'left'|'center'|'right'} [props.align='left']
 * @param {string} [props.className='']
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 */
export default function TextBlock({
	as = 'p',
	tone = 'default',
	size = 'md',
	align = 'left',
	className = '',
	children,
}) {
	const Tag = as || 'p';

	return (
		<Tag
			className={[
				styles.text,
				styles[`text--${tone}`],
				styles[`text--${size}`],
				styles[`text--${align}`],
				className,
			]
				.filter(Boolean)
				.join(' ')}
		>
			{children}
		</Tag>
	);
}
