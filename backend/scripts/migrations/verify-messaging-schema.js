/**
 * @file backend/scripts/migrations/verify-messaging-schema.js
 * @description
 * Vérifie que le schéma de messagerie attendu existe bien dans la base
 * SQLite locale Kasa.
 */

const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { promisify } = require('util');

const DB_PATH = path.join(__dirname, '..', '..', 'data', 'kasa.sqlite3');

function openDb() {
	const db = new sqlite3.Database(DB_PATH);
	db.getAsync = promisify(db.get.bind(db));
	db.allAsync = promisify(db.all.bind(db));
	return db;
}

async function getTableInfo(db, tableName) {
	return db.allAsync(`PRAGMA table_info('${tableName}')`);
}

async function getIndexes(db, tableName) {
	return db.allAsync(`PRAGMA index_list('${tableName}')`);
}

async function getForeignKeys(db, tableName) {
	return db.allAsync(`PRAGMA foreign_key_list('${tableName}')`);
}

async function tableExists(db, tableName) {
	const row = await db.getAsync(
		"SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?",
		[tableName],
	);

	return Boolean(row);
}

function printSection(title) {
	console.log(`\n=== ${title} ===`);
}

async function verify() {
	const db = openDb();

	const requiredTables = ['conversations', 'messages'];

	for (const tableName of requiredTables) {
		const exists = await tableExists(db, tableName);

		printSection(`Table ${tableName}`);

		if (!exists) {
			console.error(`ERREUR: la table '${tableName}' est absente.`);
			continue;
		}

		console.log(`OK: la table '${tableName}' existe.`);

		const columns = await getTableInfo(db, tableName);
		const indexes = await getIndexes(db, tableName);
		const foreignKeys = await getForeignKeys(db, tableName);

		console.log('\nColonnes :');
		for (const column of columns) {
			console.log(
				`- ${column.name} | type=${column.type} | notnull=${column.notnull} | pk=${column.pk} | default=${column.dflt_value}`,
			);
		}

		console.log('\nIndex :');
		if (indexes.length === 0) {
			console.log('- aucun index');
		} else {
			for (const index of indexes) {
				console.log(
					`- ${index.name} | unique=${index.unique} | origin=${index.origin}`,
				);
			}
		}

		console.log('\nCles etrangeres :');
		if (foreignKeys.length === 0) {
			console.log('- aucune cle etrangere');
		} else {
			for (const fk of foreignKeys) {
				console.log(
					`- from=${fk.from} -> ${fk.table}.${fk.to} | on_update=${fk.on_update} | on_delete=${fk.on_delete}`,
				);
			}
		}
	}

	console.log('\nVerification terminee.');
	db.close();
}

verify().catch((error) => {
	console.error('Echec de verification du schema messagerie :', error);
	process.exit(1);
});
