/**
 * @file src/components/property/PropertyCard/PropertyCard.test.jsx
 * @description
 * Tests unitaires de la carte logement et du bouton de favoris.
 *
 * Ce fichier vérifie principalement :
 *      - l'état initial du bouton favori quand le logement n'est pas encore enregistré ;
 *      - la lecture correcte d'un favori déjà présent dans le localStorage ;
 *      - l'ajout d'un favori au clic avec persistance de l'identifiant ;
 *      - le retrait d'un favori déjà présent avec mise à jour du localStorage.
 *
 * Exécuter ce fichier uniquement :
 *      - npx vitest run src/components/property/PropertyCard/PropertyCard.test.jsx
 *
 * Exécuter tous les tests :
 *      - npm run test
 *
 * Exécuter les tests en mode watch :
 *      - npm run test:watch
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import PropertyCard from './PropertyCard';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { getFavoritesStorageKey } from '@/services/favoriteStorageService';

vi.mock('next/link', () => ({
	default: ({ children, href, ...props }) => (
		<a href={href} {...props}>
			{children}
		</a>
	),
}));

vi.mock('next/image', () => ({
	default: ({ alt, fill, priority, ...props }) => {
		// On remplace next/image par une simple balise img dans les tests
		// pour éviter les contraintes spécifiques à Next.js.
		// eslint-disable-next-line @next/next/no-img-element
		return <img alt={alt} {...props} />;
	},
}));

/**
 * Portée de stockage utilisée dans ces tests.
 *
 * Les favoris sont désormais scindés par portée utilisateur,
 * donc les tests doivent cibler explicitement la portée invitée.
 */
const FAVORITES_TEST_SCOPE = 'guest';
const FAVORITES_STORAGE_KEY = getFavoritesStorageKey(FAVORITES_TEST_SCOPE);

/**
 * Propriétés par défaut d'une carte logement de test.
 *
 * Elles servent de base commune pour éviter de répéter
 * le même objet dans chaque scénario.
 */
const baseProps = {
	propertyId: '10',
	title: 'Appartement cosy',
	location: 'Paris',
	price: 100,
	image: '/placeholder-property.png',
	imageAlt: 'Appartement cosy',
	href: '/properties/10',
};

/**
 * Rend le composant dans le FavoritesProvider, car PropertyCard
 * dépend du contexte des favoris.
 *
 * @param {Object} [props={}]
 * @returns {import('@testing-library/react').RenderResult}
 */
function renderPropertyCard(props = {}) {
	return render(
		<FavoritesProvider storageScope={FAVORITES_TEST_SCOPE}>
			<PropertyCard {...baseProps} {...props} />
		</FavoritesProvider>,
	);
}

describe('PropertyCard', () => {
	beforeEach(() => {
		// On repart d'un stockage local vide avant chaque test
		// pour éviter les effets de bord entre scénarios.
		window.localStorage.clear();
	});

	it('affiche un bouton non actif par défaut si le logement n’est pas favori', () => {
		renderPropertyCard();

		// Sans favori préexistant, le bouton doit être inactif
		// et proposer l'ajout aux favoris.
		const button = screen.getByRole('button', {
			name: 'Ajouter ce logement aux favoris',
		});

		expect(button).toHaveAttribute('aria-pressed', 'false');
	});

	it('lit l’état favori initial depuis localStorage', () => {
		// On simule un logement déjà enregistré dans les favoris.
		window.localStorage.setItem(
			FAVORITES_STORAGE_KEY,
			JSON.stringify(['10']),
		);

		renderPropertyCard();

		// Le composant doit refléter immédiatement cet état initial.
		const button = screen.getByRole('button', {
			name: 'Retirer ce logement des favoris',
		});

		expect(button).toHaveAttribute('aria-pressed', 'true');
	});

	it('bascule en favori au clic et persiste l’identifiant', async () => {
		const user = userEvent.setup();

		renderPropertyCard();

		const button = screen.getByRole('button', {
			name: 'Ajouter ce logement aux favoris',
		});

		// Un clic doit activer le favori et l'écrire dans le localStorage.
		await user.click(button);

		expect(button).toHaveAttribute('aria-pressed', 'true');
		expect(button).toHaveAccessibleName('Retirer ce logement des favoris');
		expect(
			JSON.parse(window.localStorage.getItem(FAVORITES_STORAGE_KEY)),
		).toEqual(['10']);
	});

	it('retire un favori au clic si déjà présent', async () => {
		const user = userEvent.setup();

		// On part cette fois d'un favori déjà existant.
		window.localStorage.setItem(
			FAVORITES_STORAGE_KEY,
			JSON.stringify(['10']),
		);

		renderPropertyCard();

		const button = screen.getByRole('button', {
			name: 'Retirer ce logement des favoris',
		});

		// Un clic doit retirer le favori et vider la persistance locale.
		await user.click(button);

		expect(button).toHaveAttribute('aria-pressed', 'false');
		expect(button).toHaveAccessibleName('Ajouter ce logement aux favoris');
		expect(
			JSON.parse(window.localStorage.getItem(FAVORITES_STORAGE_KEY)),
		).toEqual([]);
	});
});
