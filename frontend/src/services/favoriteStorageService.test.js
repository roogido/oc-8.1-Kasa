/**
 * @file src/services/favoriteStorageService.test.js
 * @description
 * Tests unitaires du service local de favoris.
 */

import {
	addFavorite,
	getFavoriteIds,
	isFavorite,
	removeFavorite,
	toggleFavorite,
} from './favoriteStorageService';

describe('favoriteStorageService', () => {
	beforeEach(() => {
		window.localStorage.clear();
	});

	it('retourne un tableau vide si aucun favori n’est stocké', () => {
		expect(getFavoriteIds()).toEqual([]);
	});

	it('ajoute un favori', () => {
		const result = addFavorite('12');

		expect(result).toEqual(['12']);
		expect(getFavoriteIds()).toEqual(['12']);
		expect(isFavorite('12')).toBe(true);
	});

	it('ne duplique pas un favori déjà présent', () => {
		addFavorite('12');
		addFavorite('12');

		expect(getFavoriteIds()).toEqual(['12']);
	});

	it('retire un favori', () => {
		addFavorite('12');
		addFavorite('18');

		const result = removeFavorite('12');

		expect(result).toEqual(['18']);
		expect(isFavorite('12')).toBe(false);
		expect(isFavorite('18')).toBe(true);
	});

	it('ignore les identifiants vides', () => {
		addFavorite('');
		addFavorite('   ');
		addFavorite(null);
		addFavorite(undefined);

		expect(getFavoriteIds()).toEqual([]);
	});

	it('toggleFavorite ajoute un favori absent', () => {
		const result = toggleFavorite('42');

		expect(result).toEqual({
			favoriteIds: ['42'],
			isFavorite: true,
		});
		expect(getFavoriteIds()).toEqual(['42']);
	});

	it('toggleFavorite retire un favori présent', () => {
		addFavorite('42');

		const result = toggleFavorite('42');

		expect(result).toEqual({
			favoriteIds: [],
			isFavorite: false,
		});
		expect(getFavoriteIds()).toEqual([]);
	});
});
