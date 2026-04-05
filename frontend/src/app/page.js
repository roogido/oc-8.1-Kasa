/**
 * @file src/app/page.js
 * @description
 * Page d'accueil du projet Kasa.
 */

import HomeHeroSection from '@/components/home/HomeHeroSection/HomeHeroSection';
import HomeHowItWorksSection from '@/components/home/HomeHowItWorksSection/HomeHowItWorksSection';
import PropertyGridSection from '@/components/property/PropertyGridSection/PropertyGridSection';

import {
	homeHeroContent,
	homeHowItWorksContent,
} from '@/data/homeContent';
import { getHomeProperties } from '@/services/propertyService';

import styles from './page.module.css';

/**
 * Découpe un tableau en deux groupes pour conserver la structure UI
 * actuelle de la Home.
 *
 * @param {Array<Object>} properties
 * @returns {{ sectionOne: Array<Object>, sectionTwo: Array<Object> }}
 */
function splitHomeProperties(properties) {
	return {
		sectionOne: properties.slice(0, 6),
		sectionTwo: properties.slice(6, 12),
	};
}

export default async function HomePage() {
	let properties = [];
	let propertiesErrorMessage = '';

	try {
		properties = await getHomeProperties();
	} catch (error) {
		propertiesErrorMessage =
			error instanceof Error
				? error.message
				: 'Impossible de charger les logements.';
	}

	const { sectionOne, sectionTwo } = splitHomeProperties(properties);
	const hasProperties = properties.length > 0;

	return (
		<div className={styles.content}>
			<HomeHeroSection
				title={homeHeroContent.title}
				subtitle={homeHeroContent.subtitle}
				image={homeHeroContent.image}
				imageAlt={homeHeroContent.imageAlt}
			/>

			{propertiesErrorMessage !== '' ? (
				<section
					className={styles.feedbackSection}
					aria-labelledby="home-properties-error-title"
				>
					<div className={styles.feedbackCard}>
						<h2 id="home-properties-error-title" className={styles.feedbackTitle}>
							Impossible de charger les logements
						</h2>
						<p className={styles.feedbackText}>{propertiesErrorMessage}</p>
					</div>
				</section>
			) : hasProperties ? (
				<>
					{sectionOne.length > 0 ? (
						<PropertyGridSection properties={sectionOne} />
					) : null}

					{sectionTwo.length > 0 ? (
						<PropertyGridSection properties={sectionTwo} />
					) : null}
				</>
			) : (
				<section
					className={styles.feedbackSection}
					aria-labelledby="home-properties-empty-title"
				>
					<div className={styles.feedbackCard}>
						<h2 id="home-properties-empty-title" className={styles.feedbackTitle}>
							Aucun logement disponible
						</h2>
						<p className={styles.feedbackText}>
							Aucun logement n&apos;est disponible pour le moment.
						</p>
					</div>
				</section>
			)}

			<HomeHowItWorksSection
				title={homeHowItWorksContent.title}
				subtitle={homeHowItWorksContent.subtitle}
				items={homeHowItWorksContent.items}
			/>
		</div>
	);
}
