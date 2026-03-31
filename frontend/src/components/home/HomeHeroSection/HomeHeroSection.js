/**
 * @file src/components/home/HomeHeroSection/HomeHeroSection.js
 * @description
 * Section hero de la page d'accueil.
 */

import Image from 'next/image';

import styles from './HomeHeroSection.module.css';

/**
 * Section hero de la page d'accueil.
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {string} props.subtitle
 * @param {string} props.image
 * @param {string} props.imageAlt
 * @returns {JSX.Element}
 */
export default function HomeHeroSection({
	title,
	subtitle,
	image,
	imageAlt,
}) {
	return (
		<section className={styles.section} aria-labelledby="home-hero-title">
			<div className={styles.textBlock}>
				<h1 id="home-hero-title" className={styles.title}>
					{title}
				</h1>

				<p className={styles.subtitle}>{subtitle}</p>
			</div>

			<div className={styles.heroMedia}>
				<Image
					src={image}
					alt={imageAlt}
					fill
					priority
					sizes="(max-width: 767px) 100vw, 1115px"
					className={styles.heroImage}
				/>
			</div>
		</section>
	);
}
