/**
 * @file vitest.setup.js
 * @description
 * Initialisation commune des tests Vitest.
 */

import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll } from 'vitest';

import { server } from '@/tests/msw/server';

process.env.API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

beforeAll(() => {
	server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
	server.resetHandlers();
});

afterAll(() => {
	server.close();
});
