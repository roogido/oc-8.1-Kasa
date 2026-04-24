/**
 * @file next.config.mjs
 * @description
 * Configuration globale de Next.js.
 * Autorise ici les sources d'images distantes utilisées par l'application
 * avec next/image (S3, uploads backend, etc.).
 */

const DEFAULT_API_BASE_URL = 'http://localhost:3000';

/**
 * @returns {string}
 */
function getApiBaseUrl() {
	return (
		process.env.API_BASE_URL ||
		process.env.NEXT_PUBLIC_API_BASE_URL ||
		DEFAULT_API_BASE_URL
	).replace(/\/+$/, '');
}

/**
 * @param {string} hostname
 * @returns {boolean}
 */
function isLocalOrPrivateHostname(hostname) {
	if (
		hostname === 'localhost' ||
		hostname === '127.0.0.1' ||
		hostname === '0.0.0.0'
	) {
		return true;
	}

	if (/^10\.\d+\.\d+\.\d+$/.test(hostname)) {
		return true;
	}

	if (/^192\.168\.\d+\.\d+$/.test(hostname)) {
		return true;
	}

	if (/^172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+$/.test(hostname)) {
		return true;
	}

	return false;
}

const apiBaseUrl = getApiBaseUrl();
const apiUrl = new URL(apiBaseUrl);
const isDevelopment = process.env.NODE_ENV === 'development';
const allowLocalImages =
	isDevelopment && isLocalOrPrivateHostname(apiUrl.hostname);

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		dangerouslyAllowLocalIP: allowLocalImages,
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 's3-eu-west-1.amazonaws.com',
				pathname: '/course.oc-static.com/**',
			},
			{
				protocol: apiUrl.protocol.replace(':', ''),
				hostname: apiUrl.hostname,
				port: apiUrl.port || '',
				pathname: '/uploads/**',
			},
		],
	},
};

export default nextConfig;
