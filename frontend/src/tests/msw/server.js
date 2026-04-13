/**
 * @file src/tests/msw/server.js
 * @description
 * Serveur MSW pour les tests Vitest en environnement Node/jsdom.
 */

import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
