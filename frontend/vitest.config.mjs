/**
 * @file vitest.config.mjs
 * @description
 * Configuration Vitest du projet Kasa.
 */

import path from 'node:path';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { transformWithOxc } from 'vite';

/**
 * Transforme les fichiers .js contenant du JSX
 * pour les tests Vitest / Vite.
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
				lang: "jsx",
			});
		},
	};
}

export default defineConfig({
	plugins: [transformJsxInJs(), react()],
	test: {
		environment: 'jsdom',
		setupFiles: ['./vitest.setup.js'],
		globals: true,
		css: true,
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
});
