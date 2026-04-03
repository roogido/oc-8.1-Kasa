/**
 * @file src/app/favorites/page.js
 * @description
 * Page Favoris du projet Kasa.
 */

import FavoritesGrid from '@/components/favorites/FavoritesGrid/FavoritesGrid';
import FavoritesIntro from '@/components/favorites/FavoritesIntro/FavoritesIntro';
import {
	favoriteProperties,
	favoritesIntroContent,
} from '@/data/favorites';

import styles from './page.module.css';

export default function FavoritesPage() {
	return (
		<div className={styles.page}>
			<div className={styles.container}>
				<FavoritesIntro
					title={favoritesIntroContent.title}
					description={favoritesIntroContent.description}
				/>

				<FavoritesGrid items={favoriteProperties} />
			</div>
		</div>
	);
}
