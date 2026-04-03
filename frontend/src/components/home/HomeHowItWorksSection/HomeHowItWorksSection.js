/**
 * @file src/components/home/HomeHowItWorksSection/HomeHowItWorksSection.js
 * @description
 * Section "Comment ça marche ?" de la page d'accueil.
 */

import FeatureInfoCard from '@/components/home/FeatureInfoCard/FeatureInfoCard';

import styles from './HomeHowItWorksSection.module.css';

/**
 * Section "Comment ça marche ?".
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {string} props.subtitle
 * @param {Array<Object>} props.items
 * @returns {JSX.Element}
 */
export default function HomeHowItWorksSection({
	title,
	subtitle,
	items,
}) {
	return (
		<section className={styles.section} aria-labelledby="how-it-works-title">
			<div className={`${styles.surface} surface`}>
				<div className={styles.header}>
					<h2 id="how-it-works-title" className={styles.title}>
						{title}
					</h2>

					<p className={styles.subtitle}>{subtitle}</p>
				</div>

				<div className={styles.grid}>
					{items.map((item) => (
						<FeatureInfoCard
							key={item.id}
							title={item.title}
							description={item.description}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
