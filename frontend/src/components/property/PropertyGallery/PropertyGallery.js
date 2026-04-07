/**
 * @file src/components/property/PropertyGallery/PropertyGallery.js
 * @description
 * Carrousel d'images de la page détail logement.
 */

'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';

import styles from './PropertyGallery.module.css';

/**
 * Carrousel d'images.
 *
 * @param {Object} props
 * @param {Array<{ id: string, src: string, alt: string }>} props.images
 * @returns {JSX.Element}
 */
export default function PropertyGallery({ images }) {
	const normalizedImages = useMemo(
		() => (Array.isArray(images) && images.length > 0 ? images : []),
		[images],
	);

	const [currentIndex, setCurrentIndex] = useState(0);

	const imageCount = normalizedImages.length;
	const hasMultipleImages = imageCount > 1;
	const activeImage = normalizedImages[currentIndex] ?? null;

	function handlePrevious() {
		if (!hasMultipleImages) {
			return;
		}

		setCurrentIndex((previousIndex) =>
			previousIndex === 0 ? imageCount - 1 : previousIndex - 1,
		);
	}

	function handleNext() {
		if (!hasMultipleImages) {
			return;
		}

		setCurrentIndex((previousIndex) =>
			previousIndex === imageCount - 1 ? 0 : previousIndex + 1,
		);
	}

	if (activeImage === null) {
		return (
			<section className={styles.gallery} aria-label="Galerie du logement">
				<div className={styles.emptyState}>
					Aucune image disponible pour ce logement.
				</div>
			</section>
		);
	}

	return (
		<section className={styles.gallery} aria-label="Galerie du logement">
			<div className={styles.imageStage}>
				<div className={styles.imageWrapper}>
					<Image
						src={activeImage.src}
						alt={activeImage.alt}
						fill
						priority
						sizes="(max-width: 767px) 100vw, 616px"
						className={styles.image}
					/>
				</div>
			</div>

			{hasMultipleImages ? (
				<div className={styles.controls} aria-label="Contrôles du carrousel">
					<button
						type="button"
						className={styles.controlButton}
						onClick={handlePrevious}
						aria-label="Image précédente"
					>
						<span aria-hidden="true">←</span>
					</button>

					<p className={styles.counter} aria-live="polite">
						{currentIndex + 1} / {imageCount}
					</p>

					<button
						type="button"
						className={styles.controlButton}
						onClick={handleNext}
						aria-label="Image suivante"
					>
						<span aria-hidden="true">→</span>
					</button>
				</div>
			) : null}
		</section>
	);
}
