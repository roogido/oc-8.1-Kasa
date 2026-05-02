/**
 * @file vitest.config.mjs
 * @description
 * Configure Vitest pour les tests du projet Kasa.
 *
 * Ce fichier est lu au démarrage de Vitest. Il adapte l'environnement de test
 * au projet Next.js/Kasa : support de React, JSX dans les fichiers .js,
 * environnement DOM simulé, fichier de setup global, CSS et alias d'import.
 */

import path from 'node:path';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { transformWithOxc } from 'vite';

/**
 * Transforme les fichiers .js contenant du JSX avant leur analyse par Vitest.
 *
 * Next.js accepte couramment du JSX dans des fichiers .js. Ce plugin aligne
 * le comportement de Vitest/Vite sur cette convention afin d'éviter les erreurs
 * de parsing pendant les tests.
 *
 * @returns {import('vite').Plugin}
 */
function transformJsxInJs() {
	return {
		name: 'transform-jsx-in-js',
		enforce: 'pre',
		async transform(code, id) {
			if (!id.endsWith('.js')) {
				return null;
			}

			return transformWithOxc(code, id, {
				lang: 'jsx',
			});
		},
	};
}

export default defineConfig({
	plugins: [
		// Supporte les fichiers .js contenant du JSX, fréquents dans Next.js.
		transformJsxInJs(),

		// Active le support React/JSX standard côté Vitest/Vite.
		react(),
	],

	test: {
		// Simule un navigateur pour tester les composants React avec le DOM.
		environment: 'jsdom',

		// Charge l'initialisation commune avant les fichiers de test.
		setupFiles: ['./vitest.setup.js'],

		// Rend describe(), it(), expect() et vi() disponibles sans import.
		globals: true,

		// Permet aux tests de charger les imports CSS des composants.
		css: true,
	},

	resolve: {
		alias: {
			// Aligne l'alias @ sur la racine src du projet.
			'@': path.resolve(__dirname, './src'),
		},
	},
});
