/**
 * @file src/services/favoriteStorageService.test.js
 * @description
 * Tests unitaires du service local de favoris.
 *
 * Ce fichier vérifie principalement :
 *      - la lecture des favoris depuis le localStorage ;
 *      - l'ajout d'un favori ;
 *      - l'absence de doublons ;
 *      - le retrait d'un favori ;
 *      - l'ignorance des identifiants invalides ;
 *      - le comportement de toggleFavorite à l'ajout et au retrait.
 *
 * Exécuter ce fichier uniquement :
 *      - npx vitest run src/services/favoriteStorageService.test.js
 *
 * Exécuter tous les tests :
 *      - npm run test
 *
 * Exécuter les tests en mode watch :
 *      - npm run test:watch
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
		// On repart d'un stockage vide avant chaque test
		// pour éviter toute pollution entre scénarios.
		window.localStorage.clear();
	});

	it('retourne un tableau vide si aucun favori n’est stocké', () => {
		// Sans donnée en localStorage, le service doit renvoyer
		// une liste vide et exploitable.
		expect(getFavoriteIds()).toEqual([]);
	});

	it('ajoute un favori', () => {
		// L'ajout doit renvoyer la nouvelle liste, l'écrire en stockage
		// et rendre isFavorite cohérent.
		const result = addFavorite('12');

		expect(result).toEqual(['12']);
		expect(getFavoriteIds()).toEqual(['12']);
		expect(isFavorite('12')).toBe(true);
	});

	it('ne duplique pas un favori déjà présent', () => {
		// Deux ajouts successifs du même identifiant ne doivent pas
		// créer de doublon.
		addFavorite('12');
		addFavorite('12');

		expect(getFavoriteIds()).toEqual(['12']);
	});

	it('retire un favori', () => {
		// Le retrait doit supprimer uniquement l'identifiant ciblé
		// et conserver les autres favoris.
		addFavorite('12');
		addFavorite('18');

		const result = removeFavorite('12');

		expect(result).toEqual(['18']);
		expect(isFavorite('12')).toBe(false);
		expect(isFavorite('18')).toBe(true);
	});

	it('ignore les identifiants vides', () => {
		// Les valeurs invalides ne doivent rien écrire dans le stockage.
		addFavorite('');
		addFavorite('   ');
		addFavorite(null);
		addFavorite(undefined);

		expect(getFavoriteIds()).toEqual([]);
	});

	it('toggleFavorite ajoute un favori absent', () => {
		// Si le favori n'existe pas encore, toggleFavorite doit l'ajouter
		// et indiquer qu'il est désormais actif.
		const result = toggleFavorite('42');

		expect(result).toEqual({
			favoriteIds: ['42'],
			isFavorite: true,
		});
		expect(getFavoriteIds()).toEqual(['42']);
	});

	it('toggleFavorite retire un favori présent', () => {
		// Si le favori existe déjà, toggleFavorite doit le retirer
		// et indiquer qu'il n'est plus actif.
		addFavorite('42');

		const result = toggleFavorite('42');

		expect(result).toEqual({
			favoriteIds: [],
			isFavorite: false,
		});
		expect(getFavoriteIds()).toEqual([]);
	});
});
