const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const { getMissingMailConfigKeys, isMailEnabled } = require('../config/mail');
const {
	isObviouslyFakeEmailAddress,
	sendRegistrationConfirmationEmail,
	sendPasswordResetEmail,
} = require('./mailService');

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-prod';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const PASSWORD_MIN_LENGTH = 8;
const LOWERCASE_PATTERN = /[a-z]/;
const UPPERCASE_PATTERN = /[A-Z]/;
const DIGIT_PATTERN = /\d/;
const SPECIAL_CHARACTER_PATTERN = /[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/;

function hashPassword(password, salt = null) {
	if (!salt) salt = crypto.randomBytes(16).toString('hex');
	const hash = crypto.scryptSync(password, salt, 64).toString('hex');
	return `scrypt:${salt}:${hash}`;
}

function verifyPassword(password, stored) {
	if (!stored || typeof stored !== 'string') return false;

	const parts = stored.split(':');

	if (parts[0] !== 'scrypt' || parts.length !== 3) return false;

	const salt = parts[1];
	const expected = parts[2];
	const hash = crypto.scryptSync(password, salt, 64).toString('hex');

	return crypto.timingSafeEqual(
		Buffer.from(hash, 'hex'),
		Buffer.from(expected, 'hex'),
	);
}

function signToken(user) {
	const payload = {
		id: user.id,
		role: user.role,
		name: user.name,
		email: user.email || null,
	};

	return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function normalizeEmail(email) {
	return String(email || '')
		.trim()
		.toLowerCase();
}

/**
 * Tente d'envoyer l'e-mail de confirmation d'inscription
 * sans jamais bloquer la création effective du compte.
 *
 * Cas gérés :
 * - adresse e-mail de test évidente ;
 * - configuration SMTP absente ou incomplète ;
 * - erreur réelle d'envoi.
 *
 * @param {Object} user
 * @returns {Promise<void>}
 */
async function trySendRegistrationConfirmationEmail(user) {
	if (!user || !user.email) {
		return;
	}

	if (isObviouslyFakeEmailAddress(user.email)) {
		console.warn(
			`Adresse e-mail de test détectée pour l'inscription : ${user.email}. Aucun e-mail transactionnel n'a été envoyé.`,
		);
		return;
	}

	if (!isMailEnabled()) {
		const missing = getMissingMailConfigKeys();

		console.warn(
			`Configuration e-mail incomplète : aucun e-mail de confirmation d'inscription n'a été envoyé. Variables manquantes : ${missing.join(', ')}.`,
		);
		return;
	}

	try {
		await sendRegistrationConfirmationEmail({
			to: user.email,
			userName: user.name,
		});
	} catch (error) {
		console.error(
			"Echec de l'envoi de l'e-mail de confirmation d'inscription :",
			error,
		);
	}
}

/**
 * Tente d'envoyer l'e-mail de réinitialisation de mot de passe
 * avec une réponse compatible avec le principe d'anti-énumération.
 *
 * Cas gérés :
 * - configuration e-mail absente ou incomplète -> erreur 503 ;
 * - adresse e-mail de test évidente -> aucun envoi, warning serveur ;
 * - erreur réelle d'envoi -> log erreur, mais réponse générique conservée.
 *
 * @param {Object|null} user
 * @param {string} email
 * @param {string} token
 * @returns {Promise<void>}
 */
async function trySendPasswordResetEmail(user, email, token) {
	if (!isMailEnabled()) {
		const missing = getMissingMailConfigKeys();
		const err = new Error(
			`password reset email service unavailable: missing ${missing.join(', ')}`,
		);
		err.status = 503;
		throw err;
	}

	if (!user || !user.email) {
		return;
	}

	if (isObviouslyFakeEmailAddress(email)) {
		console.warn(
			`Adresse e-mail de test detectée pour la demande de réinitialisation : ${email}. Aucun e-mail transactionnel n'a été envoyé.`,
		);
		return;
	}

	try {
		await sendPasswordResetEmail({
			to: user.email,
			userName: user.name,
			token,
		});
	} catch (error) {
		console.error(
			"Echec de l'envoi de l'e-mail de réinitialisation du mot de passe :",
			error,
		);

		const err = new Error('password reset email send failed');
		err.status = 503;
		throw err;
	}
}

function getPasswordValidationError(password) {
	const normalizedPassword = String(password || '');

	if (normalizedPassword.length < PASSWORD_MIN_LENGTH) {
		return `password must be at least ${PASSWORD_MIN_LENGTH} characters`;
	}

	if (!LOWERCASE_PATTERN.test(normalizedPassword)) {
		return 'password must contain at least one lowercase letter';
	}

	if (!UPPERCASE_PATTERN.test(normalizedPassword)) {
		return 'password must contain at least one uppercase letter';
	}

	if (!DIGIT_PATTERN.test(normalizedPassword)) {
		return 'password must contain at least one digit';
	}

	if (!SPECIAL_CHARACTER_PATTERN.test(normalizedPassword)) {
		return 'password must contain at least one special character';
	}

	return '';
}

async function register(
	db,
	{ name, email, password, picture = null, role = 'client' },
) {
	const normalizedEmail = normalizeEmail(email);

	if (!name) {
		const err = new Error('name is required');
		err.status = 400;
		throw err;
	}

	if (normalizedEmail === '') {
		const err = new Error('email is required');
		err.status = 400;
		throw err;
	}

	const passwordValidationError = getPasswordValidationError(password);

	if (passwordValidationError !== '') {
		const err = new Error(passwordValidationError);
		err.status = 400;
		throw err;
	}

	if (!['owner', 'client'].includes(role)) {
		role = 'client';
	}

	const password_hash = hashPassword(String(password));

	try {
		const r = await db.runAsync(
			'INSERT INTO users(name, email, password_hash, picture, role) VALUES (?,?,?,?,?)',
			[name, normalizedEmail, password_hash, picture, role],
		);

		const user = await db.getAsync(
			'SELECT id, name, email, picture, role FROM users WHERE id = ?',
			[r.lastID],
		);

		await trySendRegistrationConfirmationEmail(user);

		const token = signToken(user);
		return { token, user };
	} catch (e) {
		if (/UNIQUE/i.test(e.message)) {
			const err = new Error('email already registered');
			err.status = 409;
			throw err;
		}

		throw e;
	}
}

async function login(db, { email, password }) {
	const normalizedEmail = normalizeEmail(email);

	if (normalizedEmail === '' || !password) {
		const err = new Error('email and password are required');
		err.status = 400;
		throw err;
	}

	const user = await db.getAsync(
		'SELECT id, name, email, picture, role, password_hash FROM users WHERE email = ?',
		[normalizedEmail],
	);

	if (
		!user ||
		!user.password_hash ||
		!verifyPassword(String(password), user.password_hash)
	) {
		const err = new Error('invalid credentials');
		err.status = 401;
		throw err;
	}

	const { password_hash, ...publicUser } = user;
	const token = signToken(publicUser);

	return { token, user: publicUser };
}

async function requestPasswordReset(db, { email }) {
	const normalizedEmail = normalizeEmail(email);

	if (normalizedEmail === '') {
		const err = new Error('email is required');
		err.status = 400;
		throw err;
	}

	const user = await db.getAsync(
		'SELECT id, name, email FROM users WHERE email = ?',
		[normalizedEmail],
	);

	const token = crypto.randomBytes(32).toString('hex');
	const expires = Date.now() + 60 * 60 * 1000;

	if (user) {
		await db.runAsync(
			'UPDATE users SET reset_token = ?, reset_expires = ? WHERE id = ?',
			[token, expires, user.id],
		);

		await trySendPasswordResetEmail(user, normalizedEmail, token);
	}

	const resp = {
		ok: true,
		message: 'If the email exists, a reset link has been sent.',
	};

	if (process.env.NODE_ENV !== 'production') {
		resp.token = token;
	}

	return resp;
}

async function resetPassword(db, { token, password }) {
	if (!token || !password) {
		const err = new Error('token and password are required');
		err.status = 400;
		throw err;
	}

	const passwordValidationError = getPasswordValidationError(password);

	if (passwordValidationError !== '') {
		const err = new Error(passwordValidationError);
		err.status = 400;
		throw err;
	}

	const now = Date.now();

	const user = await db.getAsync(
		'SELECT id FROM users WHERE reset_token = ? AND IFNULL(reset_expires, 0) > ?',
		[token, now],
	);

	if (!user) {
		const err = new Error('invalid or expired token');
		err.status = 400;
		throw err;
	}

	const password_hash = hashPassword(String(password));

	await db.runAsync(
		'UPDATE users SET password_hash = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?',
		[password_hash, user.id],
	);

	return { ok: true };
}

/**
 * Permet à un utilisateur connecté de changer son mot de passe.
 *
 * @param {Object} db
 * @param {number|string} userId
 * @param {Object} payload
 * @param {string} payload.currentPassword
 * @param {string} payload.newPassword
 * @returns {Promise<{ ok: true }>}
 */
async function changePassword(db, userId, { currentPassword, newPassword }) {
	if (!userId) {
		const err = new Error('authentication required');
		err.status = 401;
		throw err;
	}

	if (!currentPassword || !newPassword) {
		const err = new Error('current password and new password are required');
		err.status = 400;
		throw err;
	}

	const user = await db.getAsync(
		'SELECT id, password_hash FROM users WHERE id = ?',
		[userId],
	);

	if (!user || !user.password_hash) {
		const err = new Error('user not found');
		err.status = 404;
		throw err;
	}

	if (!verifyPassword(String(currentPassword), user.password_hash)) {
		const err = new Error('invalid current password');
		err.status = 401;
		throw err;
	}

	if (verifyPassword(String(newPassword), user.password_hash)) {
		const err = new Error(
			'new password must be different from current password',
		);
		err.status = 400;
		throw err;
	}

	const passwordValidationError = getPasswordValidationError(newPassword);

	if (passwordValidationError !== '') {
		const err = new Error(passwordValidationError);
		err.status = 400;
		throw err;
	}

	const password_hash = hashPassword(String(newPassword));

	await db.runAsync('UPDATE users SET password_hash = ? WHERE id = ?', [
		password_hash,
		user.id,
	]);

	return { ok: true };
}

module.exports = {
	register,
	login,
	requestPasswordReset,
	resetPassword,
	changePassword,
	hashPassword,
	verifyPassword,
	signToken,
	trySendRegistrationConfirmationEmail,
	trySendPasswordResetEmail,
};
