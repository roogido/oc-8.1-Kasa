/**
 * @file backend/routes/auth.js
 */

const express = require('express');
const router = express.Router();

const dbReady = require('../middlewares/dbReady');
const { requireAuth } = require('../middlewares/auth');
const {
	requestResetLimiter,
	resetPasswordLimiter,
} = require('../middlewares/rateLimit');
const {
	doRegister,
	doLogin,
	doRequestReset,
	doResetPassword,
	doChangePassword,
} = require('../controllers/authController');

// Ensure DB is ready for all auth routes
router.use(dbReady);

// Auth endpoints
router.post('/register', doRegister);
router.post('/login', doLogin);
router.post('/request-reset', requestResetLimiter, doRequestReset);
router.post('/reset-password', resetPasswordLimiter, doResetPassword);
router.post('/change-password', requireAuth, doChangePassword);

module.exports = router;
