/**
 * @file src/components/home/PropertyGridSection/PropertyGridSection.js
 * @description
 * Section de grille de logements de la page d'accueil.
 */

import PropertyCard from '@/components/property/PropertyCard/PropertyCard';

import styles from './PropertyGridSection.module.css';

/**
 * Section de grille de logements.
 *
 * @param {Object} props
 * @param {Array<Object>} props.properties
 * @returns {JSX.Element}
 */
export default function PropertyGridSection({ properties }) {
	return (
		<section className={styles.section} aria-label="Liste de logements">
			<div className={styles.grid}>
				{properties.map((property) => (
					<PropertyCard
						key={property.id}
						title={property.title}
						location={property.location}
						price={property.price}
						image={property.image}
						imageAlt={property.imageAlt}
						href={property.href}
					/>
				))}
			</div>
		</section>
	);
}
