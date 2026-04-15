/**
 * @file src/components/property-add/AddPropertyEquipmentsCard/AddPropertyEquipmentsCard.js
 * @description
 * Carte équipements pour la page "Ajout propriété".
 */

import {
	addPropertyEquipmentsLeft,
	addPropertyEquipmentsRight,
} from '@/data/addPropertyOptions';
import PropertyAddSectionCard from '@/components/property-add/PropertyAddSectionCard/PropertyAddSectionCard';

import styles from './AddPropertyEquipmentsCard.module.css';

/**
 * Carte des équipements.
 *
 * @param {Object} props
 * @param {string[]} props.selectedEquipments
 * @param {(equipment: string) => void} props.onToggleEquipment
 * @returns {JSX.Element}
 */
export default function AddPropertyEquipmentsCard({
	selectedEquipments,
	onToggleEquipment,
}) {
	return (
		<PropertyAddSectionCard className={styles.card}>
			<div className={styles.inner}>
				<h2 className={styles.title}>Équipements</h2>

				<div className={styles.columns}>
					<div className={styles.column}>
						{addPropertyEquipmentsLeft.map((item) => (
							<label key={item} className={styles.item}>
								<input
									type="checkbox"
									className={styles.checkbox}
									checked={selectedEquipments.includes(item)}
									onChange={() => onToggleEquipment(item)}
								/>
								<span>{item}</span>
							</label>
						))}
					</div>

					<div className={styles.column}>
						{addPropertyEquipmentsRight.map((item) => (
							<label key={item} className={styles.item}>
								<input
									type="checkbox"
									className={styles.checkbox}
									checked={selectedEquipments.includes(item)}
									onChange={() => onToggleEquipment(item)}
								/>
								<span>{item}</span>
							</label>
						))}
					</div>
				</div>
			</div>
		</PropertyAddSectionCard>
	);
}
