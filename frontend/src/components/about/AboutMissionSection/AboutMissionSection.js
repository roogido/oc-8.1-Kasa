/**
 * @file src/components/about/AboutMissionSection/AboutMissionSection.js
 * @description
 * Bloc mission de la page A propos.
 */

import Image from 'next/image';

import styles from './AboutMissionSection.module.css';

/**
 * Bloc mission + image secondaire + accroche.
 *
 * @param {Object} props
 * @param {string} props.missionTitle
 * @param {string[]} props.missionItemsDesktop
 * @param {string[]} props.missionItemsMobile
 * @param {Object} props.missionImage
 * @param {string} props.highlight
 * @returns {JSX.Element}
 */
export default function AboutMissionSection({
	missionTitle,
	missionItemsDesktop,
	missionItemsMobile,
	missionImage,
	highlight,
}) {
	return (
		<section className={styles.section} aria-labelledby="about-mission-title">
			<div className={styles.contentColumn}>
				<h2 id="about-mission-title" className={styles.title}>
					{missionTitle}
				</h2>

				<ol className={styles.desktopList}>
					{missionItemsDesktop.map((item) => (
						<li key={item} className={styles.listItem}>
							{item}
						</li>
					))}
				</ol>

				<div className={styles.mobileTextBlock}>
					{missionItemsMobile.map((item) => (
						<p key={item} className={styles.mobileParagraph}>
							{item}
						</p>
					))}
				</div>

				<p className={styles.highlight}>{highlight}</p>
			</div>

			<div className={styles.imageColumn}>
				<div className={styles.imageWrapper}>
					<Image
						src={missionImage.src}
						alt={missionImage.alt}
						fill
						sizes="(max-width: 767px) 358px, 494px"
						className={styles.image}
					/>
				</div>
			</div>
		</section>
	);
}
