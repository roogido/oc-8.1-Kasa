/**
 * @file src/components/property-add/AddPropertyCategoriesCard/AddPropertyCategoriesCard.js
 * @description
 * Carte catégories pour la page "Ajout propriété".
 */

import { Plus } from 'lucide-react';

import {
	addPropertyCategoriesDesktop,
	addPropertyCategoriesMobile,
} from '@/data/addPropertyOptions';
import PropertyAddSectionCard from '@/components/property-add/PropertyAddSectionCard/PropertyAddSectionCard';

import styles from './AddPropertyCategoriesCard.module.css';

/**
 * Carte des catégories.
 *
 * @param {Object} props
 * @param {string[]} props.selectedTags
 * @param {string} props.customCategory
 * @param {(value: string) => void} props.onCustomCategoryChange
 * @param {() => void} props.onAddCustomCategory
 * @param {(tag: string) => void} props.onToggleTag
 * @returns {JSX.Element}
 */
export default function AddPropertyCategoriesCard({
	selectedTags,
	customCategory,
	onCustomCategoryChange,
	onAddCustomCategory,
	onToggleTag,
}) {
	const categories = Array.from(
		new Set([
			...addPropertyCategoriesDesktop,
			...addPropertyCategoriesMobile,
			...selectedTags,
		]),
	).filter((tag) => typeof tag === 'string' && tag.trim() !== '');

	return (
		<PropertyAddSectionCard className={styles.card}>
			<div className={styles.inner}>
				<h2 className={styles.title}>Catégories</h2>

				<div className={styles.tagsDesktop}>
					{categories.map((tag) => (
						<button
							key={`desktop-${tag}`}
							type="button"
							className={styles.tag}
							aria-pressed={selectedTags.includes(tag)}
							data-selected={
								selectedTags.includes(tag) ? 'true' : 'false'
							}
							onClick={() => onToggleTag(tag)}
						>
							{tag}
						</button>
					))}
				</div>

				<div className={styles.tagsMobile}>
					{categories.map((tag) => (
						<button
							key={`mobile-${tag}`}
							type="button"
							className={styles.tag}
							aria-pressed={selectedTags.includes(tag)}
							data-selected={
								selectedTags.includes(tag) ? 'true' : 'false'
							}
							onClick={() => onToggleTag(tag)}
						>
							{tag}
						</button>
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
							value={customCategory}
							onChange={(event) =>
								onCustomCategoryChange(event.target.value)
							}
						/>

						<button
							type="button"
							className={styles.addButton}
							aria-label="Ajouter un tag"
							onClick={onAddCustomCategory}
						>
							<Plus
								className={styles.addIcon}
								aria-hidden="true"
							/>
						</button>
					</div>

					<button
						type="button"
						className={styles.linkButton}
						onClick={onAddCustomCategory}
					>
						+Ajouter un tag
					</button>
				</div>
			</div>
		</PropertyAddSectionCard>
	);
}
