/**
 * @file src/components/property/PropertyGallery/PropertyGallery.test.jsx
 * @description
 * Tests unitaires du carrousel de la page détail logement.
 *
 * Ce fichier vérifie principalement :
 *      - l'affichage initial de la première image ;
 *      - la navigation vers l'image suivante au clic ;
 *      - la boucle vers la dernière image depuis la première ;
 *      - l'accessibilité clavier via les boutons natifs du carrousel ;
 *      - le masquage des contrôles s'il n'y a qu'une seule image ;
 *      - l'affichage d'un état vide si aucune image n'est fournie.
 *
 * Exécuter ce fichier uniquement :
 *      - npx vitest run src/components/property/PropertyGallery/PropertyGallery.test.jsx
 *
 * Exécuter tous les tests :
 *      - npm run test
 *
 * Exécuter les tests en mode watch :
 *      - npm run test:watch
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import PropertyGallery from './PropertyGallery';

vi.mock('next/image', () => ({
	default: ({ alt, fill, priority, ...props }) => {
		// On remplace next/image par un simple <img> dans les tests
		// pour éviter les contraintes spécifiques de Next.js.
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

		// Au chargement initial, le carrousel doit montrer la première image
		// et afficher le compteur correspondant.
		expect(screen.getByAltText('Image 1')).toBeInTheDocument();
		expect(screen.getByText('1 / 3')).toBeInTheDocument();
	});

	it('passe à l’image suivante au clic', async () => {
		const user = userEvent.setup();

		render(<PropertyGallery images={multipleImages} />);

		// Un clic sur le bouton "Image suivante" doit avancer d'une image.
		await user.click(
			screen.getByRole('button', { name: 'Image suivante' }),
		);

		expect(screen.getByAltText('Image 2')).toBeInTheDocument();
		expect(screen.getByText('2 / 3')).toBeInTheDocument();
	});

	it('revient à la dernière image depuis la première', async () => {
		const user = userEvent.setup();

		render(<PropertyGallery images={multipleImages} />);

		// Si on est sur la première image et qu'on clique sur
		// "Image précédente", le carrousel doit boucler sur la dernière.
		await user.click(
			screen.getByRole('button', { name: 'Image précédente' }),
		);

		expect(screen.getByAltText('Image 3')).toBeInTheDocument();
		expect(screen.getByText('3 / 3')).toBeInTheDocument();
	});

	it('permet la navigation au clavier via les boutons du carrousel', async () => {
		const user = userEvent.setup();

		render(<PropertyGallery images={multipleImages} />);

		const nextButton = screen.getByRole('button', {
			name: 'Image suivante',
		});

		// On vérifie qu'un utilisateur clavier peut focaliser le bouton
		// puis activer la navigation avec Entrée.
		nextButton.focus();
		expect(nextButton).toHaveFocus();

		await user.keyboard('{Enter}');

		expect(screen.getByAltText('Image 2')).toBeInTheDocument();
		expect(screen.getByText('2 / 3')).toBeInTheDocument();
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

		// Avec une seule image, les flèches et le compteur ne doivent
		// pas être affichés.
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

		// Si aucune image n'est transmise, un message de remplacement
		// doit être rendu à la place du carrousel.
		expect(
			screen.getByText('Aucune image disponible pour ce logement.'),
		).toBeInTheDocument();
	});
});
