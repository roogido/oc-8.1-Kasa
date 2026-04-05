/**
 * @file src/app/layout.js
 * @description
 * Layout racine de l'application Kasa.
 */

import { Inter } from 'next/font/google';

import './globals.css';
import AppHeader from '@/components/layout/AppHeader/AppHeader';
import AppFooter from '@/components/layout/AppFooter/AppFooter';

const inter = Inter({
	subsets: ['latin'],
	weight: ['100', '200', '300', '400', '500', '600', '700', '900'],
	display: 'swap',
});

export const metadata = {
	title: 'Kasa',
	description: 'Plateforme de réservation immobilière',
};

export default function RootLayout({ children }) {
	return (
		<html lang="fr">
			<body className={inter.className}>
				<div className="site-shell">
					<AppHeader />
					<main className="site-main">{children}</main>
					<AppFooter />
				</div>
			</body>
		</html>
	);
}
