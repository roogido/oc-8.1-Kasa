/**
 * @file src/lib/slug.test.js
 * @description
 * Tests unitaires des helpers de slug de Kasa.
 */

import {
	buildPropertyRouteSegment,
	extractPropertyIdFromRouteSegment,
	slugify,
} from './slug';

describe('slug helpers', () => {
	describe('slugify', () => {
		it('retourne une chaine vide si la valeur n est pas une chaine', () => {
			expect(slugify(null)).toBe('');
			expect(slugify(undefined)).toBe('');
			expect(slugify(123)).toBe('');
		});

		it('transforme une phrase simple en slug', () => {
			expect(slugify('Appartement cosy')).toBe('appartement-cosy');
		});

		it('supprime les accents et normalise la casse', () => {
			expect(slugify('Magnifique appartement proche Canal Saint Martin'))
				.toBe('magnifique-appartement-proche-canal-saint-martin');
			expect(slugify('Île de France')).toBe('ile-de-france');
		});

		it('supprime les caracteres speciaux inutiles', () => {
			expect(slugify("Studio d'artiste !!!")).toBe('studio-d-artiste');
		});

		it('supprime les tirets en trop en debut et fin', () => {
			expect(slugify('---Appartement cosy---')).toBe('appartement-cosy');
		});

		it('compacte les separateurs consecutifs', () => {
			expect(slugify('Appartement    cosy___Paris')).toBe(
				'appartement-cosy-paris',
			);
		});
	});

	describe('buildPropertyRouteSegment', () => {
		it('construit un segment hybride id-slug', () => {
			expect(
				buildPropertyRouteSegment('c67ab8a7', 'Appartement cosy'),
			).toBe('c67ab8a7-appartement-cosy');
		});

		it('retourne seulement l id si le slug est vide', () => {
			expect(buildPropertyRouteSegment('c67ab8a7', '')).toBe('c67ab8a7');
		});

		it('retourne une chaine vide si l id est vide', () => {
			expect(buildPropertyRouteSegment('', 'Appartement cosy')).toBe('');
			expect(buildPropertyRouteSegment(null, 'Appartement cosy')).toBe('');
		});
	});

	describe('extractPropertyIdFromRouteSegment', () => {
		it('retourne l id si le segment est hybride', () => {
			expect(
				extractPropertyIdFromRouteSegment(
					'c67ab8a7-appartement-cosy',
				),
			).toBe('c67ab8a7');
		});

		it('retourne le segment tel quel s il n y a pas de slug', () => {
			expect(extractPropertyIdFromRouteSegment('c67ab8a7')).toBe(
				'c67ab8a7',
			);
		});

		it('retourne une chaine vide si le segment est invalide', () => {
			expect(extractPropertyIdFromRouteSegment('')).toBe('');
			expect(extractPropertyIdFromRouteSegment(null)).toBe('');
			expect(extractPropertyIdFromRouteSegment(undefined)).toBe('');
		});
	});
});
