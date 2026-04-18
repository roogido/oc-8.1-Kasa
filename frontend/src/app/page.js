/**
 * @file src/app/page.js
 * @description
 * Page d'accueil du projet Kasa.
 */

import HomeHeroSection from '@/components/home/HomeHeroSection/HomeHeroSection';
import HomeHowItWorksSection from '@/components/home/HomeHowItWorksSection/HomeHowItWorksSection';
import PropertyGridSection from '@/components/property/PropertyGridSection/PropertyGridSection';

import { homeHeroContent, homeHowItWorksContent } from '@/data/homeContent';
import { buildAbsoluteSiteUrl } from '@/lib/env.js';
import { getHomeProperties } from '@/services/propertyService';

import styles from './page.module.css';

const homeHeroImageUrl =
	typeof homeHeroContent?.image?.src === 'string'
		? buildAbsoluteSiteUrl(homeHeroContent.image.src)
		: null;

export const metadata = {
	title: 'Location de logements | Kasa',
	description:
		'Découvrez les logements Kasa, consultez les hébergements disponibles et préparez votre prochain séjour.',
	alternates: {
		canonical: '/',
	},
	openGraph: {
		title: 'Location de logements',
		description:
			'Découvrez les logements Kasa, consultez les hébergements disponibles et préparez votre prochain séjour.',
		url: '/',
		images: homeHeroImageUrl
			? [
					{
						url: homeHeroImageUrl,
						alt: 'Kasa - Location de logements',
					},
				]
			: [],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Location de logements',
		description:
			'Découvrez les logements Kasa, consultez les hébergements disponibles et préparez votre prochain séjour.',
		images: homeHeroImageUrl ? [homeHeroImageUrl] : [],
	},
};

/**
 * Page d'accueil.
 *
 * @returns {Promise<JSX.Element>}
 */
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

	const hasProperties = properties.length > 0;

	const websiteStructuredData = {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: 'Kasa',
		url: buildAbsoluteSiteUrl('/'),
		description:
			'Plateforme de réservation immobilière pour découvrir des logements chaleureux et réserver des séjours uniques.',
		inLanguage: 'fr-FR',
	};

	const organizationStructuredData = {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: 'Kasa',
		url: buildAbsoluteSiteUrl('/'),
		logo: buildAbsoluteSiteUrl('/logo-kasa.png'),
	};

	const homeStructuredData = [
		websiteStructuredData,
		organizationStructuredData,
	];

	if (hasProperties) {
		homeStructuredData.push({
			'@context': 'https://schema.org',
			'@type': 'ItemList',
			name: 'Liste des logements disponibles',
			url: buildAbsoluteSiteUrl('/'),
			numberOfItems: properties.length,
			itemListElement: properties.map((property, index) => ({
				'@type': 'ListItem',
				position: index + 1,
				url: buildAbsoluteSiteUrl(property.href),
				name: property.title,
			})),
		});
	}

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(homeStructuredData),
				}}
			/>

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
							<h2
								id="home-properties-error-title"
								className={styles.feedbackTitle}
							>
								Impossible de charger les logements
							</h2>
							<p className={styles.feedbackText}>
								{propertiesErrorMessage}
							</p>
						</div>
					</section>
				) : hasProperties ? (
					<PropertyGridSection properties={properties} />
				) : (
					<section
						className={styles.feedbackSection}
						aria-labelledby="home-properties-empty-title"
					>
						<div className={styles.feedbackCard}>
							<h2
								id="home-properties-empty-title"
								className={styles.feedbackTitle}
							>
								Aucun logement disponible
							</h2>
							<p className={styles.feedbackText}>
								Aucun logement n&apos;est disponible pour le
								moment.
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
		</>
	);
}
