/**
 * @file src/components/property/HostContactActions/HostContactActions.js
 * @description
 * Actions de contact de l'hôte :
 * - desktop : ouvre la modale de messagerie
 * - mobile : redirige vers la page /messages
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import MessagesDesktopModal from '@/components/messages/MessagesDesktopModal/MessagesDesktopModal';

import styles from './HostContactActions.module.css';

/**
 * Retourne true si le viewport courant est desktop.
 *
 * @returns {boolean}
 */
function isDesktopViewport() {
	if (typeof window === 'undefined') {
		return false;
	}

	return window.innerWidth >= 768;
}

/**
 * Actions de contact de l'hôte.
 *
 * @returns {JSX.Element}
 */
export default function HostContactActions() {
	const router = useRouter();
	const [isMessagesModalOpen, setIsMessagesModalOpen] = useState(false);

	function handleContactClick() {
		if (isDesktopViewport()) {
			setIsMessagesModalOpen(true);
			return;
		}

		router.push('/messages');
	}

	return (
		<>
			<div className={styles.actions}>
				<button
					type="button"
					className={styles.button}
					onClick={handleContactClick}
				>
					{"Contacter l'hôte"}
				</button>

				<button
					type="button"
					className={styles.button}
					onClick={handleContactClick}
				>
					Envoyer un message
				</button>
			</div>

			{isMessagesModalOpen ? (
				<MessagesDesktopModal
					onClose={() => setIsMessagesModalOpen(false)}
				/>
			) : null}
		</>
	);
}
