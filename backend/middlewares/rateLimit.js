/**
 * @file backend/middlewares/rateLimit.js
 * @description
 * Limiteurs de débit pour les routes sensibles d'authentification.
 */

const rateLimit = require('express-rate-limit');

const requestResetLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 5,
	standardHeaders: true,
	legacyHeaders: false,
	message: {
		error: 'Trop de demandes de réinitialisation ont été effectuees. Veuillez réessayer dans quelques minutes.',
	},
});

const resetPasswordLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 10,
	standardHeaders: true,
	legacyHeaders: false,
	message: {
		error: 'Trop de tentatives de réinitialisation ont été effectuees. Veuillez réessayer dans quelques minutes.',
	},
});

module.exports = {
	requestResetLimiter,
	resetPasswordLimiter,
};
