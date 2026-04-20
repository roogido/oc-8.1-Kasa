/**
 * @file src/app/messages/[conversationId]/page.test.jsx
 * @description
 * Tests d'intégration léger de la page mobile de détail d'une conversation.
 *
 * Ce fichier vérifie notamment :
 *      - la redirection automatique en desktop ;
 *      - l'affichage de l'état de chargement ;
 *      - l'affichage du fil de discussion ;
 *      - le marquage comme lus au chargement ;
 *      - l'envoi d'un message ;
 *      - l'état vide ;
 *      - l'affichage d'une erreur ;
 *      - la redirection vers la page de connexion si l'utilisateur
 *        n'est pas authentifié.
 *
 * Exécution de ce fichier :
 *      npm run test -- src/app/messages/[conversationId]/page.test.jsx
 *
 * Exécution de tous les tests :
 *      npm run test
 *
 * Mode watch :
 *      npm run test -- --watch
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
	fireEvent,
	render,
	screen,
	waitFor,
} from '@testing-library/react';

vi.mock('react', async () => {
	const actual = await vi.importActual('react');

	return {
		...actual,
		use: (value) => value,
	};
});

vi.mock('next/link', () => ({
	default: ({ href, children, ...props }) => (
		<a href={href} {...props}>
			{children}
		</a>
	),
}));

vi.mock('lucide-react', () => ({
	ArrowLeft: (props) => <svg aria-hidden="true" {...props} />,
	SendHorizontal: (props) => <svg aria-hidden="true" {...props} />,
}));

vi.mock('next/navigation', () => ({
	useRouter: vi.fn(),
}));

vi.mock('@/services/messageService', () => ({
	getConversationDetail: vi.fn(),
	markConversationAsRead: vi.fn(),
	sendConversationMessage: vi.fn(),
}));

import { useRouter } from 'next/navigation';
import {
	getConversationDetail,
	markConversationAsRead,
	sendConversationMessage,
} from '@/services/messageService';
import MessageDetailPage from './page';

/**
 * Définit une largeur de viewport simulée pour les tests responsive.
 *
 * @param {number} width
 * @returns {void}
 */
function setViewportWidth(width) {
	Object.defineProperty(window, 'innerWidth', {
		writable: true,
		configurable: true,
		value: width,
	});
}

/**
 * Retourne un router Next.js simulé.
 *
 * @returns {{ replace: Function, push: Function, refresh: Function }}
 */
function createRouterMock() {
	return {
		replace: vi.fn(),
		push: vi.fn(),
		refresh: vi.fn(),
	};
}

/**
 * Retourne un détail de conversation simulé.
 *
 * @returns {Object}
 */
function createConversationDetail() {
	return {
		conversation: {
			id: 1,
			property: {
				id: 'c67ab8a7',
				title: 'Appartement cosy',
				cover: '/uploads/property-cover.jpg',
			},
			client: {
				id: 29,
				name: 'Annie Davis',
				picture: null,
			},
			host: {
				id: 1,
				name: 'Nathalie Jean',
				picture: null,
			},
			last_message_preview: 'Bonjour',
			last_message_at: '2026-04-20 09:00:00',
			messages: [
				{
					id: 1,
					sender_user_id: 29,
					body: 'Bonjour',
					created_at: '2026-04-20T09:00:00.000Z',
					read_at: null,
				},
				{
					id: 2,
					sender_user_id: 1,
					body: 'Oui, le logement est disponible.',
					created_at: '2026-04-20T09:05:00.000Z',
					read_at: null,
				},
			],
		},
		currentUserId: 29,
	};
}

describe('src/app/messages/[conversationId]/page.js', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("redirige vers l'accueil si la page est ouverte en desktop", async () => {
		// Cas testé :
		// la page de détail de conversation est réservée au mobile.
		// En desktop, elle doit rediriger vers "/".
		const router = createRouterMock();

		useRouter.mockReturnValue(router);
		setViewportWidth(1200);

		getConversationDetail.mockResolvedValue(createConversationDetail());
		markConversationAsRead.mockResolvedValue({
			ok: true,
			updated: 1,
		});

		render(
			<MessageDetailPage
				params={{ conversationId: '1' }}
			/>,
		);

		await waitFor(() => {
			expect(router.replace).toHaveBeenCalledWith('/');
		});
	});

	it("affiche l'état de chargement pendant la récupération du détail", () => {
		// Cas testé :
		// tant que le détail de conversation n'est pas disponible,
		// la page doit afficher un message de chargement.
		const router = createRouterMock();

		useRouter.mockReturnValue(router);
		setViewportWidth(375);

		getConversationDetail.mockImplementation(
			() => new Promise(() => {}),
		);

		render(
			<MessageDetailPage
				params={{ conversationId: '1' }}
			/>,
		);

		expect(screen.getByText('Chargement...')).toBeInTheDocument();
	});

	it('affiche le fil de discussion et déclenche le marquage comme lus', async () => {
		// Cas testé :
		// la page doit afficher les messages renvoyés par le service
		// et demander le marquage comme lus après chargement.
		const router = createRouterMock();

		useRouter.mockReturnValue(router);
		setViewportWidth(375);

		getConversationDetail.mockResolvedValue(createConversationDetail());
		markConversationAsRead.mockResolvedValue({
			ok: true,
			updated: 1,
		});

		render(
			<MessageDetailPage
				params={{ conversationId: '1' }}
			/>,
		);

		expect(await screen.findByText('Bonjour')).toBeInTheDocument();
		expect(
			screen.getByText('Oui, le logement est disponible.'),
		).toBeInTheDocument();

		await waitFor(() => {
			expect(markConversationAsRead).toHaveBeenCalledWith('1');
		});
	});

	it("affiche un état vide si la conversation ne contient aucun message", async () => {
		// Cas testé :
		// si la conversation est valide mais sans messages,
		// la page doit afficher un message explicite.
		const router = createRouterMock();

		useRouter.mockReturnValue(router);
		setViewportWidth(375);

		const detail = createConversationDetail();
		detail.conversation.messages = [];

		getConversationDetail.mockResolvedValue(detail);
		markConversationAsRead.mockResolvedValue({
			ok: true,
			updated: 0,
		});

		render(
			<MessageDetailPage
				params={{ conversationId: '1' }}
			/>,
		);

		expect(
			await screen.findByText('Aucun message pour le moment.'),
		).toBeInTheDocument();
	});

	it("affiche une erreur si le chargement du détail échoue", async () => {
		// Cas testé :
		// si le service échoue avec une erreur métier,
		// la page doit afficher le message d'erreur reçu.
		const router = createRouterMock();

		useRouter.mockReturnValue(router);
		setViewportWidth(375);

		getConversationDetail.mockRejectedValue(
			new Error('Conversation not found'),
		);

		render(
			<MessageDetailPage
				params={{ conversationId: '999' }}
			/>,
		);

		expect(
			await screen.findByText('Conversation not found'),
		).toBeInTheDocument();
	});

	it("redirige vers /login si l'utilisateur n'est pas authentifié", async () => {
		// Cas testé :
		// si le service signale une absence d'authentification,
		// la page doit rediriger vers l'écran de connexion avec retour.
		const router = createRouterMock();

		useRouter.mockReturnValue(router);
		setViewportWidth(375);

		getConversationDetail.mockRejectedValue(
			new Error('Authentification requise.'),
		);

		render(
			<MessageDetailPage
				params={{ conversationId: '1' }}
			/>,
		);

		await waitFor(() => {
			expect(router.replace).toHaveBeenCalledWith(
				'/login?next=%2Fmessages%2F1',
			);
		});
	});

	it("désactive l'envoi si le champ du message est vide", async () => {
		// Cas testé :
		// tant qu'aucun texte n'est saisi, le bouton d'envoi
		// doit rester désactivé.
		const router = createRouterMock();

		useRouter.mockReturnValue(router);
		setViewportWidth(375);

		getConversationDetail.mockResolvedValue(createConversationDetail());
		markConversationAsRead.mockResolvedValue({
			ok: true,
			updated: 1,
		});

		render(
			<MessageDetailPage
				params={{ conversationId: '1' }}
			/>,
		);

		await screen.findByText('Bonjour');

		const sendButton = screen.getByRole('button', {
			name: 'Envoyer',
		});

		expect(sendButton).toBeDisabled();
	});

	it('envoie un message et met à jour le fil de discussion', async () => {
		// Cas testé :
		// après saisie, la page doit appeler le service d'envoi
		// puis afficher le nouveau message dans le fil.
		const router = createRouterMock();

		useRouter.mockReturnValue(router);
		setViewportWidth(375);

		getConversationDetail.mockResolvedValue(createConversationDetail());
		markConversationAsRead.mockResolvedValue({
			ok: true,
			updated: 1,
		});
		sendConversationMessage.mockResolvedValue({
			message: {
				id: 3,
				sender_user_id: 29,
				body: 'Je confirme mon intérêt.',
				created_at: '2026-04-20T09:10:00.000Z',
				read_at: null,
			},
			currentUserId: 29,
		});

		render(
			<MessageDetailPage
				params={{ conversationId: '1' }}
			/>,
		);

		await screen.findByText('Bonjour');

		const input = screen.getByLabelText('Envoyer un message');
		const sendButton = screen.getByRole('button', {
			name: 'Envoyer',
		});

		fireEvent.change(input, {
			target: { value: 'Je confirme mon intérêt.' },
		});

		expect(sendButton).not.toBeDisabled();

		fireEvent.click(sendButton);

		await waitFor(() => {
			expect(sendConversationMessage).toHaveBeenCalledWith(
				'1',
				'Je confirme mon intérêt.',
			);
		});

		expect(
			await screen.findByText('Je confirme mon intérêt.'),
		).toBeInTheDocument();

		expect(input).toHaveValue('');
	});

	it("affiche une erreur si l'envoi du message échoue", async () => {
		// Cas testé :
		// si le service d'envoi échoue, la page doit afficher
		// le message d'erreur retourné.
		const router = createRouterMock();

		useRouter.mockReturnValue(router);
		setViewportWidth(375);

		getConversationDetail.mockResolvedValue(createConversationDetail());
		markConversationAsRead.mockResolvedValue({
			ok: true,
			updated: 1,
		});
		sendConversationMessage.mockRejectedValue(
			new Error("Impossible d'envoyer le message."),
		);

		render(
			<MessageDetailPage
				params={{ conversationId: '1' }}
			/>,
		);

		await screen.findByText('Bonjour');

		const input = screen.getByLabelText('Envoyer un message');
		const sendButton = screen.getByRole('button', {
			name: 'Envoyer',
		});

		fireEvent.change(input, {
			target: { value: 'Nouveau message' },
		});

		fireEvent.click(sendButton);

		expect(
			await screen.findByText("Impossible d'envoyer le message."),
		).toBeInTheDocument();
	});
});
