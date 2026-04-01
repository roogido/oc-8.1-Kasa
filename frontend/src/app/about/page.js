/**
 * @file src/app/about/page.js
 * @description
 * Page À propos de Kasa.
 */

import AppFooter from '@/components/layout/AppFooter/AppFooter';
import AppHeader from '@/components/layout/AppHeader/AppHeader';

import AboutIntroSection from '@/components/about/AboutIntroSection/AboutIntroSection';
import AboutMissionSection from '@/components/about/AboutMissionSection/AboutMissionSection';

import { aboutPageContent } from '@/data/about';

import styles from './page.module.css';

export const metadata = {
	title: 'À propos | Kasa',
	description: 'Découvrez la mission et la vision de Kasa.',
};

/**
 * Page À propos.
 *
 * @returns {JSX.Element}
 */
export default function AboutPage() {
	return (
		<div className="page-shell">
			<AppHeader currentPath="/about" />

			<main className="page-main">
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
						missionItemsDesktop={
							aboutPageContent.missionItemsDesktop
						}
						missionItemsMobile={aboutPageContent.missionItemsMobile}
						missionImage={aboutPageContent.missionImage}
						highlight={aboutPageContent.highlight}
					/>
				</div>
			</main>

			<AppFooter />
		</div>
	);
}
