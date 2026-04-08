/**
 * @file src/app/properties/[propertyId]/page.js
 * @description
 * Page détail d'un logement de Kasa.
 */

import { notFound } from 'next/navigation';

import { extractPropertyIdFromRouteSegment } from '@/lib/slug';
import HostCard from '@/components/property/HostCard/HostCard';
import PropertyBackButton from '@/components/property/PropertyBackButton/PropertyBackButton';
import PropertyGallery from '@/components/property/PropertyGallery/PropertyGallery';
import PropertyInfoCard from '@/components/property/PropertyInfoCard/PropertyInfoCard';

import { getPropertyDetail } from '@/services/propertyService';

import styles from './page.module.css';

/**
 * Page détail logement.
 *
 * @param {Object} props
 * @param {Promise<{ propertyId: string }>} props.params
 * @returns {Promise<JSX.Element>}
 */
export default async function PropertyDetailPage({ params }) {
	const { propertyId } = await params;
	const backendPropertyId = extractPropertyIdFromRouteSegment(propertyId);

	if (backendPropertyId === '') {
		notFound();
	}

	let property = null;
	let propertyErrorMessage = '';

	try {
		property = await getPropertyDetail(backendPropertyId);
	} catch (error) {
		propertyErrorMessage =
			error instanceof Error
				? error.message
				: 'Impossible de charger le logement.';
	}

	if (property === null && propertyErrorMessage === '') {
		notFound();
	}

	if (property === null) {
		return (
			<div className={styles.content}>
				<div className={styles.backRow}>
					<PropertyBackButton href="/" />
				</div>

				<section
					className={styles.feedbackSection}
					aria-labelledby="property-error-title"
				>
					<div className={styles.feedbackCard}>
						<h1 id="property-error-title" className={styles.feedbackTitle}>
							Impossible de charger ce logement
						</h1>
						<p className={styles.feedbackText}>{propertyErrorMessage}</p>
					</div>
				</section>
			</div>
		);
	}

	return (
		<div className={styles.content}>
			<div className={styles.backRow}>
				<PropertyBackButton href="/" />
			</div>

			<div className={styles.topRow}>
				<PropertyGallery images={property.gallery.images} />

				<HostCard
					name={property.host.name}
					rating={property.host.rating}
					avatar={property.host.avatar}
					avatarAlt={property.host.avatarAlt}
				/>
			</div>

			<div className={styles.infoRow}>
				<PropertyInfoCard
					title={property.title}
					location={property.location}
					description={property.description}
					equipments={property.equipments}
					categories={property.categories}
				/>
			</div>

			<div className={styles.mobileHostRow}>
				<HostCard
					name={property.host.name}
					rating={property.host.rating}
					avatar={property.host.avatar}
					avatarAlt={property.host.avatarAlt}
				/>
			</div>
		</div>
	);
}
