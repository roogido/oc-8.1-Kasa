/**
 * @file src/app/add-property/page.js
 * @description
 * Page "Ajout propriété" du projet Kasa.
 */

import AddPropertyCategoriesCard from '@/components/property-add/AddPropertyCategoriesCard/AddPropertyCategoriesCard';
import AddPropertyEquipmentsCard from '@/components/property-add/AddPropertyEquipmentsCard/AddPropertyEquipmentsCard';
import AddPropertyFormCard from '@/components/property-add/AddPropertyFormCard/AddPropertyFormCard';
import AddPropertyHostCard from '@/components/property-add/AddPropertyHostCard/AddPropertyHostCard';
import AddPropertyMediaCard from '@/components/property-add/AddPropertyMediaCard/AddPropertyMediaCard';
import AddPropertyTopBar from '@/components/property-add/AddPropertyTopBar/AddPropertyTopBar';

import styles from './page.module.css';

export default function AddPropertyPage() {
	return (
		<div className={styles.page}>
			<div className={styles.container}>
				<AddPropertyTopBar />

				<div className={styles.row}>
					<AddPropertyFormCard />
					<div className={styles.stack}>
						<AddPropertyMediaCard />
						<AddPropertyHostCard />
					</div>
				</div>

				<div className={styles.row}>
					<AddPropertyEquipmentsCard />
					<AddPropertyCategoriesCard />
				</div>
			</div>
		</div>
	);
}
