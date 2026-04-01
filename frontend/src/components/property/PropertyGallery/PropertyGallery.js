/**
 * @file src/components/property/PropertyGallery/PropertyGallery.js
 * @description
 * Galerie d'images de la page detail logement.
 */

import Image from 'next/image';

import styles from './PropertyGallery.module.css';

/**
 * Galerie d'images.
 *
 * @param {Object} props
 * @param {Object} props.featuredImage
 * @param {Array<Object>} props.thumbnails
 * @returns {JSX.Element}
 */
export default function PropertyGallery({ featuredImage, thumbnails }) {
	return (
		<section className={styles.gallery} aria-label="Galerie du logement">
			<div className={styles.featuredImageWrapper}>
				<Image
					src={featuredImage.src}
					alt={featuredImage.alt}
					fill
					priority
					sizes="(max-width: 767px) 358px, 303px"
					className={styles.image}
				/>
			</div>

			<div className={styles.thumbnailGrid}>
				{thumbnails.map((thumbnail) => (
					<div key={thumbnail.id} className={styles.thumbnailWrapper}>
						<Image
							src={thumbnail.src}
							alt={thumbnail.alt}
							fill
							sizes="(max-width: 767px) 84px, 147px"
							className={styles.image}
						/>
					</div>
				))}
			</div>
		</section>
	);
}
