/**
 * @file src/app/profile/page.js
 * @description
 * Page serveur du profil utilisateur.
 */

import { redirect } from 'next/navigation';

import ProfileClientPage from './ProfileClientPage';
import { getServerCurrentUser } from '@/lib/authServer';

export const metadata = {
    title: 'Mon profil',
    description: 'Gérez vos informations personnelles et votre photo de profil.',
    robots: {
        index: false,
        follow: false,
    },
};

export default async function ProfilePage() {
	const currentUser = await getServerCurrentUser();

	if (currentUser === null) {
		redirect('/login?next=%2Fprofile');
	}

	return <ProfileClientPage currentUser={currentUser} />;
}
