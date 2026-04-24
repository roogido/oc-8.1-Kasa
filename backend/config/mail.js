'use strict';

/**
 * @file config/mail.js
 * @description Configuration centralisée de l'envoi d'e-mails.
 */

function parseSmtpPort(value) {
	const port = Number.parseInt(value, 10);

	if (!Number.isInteger(port) || port <= 0) {
		throw new Error('BREVO_SMTP_PORT invalide.');
	}

	return port;
}

function isSecurePort(port) {
	return port === 465;
}

const mailConfig = {
	smtp: {
		host: process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com',
		port: parseSmtpPort(process.env.BREVO_SMTP_PORT || '587'),
		secure: isSecurePort(
			Number.parseInt(process.env.BREVO_SMTP_PORT || '587', 10),
		),
		auth: {
			user: process.env.BREVO_SMTP_USER || '',
			pass: process.env.BREVO_SMTP_PASS || '',
		},
	},
	from: {
		name: process.env.MAIL_FROM_NAME || 'Kasa',
		email: process.env.MAIL_FROM_EMAIL || '',
	},
};

/**
 * Retourne la liste des variables e-mail manquantes.
 *
 * @returns {string[]}
 */
function getMissingMailConfigKeys() {
	const missing = [];

	if (!mailConfig.smtp.host) {
		missing.push('BREVO_SMTP_HOST');
	}

	if (!mailConfig.smtp.auth.user) {
		missing.push('BREVO_SMTP_USER');
	}

	if (!mailConfig.smtp.auth.pass) {
		missing.push('BREVO_SMTP_PASS');
	}

	if (!mailConfig.from.email) {
		missing.push('MAIL_FROM_EMAIL');
	}

	return missing;
}

/**
 * Indique si la configuration e-mail est suffisante
 * pour tenter un envoi réel.
 *
 * @returns {boolean}
 */
function isMailEnabled() {
	return getMissingMailConfigKeys().length === 0;
}

function validateMailConfig() {
	const missing = getMissingMailConfigKeys();

	if (missing.length > 0) {
		throw new Error(
			`Configuration e-mail incomplète. Variables manquantes : ${missing.join(', ')}.`,
		);
	}
}

module.exports = {
	mailConfig,
	getMissingMailConfigKeys,
	isMailEnabled,
	validateMailConfig,
};
