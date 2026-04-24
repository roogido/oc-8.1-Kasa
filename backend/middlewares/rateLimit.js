/**
 * @file middlewares/rateLimit.js
 * @description
 * Limiteurs de débit pour les routes sensibles d'authentification.
 *
 * Objectifs :
 *      - réduire les abus sur les endpoints sensibles ;
 *      - protéger le quota d'envoi d'e-mails transactionnels ;
 *      - limiter les tentatives répétées sur les parcours de sécurité.
 */

const rateLimit = require('express-rate-limit');

const registerLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 3,
	standardHeaders: true,
	legacyHeaders: false,
	message: {
		error: "Trop de tentatives d'inscription ont été effectuées. Veuillez réessayer dans quelques minutes.",
	},
});

const registerDailyLimiter = rateLimit({
	windowMs: 24 * 60 * 60 * 1000,
	limit: 10,
	standardHeaders: true,
	legacyHeaders: false,
	message: {
		error: "Le nombre maximal d'inscriptions autorisées pour aujourd'hui a été atteint depuis cette adresse IP. Veuillez réessayer demain.",
	},
});

const requestResetLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 3,
	standardHeaders: true,
	legacyHeaders: false,
	message: {
		error: 'Trop de demandes de réinitialisation ont été effectuées. Veuillez réessayer dans quelques minutes.',
	},
});

const requestResetDailyLimiter = rateLimit({
	windowMs: 24 * 60 * 60 * 1000,
	limit: 10,
	standardHeaders: true,
	legacyHeaders: false,
	message: {
		error: "Le nombre maximal de demandes de réinitialisation autorisées pour aujourd'hui a été atteint depuis cette adresse IP. Veuillez réessayer demain.",
	},
});

const resetPasswordLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 5,
	standardHeaders: true,
	legacyHeaders: false,
	message: {
		error: 'Trop de tentatives de réinitialisation ont été effectuées. Veuillez réessayer dans quelques minutes.',
	},
});

const changePasswordLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 5,
	standardHeaders: true,
	legacyHeaders: false,
	message: {
		error: 'Trop de tentatives de changement de mot de passe ont été effectuées. Veuillez réessayer dans quelques minutes.',
	},
});

module.exports = {
	registerLimiter,
	registerDailyLimiter,
	requestResetLimiter,
	requestResetDailyLimiter,
	resetPasswordLimiter,
	changePasswordLimiter,
};
