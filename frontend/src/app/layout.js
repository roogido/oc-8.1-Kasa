/**
 * @file src/app/layout.js
 * @description
 * Layout racine de l'application Kasa.
 */

import { Suspense } from 'react';
import { Inter } from 'next/font/google';

import './globals.css';
import Providers from './Providers';
import AppHeader from '@/components/layout/AppHeader/AppHeader';
import AppFooter from '@/components/layout/AppFooter/AppFooter';
import { getServerCurrentUser } from '@/lib/authServer';
import { getSiteUrl } from '@/lib/env.js';

const inter = Inter({
	subsets: ['latin'],
	weight: ['100', '200', '300', '400', '500', '600', '700', '900'],
	display: 'swap',
});

const siteUrl = getSiteUrl();

/**
 * Métadonnées globales du site.
 *
 * Elles servent de base commune pour :
 * - le titre et la description par défaut ;
 * - l'icône du site ;
 * - l'aperçu des pages lors des partages sur les réseaux sociaux
 *   et les messageries compatibles Open Graph / Twitter Cards.
 */
export const metadata = {
	/**
	 * URL de base utilisée par Next.js pour résoudre correctement
	 * les URLs absolues des métadonnées, comme les canonical,
	 * les images Open Graph ou les sitemaps.
	 */
	metadataBase: new URL(siteUrl),

	/**
	 * Configuration globale du titre des pages.
	 *
	 * - default : titre utilisé si une page ne définit pas son propre titre
	 * - template : format appliqué aux titres des pages enfants
	 */
	title: {
		default: 'Kasa',
		template: '%s | Kasa',
	},

	/**
	 * Description générale du site.
	 *
	 * Elle sert de valeur de secours pour les pages qui ne définissent
	 * pas leur propre description SEO.
	 */
	description:
		'Kasa, plateforme de réservation immobilière pour découvrir des logements chaleureux et réserver des séjours uniques.',

	/**
	 * Icônes globales du site.
	 *
	 * - icon : favicon principal utilisé par les navigateurs
	 * - apple : icône dédiée aux appareils Apple lors d'un ajout
	 *   à l'écran d'accueil
	 */
	icons: {
		icon: [{ url: '/favicon.ico', sizes: '16x16 32x32 48x48 64x64' }],
		apple: '/apple-icon.png',
	},

	/**
	 * Métadonnées Open Graph.
	 *
	 * Elles contrôlent l'aperçu du site lorsqu'une URL est partagée
	 * sur des plateformes compatibles, comme LinkedIn, WhatsApp,
	 * Facebook, Discord ou Slack.
	 */
	openGraph: {
		type: 'website',
		locale: 'fr_FR',
		siteName: 'Kasa',
		title: 'Kasa',
		description:
			'Kasa, plateforme de réservation immobilière pour découvrir des logements chaleureux et réserver des séjours uniques.',
	},

	/**
	 * Métadonnées Twitter Cards.
	 *
	 * Elles contrôlent l'aperçu du site lors d'un partage sur X / Twitter.
	 */
	twitter: {
		card: 'summary_large_image',
		title: 'Kasa',
		description:
			'Kasa, plateforme de réservation immobilière pour découvrir des logements chaleureux et réserver des séjours uniques.',
	},
};

export default async function RootLayout({ children }) {
	const currentUser = await getServerCurrentUser();
	const isAuthenticated = currentUser !== null;

	const favoritesScope =
		currentUser?.id !== undefined && currentUser?.id !== null
			? `user:${String(currentUser.id).trim()}`
			: 'guest';

	return (
		<html lang="fr" data-scroll-behavior="smooth">
			<body className={inter.className}>
				<Providers key={favoritesScope} favoritesScope={favoritesScope}>
					<div className="site-shell">
						<Suspense fallback={null}>
							<AppHeader
								key={isAuthenticated ? 'auth' : 'guest'}
								isAuthenticated={isAuthenticated}
								currentUser={currentUser}
							/>
						</Suspense>
						<main className="site-main">{children}</main>
						<AppFooter />
					</div>
				</Providers>
			</body>
		</html>
	);
}
