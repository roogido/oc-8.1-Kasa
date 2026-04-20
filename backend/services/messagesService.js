/**
 * @file services/messagesService.js
 * @description
 * Logique métier de la messagerie Kasa.
 */

function createHttpError(status, message) {
	const error = new Error(message);
	error.status = status;
	return error;
}

function normalizePropertyId(propertyId) {
	return typeof propertyId === 'string' ? propertyId.trim() : '';
}

function normalizeConversationId(conversationId) {
	const value = Number(conversationId);

	if (!Number.isInteger(value) || value <= 0) {
		return null;
	}

	return value;
}

function normalizeMessageBody(body) {
	return typeof body === 'string' ? body.trim() : '';
}

function ensureAuthenticatedUser(currentUser) {
	if (!currentUser || !currentUser.id) {
		throw createHttpError(401, 'Authentication required');
	}
}

function buildOtherUser(row, currentUserId) {
	const isClient = Number(row.client_user_id) === Number(currentUserId);

	if (isClient) {
		return {
			id: row.host_user_id,
			name: row.host_name,
			picture: row.host_picture,
		};
	}

	return {
		id: row.client_user_id,
		name: row.client_name,
		picture: row.client_picture,
	};
}

function mapConversationSummaryRow(row, currentUserId) {
	return {
		id: row.id,
		property: {
			id: row.property_id,
			title: row.property_title,
			cover: row.property_cover,
		},
		other_user: buildOtherUser(row, currentUserId),
		last_message_preview: row.last_message_preview,
		last_message_at: row.last_message_at,
		unread_count: Number(row.unread_count || 0),
	};
}

function mapConversationBase(row) {
	return {
		id: row.id,
		property: {
			id: row.property_id,
			title: row.property_title,
			cover: row.property_cover,
		},
		client: {
			id: row.client_user_id,
			name: row.client_name,
			picture: row.client_picture,
		},
		host: {
			id: row.host_user_id,
			name: row.host_name,
			picture: row.host_picture,
		},
		last_message_at: row.last_message_at,
		last_message_preview: row.last_message_preview,
	};
}

function mapMessageRow(row) {
	return {
		id: row.id,
		sender_user_id: row.sender_user_id,
		body: row.body,
		created_at: row.created_at,
		read_at: row.read_at,
	};
}

async function getPropertyForConversation(db, propertyId) {
	return db.getAsync(
		`
      SELECT
        p.id,
        p.title,
        p.cover,
        p.host_id,
        u.name AS host_name,
        u.picture AS host_picture
      FROM properties p
      JOIN users u ON u.id = p.host_id
      WHERE p.id = ?
    `,
		[propertyId],
	);
}

async function getConversationRowById(db, conversationId) {
	return db.getAsync(
		`
      SELECT
        c.*,
        p.title AS property_title,
        p.cover AS property_cover,
        client.name AS client_name,
        client.picture AS client_picture,
        host.name AS host_name,
        host.picture AS host_picture
      FROM conversations c
      JOIN properties p ON p.id = c.property_id
      JOIN users client ON client.id = c.client_user_id
      JOIN users host ON host.id = c.host_user_id
      WHERE c.id = ?
    `,
		[conversationId],
	);
}

async function getExistingConversation(
	db,
	propertyId,
	clientUserId,
	hostUserId,
) {
	return db.getAsync(
		`
      SELECT
        c.*,
        p.title AS property_title,
        p.cover AS property_cover,
        client.name AS client_name,
        client.picture AS client_picture,
        host.name AS host_name,
        host.picture AS host_picture
      FROM conversations c
      JOIN properties p ON p.id = c.property_id
      JOIN users client ON client.id = c.client_user_id
      JOIN users host ON host.id = c.host_user_id
      WHERE c.property_id = ?
        AND c.client_user_id = ?
        AND c.host_user_id = ?
    `,
		[propertyId, clientUserId, hostUserId],
	);
}

function isConversationUniqueConstraintError(error) {
	return (
		error instanceof Error &&
		typeof error.message === 'string' &&
		error.message.includes(
			'UNIQUE constraint failed: conversations.property_id, conversations.client_user_id, conversations.host_user_id',
		)
	);
}

function ensureConversationParticipant(conversation, currentUser) {
	const currentUserId = Number(currentUser.id);
	const isParticipant =
		Number(conversation.client_user_id) === currentUserId ||
		Number(conversation.host_user_id) === currentUserId;

	if (!isParticipant) {
		throw createHttpError(403, 'Forbidden');
	}
}

async function openConversation(db, currentUser, propertyId) {
	ensureAuthenticatedUser(currentUser);

	if (currentUser.role !== 'client') {
		throw createHttpError(
			403,
			'Only authenticated clients can open a new conversation',
		);
	}

	const normalizedPropertyId = normalizePropertyId(propertyId);

	if (normalizedPropertyId === '') {
		throw createHttpError(400, 'property_id is required');
	}

	const property = await getPropertyForConversation(db, normalizedPropertyId);

	if (!property) {
		throw createHttpError(404, 'Property not found');
	}

	const clientUserId = Number(currentUser.id);
	const hostUserId = Number(property.host_id);

	if (clientUserId === hostUserId) {
		throw createHttpError(
			403,
			'A host cannot open a conversation with their own property',
		);
	}

	const existing = await getExistingConversation(
		db,
		normalizedPropertyId,
		clientUserId,
		hostUserId,
	);

	if (existing) {
		return {
			status: 200,
			data: mapConversationBase(existing),
		};
	}

	try {
		const insert = await db.runAsync(
			`
				INSERT INTO conversations (
					property_id,
					client_user_id,
					host_user_id
				)
				VALUES (?, ?, ?)
			`,
			[normalizedPropertyId, clientUserId, hostUserId],
		);

		const created = await getConversationRowById(db, insert.lastID);

		return {
			status: 201,
			data: mapConversationBase(created),
		};
	} catch (error) {
		if (isConversationUniqueConstraintError(error)) {
			const concurrentConversation = await getExistingConversation(
				db,
				normalizedPropertyId,
				clientUserId,
				hostUserId,
			);

			if (concurrentConversation) {
				return {
					status: 200,
					data: mapConversationBase(concurrentConversation),
				};
			}
		}

		throw error;
	}
}

async function listUserConversations(db, currentUser) {
	ensureAuthenticatedUser(currentUser);

	const currentUserId = Number(currentUser.id);

	const rows = await db.allAsync(
		`
      SELECT
        c.id,
        c.property_id,
        c.client_user_id,
        c.host_user_id,
        c.last_message_preview,
        c.last_message_at,
        c.created_at,
        p.title AS property_title,
        p.cover AS property_cover,
        client.name AS client_name,
        client.picture AS client_picture,
        host.name AS host_name,
        host.picture AS host_picture,
        (
          SELECT COUNT(*)
          FROM messages m
          WHERE m.conversation_id = c.id
            AND m.sender_user_id != ?
            AND m.read_at IS NULL
        ) AS unread_count
      FROM conversations c
      JOIN properties p ON p.id = c.property_id
      JOIN users client ON client.id = c.client_user_id
      JOIN users host ON host.id = c.host_user_id
      WHERE c.client_user_id = ?
         OR c.host_user_id = ?
      ORDER BY COALESCE(c.last_message_at, c.created_at) DESC, c.id DESC
    `,
		[currentUserId, currentUserId, currentUserId],
	);

	return rows.map((row) => mapConversationSummaryRow(row, currentUserId));
}

async function getConversationDetails(db, currentUser, conversationId) {
	ensureAuthenticatedUser(currentUser);

	const normalizedConversationId = normalizeConversationId(conversationId);

	if (!normalizedConversationId) {
		throw createHttpError(400, 'Invalid conversation id');
	}

	const conversation = await getConversationRowById(
		db,
		normalizedConversationId,
	);

	if (!conversation) {
		throw createHttpError(404, 'Conversation not found');
	}

	ensureConversationParticipant(conversation, currentUser);

	const messages = await db.allAsync(
		`
      SELECT
        id,
        sender_user_id,
        body,
        created_at,
        read_at
      FROM messages
      WHERE conversation_id = ?
      ORDER BY created_at ASC, id ASC
    `,
		[normalizedConversationId],
	);

	return {
		...mapConversationBase(conversation),
		messages: messages.map(mapMessageRow),
	};
}

async function sendConversationMessage(db, currentUser, conversationId, body) {
	ensureAuthenticatedUser(currentUser);

	const normalizedConversationId = normalizeConversationId(conversationId);

	if (!normalizedConversationId) {
		throw createHttpError(400, 'Invalid conversation id');
	}

	const conversation = await getConversationRowById(
		db,
		normalizedConversationId,
	);

	if (!conversation) {
		throw createHttpError(404, 'Conversation not found');
	}

	ensureConversationParticipant(conversation, currentUser);

	const normalizedBody = normalizeMessageBody(body);

	if (normalizedBody === '') {
		throw createHttpError(400, 'Message body is required');
	}

	if (normalizedBody.length > 2000) {
		throw createHttpError(
			400,
			'Message body must not exceed 2000 characters',
		);
	}

	const insert = await db.runAsync(
		`
      INSERT INTO messages (
        conversation_id,
        sender_user_id,
        body
      )
      VALUES (?, ?, ?)
    `,
		[normalizedConversationId, currentUser.id, normalizedBody],
	);

	const preview =
		normalizedBody.length > 160
			? `${normalizedBody.slice(0, 157)}...`
			: normalizedBody;

	await db.runAsync(
		`
      UPDATE conversations
      SET
        updated_at = CURRENT_TIMESTAMP,
        last_message_at = CURRENT_TIMESTAMP,
        last_message_preview = ?
      WHERE id = ?
    `,
		[preview, normalizedConversationId],
	);

	const message = await db.getAsync(
		`
      SELECT
        id,
        sender_user_id,
        body,
        created_at,
        read_at
      FROM messages
      WHERE id = ?
    `,
		[insert.lastID],
	);

	return mapMessageRow(message);
}

async function markConversationAsRead(db, currentUser, conversationId) {
	ensureAuthenticatedUser(currentUser);

	const normalizedConversationId = normalizeConversationId(conversationId);

	if (!normalizedConversationId) {
		throw createHttpError(400, 'Invalid conversation id');
	}

	const conversation = await getConversationRowById(
		db,
		normalizedConversationId,
	);

	if (!conversation) {
		throw createHttpError(404, 'Conversation not found');
	}

	ensureConversationParticipant(conversation, currentUser);

	const update = await db.runAsync(
		`
      UPDATE messages
      SET read_at = CURRENT_TIMESTAMP
      WHERE conversation_id = ?
        AND sender_user_id != ?
        AND read_at IS NULL
    `,
		[normalizedConversationId, currentUser.id],
	);

	return {
		ok: true,
		updated: update.changes || 0,
	};
}

module.exports = {
	openConversation,
	listUserConversations,
	getConversationDetails,
	sendConversationMessage,
	markConversationAsRead,
};
