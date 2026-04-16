/**
 * @file src/app/login/page.js
 * @description
 * Page de connexion Kasa.
 */

import LoginClientView from './LoginClientView';

export const metadata = {
	title: 'Connexion',
	description: 'Connectez-vous à votre compte Kasa.',
	robots: {
		index: false,
		follow: false,
	},
};

export default function LoginPage() {
	return <LoginClientView />;
}
