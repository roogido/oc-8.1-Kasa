/**
 * @file src/components/messages/MessagesDesktopModal/MessagesDesktopModal.js
 * @description
 * Modale desktop de messagerie.
 */

'use client';

import { useEffect } from 'react';
import { ArrowLeft, Send } from 'lucide-react';

import { conversations, desktopThread } from '@/data/messages';
import styles from './MessagesDesktopModal.module.css';

/**
 * Ligne de conversation dans la liste desktop.
 *
 * @param {Object} props
 * @param {Object} props.conversation
 * @param {boolean} props.isSelected
 * @returns {JSX.Element}
 */
function ConversationRow({ conversation, isSelected = false }) {
	return (
		<button
			type="button"
			className={`${styles.conversationRow} ${
				isSelected ? styles.conversationRowSelected : ''
			}`.trim()}
		>
			<span className={styles.conversationLeft}>
				<span className={styles.conversationAvatar} aria-hidden="true" />

				<span className={styles.conversationText}>
					<span
						className={`${styles.conversationName} ${
							isSelected ? styles.conversationNameSelected : ''
						}`.trim()}
					>
						{conversation.name}
					</span>

					<span className={styles.conversationSnippet}>
						{conversation.snippet}
					</span>
				</span>
			</span>

			<span className={styles.conversationRight}>
				<span className={styles.conversationTime}>
					{conversation.time}
				</span>

				{conversation.unread ? (
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
				isOutgoing ? styles.messageRowOutgoing : styles.messageRowIncoming
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
 * Modale desktop de messagerie.
 *
 * @param {Object} props
 * @param {Function} props.onClose
 * @returns {JSX.Element}
 */
export default function MessagesDesktopModal({ onClose }) {
	useEffect(() => {
		const previousOverflow = document.body.style.overflow;

		document.body.style.overflow = 'hidden';

		return () => {
			document.body.style.overflow = previousOverflow;
		};
	}, []);

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
						{conversations.map((conversation, index) => (
							<ConversationRow
								key={conversation.id}
								conversation={conversation}
								isSelected={index === 0}
							/>
						))}
					</div>
				</aside>

				<section className={styles.threadPanel}>
					<div className={styles.threadHistory}>
						{desktopThread.map((message) => (
							<MessageBubble key={message.id} message={message} />
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
							/>

							<button
								type="button"
								className={styles.sendButton}
								aria-label="Envoyer"
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
