/**
 * @file src/components/messages/MessagesDesktopModal/MessagesDesktopModal.test.js
 * @description
 * Tests d'intégration léger de la modale desktop de messagerie.
 *
 * Ce fichier vérifie notamment :
 *      - le chargement initial de la liste des conversations ;
 *      - l'état vide ;
 *      - l'ouverture d'une conversation via initialPropertyId ;
 *      - la sélection d'une conversation existante ;
 *      - l'envoi d'un message ;
 *      - la fermeture de la modale ;
 *      - la gestion du scroll du document.
 *
 * Exécution de ce fichier :
 *      npm run test -- src/components/messages/MessagesDesktopModal/MessagesDesktopModal.test.js
 *
 * Exécution de tous les tests :
 *      npm run test
 *
 * Mode watch :
 *      npm run test -- --watch
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

vi.mock('lucide-react', () => ({
	ArrowLeft: (props) => <svg aria-hidden="true" {...props} />,
	Send: (props) => <svg aria-hidden="true" {...props} />,
}));

vi.mock('@/services/messageService', () => ({
	getConversationDetail: vi.fn(),
	listConversations: vi.fn(),
	markConversationAsRead: vi.fn(),
	openConversation: vi.fn(),
	sendConversationMessage: vi.fn(),
}));

import {
	getConversationDetail,
	listConversations,
	markConversationAsRead,
	openConversation,
	sendConversationMessage,
} from '@/services/messageService';
import MessagesDesktopModal from './MessagesDesktopModal';

/**
 * Retourne un objet simulant une liste de conversations.
 *
 * @returns {Array<Object>}
 */
function createConversationsList() {
	return [
		{
			id: 1,
			property: {
				id: 'c67ab8a7',
				title: 'Appartement cosy',
				cover: '/uploads/property-cover.jpg',
			},
			other_user: {
				id: 1,
				name: 'Nathalie Jean',
				picture: null,
			},
			last_message_preview: 'Bonjour',
			last_message_at: '2026-04-20T09:00:00.000Z',
			unread_count: 2,
		},
		{
			id: 2,
			property: {
				id: 'd91fe77a',
				title: 'Studio lumineux',
				cover: '/uploads/property-cover-2.jpg',
			},
			other_user: {
				id: 8,
				name: 'Pierrette Martin',
				picture: null,
			},
			last_message_preview: 'Je vous contacte pour ce logement.',
			last_message_at: '2026-04-20T10:00:00.000Z',
			unread_count: 0,
		},
	];
}

/**
 * Retourne un détail simulé pour une conversation.
 *
 * @param {number} conversationId
 * @returns {{ conversation: Object, currentUserId: number }}
 */
function createConversationDetail(conversationId) {
	if (conversationId === 2) {
		return {
			conversation: {
				id: 2,
				property: {
					id: 'd91fe77a',
					title: 'Studio lumineux',
					cover: '/uploads/property-cover-2.jpg',
				},
				client: {
					id: 29,
					name: 'Annie Davis',
					picture: null,
				},
				host: {
					id: 8,
					name: 'Pierrette Martin',
					picture: null,
				},
				last_message_preview: 'Je vous contacte pour ce logement.',
				last_message_at: '2026-04-20T10:00:00.000Z',
				messages: [
					{
						id: 20,
						sender_user_id: 8,
						body: 'Bonjour, je vous écoute.',
						created_at: '2026-04-20T10:00:00.000Z',
						read_at: null,
					},
				],
			},
			currentUserId: 29,
		};
	}

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
			last_message_at: '2026-04-20T09:00:00.000Z',
			messages: [
				{
					id: 10,
					sender_user_id: 29,
					body: 'Bonjour',
					created_at: '2026-04-20T09:00:00.000Z',
					read_at: null,
				},
				{
					id: 11,
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

describe('src/components/messages/MessagesDesktopModal/MessagesDesktopModal.js', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		document.body.style.overflow = '';
	});

	it('verrouille puis restaure le scroll du document', () => {
		// Cas testé :
		// la modale doit bloquer le scroll à son ouverture
		// puis restaurer l'état précédent à sa fermeture.
		listConversations.mockImplementation(() => new Promise(() => {}));

		const { unmount } = render(<MessagesDesktopModal onClose={vi.fn()} />);

		expect(document.body.style.overflow).toBe('hidden');

		unmount();

		expect(document.body.style.overflow).toBe('');
	});

	it("affiche l'état de chargement pendant la récupération des conversations", () => {
		// Cas testé :
		// tant que la liste n'est pas résolue, la modale affiche un état
		// de chargement dans la colonne de gauche.
		listConversations.mockImplementation(() => new Promise(() => {}));

		render(<MessagesDesktopModal onClose={vi.fn()} />);

		expect(screen.getByText('Chargement...')).toBeInTheDocument();
	});

	it("affiche un état vide si aucune conversation n'est disponible", async () => {
		// Cas testé :
		// si aucune conversation n'existe, la modale doit afficher
		// un message explicite et ne sélectionner aucun fil.
		listConversations.mockResolvedValue({
			conversations: [],
			currentUserId: 29,
		});

		render(<MessagesDesktopModal onClose={vi.fn()} />);

		expect(
			await screen.findByText('Aucune conversation pour le moment.'),
		).toBeInTheDocument();

		expect(
			screen.getByText('Sélectionne une conversation.'),
		).toBeInTheDocument();
	});

	it('charge la liste et sélectionne automatiquement la première conversation', async () => {
		// Cas testé :
		// au chargement normal, la modale récupère la liste,
		// sélectionne la première conversation et charge son détail.
		listConversations.mockResolvedValue({
			conversations: createConversationsList(),
			currentUserId: 29,
		});
		getConversationDetail.mockResolvedValue(createConversationDetail(1));
		markConversationAsRead.mockResolvedValue({
			ok: true,
			updated: 2,
		});

		render(<MessagesDesktopModal onClose={vi.fn()} />);

		expect(await screen.findByText('Nathalie Jean')).toBeInTheDocument();

		expect(
			await screen.findByText('Oui, le logement est disponible.'),
		).toBeInTheDocument();

		await waitFor(() => {
			expect(getConversationDetail).toHaveBeenCalledWith(1);
			expect(markConversationAsRead).toHaveBeenCalledWith(1);
		});
	});

	it("ouvre d'abord une conversation via initialPropertyId", async () => {
		// Cas testé :
		// si la modale reçoit un propertyId initial,
		// elle doit d'abord ouvrir ou récupérer la conversation liée
		// puis charger le bon détail.
		openConversation.mockResolvedValue({
			conversation: {
				id: 2,
			},
			currentUserId: 29,
		});
		listConversations.mockResolvedValue({
			conversations: createConversationsList(),
			currentUserId: 29,
		});
		getConversationDetail.mockResolvedValue(createConversationDetail(2));
		markConversationAsRead.mockResolvedValue({
			ok: true,
			updated: 0,
		});

		render(
			<MessagesDesktopModal
				onClose={vi.fn()}
				initialPropertyId="d91fe77a"
			/>,
		);

		await waitFor(() => {
			expect(openConversation).toHaveBeenCalledWith('d91fe77a');
		});

		expect(await screen.findByText('Pierrette Martin')).toBeInTheDocument();

		expect(
			await screen.findByText('Bonjour, je vous écoute.'),
		).toBeInTheDocument();

		expect(getConversationDetail).toHaveBeenCalledWith(2);
	});

	it('permet de sélectionner une autre conversation dans la liste', async () => {
		// Cas testé :
		// l'utilisateur peut changer de conversation depuis la colonne
		// de gauche et la modale recharge alors le bon fil.
		listConversations.mockResolvedValue({
			conversations: createConversationsList(),
			currentUserId: 29,
		});
		getConversationDetail
			.mockResolvedValueOnce(createConversationDetail(1))
			.mockResolvedValueOnce(createConversationDetail(2));
		markConversationAsRead.mockResolvedValue({
			ok: true,
			updated: 0,
		});

		render(<MessagesDesktopModal onClose={vi.fn()} />);

		expect(
			await screen.findByText('Oui, le logement est disponible.'),
		).toBeInTheDocument();

		fireEvent.click(
			screen.getByRole('button', {
				name: /Pierrette Martin/i,
			}),
		);

		expect(
			await screen.findByText('Bonjour, je vous écoute.'),
		).toBeInTheDocument();

		await waitFor(() => {
			expect(getConversationDetail).toHaveBeenCalledWith(2);
		});
	});

	it('envoie un message et met à jour le fil affiché', async () => {
		// Cas testé :
		// après saisie, la modale doit appeler le service d'envoi
		// puis afficher le nouveau message dans le fil courant.
		listConversations.mockResolvedValue({
			conversations: createConversationsList(),
			currentUserId: 29,
		});
		getConversationDetail.mockResolvedValue(createConversationDetail(1));
		markConversationAsRead.mockResolvedValue({
			ok: true,
			updated: 1,
		});
		sendConversationMessage.mockResolvedValue({
			message: {
				id: 99,
				sender_user_id: 29,
				body: 'Je confirme ma demande.',
				created_at: '2026-04-20T10:15:00.000Z',
				read_at: null,
			},
			currentUserId: 29,
		});

		render(<MessagesDesktopModal onClose={vi.fn()} />);

		await screen.findByText('Oui, le logement est disponible.');

		const textarea = screen.getByLabelText('Envoyer un message');
		const sendButton = screen.getByRole('button', {
			name: 'Envoyer',
		});

		fireEvent.change(textarea, {
			target: { value: 'Je confirme ma demande.' },
		});

		fireEvent.click(sendButton);

		await waitFor(() => {
			expect(sendConversationMessage).toHaveBeenCalledWith(
				1,
				'Je confirme ma demande.',
			);
		});

		const matchingMessages = await screen.findAllByText(
			'Je confirme ma demande.',
		);

		expect(matchingMessages).toHaveLength(2);
		expect(textarea).toHaveValue('');
	});

	it("affiche une erreur si l'envoi échoue", async () => {
		// Cas testé :
		// si le service d'envoi échoue, la modale doit afficher
		// le message d'erreur retourné.
		listConversations.mockResolvedValue({
			conversations: createConversationsList(),
			currentUserId: 29,
		});
		getConversationDetail.mockResolvedValue(createConversationDetail(1));
		markConversationAsRead.mockResolvedValue({
			ok: true,
			updated: 1,
		});
		sendConversationMessage.mockRejectedValue(
			new Error("Impossible d'envoyer le message."),
		);

		render(<MessagesDesktopModal onClose={vi.fn()} />);

		await screen.findByText('Oui, le logement est disponible.');

		fireEvent.change(screen.getByLabelText('Envoyer un message'), {
			target: { value: 'Nouveau message' },
		});

		fireEvent.click(
			screen.getByRole('button', {
				name: 'Envoyer',
			}),
		);

		expect(
			await screen.findByText("Impossible d'envoyer le message."),
		).toBeInTheDocument();
	});

	it('ferme la modale lorsque le bouton Retour est cliqué', async () => {
		// Cas testé :
		// le clic sur le bouton de fermeture doit appeler onClose.
		const onClose = vi.fn();

		listConversations.mockResolvedValue({
			conversations: createConversationsList(),
			currentUserId: 29,
		});
		getConversationDetail.mockResolvedValue(createConversationDetail(1));
		markConversationAsRead.mockResolvedValue({
			ok: true,
			updated: 1,
		});

		render(<MessagesDesktopModal onClose={onClose} />);

		await screen.findByText('Oui, le logement est disponible.');

		fireEvent.click(
			screen.getByRole('button', {
				name: 'Retour',
			}),
		);

		expect(onClose).toHaveBeenCalled();
	});
});
