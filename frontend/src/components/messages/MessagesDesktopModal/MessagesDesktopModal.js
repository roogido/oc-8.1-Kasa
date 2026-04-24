/**
 * @file src/components/messages/MessagesDesktopModal/MessagesDesktopModal.js
 * @description
 * Modale desktop réelle de messagerie.
 */

'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Send } from 'lucide-react';

import {
	getConversationDetail,
	listConversations,
	markConversationAsRead,
	openConversation,
	sendConversationMessage,
} from '@/services/messageService';
import styles from './MessagesDesktopModal.module.css';

/**
 * Formate l'heure d'une conversation.
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
 * Retourne un aperçu lisible pour la liste des conversations.
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
 * Ligne de conversation dans la liste desktop.
 *
 * @param {Object} props
 * @param {Object} props.conversation
 * @param {boolean} props.isSelected
 * @param {Function} props.onClick
 * @returns {JSX.Element}
 */
function ConversationRow({
	conversation,
	isSelected = false,
	onClick,
}) {
	return (
		<button
			type="button"
			className={`${styles.conversationRow} ${
				isSelected ? styles.conversationRowSelected : ''
			}`.trim()}
			onClick={onClick}
		>
			<span className={styles.conversationLeft}>
				<span className={styles.conversationAvatar} aria-hidden="true" />

				<span className={styles.conversationText}>
					<span
						className={`${styles.conversationName} ${
							isSelected ? styles.conversationNameSelected : ''
						}`.trim()}
					>
						{conversation.other_user?.name ?? 'Utilisateur'}
					</span>

					<span className={styles.conversationSnippet}>
						{getConversationSnippet(conversation)}
					</span>
				</span>
			</span>

			<span className={styles.conversationRight}>
				<span className={styles.conversationTime}>
					{formatConversationTime(conversation.last_message_at)}
				</span>

				{Number(conversation.unread_count || 0) > 0 ? (
					<span className={styles.conversationDot} aria-hidden="true" />
				) : null}
			</span>
		</button>
	);
}

/**
 * Bulle de message desktop.
 *
 * @param {Object} props
 * @param {Object} props.message
 * @returns {JSX.Element}
 */
function MessageBubble({ message }) {
	if (message.type === 'separator') {
		return (
			<div className={styles.dateSeparator}>
				<span className={styles.dateLine} aria-hidden="true" />
				<span className={styles.dateLabel}>{message.label}</span>
				<span className={styles.dateLine} aria-hidden="true" />
			</div>
		);
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
				<div className={styles.messageMeta}>
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
 * Retourne un nom d'auteur lisible.
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
 * Formate le label de date d'un message.
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
function buildThread(conversation, currentUserId) {
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
 * Normalise un identifiant de conversation en entier positif.
 *
 * @param {string|number|null|undefined} value
 * @returns {number|null}
 */
function normalizeConversationId(value) {
	const numericValue = Number.parseInt(String(value ?? '').trim(), 10);

	return Number.isInteger(numericValue) && numericValue > 0
		? numericValue
		: null;
}

/**
 * Normalise un identifiant de propriété.
 *
 * @param {string|null|undefined} value
 * @returns {string}
 */
function normalizePropertyId(value) {
	return typeof value === 'string' ? value.trim() : '';
}

/**
 * Modale desktop réelle de messagerie.
 *
 * @param {Object} props
 * @param {Function} props.onClose
 * @param {number|string|null} [props.initialConversationId=null]
 * @param {string|null} [props.initialPropertyId=null]
 * @returns {JSX.Element}
 */
export default function MessagesDesktopModal({
	onClose,
	initialConversationId = null,
	initialPropertyId = null,
}) {
	const [conversations, setConversations] = useState([]);
	const [selectedConversationId, setSelectedConversationId] =
		useState(null);
	const [selectedConversation, setSelectedConversation] =
		useState(null);
	const [currentUserId, setCurrentUserId] = useState(null);
	const [composerValue, setComposerValue] = useState('');
	const [isLoadingList, setIsLoadingList] = useState(true);
	const [isLoadingThread, setIsLoadingThread] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	useEffect(() => {
		const previousOverflow = document.body.style.overflow;

		document.body.style.overflow = 'hidden';

		return () => {
			document.body.style.overflow = previousOverflow;
		};
	}, []);

	useEffect(() => {
		let isCancelled = false;

		async function bootstrapModal() {
			setIsLoadingList(true);
			setErrorMessage('');

			try {
				let openedConversationId = null;
				let nextCurrentUserId = null;
				const normalizedInitialPropertyId =
					normalizePropertyId(initialPropertyId);
				const normalizedInitialConversationId =
					normalizeConversationId(initialConversationId);

				if (normalizedInitialPropertyId !== '') {
					const { conversation, currentUserId: openedUserId } =
						await openConversation(normalizedInitialPropertyId);

					openedConversationId =
						normalizeConversationId(conversation?.id);
					nextCurrentUserId = openedUserId;
				}

				const {
					conversations: nextConversations,
					currentUserId: listedCurrentUserId,
				} = await listConversations();

				if (isCancelled) {
					return;
				}

				setConversations(nextConversations);
				setCurrentUserId(
					typeof nextCurrentUserId === 'number'
						? nextCurrentUserId
						: listedCurrentUserId,
				);

				const nextSelectedId =
					openedConversationId ??
					normalizedInitialConversationId ??
					normalizeConversationId(nextConversations[0]?.id);

				setSelectedConversationId(nextSelectedId);
			} catch (error) {
				if (isCancelled) {
					return;
				}

				if (error instanceof Error) {
					setErrorMessage(error.message);
				} else {
					setErrorMessage(
						'Impossible de récupérer les conversations.',
					);
				}
			} finally {
				if (!isCancelled) {
					setIsLoadingList(false);
				}
			}
		}

		bootstrapModal();

		return () => {
			isCancelled = true;
		};
	}, [initialConversationId, initialPropertyId]);

	useEffect(() => {
		if (selectedConversationId === null) {
			setSelectedConversation(null);
			return;
		}

		let isCancelled = false;

		async function loadConversationDetail() {
			setIsLoadingThread(true);
			setErrorMessage('');

			try {
				const {
					conversation,
					currentUserId: nextCurrentUserId,
				} = await getConversationDetail(selectedConversationId);

				if (isCancelled) {
					return;
				}

				setSelectedConversation(conversation);

				if (typeof nextCurrentUserId === 'number') {
					setCurrentUserId(nextCurrentUserId);
				}

				void markConversationAsRead(selectedConversationId)
					.then(() => {
						if (isCancelled) {
							return;
						}

						setConversations((currentConversations) =>
							currentConversations.map((currentConversation) =>
								Number(currentConversation.id) ===
								Number(selectedConversationId)
									? {
											...currentConversation,
											unread_count: 0,
										}
									: currentConversation,
							),
						);
					})
					.catch(() => {});
			} catch (error) {
				if (isCancelled) {
					return;
				}

				if (error instanceof Error) {
					setErrorMessage(error.message);
				} else {
					setErrorMessage(
						'Impossible de récupérer la conversation.',
					);
				}
			} finally {
				if (!isCancelled) {
					setIsLoadingThread(false);
				}
			}
		}

		loadConversationDetail();

		return () => {
			isCancelled = true;
		};
	}, [selectedConversationId]);

	const thread = useMemo(() => {
		return buildThread(selectedConversation, currentUserId);
	}, [selectedConversation, currentUserId]);

	/**
	 * Envoie le message composé depuis la modale desktop.
	 *
	 * @returns {Promise<void>}
	 */
	async function handleSendMessage() {
		if (
			isSubmitting ||
			selectedConversationId === null ||
			composerValue.trim() === ''
		) {
			return;
		}

		setIsSubmitting(true);
		setErrorMessage('');

		try {
			const { message } = await sendConversationMessage(
				selectedConversationId,
				composerValue,
			);

			if (!message) {
				throw new Error("Réponse d'envoi invalide.");
			}

			setSelectedConversation((currentConversation) => {
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

			setConversations((currentConversations) => {
				const nextConversations = currentConversations.map(
					(currentConversation) =>
						Number(currentConversation.id) ===
						Number(selectedConversationId)
							? {
									...currentConversation,
									last_message_at: message.created_at,
									last_message_preview: message.body,
								}
							: currentConversation,
				);

				nextConversations.sort((left, right) => {
					const leftDate = new Date(
						left.last_message_at ?? 0,
					).getTime();
					const rightDate = new Date(
						right.last_message_at ?? 0,
					).getTime();

					return rightDate - leftDate;
				});

				return nextConversations;
			});

			setComposerValue('');
		} catch (error) {
			if (error instanceof Error) {
				setErrorMessage(error.message);
			} else {
				setErrorMessage("Impossible d'envoyer le message.");
			}
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<div
			className={styles.overlay}
			role="presentation"
			onClick={onClose}
		>
			<div
				className={styles.modal}
				role="dialog"
				aria-modal="true"
				aria-label="Messagerie"
				onClick={(event) => event.stopPropagation()}
			>
				<aside className={styles.sidebar}>
					<div className={styles.sidebarBackArea}>
						<button
							type="button"
							className={styles.backButton}
							onClick={onClose}
						>
							<ArrowLeft size={16} strokeWidth={1.75} />
							<span>Retour</span>
						</button>
					</div>

					<h2 className={styles.sidebarTitle}>Messages</h2>

					<div className={styles.conversationList}>
						{isLoadingList ? <p>Chargement...</p> : null}

						{!isLoadingList && errorMessage !== '' ? (
							<p>{errorMessage}</p>
						) : null}

						{!isLoadingList &&
						errorMessage === '' &&
						conversations.length === 0 ? (
							<p>Aucune conversation pour le moment.</p>
						) : null}

						{!isLoadingList &&
							errorMessage === '' &&
							conversations.map((conversation) => (
								<ConversationRow
									key={conversation.id}
									conversation={conversation}
									isSelected={
										Number(conversation.id) ===
										Number(selectedConversationId)
									}
									onClick={() =>
										setSelectedConversationId(
											normalizeConversationId(
												conversation.id,
											),
										)
									}
								/>
							))}
					</div>
				</aside>

				<section className={styles.threadPanel}>
					<div className={styles.threadHistory}>
						{isLoadingThread ? <p>Chargement...</p> : null}

						{!isLoadingThread &&
						errorMessage === '' &&
						selectedConversationId === null ? (
							<p>Sélectionne une conversation.</p>
						) : null}

						{!isLoadingThread &&
						errorMessage === '' &&
						selectedConversationId !== null &&
						thread.length === 0 ? (
							<p>Aucun message pour le moment.</p>
						) : null}

						{!isLoadingThread &&
							errorMessage === '' &&
							thread.map((message) => (
								<MessageBubble
									key={message.id}
									message={message}
								/>
							))}
					</div>

					<div className={styles.composerArea}>
						<div className={styles.composerBox}>
							<span className={styles.composerLabel}>
								Envoyer un message
							</span>

							<textarea
								className={styles.composerInput}
								aria-label="Envoyer un message"
								value={composerValue}
								onChange={(event) =>
									setComposerValue(event.target.value)
								}
								disabled={
									isLoadingThread ||
									isSubmitting ||
									selectedConversationId === null
								}
							/>

							<button
								type="button"
								className={styles.sendButton}
								aria-label="Envoyer"
								onClick={handleSendMessage}
								disabled={
									isLoadingThread ||
									isSubmitting ||
									selectedConversationId === null ||
									composerValue.trim() === ''
								}
							>
								<Send size={14} strokeWidth={1.75} />
							</button>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
