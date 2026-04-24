/**
 * @file src/app/messages/page.js
 * @description
 * Page mobile de messagerie : liste réelle des conversations.
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { listConversations } from '@/services/messageService';
import styles from './page.module.css';

/**
 * Formate l'heure d'une conversation pour l'affichage mobile.
 *
 * @param {string|null|undefined} value
 * @returns {string}
 */
function formatConversationTime(value) {
	if (typeof value !== 'string' || value.trim() === '') {
		return '';
	}

	const date = new Date(value);

	if (Number.isNaN(date.getTime())) {
		return '';
	}

	return new Intl.DateTimeFormat('fr-FR', {
		hour: '2-digit',
		minute: '2-digit',
	}).format(date);
}

/**
 * Retourne un extrait lisible pour la liste des conversations.
 *
 * @param {Object} conversation
 * @returns {string}
 */
function getConversationSnippet(conversation) {
	if (
		typeof conversation?.last_message_preview === 'string' &&
		conversation.last_message_preview.trim() !== ''
	) {
		return conversation.last_message_preview.trim();
	}

	const propertyTitle =
		typeof conversation?.property?.title === 'string'
			? conversation.property.title.trim()
			: '';

	if (propertyTitle !== '') {
		return `Conversation à propos de ${propertyTitle}`;
	}

	return 'Aucun message pour le moment.';
}

/**
 * Page mobile de messagerie.
 *
 * @returns {JSX.Element}
 */
export default function MessagesPage() {
	const router = useRouter();

	const [conversations, setConversations] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState('');

	useEffect(() => {
		function handleDesktopRedirect() {
			if (window.innerWidth >= 768) {
				router.replace('/');
			}
		}

		handleDesktopRedirect();
		window.addEventListener('resize', handleDesktopRedirect);

		return () => {
			window.removeEventListener('resize', handleDesktopRedirect);
		};
	}, [router]);

	useEffect(() => {
		let isCancelled = false;

		async function loadConversations() {
			setIsLoading(true);
			setErrorMessage('');

			try {
				const { conversations: nextConversations } =
					await listConversations();

				if (isCancelled) {
					return;
				}

				setConversations(nextConversations);
			} catch (error) {
				if (isCancelled) {
					return;
				}

				if (error instanceof Error) {
					if (error.message === 'Authentification requise.') {
						router.replace('/login?next=%2Fmessages');
						return;
					}

					setErrorMessage(error.message);
					return;
				}

				setErrorMessage(
					'Impossible de récupérer les conversations.',
				);
			} finally {
				if (!isCancelled) {
					setIsLoading(false);
				}
			}
		}

		loadConversations();

		return () => {
			isCancelled = true;
		};
	}, [router]);

	return (
		<>
			<div className={styles.desktopOnly} aria-hidden="true" />

			<div className={styles.mobileOnly}>
				<div className={styles.mobilePage}>
					<div className={styles.mobileBackArea}>
						<Link href="/" className={styles.backButton}>
							<ArrowLeft size={16} strokeWidth={1.75} />
							<span>Retour</span>
						</Link>
					</div>

					<h1 className={styles.mobileTitle}>Messages</h1>

					<div className={styles.mobileConversationList}>
						{isLoading ? (
							<p aria-live="polite">Chargement...</p>
						) : null}

						{!isLoading && errorMessage !== '' ? (
							<p aria-live="polite">{errorMessage}</p>
						) : null}

						{!isLoading &&
						errorMessage === '' &&
						conversations.length === 0 ? (
							<p aria-live="polite">
								Aucune conversation pour le moment.
							</p>
						) : null}

						{!isLoading &&
							errorMessage === '' &&
							conversations.map((conversation, index) => (
								<Link
									key={conversation.id}
									href={`/messages/${conversation.id}`}
									className={`${styles.mobileConversationRow} ${
										index === 0
											? styles.mobileConversationRowSelected
											: ''
									}`.trim()}
									aria-label={`Ouvrir la conversation avec ${conversation.other_user?.name ?? 'cet utilisateur'}`}
								>
									<span className={styles.conversationLeft}>
										<span
											className={styles.conversationAvatar}
											aria-hidden="true"
										/>

										<span className={styles.conversationText}>
											<span
												className={`${styles.conversationName} ${
													index === 0
														? styles.conversationNameSelected
														: ''
												}`.trim()}
											>
												{conversation.other_user?.name ??
													'Utilisateur'}
											</span>

											<span
												className={styles.conversationSnippet}
											>
												{getConversationSnippet(
													conversation,
												)}
											</span>
										</span>
									</span>

									<span className={styles.conversationRight}>
										<span
											className={styles.conversationTime}
										>
											{formatConversationTime(
												conversation.last_message_at,
											)}
										</span>

										{Number(conversation.unread_count || 0) >
										0 ? (
											<span
												className={styles.conversationDot}
												aria-hidden="true"
											/>
										) : null}
									</span>
								</Link>
							))}
					</div>
				</div>
			</div>
		</>
	);
}
