/**
 * @file src/lib/slug.test.js
 * @description
 * Tests unitaires des helpers de slug de Kasa.
 *
 * Ce fichier vérifie principalement :
 *      - la conversion d'un texte libre en slug URL-friendly ;
 *      - la suppression des accents, caractères spéciaux et séparateurs inutiles ;
 *      - la construction d'un segment de route hybride "id-slug" ;
 *      - l'extraction fiable de l'identifiant depuis un segment de route.
 *
 * Exécuter ce fichier uniquement :
 *      - npx vitest run src/lib/slug.test.js
 *
 * Exécuter tous les tests :
 *      - npm run test
 *
 * Exécuter les tests en mode watch :
 *      - npm run test:watch
 */

import {
	buildPropertyRouteSegment,
	extractPropertyIdFromRouteSegment,
	slugify,
} from './slug';

describe('Helpers de slug', () => {
	describe('slugify', () => {
		it("retourne une chaîne vide si la valeur n'est pas une chaîne", () => {
			// Les valeurs invalides ne doivent pas produire de slug exploitable.
			expect(slugify(null)).toBe('');
			expect(slugify(undefined)).toBe('');
			expect(slugify(123)).toBe('');
		});

		it('transforme une phrase simple en slug', () => {
			// Vérifie le cas nominal le plus simple.
			expect(slugify('Appartement cosy')).toBe('appartement-cosy');
		});

		it('supprime les accents et normalise la casse', () => {
			// Le helper doit produire un slug lisible et stable,
			// sans accents et en minuscules.
			expect(
				slugify('Magnifique appartement proche Canal Saint Martin'),
			).toBe('magnifique-appartement-proche-canal-saint-martin');
			expect(slugify('Île de France')).toBe('ile-de-france');
		});

		it('supprime les caractères spéciaux inutiles', () => {
			// Les caractères non utiles à l'URL doivent être nettoyés.
			expect(slugify("Studio d'artiste !!!")).toBe('studio-d-artiste');
		});

		it('supprime les tirets en trop en début et fin', () => {
			// On évite un slug mal formé avec des tirets parasites.
			expect(slugify('---Appartement cosy---')).toBe('appartement-cosy');
		});

		it('compacte les séparateurs consécutifs', () => {
			// Plusieurs espaces ou séparateurs doivent être fusionnés
			// en un seul tiret.
			expect(slugify('Appartement    cosy___Paris')).toBe(
				'appartement-cosy-paris',
			);
		});
	});

	describe('buildPropertyRouteSegment', () => {
		it('construit un segment hybride id-slug', () => {
			// Le segment final doit concaténer l'identifiant et le slug.
			expect(
				buildPropertyRouteSegment('c67ab8a7', 'Appartement cosy'),
			).toBe('c67ab8a7-appartement-cosy');
		});

		it("retourne seulement l'id si le slug est vide", () => {
			// Si aucun titre exploitable n'est fourni,
			// on conserve au moins l'identifiant.
			expect(buildPropertyRouteSegment('c67ab8a7', '')).toBe('c67ab8a7');
		});

		it("retourne une chaîne vide si l'id est vide", () => {
			// Sans identifiant, aucun segment de route valide ne peut être produit.
			expect(buildPropertyRouteSegment('', 'Appartement cosy')).toBe('');
			expect(buildPropertyRouteSegment(null, 'Appartement cosy')).toBe(
				'',
			);
		});
	});

	describe('extractPropertyIdFromRouteSegment', () => {
		it("retourne l'id si le segment est hybride", () => {
			// Le helper doit extraire proprement l'identifiant
			// de la partie gauche du segment.
			expect(
				extractPropertyIdFromRouteSegment('c67ab8a7-appartement-cosy'),
			).toBe('c67ab8a7');
		});

		it("retourne le segment tel quel s'il n'y a pas de slug", () => {
			// Si le segment ne contient que l'identifiant,
			// il doit être renvoyé tel quel.
			expect(extractPropertyIdFromRouteSegment('c67ab8a7')).toBe(
				'c67ab8a7',
			);
		});

		it('retourne une chaîne vide si le segment est invalide', () => {
			// Les entrées invalides ne doivent pas produire
			// de faux identifiant exploitable.
			expect(extractPropertyIdFromRouteSegment('')).toBe('');
			expect(extractPropertyIdFromRouteSegment(null)).toBe('');
			expect(extractPropertyIdFromRouteSegment(undefined)).toBe('');
		});
	});
});
