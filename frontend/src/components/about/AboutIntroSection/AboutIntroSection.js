/**
 * @file src/components/about/AboutIntroSection/AboutIntroSection.js
 * @description
 * Bloc d'introduction de la page À propos.
 */

import Image from 'next/image';

import styles from './AboutIntroSection.module.css';

/**
 * Bloc intro + image hero.
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {string[]} props.introParagraphsDesktop
 * @param {string[]} props.introParagraphsMobile
 * @param {Object} props.heroImage
 * @returns {JSX.Element}
 */
export default function AboutIntroSection({
	title,
	introParagraphsDesktop,
	introParagraphsMobile,
	heroImage,
}) {
	return (
		<section className={styles.section} aria-labelledby="about-title">
			<div className={styles.textBlock}>
				<h1 id="about-title" className={styles.title}>
					{title}
				</h1>

				<div className={styles.desktopParagraphs}>
					{introParagraphsDesktop.map((paragraph) => (
						<p key={paragraph} className={styles.paragraph}>
							{paragraph}
						</p>
					))}
				</div>

				<div className={styles.mobileParagraphs}>
					{introParagraphsMobile.map((paragraph) => (
						<p key={paragraph} className={styles.paragraph}>
							{paragraph}
						</p>
					))}
				</div>
			</div>

			<div className={styles.heroMedia}>
				<Image
					src={heroImage.src}
					alt={heroImage.alt}
					fill
					priority
					sizes="(max-width: 767px) 342px, 1115px"
					className={styles.heroImage}
				/>
			</div>
		</section>
	);
}
