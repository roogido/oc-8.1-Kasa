/**
 * @file src/app/page.js
 * @description
 * Page d'accueil du projet Kasa.
 */

import AppFooter from '@/components/layout/AppFooter/AppFooter';
import AppHeader from '@/components/layout/AppHeader/AppHeader';
import HomeHeroSection from '@/components/home/HomeHeroSection/HomeHeroSection';
import HomeHowItWorksSection from '@/components/home/HomeHowItWorksSection/HomeHowItWorksSection';
import PropertyGridSection from '@/components/home/PropertyGridSection/PropertyGridSection';

import {
	featuredPropertiesSectionOne,
	featuredPropertiesSectionTwo,
	homeHeroContent,
	homeHowItWorksContent,
} from '@/data/home';

import styles from './page.module.css';

export default function HomePage() {
	return (
		<div className="page-shell">
			<AppHeader currentPath="/" />

			<main className="page-main">
				<div className={styles.content}>
					<HomeHeroSection
						title={homeHeroContent.title}
						subtitle={homeHeroContent.subtitle}
						image={homeHeroContent.image}
						imageAlt={homeHeroContent.imageAlt}
					/>

					<PropertyGridSection properties={featuredPropertiesSectionOne} />

					<PropertyGridSection properties={featuredPropertiesSectionTwo} />

					<HomeHowItWorksSection
						title={homeHowItWorksContent.title}
						subtitle={homeHowItWorksContent.subtitle}
						items={homeHowItWorksContent.items}
					/>
				</div>
			</main>

			<AppFooter />
		</div>
	);
}
