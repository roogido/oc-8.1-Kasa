/**
 * @file src/app/profile/page.js
 * @description
 * Page serveur du profil utilisateur.
 */

import { redirect } from 'next/navigation';

import ProfileClientPage from './ProfileClientPage';
import { getServerCurrentUser } from '@/lib/authServer';

export default async function ProfilePage() {
	const currentUser = await getServerCurrentUser();

	if (currentUser === null) {
		redirect('/login?next=%2Fprofile');
	}

	return <ProfileClientPage currentUser={currentUser} />;
}
