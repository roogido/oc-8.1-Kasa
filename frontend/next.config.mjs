/**
 * @file next.config.mjs
 * @description
 * Configuration globale de Next.js.
 * Autorise ici les sources d'images distantes utilisees par l'application
 * avec next/image (S3, uploads backend, etc.).
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 's3-eu-west-1.amazonaws.com',
				pathname: '/course.oc-static.com/**',
			},
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '3000',
				pathname: '/uploads/**',
			},
		],
	},
};

export default nextConfig;
