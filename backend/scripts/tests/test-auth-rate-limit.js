/**
 * @file scripts/tests/test-auth-rate-limit.js
 * @description
 * Script de test manuel automatisé pour vérifier la limitation de débit
 * sur les routes sensibles d'authentification du backend Kasa.
 *
 * Ce script teste :
 * - POST /auth/register
 * - POST /auth/request-reset
 * - POST /auth/reset-password
 *
 * Il vérifie que :
 * - les premières requêtes passent sans HTTP 429 ;
 * - la tentative immédiatement après le seuil configuré renvoie HTTP 429 ;
 * - le backend reste cohérent dans ses réponses.
 *
 * Pré-requis :
 * - le backend local doit être démarré ;
 * - le fichier .env backend doit contenir au minimum PORT ;
 * - les seuils ci-dessous doivent être alignés avec
 *   backend/middlewares/rateLimit.js
 *
 * Exécution :
 * - depuis le dossier backend :
 *   node scripts/tests/test-auth-rate-limit.js
 *
 * Remarques :
 * - ce script ne remplace pas de vrais tests d'intégration ;
 * - il sert de vérification rapide pendant le développement ;
 * - il n'utilise aucune adresse e-mail personnelle en dur ;
 * - le test de /auth/change-password n'est pas inclus ici car il exige
 *   un utilisateur authentifié et un mot de passe actuel valide.
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const BASE_URL = `http://localhost:${process.env.PORT || 3000}`;

const REGISTER_TEST_EMAIL_PREFIX =
	process.env.RATE_LIMIT_REGISTER_EMAIL_PREFIX || 'rate-limit-register';
const REQUEST_RESET_TEST_EMAIL =
	process.env.RATE_LIMIT_REQUEST_RESET_EMAIL ||
	'rate-limit-request-reset@example.test';

const REGISTER_ALLOWED_ATTEMPTS = 3;
const REQUEST_RESET_ALLOWED_ATTEMPTS = 3;
const RESET_PASSWORD_ALLOWED_ATTEMPTS = 5;

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

function printResult(label, attempt, result) {
	console.log(
		`Tentative ${attempt} [${label}] : HTTP ${result.status} | ${JSON.stringify(result.data)}`,
	);
}

async function runScenario({
	label,
	url,
	allowedAttempts,
	buildBody,
}) {
	console.log(`\n=== Test rate limit : ${label} ===`);

	const blockedAttempt = allowedAttempts + 1;
	const results = [];

	for (let attempt = 1; attempt <= blockedAttempt; attempt += 1) {
		const result = await postJson(url, buildBody(attempt));
		results.push(result);
		printResult(label, attempt, result);
	}

	const allowedPartOk = results
		.slice(0, allowedAttempts)
		.every((result) => result.status !== 429);

	const blockedPartOk = results[allowedAttempts]?.status === 429;

	console.log('\nRésumé :');
	console.log(`- avant le seuil : ${allowedPartOk ? 'OK' : 'ÉCHEC'}`);
	console.log(
		`- blocage au bon moment : ${blockedPartOk ? 'OK' : 'ÉCHEC'}`,
	);

	return allowedPartOk && blockedPartOk;
}

async function runRegisterTest() {
	return runScenario({
		label: 'POST /auth/register',
		url: `${BASE_URL}/auth/register`,
		allowedAttempts: REGISTER_ALLOWED_ATTEMPTS,
		buildBody: (attempt) => ({
			firstName: 'Rate',
			lastName: `Limit ${attempt}`,
			email: `${REGISTER_TEST_EMAIL_PREFIX}-${Date.now()}-${attempt}@example.test`,
			password: 'Aa!12345',
			role: 'client',
		}),
	});
}

async function runRequestResetTest() {
	return runScenario({
		label: 'POST /auth/request-reset',
		url: `${BASE_URL}/auth/request-reset`,
		allowedAttempts: REQUEST_RESET_ALLOWED_ATTEMPTS,
		buildBody: () => ({
			email: REQUEST_RESET_TEST_EMAIL,
		}),
	});
}

async function runResetPasswordTest() {
	return runScenario({
		label: 'POST /auth/reset-password',
		url: `${BASE_URL}/auth/reset-password`,
		allowedAttempts: RESET_PASSWORD_ALLOWED_ATTEMPTS,
		buildBody: () => ({
			token: 'dummy-test-token',
			password: 'Aa!12345',
		}),
	});
}

async function main() {
	console.log(`Base URL : ${BASE_URL}`);
	console.log(
		`Préfixe e-mail de test register : ${REGISTER_TEST_EMAIL_PREFIX}`,
	);
	console.log(
		`Adresse e-mail de test request-reset : ${REQUEST_RESET_TEST_EMAIL}`,
	);

	const registerOk = await runRegisterTest();
	const requestResetOk = await runRequestResetTest();
	const resetPasswordOk = await runResetPasswordTest();

	const globalOk = registerOk && requestResetOk && resetPasswordOk;

	console.log('\n=== Verdict final ===');
	console.log(globalOk ? 'PASS' : 'FAIL');

	if (!globalOk) {
		process.exitCode = 1;
	}
}

main().catch((error) => {
	console.error('Erreur pendant le test de rate limiting :', error);
	process.exit(1);
});
