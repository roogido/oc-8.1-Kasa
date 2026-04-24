/**
 * @file src/app/properties/[propertyId]/page.js
 * @description
 * Page détail d'un logement de Kasa.
 */

import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import { AUTH_COOKIE_NAME } from '@/lib/authConstants';
import {
	buildPropertyRouteSegment,
	extractPropertyIdFromRouteSegment,
} from '@/lib/slug';
import { buildAbsoluteSiteUrl } from '@/lib/env.js';
import HostCard from '@/components/property/HostCard/HostCard';
import PropertyBackButton from '@/components/property/PropertyBackButton/PropertyBackButton';
import PropertyGallery from '@/components/property/PropertyGallery/PropertyGallery';
import PropertyInfoCard from '@/components/property/PropertyInfoCard/PropertyInfoCard';

import { getPropertyDetail } from '@/services/propertyService';

import styles from './page.module.css';

/**
 * Retourne une description SEO courte et propre.
 *
 * @param {string} description
 * @returns {string}
 */
function buildSeoDescription(description) {
	const fallbackDescription =
		'Découvrez les informations détaillées de ce logement sur Kasa.';

	if (typeof description !== 'string' || description.trim() === '') {
		return fallbackDescription;
	}

	const normalizedDescription = description.trim();

	if (normalizedDescription.length <= 160) {
		return normalizedDescription;
	}

	return `${normalizedDescription.slice(0, 157).trim()}...`;
}

/**
 * Charge le logement à partir du segment de route.
 *
 * @param {string} routeSegment
 * @returns {Promise<Object|null>}
 */
async function loadPropertyFromRouteSegment(routeSegment) {
	const backendPropertyId = extractPropertyIdFromRouteSegment(routeSegment);

	if (backendPropertyId === '') {
		return null;
	}

	return getPropertyDetail(backendPropertyId);
}

/**
 * Retourne les images Open Graph/Twitter normalisées.
 *
 * @param {Object} property
 * @returns {Array<{ url: string, alt: string }>}
 */
function getStructuredImages(property) {
	if (!Array.isArray(property?.gallery?.images)) {
		return [];
	}

	return property.gallery.images
		.map((image) => {
			const source =
				typeof image?.src === 'string' ? image.src.trim() : '';

			if (source === '') {
				return null;
			}

			return {
				url: buildAbsoluteSiteUrl(source),
				alt:
					typeof image?.alt === 'string' && image.alt.trim() !== ''
						? image.alt.trim()
						: `Photo du logement ${property.title}`,
			};
		})
		.filter(Boolean);
}

/**
 * Métadonnées dynamiques de la page logement.
 *
 * @param {Object} props
 * @param {Promise<{ propertyId: string }>} props.params
 * @returns {Promise<Object>}
 */
export async function generateMetadata({ params }) {
	const { propertyId } = await params;

	let property = null;

	try {
		property = await loadPropertyFromRouteSegment(propertyId);
	} catch {
		return {
			title: 'Logement',
			description:
				'Consultez la fiche détaillée de ce logement sur Kasa.',
			robots: {
				index: false,
				follow: false,
			},
		};
	}

	if (property === null) {
		return {
			title: 'Logement introuvable',
			description: 'Le logement demandé est introuvable sur Kasa.',
			robots: {
				index: false,
				follow: false,
			},
		};
	}

	const canonicalSegment = buildPropertyRouteSegment(
		property.id,
		property.title,
	);

	const canonicalPath = `/properties/${encodeURIComponent(canonicalSegment)}`;
	const seoDescription = buildSeoDescription(property.description);
	const socialImages = getStructuredImages(property);

	return {
		title: property.title,
		description: seoDescription,
		alternates: {
			canonical: canonicalPath,
		},
		openGraph: {
			title: property.title,
			description: seoDescription,
			url: canonicalPath,
			images: socialImages,
		},
		twitter: {
			card: socialImages.length > 0 ? 'summary_large_image' : 'summary',
			title: property.title,
			description: seoDescription,
			images: socialImages.map((image) => image.url),
		},
	};
}

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

	const cookieStore = await cookies();
	const authToken = cookieStore.get(AUTH_COOKIE_NAME)?.value ?? '';
	const isAuthenticated = authToken.trim() !== '';

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
						<h1
							id="property-error-title"
							className={styles.feedbackTitle}
						>
							Impossible de charger ce logement
						</h1>
						<p className={styles.feedbackText}>
							{propertyErrorMessage}
						</p>
					</div>
				</section>
			</div>
		);
	}

	const canonicalSegment = buildPropertyRouteSegment(
		property.id,
		property.title,
	);

	const propertyUrl = buildAbsoluteSiteUrl(
		`/properties/${encodeURIComponent(canonicalSegment)}`,
	);

	const structuredImages = getStructuredImages(property);

	const structuredAmenities = Array.isArray(property.equipments)
		? property.equipments
				.filter(
					(equipment) =>
						typeof equipment === 'string' &&
						equipment.trim() !== '',
				)
				.map((equipment) => ({
					'@type': 'LocationFeatureSpecification',
					name: equipment.trim(),
					value: true,
				}))
		: [];

	const propertyStructuredData = {
		'@context': 'https://schema.org',
		'@type': 'VacationRental',
		identifier: property.id,
		name: property.title,
		description: property.description,
		url: propertyUrl,
		image: structuredImages.map((image) => image.url),
		amenityFeature: structuredAmenities,
		containsPlace: {
			'@type': 'Accommodation',
			name: property.title,
			description: property.description,
		},
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(propertyStructuredData),
				}}
			/>

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
						propertyId={property.id}
						isAuthenticated={isAuthenticated}
					/>
				</div>

				<div className={styles.infoRow}>
					<PropertyInfoCard
						propertyId={property.id}
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
						propertyId={property.id}
						isAuthenticated={isAuthenticated}
					/>
				</div>
			</div>
		</>
	);
}
