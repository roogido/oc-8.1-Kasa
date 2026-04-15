/**
 * @file src/app/add-property/page.js
 * @description
 * Page serveur "Ajout propriété" du projet Kasa.
 */

import { redirect } from 'next/navigation';

import AddPropertyClientPage from './AddPropertyClientPage';
import {
	canManageProperties,
	getServerCurrentUser,
} from '@/lib/authServer';

export default async function AddPropertyPage() {
	const currentUser = await getServerCurrentUser();

	if (currentUser === null) {
		redirect('/login?next=%2Fadd-property');
	}

	if (!canManageProperties(currentUser)) {
		redirect('/');
	}

	return <AddPropertyClientPage currentUser={currentUser} />;
}
