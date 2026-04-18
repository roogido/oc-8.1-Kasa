/**
 * @file src/app/about/page.js
 * @description
 * Page À propos de Kasa.
 */

import AboutIntroSection from '@/components/about/AboutIntroSection/AboutIntroSection';
import AboutMissionSection from '@/components/about/AboutMissionSection/AboutMissionSection';

import { aboutPageContent } from '@/data/aboutContent';
import { buildAbsoluteSiteUrl } from '@/lib/env.js';

import styles from './page.module.css';

const aboutHeroImageUrl =
	typeof aboutPageContent?.heroImage?.src?.src === 'string'
		? buildAbsoluteSiteUrl(aboutPageContent.heroImage.src.src)
		: null;

export const metadata = {
	title: 'À propos de Kasa',
	description: 'Découvrez la mission, la vision et les engagements de Kasa.',
	alternates: {
		canonical: '/about',
	},
	openGraph: {
		title: 'À propos de Kasa',
		description:
			'Découvrez la mission, la vision et les engagements de Kasa.',
		url: '/about',
		images: aboutHeroImageUrl
			? [
					{
						url: aboutHeroImageUrl,
						alt: aboutPageContent.heroImage.alt,
					},
				]
			: [],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'À propos de Kasa',
		description:
			'Découvrez la mission, la vision et les engagements de Kasa.',
		images: aboutHeroImageUrl ? [aboutHeroImageUrl] : [],
	},
};

/**
 * Page À propos.
 *
 * @returns {JSX.Element}
 */
export default function AboutPage() {
	const aboutStructuredData = {
		'@context': 'https://schema.org',
		'@type': 'AboutPage',
		name: 'À propos de Kasa',
		url: buildAbsoluteSiteUrl('/about'),
		description:
			'Découvrez la mission, la vision et les engagements de Kasa.',
		inLanguage: 'fr-FR',
		about: {
			'@type': 'Organization',
			name: 'Kasa',
			url: buildAbsoluteSiteUrl('/'),
			logo: buildAbsoluteSiteUrl('/logo-kasa.png'),
		},
		...(aboutHeroImageUrl
			? {
					primaryImageOfPage: {
						'@type': 'ImageObject',
						url: aboutHeroImageUrl,
					},
				}
			: {}),
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(aboutStructuredData),
				}}
			/>

			<div className={styles.content}>
				<AboutIntroSection
					title={aboutPageContent.title}
					introParagraphsDesktop={
						aboutPageContent.introParagraphsDesktop
					}
					introParagraphsMobile={
						aboutPageContent.introParagraphsMobile
					}
					heroImage={aboutPageContent.heroImage}
				/>

				<AboutMissionSection
					missionTitle={aboutPageContent.missionTitle}
					missionItemsDesktop={aboutPageContent.missionItemsDesktop}
					missionItemsMobile={aboutPageContent.missionItemsMobile}
					missionImage={aboutPageContent.missionImage}
					highlight={aboutPageContent.highlight}
				/>
			</div>
		</>
	);
}
