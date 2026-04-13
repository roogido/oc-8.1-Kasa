/**
 * @file src/components/property/PropertyGridSection/PropertyGridSection.js
 * @description
 * Section de grille de logements de la page d'accueil.
 */

'use client';

import { useMemo, useState } from 'react';

import PropertyCard from '@/components/property/PropertyCard/PropertyCard';

import styles from './PropertyGridSection.module.css';

const PROPERTIES_PER_SLIDE = 12;
const PRIORITY_CARDS_COUNT = 3;

/**
 * Découpe les propriétés en groupes de 12 pour le slider Home.
 *
 * @param {Array<Object>} properties
 * @returns {Array<Array<Object>>}
 */
function chunkProperties(properties) {
	const chunks = [];

	for (let index = 0; index < properties.length; index += PROPERTIES_PER_SLIDE) {
		chunks.push(properties.slice(index, index + PROPERTIES_PER_SLIDE));
	}

	return chunks;
}

/**
 * Section de grille de logements.
 *
 * @param {Object} props
 * @param {Array<Object>} props.properties
 * @returns {JSX.Element}
 */
export default function PropertyGridSection({ properties }) {
	const slides = useMemo(
		() => chunkProperties(Array.isArray(properties) ? properties : []),
		[properties],
	);

	const [currentIndex, setCurrentIndex] = useState(0);

	const slideCount = slides.length;
	const hasMultipleSlides = slideCount > 1;

	function handlePrevious() {
		if (!hasMultipleSlides) {
			return;
		}

		setCurrentIndex((previousIndex) =>
			previousIndex === 0 ? slideCount - 1 : previousIndex - 1,
		);
	}

	function handleNext() {
		if (!hasMultipleSlides) {
			return;
		}

		setCurrentIndex((previousIndex) =>
			previousIndex === slideCount - 1 ? 0 : previousIndex + 1,
		);
	}

	if (slides.length === 0) {
		return null;
	}

	return (
		<section className={styles.section} aria-label="Liste de logements">
			<div className={styles.viewport}>
				<div
					className={styles.track}
					style={{
						transform: `translateX(-${currentIndex * 100}%)`,
					}}
				>
					{slides.map((slideProperties, slideIndex) => (
						<div
							key={`home-slide-${slideIndex + 1}`}
							className={styles.slide}
						>
							<div className={styles.grid}>
								{slideProperties.map((property, propertyIndex) => (
									<PropertyCard
										key={property.id}
										propertyId={property.propertyId}
										title={property.title}
										location={property.location}
										price={property.price}
										image={property.image}
										imageAlt={property.imageAlt}
										href={property.href}
										isPriorityImage={
											slideIndex === 0 &&
											propertyIndex < PRIORITY_CARDS_COUNT
										}
									/>
								))}
							</div>
						</div>
					))}
				</div>
			</div>

			{hasMultipleSlides ? (
				<div
					className={styles.controls}
					aria-label="Contrôles du slider des logements"
				>
					<button
						type="button"
						className={styles.controlButton}
						onClick={handlePrevious}
						aria-label="Logements précédents"
					>
						<span aria-hidden="true">←</span>
					</button>

					<p className={styles.counter} aria-live="polite">
						{currentIndex + 1} / {slideCount}
					</p>

					<button
						type="button"
						className={styles.controlButton}
						onClick={handleNext}
						aria-label="Logements suivants"
					>
						<span aria-hidden="true">→</span>
					</button>
				</div>
			) : null}
		</section>
	);
}
