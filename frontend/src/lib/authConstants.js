/**
 * @file src/lib/authConstants.js
 * @description
 * Constantes partagées liées à l'authentification.
 */

export const AUTH_COOKIE_NAME = 'kasa_auth_token';
export const AUTH_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
export const AUTH_COOKIE_PATH = '/';
export const AUTH_COOKIE_SAME_SITE = 'lax';
export const AUTH_USER_ID_COOKIE_NAME = 'kasa_auth_user_id';
