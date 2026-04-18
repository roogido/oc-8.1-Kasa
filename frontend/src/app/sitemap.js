/**
 * @file src/app/sitemap.js
 * @description
 * Génère dynamiquement le sitemap XML du site public Kasa.
 *
 * Le sitemap est un fichier destiné principalement aux moteurs de recherche
 * comme Google. Il liste les URLs publiques importantes du site afin de
 * faciliter leur découverte, leur exploration et leur indexation.
 *
 * Dans ce projet, ce fichier permet notamment de :
 * - déclarer les pages statiques importantes, comme l'accueil et la page À propos ;
 * - ajouter les pages dynamiques des fiches logement ;
 * - fournir pour chaque URL des informations SEO utiles, comme :
 *   - l'adresse canonique de la page ;
 *   - une date de dernière modification ;
 *   - une fréquence estimée de mise à jour ;
 *   - un niveau de priorité relatif dans le site.
 *
 * Ce fichier ne garantit pas l'indexation par Google, mais il améliore
 * nettement la compréhension de la structure du site par les moteurs
 * de recherche.
 */

import { getHomeProperties } from '@/services/propertyService';
import { buildAbsoluteSiteUrl } from '@/lib/env.js';

/**
 * Date de repli utilisée pour les pages statiques lorsque
 * aucune date métier de mise à jour n'est disponible.
 *
 * @type {string}
 */
const STATIC_LAST_MODIFIED = '2026-04-17T00:00:00.000Z';

/**
 * Retourne les entrées statiques du sitemap.
 *
 * Ces pages sont toujours présentes sur le site et ont une
 * importance forte pour l'exploration par les moteurs.
 *
 * @returns {Array<Object>}
 */
function getStaticEntries() {
	return [
		{
			url: buildAbsoluteSiteUrl('/'),
			lastModified: STATIC_LAST_MODIFIED,
			changeFrequency: 'daily',
			priority: 1,
		},
		{
			url: buildAbsoluteSiteUrl('/about'),
			lastModified: STATIC_LAST_MODIFIED,
			changeFrequency: 'monthly',
			priority: 0.6,
		},
	];
}

/**
 * Retourne les entrées dynamiques du sitemap pour les fiches logement.
 *
 * En l'absence de vraie date de mise à jour fournie par l'API,
 * on utilise une date de repli stable afin d'éviter d'annoncer
 * à tort une mise à jour à chaque génération du sitemap.
 *
 * @param {Array<Object>} properties
 * @returns {Array<Object>}
 */
function getPropertyEntries(properties) {
	if (!Array.isArray(properties)) {
		return [];
	}

	return properties
		.filter(
			(property) =>
				typeof property?.href === 'string' &&
				property.href.trim() !== '',
		)
		.map((property) => ({
			url: buildAbsoluteSiteUrl(property.href),
			lastModified: STATIC_LAST_MODIFIED,
			changeFrequency: 'weekly',
			priority: 0.8,
		}));
}

/**
 * Génère les entrées du sitemap XML.
 *
 * Objectif :
 * - exposer les pages publiques utiles au référencement ;
 * - inclure les fiches logement accessibles depuis la home ;
 * - rester robuste même si la récupération des logements échoue.
 *
 * @returns {Promise<Array<Object>>}
 */
export default async function sitemap() {
	const staticEntries = getStaticEntries();

	try {
		const properties = await getHomeProperties();
		const propertyEntries = getPropertyEntries(properties);

		return [...staticEntries, ...propertyEntries];
	} catch {
		return staticEntries;
	}
}
