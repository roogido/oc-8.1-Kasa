/**
 * Fichier : src/lib/passwordValidation.js
 * Nouveau fichier
 */

/**
 * @file src/lib/passwordValidation.js
 * @description
 * Regles partagees de validation du mot de passe cote frontend.
 */

export const PASSWORD_MIN_LENGTH = 8;
export const LOWERCASE_PATTERN = /[a-z]/;
export const UPPERCASE_PATTERN = /[A-Z]/;
export const DIGIT_PATTERN = /\d/;
export const SPECIAL_CHARACTER_PATTERN = /[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/;

export const PASSWORD_REQUIREMENTS_TEXT =
	'Le mot de passe doit contenir au moins 8 caracteres, avec au moins une minuscule, une majuscule, un chiffre et un caractere special.';

/**
 * Retourne un message d'erreur clair si le mot de passe
 * ne respecte pas la politique de robustesse attendue.
 *
 * @param {string} password
 * @returns {string}
 */
export function getPasswordValidationError(password) {
	const normalizedPassword = String(password || '');

	if (normalizedPassword.length < PASSWORD_MIN_LENGTH) {
		return `Le mot de passe doit contenir au moins ${PASSWORD_MIN_LENGTH} caracteres.`;
	}

	if (!LOWERCASE_PATTERN.test(normalizedPassword)) {
		return 'Le mot de passe doit contenir au moins une lettre minuscule.';
	}

	if (!UPPERCASE_PATTERN.test(normalizedPassword)) {
		return 'Le mot de passe doit contenir au moins une lettre majuscule.';
	}

	if (!DIGIT_PATTERN.test(normalizedPassword)) {
		return 'Le mot de passe doit contenir au moins un chiffre.';
	}

	if (!SPECIAL_CHARACTER_PATTERN.test(normalizedPassword)) {
		return 'Le mot de passe doit contenir au moins un caractere special, par exemple : ! @ # $ % & * ?';
	}

	return '';
}
