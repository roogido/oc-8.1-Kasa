/**
 * @file src/components/property-add/AddPropertyCategoriesCard/AddPropertyCategoriesCard.js
 * @description
 * Carte catégories pour la page "Ajout propriété".
 */

import { Plus } from 'lucide-react';

import {
	addPropertyCategoriesDesktop,
	addPropertyCategoriesMobile,
} from '@/data/addProperty';
import PropertyAddSectionCard from '@/components/property-add/PropertyAddSectionCard/PropertyAddSectionCard';

import styles from './AddPropertyCategoriesCard.module.css';

/**
 * Carte des catégories.
 *
 * @returns {JSX.Element}
 */
export default function AddPropertyCategoriesCard() {
	return (
		<PropertyAddSectionCard className={styles.card}>
			<div className={styles.inner}>
				<h2 className={styles.title}>Catégories</h2>

				<div className={styles.tagsDesktop}>
					{addPropertyCategoriesDesktop.map((tag, index) => (
						<span key={`${tag}-${index}`} className={styles.tag}>
							{tag}
						</span>
					))}
				</div>

				<div className={styles.tagsMobile}>
					{addPropertyCategoriesMobile.map((tag, index) => (
						<span
							key={`${tag}-mobile-${index}`}
							className={styles.tag}
						>
							{tag}
						</span>
					))}
				</div>

				<div className={styles.customField}>
					<label className={styles.label} htmlFor="custom-category">
						Ajouter une catégorie personnalisée
					</label>

					<div className={styles.inputRow}>
						<input
							id="custom-category"
							name="custom-category"
							type="text"
							placeholder="Nouveau tag"
							className={styles.input}
						/>

						<button
							type="button"
							className={styles.addButton}
							aria-label="Ajouter un tag"
						>
							<Plus
								className={styles.addIcon}
								aria-hidden="true"
							/>
						</button>
					</div>

					<button type="button" className={styles.linkButton}>
						+Ajouter un tag
					</button>
				</div>
			</div>
		</PropertyAddSectionCard>
	);
}
