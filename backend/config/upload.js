/**
 * @file config/upload.js
 * @description
 * Configuration centralisee des limites d'upload pour Kasa.
 */

function parsePositiveInteger(value, fallback) {
	const parsedValue = Number.parseInt(String(value || ''), 10);

	if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
		return fallback;
	}

	return parsedValue;
}

const UPLOAD_MAX_FILE_SIZE_BYTES = parsePositiveInteger(
	process.env.UPLOAD_MAX_FILE_SIZE_BYTES,
	5 * 1024 * 1024,
);

const PROPERTY_MAX_IMAGES = parsePositiveInteger(
	process.env.PROPERTY_MAX_IMAGES,
	10,
);

module.exports = {
	UPLOAD_MAX_FILE_SIZE_BYTES,
	PROPERTY_MAX_IMAGES,
};
