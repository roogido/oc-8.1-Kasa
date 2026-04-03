/**
 * @file src/app/messages/[conversationId]/page.js
 * @description Vue détail mobile d'une conversation.
 */

'use client';

import { use, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, SendHorizontal } from 'lucide-react';

import { conversations, desktopThread } from '@/data/messages';
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

	const activeConversation = useMemo(
		() =>
			conversations.find(
				(conversation) => conversation.id === conversationId,
			) ?? conversations[0],
		[conversationId],
	);

	const mobileThread = useMemo(() => {
		return desktopThread.map((message) => {
			if (message.type === 'separator') {
				return message;
			}

			return {
				...message,
				author:
					message.author === 'Utilisateur'
						? activeConversation.name
						: message.author,
				content: message.content.replaceAll(
					'Utilisateur',
					activeConversation.name,
				),
			};
		});
	}, [activeConversation.name]);

	return (
		<div className={styles.mobileDetailPage}>
			<div className={styles.mobileDetailBackArea}>
				<Link href="/messages" className={styles.backButton}>
					<ArrowLeft size={16} strokeWidth={1.75} />
					<span>Retour</span>
				</Link>
			</div>

			<div className={styles.threadArea}>
				{mobileThread.map((message) => (
					<MobileMessageBubble key={message.id} message={message} />
				))}
			</div>

			<div className={styles.composerArea}>
				<div className={styles.composerBox}>
					<input
						type="text"
						className={styles.composerInput}
						aria-label="Envoyer un message"
						placeholder="Envoyer un message"
					/>

					<button
						type="button"
						className={styles.sendButton}
						aria-label="Envoyer"
					>
						<SendHorizontal size={16} strokeWidth={1.75} />
					</button>
				</div>
			</div>
		</div>
	);
}
