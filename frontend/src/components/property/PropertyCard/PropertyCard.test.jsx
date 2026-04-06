/**
 * @file src/components/property/PropertyCard/PropertyCard.test.jsx
 * @description
 * Tests unitaires de la carte logement et du toggle favori.
 *       Ici, on teste :
 *          - l’état favori initial lu depuis localStorage
 *          - le clic sur le coeur
 *          - aria-pressed
 *          - le libellé du bouton qui change
 *
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import PropertyCard from './PropertyCard';

vi.mock('next/link', () => ({
	default: ({ children, href, ...props }) => (
		<a href={href} {...props}>
			{children}
		</a>
	),
}));

vi.mock('next/image', () => ({
	default: ({ alt, fill, ...props }) => {
		// eslint-disable-next-line @next/next/no-img-element
		return <img alt={alt} {...props} />;
	},
}));

describe('PropertyCard', () => {
	beforeEach(() => {
		window.localStorage.clear();
	});

	it('affiche un bouton non actif par défaut si le logement n’est pas favori', () => {
		render(
			<PropertyCard
				propertyId="10"
				title="Appartement cosy"
				location="Paris"
				price={100}
				image="/placeholder-property.png"
				imageAlt="Appartement cosy"
				href="/properties/10"
			/>,
		);

		const button = screen.getByRole('button', {
			name: 'Ajouter ce logement aux favoris',
		});

		expect(button).toHaveAttribute('aria-pressed', 'false');
	});

	it('lit l’état favori initial depuis localStorage', () => {
		window.localStorage.setItem('kasa:favorites', JSON.stringify(['10']));

		render(
			<PropertyCard
				propertyId="10"
				title="Appartement cosy"
				location="Paris"
				price={100}
				image="/placeholder-property.png"
				imageAlt="Appartement cosy"
				href="/properties/10"
			/>,
		);

		const button = screen.getByRole('button', {
			name: 'Retirer ce logement des favoris',
		});

		expect(button).toHaveAttribute('aria-pressed', 'true');
	});

	it('bascule en favori au clic et persiste l’id', async () => {
		const user = userEvent.setup();

		render(
			<PropertyCard
				propertyId="10"
				title="Appartement cosy"
				location="Paris"
				price={100}
				image="/placeholder-property.png"
				imageAlt="Appartement cosy"
				href="/properties/10"
			/>,
		);

		const button = screen.getByRole('button', {
			name: 'Ajouter ce logement aux favoris',
		});

		await user.click(button);

		expect(button).toHaveAttribute('aria-pressed', 'true');
		expect(button).toHaveAccessibleName('Retirer ce logement des favoris');
		expect(
			JSON.parse(window.localStorage.getItem('kasa:favorites')),
		).toEqual(['10']);
	});

	it('retire un favori au clic si déjà présent', async () => {
		const user = userEvent.setup();
		window.localStorage.setItem('kasa:favorites', JSON.stringify(['10']));

		render(
			<PropertyCard
				propertyId="10"
				title="Appartement cosy"
				location="Paris"
				price={100}
				image="/placeholder-property.png"
				imageAlt="Appartement cosy"
				href="/properties/10"
			/>,
		);

		const button = screen.getByRole('button', {
			name: 'Retirer ce logement des favoris',
		});

		await user.click(button);

		expect(button).toHaveAttribute('aria-pressed', 'false');
		expect(button).toHaveAccessibleName('Ajouter ce logement aux favoris');
		expect(
			JSON.parse(window.localStorage.getItem('kasa:favorites')),
		).toEqual([]);
	});
});
