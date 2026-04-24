/**
 * @file src/app/messages/page.test.jsx
 * @description
 * Tests d'intégration léger de la page mobile de messagerie.
 *
 * Ce fichier vérifie notamment :
 *      - la redirection automatique en desktop ;
 *      - l'affichage de l'état de chargement ;
 *      - l'affichage d'une liste de conversations ;
 *      - l'affichage de l'état vide ;
 *      - l'affichage d'une erreur ;
 *      - la redirection vers la page de connexion si l'utilisateur
 *        n'est pas authentifié.
 *
 * Exécution de ce fichier :
 *      npm run test -- src/app/messages/page.test.jsx
 *
 * Exécution de tous les tests :
 *      npm run test
 *
 * Mode watch :
 *      npm run test -- --watch
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

vi.mock('next/link', () => ({
	default: ({ href, children, ...props }) => (
		<a href={href} {...props}>
			{children}
		</a>
	),
}));

vi.mock('lucide-react', () => ({
	ArrowLeft: (props) => <svg aria-hidden="true" {...props} />,
}));

vi.mock('next/navigation', () => ({
	useRouter: vi.fn(),
}));

vi.mock('@/services/messageService', () => ({
	listConversations: vi.fn(),
}));

import { useRouter } from 'next/navigation';
import { listConversations } from '@/services/messageService';
import MessagesPage from './page';

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

describe('src/app/messages/page.js', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("redirige vers l'accueil si la page est ouverte en desktop", async () => {
		// Cas testé :
		// la page /messages est réservée au mobile.
		// En desktop, elle doit rediriger immédiatement vers "/".
		const router = createRouterMock();

		useRouter.mockReturnValue(router);
		setViewportWidth(1200);
		listConversations.mockResolvedValue({
			conversations: [],
			currentUserId: 29,
		});

		render(<MessagesPage />);

		await waitFor(() => {
			expect(router.replace).toHaveBeenCalledWith('/');
		});
	});

	it("affiche l'état de chargement pendant la récupération des conversations", () => {
		// Cas testé :
		// tant que la promesse de chargement n'est pas résolue,
		// la page doit afficher un message de chargement.
		const router = createRouterMock();

		useRouter.mockReturnValue(router);
		setViewportWidth(375);

		listConversations.mockImplementation(() => new Promise(() => {}));

		render(<MessagesPage />);

		expect(screen.getByText('Chargement...')).toBeInTheDocument();
	});

	it('affiche la liste des conversations récupérées', async () => {
		// Cas testé :
		// la page doit afficher chaque conversation renvoyée par le service,
		// avec le nom du correspondant et un aperçu du dernier message.
		const router = createRouterMock();

		useRouter.mockReturnValue(router);
		setViewportWidth(375);

		listConversations.mockResolvedValue({
			conversations: [
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
					last_message_preview:
						'Bonjour, votre logement est-il disponible ?',
					last_message_at: '2026-04-20 09:15:00',
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
					last_message_preview: '',
					last_message_at: null,
					unread_count: 0,
				},
			],
			currentUserId: 29,
		});

		render(<MessagesPage />);

		expect(await screen.findByText('Nathalie Jean')).toBeInTheDocument();
		expect(
			screen.getByText('Bonjour, votre logement est-il disponible ?'),
		).toBeInTheDocument();

		expect(screen.getByText('Pierrette Martin')).toBeInTheDocument();
		expect(
			screen.getByText('Conversation à propos de Studio lumineux'),
		).toBeInTheDocument();

		expect(router.replace).not.toHaveBeenCalledWith(
			'/login?next=%2Fmessages',
		);
	});

	it("affiche un état vide si aucune conversation n'est disponible", async () => {
		// Cas testé :
		// si le service retourne une liste vide,
		// la page doit afficher un message explicite.
		const router = createRouterMock();

		useRouter.mockReturnValue(router);
		setViewportWidth(375);

		listConversations.mockResolvedValue({
			conversations: [],
			currentUserId: 29,
		});

		render(<MessagesPage />);

		expect(
			await screen.findByText('Aucune conversation pour le moment.'),
		).toBeInTheDocument();
	});

	it('affiche une erreur si le chargement des conversations échoue', async () => {
		// Cas testé :
		// si le service échoue avec une erreur métier,
		// la page doit afficher le message d'erreur reçu.
		const router = createRouterMock();

		useRouter.mockReturnValue(router);
		setViewportWidth(375);

		listConversations.mockRejectedValue(
			new Error('Impossible de récupérer les conversations.'),
		);

		render(<MessagesPage />);

		expect(
			await screen.findByText(
				'Impossible de récupérer les conversations.',
			),
		).toBeInTheDocument();
	});

	it("redirige vers /login si l'utilisateur n'est pas authentifié", async () => {
		// Cas testé :
		// si le service signale une absence d'authentification,
		// la page doit rediriger vers l'écran de connexion avec retour.
		const router = createRouterMock();

		useRouter.mockReturnValue(router);
		setViewportWidth(375);

		listConversations.mockRejectedValue(
			new Error('Authentification requise.'),
		);

		render(<MessagesPage />);

		await waitFor(() => {
			expect(router.replace).toHaveBeenCalledWith(
				'/login?next=%2Fmessages',
			);
		});
	});
});
