/**
 * @file vitest.setup.js
 * @description
 * Initialise l'environnement commun des tests Vitest.
 *
 * Ce fichier est chargé avant l'exécution des fichiers de test.
 * Il active les matchers DOM de Testing Library, configure l'URL de base
 * de l'API pour les tests et démarre le serveur MSW chargé d'intercepter
 * les appels HTTP.
 */

import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll } from 'vitest';

import { server } from '@/tests/msw/server';

/**
 * URL de base utilisée par le client API pendant les tests.
 *
 * La valeur est définie seulement si elle n'existe pas déjà dans
 * l'environnement, afin de permettre une surcharge ponctuelle si nécessaire.
 */
process.env.API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

/**
 * Démarre le serveur MSW avant l'ensemble des tests.
 *
 * Toute requête HTTP non interceptée provoque une erreur, ce qui évite
 * les appels réseau réels ou les mocks incomplets.
 */
beforeAll(() => {
	server.listen({ onUnhandledRequest: 'error' });
});

/**
 * Réinitialise les handlers MSW après chaque test.
 *
 * Cela évite qu'un handler surchargé avec server.use() dans un test
 * influence les tests suivants.
 */
afterEach(() => {
	server.resetHandlers();
});

/**
 * Arrête le serveur MSW après l'exécution complète de la suite de tests.
 */
afterAll(() => {
	server.close();
});
