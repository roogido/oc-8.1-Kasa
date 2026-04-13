/**
 * @file src/tests/msw/handlers.js
 * @description
 * Handlers MSW communs du projet Kasa.
 */

import { http, HttpResponse } from 'msw';

const API_BASE_URL = 'http://localhost:3000';

export const handlers = [
	http.get(`${API_BASE_URL}/api/properties`, () => {
		return HttpResponse.json([]);
	}),
];
