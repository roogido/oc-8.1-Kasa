/**
 * @file src/app/robots.js
 * @description
 * Génère dynamiquement le fichier robots.txt du site public Kasa.
 *
 * Le fichier robots.txt est destiné aux robots d'exploration des moteurs
 * de recherche, comme Googlebot. Il permet d'indiquer quelles zones du site
 * peuvent être explorées librement et quelles zones ne présentent pas
 * d'intérêt pour le référencement public.
 *
 * Dans ce projet, ce fichier sert notamment à :
 * - autoriser l'exploration des pages publiques utiles au SEO ;
 * - empêcher l'exploration de certaines pages privées ou fonctionnelles,
 *   comme les espaces utilisateur, les favoris, la messagerie ou
 *   les formulaires d'authentification ;
 * - déclarer l'URL du sitemap XML afin d'aider les moteurs à découvrir
 *   plus facilement les pages importantes du site.
 *
 * Ce fichier ne bloque pas formellement l'accès aux pages sensibles :
 * il donne uniquement des consignes d'exploration aux robots respectueux
 * du standard robots.txt. La protection réelle des pages privées doit
 * toujours être assurée côté application.
 */

import { buildAbsoluteSiteUrl } from '@/lib/env.js';

/**
 * Retourne la configuration robots du site.
 *
 * Objectif :
 * - autoriser l'exploration des pages publiques utiles au référencement ;
 * - empêcher l'exploration des espaces utilisateurs et des pages non utiles au SEO ;
 * - déclarer l'URL du sitemap XML.
 *
 * @returns {import('next').MetadataRoute.Robots}
 */
export default function robots() {
	return {
		rules: {
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
		sitemap: buildAbsoluteSiteUrl('/sitemap.xml'),
	};
}
