/**
 * @file  src/app/forgot-password/page.js
 * @description
 * Page de demande de réinitialisation du mot de passe.
 */

import ForgotPasswordClientView from './ForgotPasswordClientView';

export const metadata = {
	title: 'Mot de passe oublié',
	description: 'Demandez un lien de réinitialisation de mot de passe.',
	robots: {
		index: false,
		follow: false,
	},
};

export default function ForgotPasswordPage() {
	return <ForgotPasswordClientView />;
}
