/**
 * @file src/components/property-add/AddPropertyEquipmentsCard/AddPropertyEquipmentsCard.js
 * @description
 * Carte équipements pour la page "Ajout propriété".
 */

import {
	addPropertyEquipmentsLeft,
	addPropertyEquipmentsRight,
} from '@/data/addProperty';
import PropertyAddSectionCard from '@/components/property-add/PropertyAddSectionCard/PropertyAddSectionCard';

import styles from './AddPropertyEquipmentsCard.module.css';

/**
 * Carte des équipements.
 *
 * @returns {JSX.Element}
 */
export default function AddPropertyEquipmentsCard() {
	return (
		<PropertyAddSectionCard className={styles.card}>
			<div className={styles.inner}>
				<h2 className={styles.title}>Équipements</h2>

				<div className={styles.columns}>
					<div className={styles.column}>
						{addPropertyEquipmentsLeft.map((item) => (
							<label key={item} className={styles.item}>
								<input type="checkbox" className={styles.checkbox} />
								<span>{item}</span>
							</label>
						))}
					</div>

					<div className={styles.column}>
						{addPropertyEquipmentsRight.map((item) => (
							<label key={item} className={styles.item}>
								<input type="checkbox" className={styles.checkbox} />
								<span>{item}</span>
							</label>
						))}
					</div>
				</div>
			</div>
		</PropertyAddSectionCard>
	);
}
