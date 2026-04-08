/**
 * @file src/app/favorites/FavoritesClientView.js
 * @description
 * Vue client de la page Favoris alimentée par localStorage.
 */

'use client';

import { useEffect, useMemo, useState } from 'react';

import { buildPropertyRouteSegment } from '@/lib/slug';
import FavoritesGrid from '@/components/favorites/FavoritesGrid/FavoritesGrid';
import FavoritesIntro from '@/components/favorites/FavoritesIntro/FavoritesIntro';
import { internalApiRequest } from '@/lib/internalApiClient';
import { getFavoriteIds } from '@/services/favoriteStorageService';

import styles from './page.module.css';

const favoritesIntroContent = {
	title: 'Vos favoris',
	description:
		'Retrouvez ici tous les logements que vous avez aimés. Prêts à réserver ? Un simple clic et votre prochain séjour est en route.',
};

/**
 * Retourne une image sûre pour la page Favoris.
 *
 * @param {Object} property
 * @returns {string}
 */
function getFavoriteImage(property) {
	if (typeof property?.cover === 'string' && property.cover.trim() !== '') {
		return property.cover.trim();
	}

	if (
		Array.isArray(property?.pictures) &&
		typeof property.pictures[0] === 'string' &&
		property.pictures[0].trim() !== ''
	) {
		return property.pictures[0].trim();
	}

	return '/placeholder-property.png';
}

/**
 * Mappe une propriété backend vers le contrat UI d'une carte de la page Favoris.
 *
 * @param {Object} property
 * @returns {Object}
 */
function mapPropertyToFavoriteCard(property) {
	const id = String(property?.id ?? '');
	const routeSegment = buildPropertyRouteSegment(
		id,
		typeof property?.title === 'string' ? property.title : '',
	);

	return {
		id,
		title:
			typeof property?.title === 'string' && property.title.trim() !== ''
				? property.title.trim()
				: 'Logement',
		location:
			typeof property?.location === 'string' &&
			property.location.trim() !== ''
				? property.location.trim()
				: 'Localisation non renseignée',
		price: Number.isFinite(property?.price_per_night)
			? property.price_per_night
			: 0,
		image: getFavoriteImage(property),
		imageAlt:
			typeof property?.title === 'string' && property.title.trim() !== ''
				? `Photo du logement ${property.title.trim()}`
				: 'Photo du logement',
		href: `/properties/${encodeURIComponent(routeSegment)}`,
	};
}

export default function FavoritesClientView() {
	const [favoriteIds, setFavoriteIds] = useState([]);
	const [properties, setProperties] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState('');

	useEffect(() => {
		async function loadFavorites() {
			setIsLoading(true);
			setErrorMessage('');

			try {
				const storedFavoriteIds = getFavoriteIds();
				setFavoriteIds(storedFavoriteIds);

				if (storedFavoriteIds.length === 0) {
					setProperties([]);
					return;
				}

				const response = await internalApiRequest('/api/properties', {
					method: 'GET',
				});

				const apiProperties = Array.isArray(response?.data?.properties)
					? response.data.properties
					: [];

				const filteredProperties = apiProperties.filter((property) =>
					storedFavoriteIds.includes(String(property?.id ?? '')),
				);

				setProperties(
					filteredProperties.map(mapPropertyToFavoriteCard),
				);
			} catch (error) {
				setErrorMessage(
					error instanceof Error
						? error.message
						: 'Impossible de charger vos favoris.',
				);
			} finally {
				setIsLoading(false);
			}
		}

		loadFavorites();
	}, []);

	const hasFavorites = useMemo(() => properties.length > 0, [properties]);

	return (
		<div className={styles.page}>
			<div className={styles.container}>
				<FavoritesIntro
					title={favoritesIntroContent.title}
					description={favoritesIntroContent.description}
				/>

				{isLoading ? (
					<section
						className={styles.feedbackSection}
						aria-live="polite"
					>
						<div className={styles.feedbackCard}>
							<h2 className={styles.feedbackTitle}>
								Chargement de vos favoris...
							</h2>
							<p className={styles.feedbackText}>
								Nous récupérons les logements que vous avez
								sélectionnés.
							</p>
						</div>
					</section>
				) : errorMessage !== '' ? (
					<section
						className={styles.feedbackSection}
						aria-live="polite"
					>
						<div className={styles.feedbackCard}>
							<h2 className={styles.feedbackTitle}>
								{"Impossible d'afficher vos favoris"}
							</h2>
							<p className={styles.feedbackText}>
								{errorMessage}
							</p>
						</div>
					</section>
				) : favoriteIds.length === 0 ? (
					<section
						className={styles.feedbackSection}
						aria-live="polite"
					>
						<div className={styles.feedbackCard}>
							<h2 className={styles.feedbackTitle}>
								Aucun favori pour le moment
							</h2>
							<p className={styles.feedbackText}>
								Ajoutez des logements à vos favoris depuis la
								{"page d'accueil pour les retrouver ici."}
							</p>
						</div>
					</section>
				) : !hasFavorites ? (
					<section
						className={styles.feedbackSection}
						aria-live="polite"
					>
						<div className={styles.feedbackCard}>
							<h2 className={styles.feedbackTitle}>
								Vos favoris ne sont plus disponibles
							</h2>
							<p className={styles.feedbackText}>
								Les logements enregistrés localement ne sont pas
								ou plus disponibles dans les données actuelles.
							</p>
						</div>
					</section>
				) : (
					<FavoritesGrid items={properties} />
				)}
			</div>
		</div>
	);
}
