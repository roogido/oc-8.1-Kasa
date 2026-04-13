/**
 * @file src/services/propertyService.test.js
 * @description
 * Tests du service de proprietes avec MSW.
 */

import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';

import { server } from '@/tests/msw/server';
import { getHomeProperties } from '@/services/propertyService';

const API_BASE_URL = 'http://localhost:3000';

describe('propertyService.getHomeProperties', () => {
	it('retourne les proprietes mappees et triees par prix croissant', async () => {
		server.use(
			http.get(`${API_BASE_URL}/api/properties`, () => {
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
							name: 'Hote B',
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
							name: 'Hote A',
							picture: 'https://example.com/host-a.jpg',
						},
					},
				]);
			}),
		);

		const properties = await getHomeProperties();

		expect(properties).toHaveLength(2);
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
				return HttpResponse.json([]);
			}),
		);

		const properties = await getHomeProperties();

		expect(properties).toEqual([]);
	});

	it("leve une erreur si l'API repond en erreur", async () => {
		server.use(
			http.get(`${API_BASE_URL}/api/properties`, () => {
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
