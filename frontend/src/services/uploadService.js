/**
 * @file src/services/uploadService.js
 * @description
 * Services d'upload d'images via les routes internes Next.js.
 */

/**
 * Parse une réponse JSON sans lever d'erreur si le corps est vide.
 *
 * @param {Response} response
 * @returns {Promise<Object|null>}
 */
async function parseJsonSafe(response) {
	return response.json().catch(() => null);
}

/**
 * Upload une image vers la route interne Next.js.
 *
 * @param {Object} params
 * @param {File} params.file
 * @param {string} params.purpose
 * @param {string} [params.propertyId='']
 * @returns {Promise<Object|null>}
 */
export async function uploadImage({
	file,
	purpose,
	propertyId = '',
}) {
	if (!(file instanceof File)) {
		throw new Error("Le fichier d'image est requis.");
	}

	const formData = new FormData();
	formData.append('file', file);

	if (typeof purpose === 'string' && purpose.trim() !== '') {
		formData.append('purpose', purpose.trim());
	}

	if (typeof propertyId === 'string' && propertyId.trim() !== '') {
		formData.append('property_id', propertyId.trim());
	}

	const response = await fetch('/api/uploads/image', {
		method: 'POST',
		credentials: 'include',
		headers: {
			Accept: 'application/json',
		},
		body: formData,
	});

	const data = await parseJsonSafe(response);

	if (!response.ok) {
		throw new Error(
			typeof data?.message === 'string' && data.message.trim() !== ''
				? data.message
				: "Impossible d'uploader l'image.",
		);
	}

	return data?.data ?? null;
}

/**
 * Supprime une ou plusieurs images via la route interne Next.js.
 *
 * @param {Object} params
 * @param {string[]} [params.urls=[]]
 * @param {string[]} [params.filenames=[]]
 * @param {boolean} [params.keepalive=false]
 * @returns {Promise<Object|null>}
 */
export async function deleteUploadedImages({
	urls = [],
	filenames = [],
	keepalive = false,
}) {
	const response = await fetch('/api/uploads/images', {
		method: 'DELETE',
		credentials: 'include',
		keepalive,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ urls, filenames }),
	});

	const data = await parseJsonSafe(response);

	if (!response.ok) {
		throw new Error(
			typeof data?.message === 'string' && data.message.trim() !== ''
				? data.message
				: "Impossible de supprimer l'image.",
		);
	}

	return data?.data ?? null;
}
