/**
 * @file src/app/layout.js
 * @description
 * Layout racine de l'application Kasa.
 */

import { Inter } from 'next/font/google';

import './globals.css';
import Providers from './Providers';
import AppHeader from '@/components/layout/AppHeader/AppHeader';
import AppFooter from '@/components/layout/AppFooter/AppFooter';
import { getServerCurrentUser } from '@/lib/authServer';

const inter = Inter({
	subsets: ['latin'],
	weight: ['100', '200', '300', '400', '500', '600', '700', '900'],
	display: 'swap',
});

export const metadata = {
	title: 'Kasa',
	description: 'Plateforme de réservation immobilière',
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
						<AppHeader
							key={isAuthenticated ? 'auth' : 'guest'}
							isAuthenticated={isAuthenticated}
							currentUser={currentUser}
						/>
						<main className="site-main">{children}</main>
						<AppFooter />
					</div>
				</Providers>
			</body>
		</html>
	);
}
