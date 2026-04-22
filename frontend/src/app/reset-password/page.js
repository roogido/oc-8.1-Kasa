/**
 * @file src/app/reset-password/page.js
 * @description
 *
 */


import ResetPasswordClientView from './ResetPasswordClientView';

export const metadata = {
	title: 'Reinitialiser le mot de passe',
	description: 'Definissez un nouveau mot de passe pour votre compte Kasa.',
	robots: {
		index: false,
		follow: false,
	},
};

export default function ResetPasswordPage() {
	return <ResetPasswordClientView />;
}
