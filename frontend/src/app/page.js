/**
 * @file src/app/page.js
 * @description
 * Page d'accueil temporaire du projet Kasa.
 */

import AppFooter from '@/components/layout/AppFooter/AppFooter';
import AppHeader from '@/components/layout/AppHeader/AppHeader';
import Button from '@/components/ui/Button/Button';
import PageHeading from '@/components/ui/PageHeading/PageHeading';
import TextBlock from '@/components/ui/TextBlock/TextBlock';

export default function HomePage() {
	return (
		<div className="page-shell">
			<AppHeader currentPath="/" />

			<main className="page-main">
				<section className="section">
					<div className="container">
						<div className="stack stack--md">
							<PageHeading size="hero">Kasa</PageHeading>

							<TextBlock size="lg" tone="muted">
								Base UI commune en cours de mise en place.
							</TextBlock>

							<div className="cluster">
								<Button variant="primary">Action principale</Button>
								<Button variant="secondary">Action secondaire</Button>
							</div>
						</div>
					</div>
				</section>
			</main>

			<AppFooter />
		</div>
	);
}
