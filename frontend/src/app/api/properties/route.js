/**
 * @file src/app/api/properties/route.js
 * @description
 * Route interne Next.js pour récupérer la liste des propriétés.
 */

import { NextResponse } from 'next/server';

import { apiRequest, ApiClientError } from '@/lib/apiClient';

/**
 * @returns {Promise<NextResponse>}
 */
export async function GET() {
	try {
		const properties = await apiRequest('/api/properties', {
			method: 'GET',
			cache: 'no-store',
		});

		return NextResponse.json({
			success: true,
			data: {
				properties: Array.isArray(properties) ? properties : [],
			},
		});
	} catch (error) {
		const status =
			error instanceof ApiClientError && Number.isInteger(error.status)
				? error.status
				: 500;

		return NextResponse.json(
			{
				success: false,
				message:
					error instanceof Error
						? error.message
						: 'Impossible de récupérer les propriétés.',
			},
			{ status },
		);
	}
}
