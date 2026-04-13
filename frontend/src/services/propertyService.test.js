/**
 * @file src/services/propertyService.test.js
 * @description
 * Tests du service métier des propriétés avec MSW.
 *
 * Ce fichier vérifie principalement :
 *      - la récupération de la liste Home via getHomeProperties()
 *      - le mapping des données backend vers le contrat UI attendu
 *      - le tri des cartes Home par prix croissant
 *      - la gestion des réponses vides
 *      - la gestion des erreurs API
 *      - la récupération du détail d'un logement via getPropertyDetail()
 *      - le mapping des données détail : galerie, hôte, équipements, catégories
 *      - le comportement attendu sur 404 et sur erreur backend
 *
 * Exécution de ce fichier uniquement :
 *      - npx vitest run src/services/propertyService.test.js
 *
 * Exécution de tous les tests :
 *      - npm run test
 *
 * Exécution des tests en mode watch :
 *      - npm run test:watch
 */

import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';

import { server } from '@/tests/msw/server';
import {
	getHomeProperties,
	getPropertyDetail,
} from '@/services/propertyService';

const API_BASE_URL = 'http://localhost:3000';

describe('propertyService.getHomeProperties', () => {
	it('retourne les propriétés mappées et triées par prix croissant', async () => {
		server.use(
			http.get(`${API_BASE_URL}/api/properties`, () => {
				// On simule ici une réponse backend contenant
				// deux logements dans un ordre non trié par prix.
				return HttpResponse.json([
					{
						id: 2,
						slug: 'logement-b',
						title: 'Logement B',
						description: 'Description B',
						cover: 'https://example.com/b.jpg',
						location: 'Paris',
						price_per_night: 140,
						rating_avg: 4,
						ratings_count: 12,
						host: {
							id: 11,
							name: 'Hôte B',
							picture: 'https://example.com/host-b.jpg',
						},
					},
					{
						id: 1,
						slug: 'logement-a',
						title: 'Logement A',
						description: 'Description A',
						cover: 'https://example.com/a.jpg',
						location: 'Lyon',
						price_per_night: 90,
						rating_avg: 5,
						ratings_count: 8,
						host: {
							id: 10,
							name: 'Hôte A',
							picture: 'https://example.com/host-a.jpg',
						},
					},
				]);
			}),
		);

		const properties = await getHomeProperties();

		// On vérifie d'abord que deux cartes sont bien renvoyées.
		expect(properties).toHaveLength(2);

		// Puis on vérifie que le mapping vers le format UI est correct
		// et que le tri par prix croissant a bien été appliqué.
		expect(properties[0]).toMatchObject({
			propertyId: '1',
			title: 'Logement A',
			location: 'Lyon',
			price: 90,
			image: 'https://example.com/a.jpg',
			imageAlt: 'Photo du logement Logement A',
		});
		expect(properties[1]).toMatchObject({
			propertyId: '2',
			title: 'Logement B',
			location: 'Paris',
			price: 140,
			image: 'https://example.com/b.jpg',
			imageAlt: 'Photo du logement Logement B',
		});
	});

	it("retourne un tableau vide si l'API renvoie une liste vide", async () => {
		server.use(
			http.get(`${API_BASE_URL}/api/properties`, () => {
				// Ce scénario vérifie le comportement du service
				// si aucun logement n'est renvoyé par l'API.
				return HttpResponse.json([]);
			}),
		);

		const properties = await getHomeProperties();

		expect(properties).toEqual([]);
	});

	it("lève une erreur si l'API répond en erreur", async () => {
		server.use(
			http.get(`${API_BASE_URL}/api/properties`, () => {
				// On simule ici une indisponibilité backend
				// pour vérifier la bonne remontée de l'erreur.
				return HttpResponse.json(
					{ message: 'Backend indisponible.' },
					{ status: 503 },
				);
			}),
		);

		await expect(getHomeProperties()).rejects.toThrow(
			'Backend indisponible.',
		);
	});
});

describe('propertyService.getPropertyDetail', () => {
	it("retourne le détail d'un logement mappé au format UI attendu", async () => {
		server.use(
			http.get(`${API_BASE_URL}/api/properties/42`, () => {
				// On simule ici un logement complet tel qu'il pourrait
				// être renvoyé par le backend sur la page détail.
				return HttpResponse.json({
					id: 42,
					slug: 'super-logement',
					title: 'Super logement',
					description: 'Un logement très agréable.',
					cover: 'https://example.com/cover.jpg',
					location: 'Marseille',
					price_per_night: 160,
					rating_avg: 4.4,
					ratings_count: 18,
					host: {
						id: 7,
						name: 'Nathalie Jean',
						picture: 'https://example.com/host.jpg',
					},
					pictures: [
						'https://example.com/picture-1.jpg',
						'https://example.com/picture-2.jpg',
					],
					equipments: ['Wi-Fi', 'Cuisine', 'Climatisation'],
					tags: ['Vue mer', 'Famille'],
				});
			}),
		);

		const property = await getPropertyDetail('42');

		// Le service doit retourner un objet exploitable par l'UI.
		expect(property).not.toBeNull();

		// On vérifie le mapping principal des champs métier.
		expect(property).toMatchObject({
			id: '42',
			title: 'Super logement',
			location: 'Marseille',
			description: 'Un logement très agréable.',
			equipments: ['Wi-Fi', 'Cuisine', 'Climatisation'],
			categories: ['Vue mer', 'Famille'],
			host: {
				name: 'Nathalie Jean',
				rating: 4,
				avatar: 'https://example.com/host.jpg',
				avatarAlt: "Photo de l'hôte Nathalie Jean",
			},
		});

		// On vérifie aussi la galerie, qui doit inclure
		// la cover puis les autres images.
		expect(property.gallery.images).toHaveLength(3);
		expect(property.gallery.images[0]).toMatchObject({
			id: 'image-1',
			src: 'https://example.com/cover.jpg',
			alt: 'Image principale du logement Super logement',
		});
		expect(property.gallery.images[1]).toMatchObject({
			id: 'image-2',
			src: 'https://example.com/picture-1.jpg',
		});
		expect(property.gallery.images[2]).toMatchObject({
			id: 'image-3',
			src: 'https://example.com/picture-2.jpg',
		});
	});

	it('retourne null si le backend répond 404', async () => {
		server.use(
			http.get(`${API_BASE_URL}/api/properties/404`, () => {
				// Un 404 ne doit pas remonter comme une erreur technique :
				// on attend simplement null côté service.
				return HttpResponse.json(
					{ message: 'Logement introuvable.' },
					{ status: 404 },
				);
			}),
		);

		await expect(getPropertyDetail('404')).resolves.toBeNull();
	});

	it('lève une erreur si le backend répond une erreur autre que 404', async () => {
		server.use(
			http.get(`${API_BASE_URL}/api/properties/500`, () => {
				// Ce cas vérifie qu'une vraie erreur backend
				// reste bien propagée par le service.
				return HttpResponse.json(
					{ message: 'Erreur serveur.' },
					{ status: 500 },
				);
			}),
		);

		await expect(getPropertyDetail('500')).rejects.toThrow(
			'Erreur serveur.',
		);
	});

	it('retourne null si propertyId est vide ou invalide', async () => {
		// Sans identifiant exploitable, le service ne doit pas
		// tenter de requête inutile et retourne simplement null.
		await expect(getPropertyDetail('')).resolves.toBeNull();
	});
});
