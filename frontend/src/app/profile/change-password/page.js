/**
 * @file src/app/profile/change-password/page.js
 * @description
 * Page de changement du mot de passe.
 */

import ChangePasswordClientView from './ChangePasswordClientView';

export const metadata = {
	title: 'Changer le mot de passe',
	description: 'Modifiez le mot de passe de votre compte Kasa.',
	robots: {
		index: false,
		follow: false,
	},
};

export default function ChangePasswordPage() {
	return <ChangePasswordClientView />;
}
