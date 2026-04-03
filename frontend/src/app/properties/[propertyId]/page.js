/**
 * @file src/app/properties/[propertyId]/page.js
 * @description
 * Page détail d'un logement de Kasa.
 */

import { notFound } from 'next/navigation';

import HostCard from '@/components/property/HostCard/HostCard';
import PropertyBackButton from '@/components/property/PropertyBackButton/PropertyBackButton';
import PropertyGallery from '@/components/property/PropertyGallery/PropertyGallery';
import PropertyInfoCard from '@/components/property/PropertyInfoCard/PropertyInfoCard';

import { propertyDetailsById } from '@/data/propertyDetails';

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
	const property = propertyDetailsById[propertyId];

	if (!property) {
		notFound();
	}

	return (
		<div className={styles.content}>
			<div className={styles.backRow}>
				<PropertyBackButton href="/" />
			</div>

			<div className={styles.topRow}>
				<PropertyGallery
					featuredImage={property.gallery.featuredImage}
					thumbnails={property.gallery.thumbnails}
				/>

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
