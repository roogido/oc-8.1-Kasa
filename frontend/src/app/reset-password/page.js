/**
 * @file  src/app/reset-password/page.js
 * @description
 * Page de réinitialisation du mot de passe.
 */

import ResetPasswordClientView from './ResetPasswordClientView';

export const metadata = {
	title: 'Réinitialiser le mot de passe',
	description: 'Définissez un nouveau mot de passe pour votre compte Kasa.',
	robots: {
		index: false,
		follow: false,
	},
};

export default function ResetPasswordPage() {
	return <ResetPasswordClientView />;
}
