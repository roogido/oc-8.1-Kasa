/**
 * @file controllers/uploadsController.js
 * @description
 */

const path = require('path');
const fs = require('fs');

const { UPLOAD_MAX_FILE_SIZE_BYTES } = require('../config/upload');

function formatMegabytes(bytes) {
	return Math.round((bytes / (1024 * 1024)) * 10) / 10;
}

async function uploadImage(req, res) {
	let multer;

	try {
		multer = require('multer');
	} catch (e) {
		return res.status(500).json({
			error: 'Upload not available: missing dependency (multer)',
		});
	}

	const uploadDir = path.join(__dirname, '..', 'public', 'uploads');

	try {
		fs.mkdirSync(uploadDir, { recursive: true });
	} catch (_) {}

	const storage = multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, uploadDir);
		},
		filename: function (req, file, cb) {
			const ext = path
				.extname(file && file.originalname ? file.originalname : '')
				.toLowerCase();
			const base =
				Date.now() + '-' + Math.random().toString(16).slice(2, 10);

			cb(null, base + ext);
		},
	});

	const fileFilter = function (req, file, cb) {
		if (file && file.mimetype && file.mimetype.startsWith('image/')) {
			return cb(null, true);
		}

		cb(new Error("Seuls les fichiers d'image sont autorises."));
	};

	const upload = multer({
		storage,
		fileFilter,
		limits: {
			fileSize: UPLOAD_MAX_FILE_SIZE_BYTES,
		},
	}).single('file');

	upload(req, res, async function (err) {
		if (err) {
			if (err.code === 'LIMIT_FILE_SIZE') {
				return res.status(400).json({
					error: `Le fichier depasse la taille maximale autorisee de ${formatMegabytes(UPLOAD_MAX_FILE_SIZE_BYTES)} Mo.`,
				});
			}

			return res.status(400).json({ error: err.message });
		}

		if (!req.file) {
			return res
				.status(400)
				.json({ error: 'file is required (field name "file")' });
		}

		const purpose =
			(req.body && String(req.body.purpose || '').toLowerCase()) || null;
		const propertyId =
			req.body && req.body.property_id
				? String(req.body.property_id)
				: null;

		if (propertyId) {
			try {
				const db = req.app.locals.db;
				const property = await db.getAsync(
					'SELECT id FROM properties WHERE id = ?',
					[propertyId],
				);

				if (!property) {
					return res.status(404).json({
						error: 'Property not found for provided property_id',
					});
				}
			} catch (error) {
				return res.status(500).json({
					error: `Validation failed: ${error.message}`,
				});
			}
		}

		const publicUrl = '/uploads/' + req.file.filename;

		let instructions =
			'Upload successful. Use the returned URL where appropriate.';

		if (purpose === 'property-cover') {
			instructions = propertyId
				? `Set as cover: PATCH /api/properties/${propertyId} with { "cover": "${publicUrl}" }`
				: 'Set as cover of a property by PATCH /api/properties/{id} with { "cover": "<url>" }';
		} else if (purpose === 'property-picture') {
			instructions = propertyId
				? 'Add to gallery when creating/updating property data. Currently, pictures are provided when creating a property: include the URL in the pictures array.'
				: 'Include the URL in the "pictures" array when creating a property.';
		} else if (purpose === 'user-picture') {
			const userId =
				req.user && req.user.id ? String(req.user.id) : '{yourUserId}';

			instructions = `Set as user picture: PATCH /api/users/${userId} with { "picture": "${publicUrl}" } (self or admin)`;
		}

		return res.status(201).json({
			url: publicUrl,
			filename: req.file.filename,
			size: req.file.size,
			mimetype: req.file.mimetype,
			purpose: purpose,
			property_id: propertyId || undefined,
			instructions,
		});
	});
}

async function deleteImages(req, res) {
	const uploadDir = path.join(__dirname, '..', 'public', 'uploads');

	try {
		fs.mkdirSync(uploadDir, { recursive: true });
	} catch (_) {}

	function toFilename(item) {
		if (!item) {
			return null;
		}

		const stringValue = String(item);
		const base = stringValue.includes('/uploads/')
			? stringValue.split('/uploads/').pop()
			: path.basename(stringValue);

		if (
			base.includes('..') ||
			base.includes('/') ||
			base.includes('\\')
		) {
			return null;
		}

		return base;
	}

	let inputs = [];

	if (req.body && Array.isArray(req.body.filenames)) {
		inputs = inputs.concat(req.body.filenames);
	}

	if (req.body && Array.isArray(req.body.urls)) {
		inputs = inputs.concat(req.body.urls);
	}

	if (req.body && typeof req.body.filename === 'string') {
		inputs.push(req.body.filename);
	}

	if (req.body && typeof req.body.url === 'string') {
		inputs.push(req.body.url);
	}

	if (typeof req.query.filenames === 'string') {
		inputs = inputs.concat(req.query.filenames.split(','));
	}

	if (typeof req.query.filename === 'string') {
		inputs.push(req.query.filename);
	}

	if (typeof req.query.urls === 'string') {
		inputs = inputs.concat(req.query.urls.split(','));
	}

	if (typeof req.query.url === 'string') {
		inputs.push(req.query.url);
	}

	const uniqueFilenames = new Set(inputs.map(toFilename).filter(Boolean));

	if (uniqueFilenames.size === 0) {
		return res.status(400).json({
			error: 'Provide filename(s) or url(s) to delete (filenames[], urls[], filename, url, or query params).',
		});
	}

	const filenames = Array.from(uniqueFilenames);
	const results = [];
	const deleted = [];
	const not_found = [];
	const errors = [];

	const db = req.app.locals.db;

	for (const name of filenames) {
		const fullPath = path.join(uploadDir, name);

		try {
			if (!fs.existsSync(fullPath)) {
				not_found.push(name);
				results.push({ filename: name, status: 'not_found' });
				continue;
			}

			fs.unlinkSync(fullPath);
			deleted.push(name);
			results.push({ filename: name, status: 'deleted' });

			const url = '/uploads/' + name;

			try {
				await db.runAsync(
					'DELETE FROM property_pictures WHERE url = ?',
					[url],
				);
			} catch (_) {}

			try {
				await db.runAsync(
					'UPDATE properties SET cover = NULL WHERE cover = ?',
					[url],
				);
			} catch (_) {}

			try {
				await db.runAsync(
					'UPDATE users SET picture = NULL WHERE picture = ?',
					[url],
				);
			} catch (_) {}
		} catch (error) {
			errors.push({ filename: name, error: error.message });
			results.push({
				filename: name,
				status: 'error',
				error: error.message,
			});
		}
	}

	const status =
		errors.length === 0 ? 200 : deleted.length > 0 ? 207 : 400;

	return res.status(status).json({
		ok: errors.length === 0,
		deleted,
		not_found,
		errors,
		results,
	});
}

module.exports = {
	uploadImage,
	deleteImages,
};
