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

export const metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: 'Kasa',
        template: '%s | Kasa',
    },
    description:
        'Kasa, plateforme de réservation immobilière pour découvrir des logements chaleureux et réserver des séjours uniques.',
    openGraph: {
        type: 'website',
        locale: 'fr_FR',
        siteName: 'Kasa',
        title: 'Kasa',
        description:
            'Kasa, plateforme de réservation immobilière pour découvrir des logements chaleureux et réserver des séjours uniques.',
    },
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
