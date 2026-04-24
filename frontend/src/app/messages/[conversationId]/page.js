/**
 * @file src/app/messages/[conversationId]/page.js
 * @description
 * Vue détail mobile réelle d'une conversation.
 */

'use client';

import { use, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, SendHorizontal } from 'lucide-react';

import {
	getConversationDetail,
	markConversationAsRead,
	sendConversationMessage,
} from '@/services/messageService';
import styles from './page.module.css';

/**
 * Séparateur de date dans le fil mobile.
 *
 * @param {Object} props
 * @param {string} props.label
 * @returns {JSX.Element}
 */
function DateSeparator({ label }) {
	return (
		<div className={styles.dateSeparator}>
			<span className={styles.dateLine} aria-hidden="true" />
			<span className={styles.dateLabel}>{label}</span>
			<span className={styles.dateLine} aria-hidden="true" />
		</div>
	);
}

/**
 * Bulle de message mobile.
 *
 * @param {Object} props
 * @param {Object} props.message
 * @returns {JSX.Element}
 */
function MobileMessageBubble({ message }) {
	if (message.type === 'separator') {
		return <DateSeparator label={message.label} />;
	}

	const isOutgoing = message.side === 'outgoing';

	return (
		<div
			className={`${styles.messageRow} ${
				isOutgoing
					? styles.messageRowOutgoing
					: styles.messageRowIncoming
			}`.trim()}
		>
			{!isOutgoing ? (
				<span className={styles.messageAvatar} aria-hidden="true" />
			) : null}

			<div
				className={`${styles.messageContent} ${
					isOutgoing
						? styles.messageContentOutgoing
						: styles.messageContentIncoming
				}`.trim()}
			>
				<div
					className={`${styles.messageMeta} ${
						isOutgoing ? styles.messageMetaOutgoing : ''
					}`.trim()}
				>
					<span>{message.author}</span>
					<span>•</span>
					<span>{message.time}</span>
				</div>

				<div
					className={`${styles.messageBubble} ${
						isOutgoing
							? styles.messageBubbleOutgoing
							: styles.messageBubbleIncoming
					}`.trim()}
				>
					{message.content}
				</div>
			</div>

			{isOutgoing ? (
				<span className={styles.messageAvatar} aria-hidden="true" />
			) : null}
		</div>
	);
}

/**
 * Retourne un nom d'auteur lisible selon le sens du message.
 *
 * @param {Object} conversation
 * @param {number|null} currentUserId
 * @param {Object} message
 * @returns {string}
 */
function getMessageAuthor(conversation, currentUserId, message) {
	const senderUserId = Number(message?.sender_user_id);

	if (
		typeof currentUserId === 'number' &&
		senderUserId === currentUserId
	) {
		return 'Vous';
	}

	if (senderUserId === Number(conversation?.client?.id)) {
		return conversation?.client?.name ?? 'Client';
	}

	if (senderUserId === Number(conversation?.host?.id)) {
		return conversation?.host?.name ?? 'Hôte';
	}

	return 'Utilisateur';
}

/**
 * Retourne le sens du message.
 *
 * @param {number|null} currentUserId
 * @param {Object} message
 * @returns {'incoming'|'outgoing'}
 */
function getMessageSide(currentUserId, message) {
	return Number(message?.sender_user_id) === Number(currentUserId)
		? 'outgoing'
		: 'incoming';
}

/**
 * Formate l'heure d'un message.
 *
 * @param {string|null|undefined} value
 * @returns {string}
 */
function formatMessageTime(value) {
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
 * Formate le label de date d'un séparateur.
 *
 * @param {string|null|undefined} value
 * @returns {string}
 */
function formatMessageDateLabel(value) {
	if (typeof value !== 'string' || value.trim() === '') {
		return '';
	}

	const date = new Date(value);

	if (Number.isNaN(date.getTime())) {
		return '';
	}

	return new Intl.DateTimeFormat('fr-FR', {
		day: '2-digit',
		month: 'long',
		year: 'numeric',
	}).format(date);
}

/**
 * Construit le fil d'affichage avec séparateurs de date.
 *
 * @param {Object|null} conversation
 * @param {number|null} currentUserId
 * @returns {Array<Object>}
 */
function buildMobileThread(conversation, currentUserId) {
	if (!conversation || !Array.isArray(conversation.messages)) {
		return [];
	}

	const thread = [];
	let previousLabel = '';

	for (const message of conversation.messages) {
		const label = formatMessageDateLabel(message.created_at);

		if (label !== '' && label !== previousLabel) {
			thread.push({
				id: `separator-${message.id}`,
				type: 'separator',
				label,
			});
			previousLabel = label;
		}

		thread.push({
			id: `message-${message.id}`,
			type: 'message',
			side: getMessageSide(currentUserId, message),
			author: getMessageAuthor(conversation, currentUserId, message),
			time: formatMessageTime(message.created_at),
			content: message.body,
		});
	}

	return thread;
}

/**
 * Détail mobile d'une conversation.
 *
 * @param {Object} props
 * @param {Promise<{conversationId: string}>} props.params
 * @returns {JSX.Element}
 */
export default function MessageDetailPage({ params }) {
	const router = useRouter();
	const resolvedParams = use(params);
	const conversationId = resolvedParams.conversationId;

	const [conversation, setConversation] = useState(null);
	const [currentUserId, setCurrentUserId] = useState(null);
	const [messageBody, setMessageBody] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
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

		async function loadConversation() {
			setIsLoading(true);
			setErrorMessage('');

			try {
				const {
					conversation: nextConversation,
					currentUserId: nextCurrentUserId,
				} = await getConversationDetail(conversationId);

				if (isCancelled) {
					return;
				}

				setConversation(nextConversation);
				setCurrentUserId(nextCurrentUserId);

				void markConversationAsRead(conversationId).catch(() => {});
			} catch (error) {
				if (isCancelled) {
					return;
				}

				if (error instanceof Error) {
					if (error.message === 'Authentification requise.') {
						router.replace(
							`/login?next=${encodeURIComponent(`/messages/${conversationId}`)}`,
						);
						return;
					}

					setErrorMessage(error.message);
					return;
				}

				setErrorMessage(
					'Impossible de récupérer la conversation.',
				);
			} finally {
				if (!isCancelled) {
					setIsLoading(false);
				}
			}
		}

		loadConversation();

		return () => {
			isCancelled = true;
		};
	}, [conversationId, router]);

	const mobileThread = useMemo(() => {
		return buildMobileThread(conversation, currentUserId);
	}, [conversation, currentUserId]);

	/**
	 * Envoie le message en cours de composition.
	 *
	 * @returns {Promise<void>}
	 */
	async function handleSendMessage() {
		if (isSubmitting || messageBody.trim() === '') {
			return;
		}

		setIsSubmitting(true);
		setErrorMessage('');

		try {
			const { message } = await sendConversationMessage(
				conversationId,
				messageBody,
			);

			if (!message) {
				throw new Error("Réponse d'envoi invalide.");
			}

			setConversation((currentConversation) => {
				if (!currentConversation) {
					return currentConversation;
				}

				return {
					...currentConversation,
					last_message_at: message.created_at,
					last_message_preview: message.body,
					messages: [
						...(currentConversation.messages ?? []),
						message,
					],
				};
			});

			setMessageBody('');
		} catch (error) {
			if (error instanceof Error) {
				if (error.message === 'Authentification requise.') {
					router.replace(
						`/login?next=${encodeURIComponent(`/messages/${conversationId}`)}`,
					);
					return;
				}

				setErrorMessage(error.message);
				return;
			}

			setErrorMessage("Impossible d'envoyer le message.");
		} finally {
			setIsSubmitting(false);
		}
	}

	/**
	 * Envoie le message avec la touche Entrée.
	 *
	 * @param {React.KeyboardEvent<HTMLInputElement>} event
	 * @returns {Promise<void>}
	 */
	async function handleInputKeyDown(event) {
		if (event.key !== 'Enter') {
			return;
		}

		event.preventDefault();
		await handleSendMessage();
	}

	return (
		<div className={styles.mobileDetailPage}>
			<div className={styles.mobileDetailBackArea}>
				<Link href="/messages" className={styles.backButton}>
					<ArrowLeft size={16} strokeWidth={1.75} />
					<span>Retour</span>
				</Link>
			</div>

			<div className={styles.threadArea}>
				{isLoading ? <p aria-live="polite">Chargement...</p> : null}

				{!isLoading && errorMessage !== '' ? (
					<p aria-live="polite">{errorMessage}</p>
				) : null}

				{!isLoading &&
				errorMessage === '' &&
				mobileThread.length === 0 ? (
					<p aria-live="polite">
						Aucun message pour le moment.
					</p>
				) : null}

				{!isLoading &&
					errorMessage === '' &&
					mobileThread.map((message) => (
						<MobileMessageBubble
							key={message.id}
							message={message}
						/>
					))}
			</div>

			<div className={styles.composerArea}>
				<div className={styles.composerBox}>
					<input
						type="text"
						className={styles.composerInput}
						aria-label="Envoyer un message"
						placeholder="Envoyer un message"
						value={messageBody}
						onChange={(event) =>
							setMessageBody(event.target.value)
						}
						onKeyDown={handleInputKeyDown}
						disabled={isLoading || isSubmitting}
					/>

					<button
						type="button"
						className={styles.sendButton}
						aria-label="Envoyer"
						onClick={handleSendMessage}
						disabled={
							isLoading ||
							isSubmitting ||
							messageBody.trim() === ''
						}
					>
						<SendHorizontal size={16} strokeWidth={1.75} />
					</button>
				</div>
			</div>
		</div>
	);
}
