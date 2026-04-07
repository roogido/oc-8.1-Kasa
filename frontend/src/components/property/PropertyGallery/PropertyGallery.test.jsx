/**
 * @file src/components/property/PropertyGallery/PropertyGallery.test.jsx
 * @description
 * Tests unitaires du carrousel de la page détail logement.
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import PropertyGallery from './PropertyGallery';

vi.mock('next/image', () => ({
	default: ({ alt, fill, priority, ...props }) => {
		// eslint-disable-next-line @next/next/no-img-element
		return <img alt={alt} {...props} />;
	},
}));

describe('PropertyGallery', () => {
	const multipleImages = [
		{
			id: 'image-1',
			src: '/image-1.jpg',
			alt: 'Image 1',
		},
		{
			id: 'image-2',
			src: '/image-2.jpg',
			alt: 'Image 2',
		},
		{
			id: 'image-3',
			src: '/image-3.jpg',
			alt: 'Image 3',
		},
	];

	it('affiche la première image par défaut', () => {
		render(<PropertyGallery images={multipleImages} />);

		expect(screen.getByAltText('Image 1')).toBeInTheDocument();
		expect(screen.getByText('1 / 3')).toBeInTheDocument();
	});

	it('passe à l’image suivante au clic', async () => {
		const user = userEvent.setup();

		render(<PropertyGallery images={multipleImages} />);

		await user.click(
			screen.getByRole('button', { name: 'Image suivante' }),
		);

		expect(screen.getByAltText('Image 2')).toBeInTheDocument();
		expect(screen.getByText('2 / 3')).toBeInTheDocument();
	});

	it('revient à la dernière image depuis la première', async () => {
		const user = userEvent.setup();

		render(<PropertyGallery images={multipleImages} />);

		await user.click(
			screen.getByRole('button', { name: 'Image précédente' }),
		);

		expect(screen.getByAltText('Image 3')).toBeInTheDocument();
		expect(screen.getByText('3 / 3')).toBeInTheDocument();
	});

	it('masque les contrôles quand il n’y a qu’une image', () => {
		render(
			<PropertyGallery
				images={[
					{
						id: 'image-1',
						src: '/image-1.jpg',
						alt: 'Image unique',
					},
				]}
			/>,
		);

		expect(screen.getByAltText('Image unique')).toBeInTheDocument();
		expect(
			screen.queryByRole('button', { name: 'Image précédente' }),
		).not.toBeInTheDocument();
		expect(
			screen.queryByRole('button', { name: 'Image suivante' }),
		).not.toBeInTheDocument();
		expect(screen.queryByText('1 / 1')).not.toBeInTheDocument();
	});

	it('affiche un état vide si aucune image n’est disponible', () => {
		render(<PropertyGallery images={[]} />);

		expect(
			screen.getByText('Aucune image disponible pour ce logement.'),
		).toBeInTheDocument();
	});
});
