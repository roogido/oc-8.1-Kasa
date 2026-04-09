/**
 * @file src/components/disclosure/Collapse/Collapse.js
 * @description
 * Bloc repliable accessible pour la fiche logement.
 */

'use client';

import { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';

import styles from './Collapse.module.css';

/**
 * Bloc repliable.
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {React.ReactNode} props.children
 * @param {boolean} [props.defaultOpen=false]
 * @returns {JSX.Element}
 */
export default function Collapse({
	title,
	children,
	defaultOpen = false,
}) {
	const [isOpen, setIsOpen] = useState(defaultOpen);
	const contentId = useId();

	function handleToggle() {
		setIsOpen((previousState) => !previousState);
	}

	return (
		<section className={styles.collapse}>
			<button
				type="button"
				className={styles.trigger}
				aria-expanded={isOpen}
				aria-controls={contentId}
				onClick={handleToggle}
			>
				<span className={styles.title}>{title}</span>

				<ChevronDown
					className={`${styles.icon} ${
						isOpen ? styles.iconOpen : ''
					}`}
					aria-hidden="true"
					strokeWidth={1.8}
				/>
			</button>

			<div
				id={contentId}
				className={`${styles.contentWrapper} ${
					isOpen ? styles.contentWrapperOpen : ''
				}`}
			>
				<div className={styles.content}>{children}</div>
			</div>
		</section>
	);
}
