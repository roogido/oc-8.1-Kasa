/**
 * @file scripts/tests/test-auth-rate-limit.js
 * @description
 * Script de test manuel automatisé pour vérifier la limitation de débit
 * sur les routes sensibles d'authentification du backend Kasa.
 *
 * Ce script envoie plusieurs requêtes HTTP successives vers :
 *      - POST /auth/request-reset
 *      - POST /auth/reset-password
 *
 * Il permet de vérifier rapidement que :
 *      - le rate limiting se déclenche bien au bon seuil ;
 *      - la réponse HTTP 429 est bien renvoyée ;
 *      - les routes restent accessibles avant d'atteindre la limite.
 *
 * Pré-requis :
 *      - le backend local doit être démarré ;
 *      - le fichier .env backend doit contenir au minimum PORT ;
 *      - MAIL_TEST_TO peut être défini pour fournir un e-mail de test.
 *
 * Exécution :
 *      - depuis le dossier backend :
 *        node scripts/tests/test-auth-rate-limit.js
 *
 * Remarque :
 *      - ce script ne remplace pas de vrais tests d'intégration ;
 *      - il sert de vérification rapide et pratique pendant le développement.
 *
 * Exécution :
 *      node scripts/tests/test-auth-rate-limit.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const BASE_URL = `http://localhost:${process.env.PORT || 3000}`;
const TEST_EMAIL = process.env.MAIL_TEST_TO;

if (!TEST_EMAIL) {
	throw new Error('MAIL_TEST_TO doit etre defini dans le fichier .env');
}

async function postJson(url, body) {
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: JSON.stringify(body),
	});

	let data = null;

	try {
		data = await response.json();
	} catch (error) {
		data = null;
	}

	return {
		status: response.status,
		data,
	};
}

async function runRequestResetTest() {
	console.log('\n=== Test rate limit: POST /auth/request-reset ===');

	for (let attempt = 1; attempt <= 6; attempt += 1) {
		const result = await postJson(`${BASE_URL}/auth/request-reset`, {
			email: TEST_EMAIL,
		});

		console.log(
			`Tentative ${attempt}: HTTP ${result.status} | ${JSON.stringify(result.data)}`,
		);
	}
}

async function runResetPasswordTest() {
	console.log('\n=== Test rate limit: POST /auth/reset-password ===');

	for (let attempt = 1; attempt <= 11; attempt += 1) {
		const result = await postJson(`${BASE_URL}/auth/reset-password`, {
			token: 'dummy-test-token',
			password: 'Aa!12345',
		});

		console.log(
			`Tentative ${attempt}: HTTP ${result.status} | ${JSON.stringify(result.data)}`,
		);
	}
}

async function main() {
	console.log(`Base URL: ${BASE_URL}`);
	console.log(`E-mail de test: ${TEST_EMAIL}`);

	await runRequestResetTest();
	await runResetPasswordTest();

	console.log('\nTest terminé.');
}

main().catch((error) => {
	console.error('Erreur pendant le test de rate limit:', error);
	process.exit(1);
});
