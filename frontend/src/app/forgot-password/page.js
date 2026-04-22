/**
 * @file src/app/forgot-password/page.js
 * @description
 *
 */

import ForgotPasswordClientView from './ForgotPasswordClientView';

export const metadata = {
	title: 'Mot de passe oublie',
	description: 'Demandez un lien de reinitialisation de mot de passe.',
	robots: {
		index: false,
		follow: false,
	},
};

export default function ForgotPasswordPage() {
	return <ForgotPasswordClientView />;
}
