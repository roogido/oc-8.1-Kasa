/**
 * @file src/components/property/HostContactActions/HostContactActions.js
 * @description
 * Actions de contact de l'hôte :
 * - non connecté :
 *   redirige vers /login avec retour sur la fiche et intention
 *   d'ouverture de la messagerie
 * - connecté :
 *   - desktop : ouvre la modale de messagerie
 *   - mobile : redirige vers la page /messages
 */

'use client';

import { useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import MessagesDesktopModal from '@/components/messages/MessagesDesktopModal/MessagesDesktopModal';
import { buildLoginMessagesHref } from '@/lib/messagesNavigation';

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
 * @param {Object} props
 * @param {boolean} [props.isAuthenticated=false]
 * @returns {JSX.Element}
 */
export default function HostContactActions({
	isAuthenticated = false,
}) {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const router = useRouter();

	const [isMessagesModalOpen, setIsMessagesModalOpen] = useState(false);

	const loginMessagesHref = useMemo(() => {
		return buildLoginMessagesHref(pathname, searchParams.toString());
	}, [pathname, searchParams]);

	function handleContactClick() {
		if (!isAuthenticated) {
			router.push(loginMessagesHref);
			return;
		}

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
