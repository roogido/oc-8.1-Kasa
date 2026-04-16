/**
 * @file src/app/robots.js
 * @description
 * Génère le fichier robots.txt du site Kasa.
 */

import { buildAbsoluteSiteUrl } from '@/lib/env.js';

/**
 * Robots du site.
 *
 * @returns {Object}
 */
export default function robots() {
	return {
		rules: [
			{
				userAgent: '*',
				allow: '/',
				disallow: [
					'/profile',
					'/favorites',
					'/messages',
					'/add-property',
					'/login',
					'/sign-in',
				],
			},
		],
		sitemap: buildAbsoluteSiteUrl('/sitemap.xml'),
	};
}
