/**
 * @file src/app/messages/page.js
 * @description Page mobile de messagerie : liste des conversations.
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import styles from './page.module.css';
import { conversations } from '@/data/messages';

/**
 * Page mobile de messagerie.
 *
 * @returns {JSX.Element}
 */
export default function MessagesPage() {
	const router = useRouter();

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
						{conversations.map((conversation, index) => (
							<Link
								key={conversation.id}
								href={`/messages/${conversation.id}`}
								className={`${styles.mobileConversationRow} ${
									index === 0 ? styles.mobileConversationRowSelected : ''
								}`.trim()}
								aria-label={`Ouvrir la conversation avec ${conversation.name}`}
							>
								<span className={styles.conversationLeft}>
									<span
										className={styles.conversationAvatar}
										aria-hidden="true"
									/>

									<span className={styles.conversationText}>
										<span
											className={`${styles.conversationName} ${
												index === 0 ? styles.conversationNameSelected : ''
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
