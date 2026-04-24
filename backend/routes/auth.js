/**
 * @file routes/auth.js
 * @description
 * Routes d'authentification du backend Kasa.
 *
 * Ce routeur expose les parcours suivants :
 *      - inscription ;
 *      - connexion ;
 *      - demande de réinitialisation du mot de passe ;
 *      - réinitialisation du mot de passe par jeton ;
 *      - changement du mot de passe pour un utilisateur connecté.
 *
 * Les routes les plus sensibles sont protégées par des limiteurs
 * de débit afin de réduire les abus et de protéger le quota
 * d'envoi d'e-mails transactionnels.
 */

const express = require('express');
const router = express.Router();

const dbReady = require('../middlewares/dbReady');
const { requireAuth } = require('../middlewares/auth');
const {
	registerLimiter,
	registerDailyLimiter,
	requestResetLimiter,
	requestResetDailyLimiter,
	resetPasswordLimiter,
	changePasswordLimiter,
} = require('../middlewares/rateLimit');
const {
	doRegister,
	doLogin,
	doRequestReset,
	doResetPassword,
	doChangePassword,
} = require('../controllers/authController');

// S'assure que la base est prête pour toutes les routes d'authentification
router.use(dbReady);

// Endpoints d'authentification
router.post('/register', registerLimiter, registerDailyLimiter, doRegister);
router.post('/login', doLogin);
router.post(
	'/request-reset',
	requestResetLimiter,
	requestResetDailyLimiter,
	doRequestReset,
);
router.post('/reset-password', resetPasswordLimiter, doResetPassword);
router.post(
	'/change-password',
	requireAuth,
	changePasswordLimiter,
	doChangePassword,
);

module.exports = router;
