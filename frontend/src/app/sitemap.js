/**
 * @file src/app/sitemap.js
 * @description
 * Génère le sitemap XML du site Kasa.
 */

import { getHomeProperties } from '@/services/propertyService';
import { buildAbsoluteSiteUrl } from '@/lib/env.js';

/**
 * Sitemap du site.
 *
 * @returns {Promise<Array<Object>>}
 */
export default async function sitemap() {
	const staticEntries = [
		{
			url: buildAbsoluteSiteUrl('/'),
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 1,
		},
		{
			url: buildAbsoluteSiteUrl('/about'),
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.6,
		},
	];

	try {
		const properties = await getHomeProperties();

		const propertyEntries = properties.map((property) => ({
			url: buildAbsoluteSiteUrl(property.href),
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 0.8,
		}));

		return [...staticEntries, ...propertyEntries];
	} catch {
		return staticEntries;
	}
}
