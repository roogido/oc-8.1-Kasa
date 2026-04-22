'use strict';

/**
 * @file services/mailService.js
 * @description Service centralisé pour vérifier et envoyer les e-mails transactionnels.
 */

const nodemailer = require('nodemailer');
const { mailConfig, validateMailConfig } = require('../config/mail');

let transporter = null;

const DEFAULT_FRONTEND_BASE_URL = 'http://localhost:3001';

const OBVIOUSLY_FAKE_EMAIL_DOMAINS = new Set([
	'example.com',
	'example.net',
	'example.org',
	'invalid',
	'localhost',
]);

/**
 * Retourne le domaine normalisé d'une adresse e-mail.
 *
 * @param {string} email
 * @returns {string}
 */
function getEmailDomain(email) {
	if (typeof email !== 'string') {
		return '';
	}

	const normalizedEmail = email.trim().toLowerCase();
	const atIndex = normalizedEmail.lastIndexOf('@');

	if (atIndex === -1) {
		return '';
	}

	return normalizedEmail.slice(atIndex + 1);
}

/**
 * Détecte une adresse e-mail manifestement factice ou non délivrable.
 *
 * @param {string} email
 * @returns {boolean}
 */
function isObviouslyFakeEmailAddress(email) {
	const domain = getEmailDomain(email);

	if (domain === '') {
		return false;
	}

	if (OBVIOUSLY_FAKE_EMAIL_DOMAINS.has(domain)) {
		return true;
	}

	if (domain.endsWith('.test')) {
		return true;
	}

	if (domain.endsWith('.localhost')) {
		return true;
	}

	return false;
}

/**
 * Normalise une URL en supprimant les slashs finaux.
 *
 * @param {string} url
 * @returns {string}
 */
function normalizeBaseUrl(url) {
	return String(url).replace(/\/+$/, '');
}

/**
 * Retourne l'URL publique du frontend pour construire les liens
 * de réinitialisation.
 *
 * @returns {string}
 */
function getFrontendBaseUrl() {
	const configuredUrl = String(process.env.FRONTEND_BASE_URL || '').trim();

	if (configuredUrl !== '') {
		return normalizeBaseUrl(configuredUrl);
	}

	if (process.env.NODE_ENV !== 'production') {
		return DEFAULT_FRONTEND_BASE_URL;
	}

	throw new Error('FRONTEND_BASE_URL est manquante.');
}

/**
 * Construit l'URL de réinitialisation de mot de passe.
 *
 * @param {string} token
 * @returns {string}
 */
function buildResetPasswordUrl(token) {
	const normalizedToken = String(token || '').trim();

	if (normalizedToken === '') {
		throw new Error('Le token de réinitialisation est manquant.');
	}

	const frontendBaseUrl = getFrontendBaseUrl();

	return `${frontendBaseUrl}/reset-password?token=${encodeURIComponent(normalizedToken)}`;
}

function buildTransporter() {
	validateMailConfig();

	return nodemailer.createTransport({
		host: mailConfig.smtp.host,
		port: mailConfig.smtp.port,
		secure: mailConfig.smtp.secure,
		auth: {
			user: mailConfig.smtp.auth.user,
			pass: mailConfig.smtp.auth.pass,
		},
	});
}

function getTransporter() {
	if (!transporter) {
		transporter = buildTransporter();
	}

	return transporter;
}

async function verifyMailTransport() {
	const smtpTransporter = getTransporter();

	await smtpTransporter.verify();

	return true;
}

function getDefaultFrom() {
	return `"${mailConfig.from.name}" <${mailConfig.from.email}>`;
}

async function sendMail({ to, subject, text, html, replyTo = null }) {
	if (!to) {
		throw new Error('Destinataire e-mail manquant.');
	}

	if (!subject) {
		throw new Error('Sujet e-mail manquant.');
	}

	if (!text && !html) {
		throw new Error('Le contenu du message est vide.');
	}

	const smtpTransporter = getTransporter();

	const mailOptions = {
		from: getDefaultFrom(),
		to,
		subject,
		text,
		html,
	};

	if (replyTo) {
		mailOptions.replyTo = replyTo;
	}

	const info = await smtpTransporter.sendMail(mailOptions);

	return {
		messageId: info.messageId,
		accepted: info.accepted,
		rejected: info.rejected,
		response: info.response,
	};
}

async function sendRegistrationConfirmationEmail({ to, userName }) {
	const safeUserName = userName ? String(userName).trim() : 'utilisateur';

	const subject = 'Confirmation de ton inscription sur Kasa';

	const text = [
		`Bonjour ${safeUserName},`,
		'',
		'Ton inscription sur Kasa a bien été prise en compte.',
		'',
		'Tu peux maintenant te connecter et commencer à utiliser la plateforme.',
		'',
		'À bientôt,',
		"L'équipe Kasa",
	].join('\n');

	const html = [
		`<p>Bonjour ${escapeHtml(safeUserName)},</p>`,
		`<p>Ton inscription sur <strong>Kasa</strong> a bien été prise en compte.</p>`,
		`<p>Tu peux maintenant te connecter et commencer à utiliser la plateforme.</p>`,
		`<p>À bientôt,<br>L'équipe Kasa</p>`,
	].join('');

	return sendMail({
		to,
		subject,
		text,
		html,
	});
}

async function sendPasswordResetEmail({ to, userName, token }) {
	const safeUserName = userName ? String(userName).trim() : 'utilisateur';
	const resetUrl = buildResetPasswordUrl(token);

	const subject = 'Réinitialisation de ton mot de passe Kasa';

	const text = [
		`Bonjour ${safeUserName},`,
		'',
		'Une demande de réinitialisation de mot de passe a été reçue pour ton compte Kasa.',
		'',
		'Pour définir un nouveau mot de passe, utilise ce lien :',
		resetUrl,
		'',
		"Si tu n'es pas à l'origine de cette demande, tu peux ignorer cet e-mail.",
		'',
		'À bientôt,',
		"L'équipe Kasa",
	].join('\n');

	const html = [
		`<p>Bonjour ${escapeHtml(safeUserName)},</p>`,
		`<p>Une demande de réinitialisation de mot de passe a été reçue pour ton compte <strong>Kasa</strong>.</p>`,
		`<p>Pour définir un nouveau mot de passe, utilise ce lien :</p>`,
		`<p><a href="${escapeHtml(resetUrl)}">${escapeHtml(resetUrl)}</a></p>`,
		`<p>Si tu n'es pas à l'origine de cette demande, tu peux ignorer cet e-mail.</p>`,
		`<p>À bientôt,<br>L'équipe Kasa</p>`,
	].join('');

	return sendMail({
		to,
		subject,
		text,
		html,
	});
}

function escapeHtml(value) {
	return String(value)
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');
}

module.exports = {
	buildResetPasswordUrl,
	getFrontendBaseUrl,
	isObviouslyFakeEmailAddress,
	verifyMailTransport,
	sendMail,
	sendRegistrationConfirmationEmail,
	sendPasswordResetEmail,
};
