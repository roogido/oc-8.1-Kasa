/**
 * @file controllers/messagesController.js
 * @description
 * Contrôleur HTTP de la messagerie Kasa.
 */

const {
  openConversation,
  listUserConversations,
  getConversationDetails,
  sendConversationMessage,
  markConversationAsRead,
} = require('../services/messagesService');

function statusFromError(error) {
  if (error && error.status) {
    return error.status;
  }

  if (
    error &&
    error.message &&
    /(UNIQUE|PRIMARY KEY|FOREIGN KEY|CHECK constraint failed)/i.test(
      error.message
    )
  ) {
    return 400;
  }

  return 500;
}

async function createOrGetConversation(req, res) {
  const db = req.app.locals.db;

  try {
    const result = await openConversation(
      db,
      req.user,
      req.body?.property_id
    );

    return res.status(result.status).json(result.data);
  } catch (error) {
    return res
      .status(statusFromError(error))
      .json({ error: error.message });
  }
}

async function list(req, res) {
  const db = req.app.locals.db;

  try {
    const rows = await listUserConversations(db, req.user);
    return res.json(rows);
  } catch (error) {
    return res
      .status(statusFromError(error))
      .json({ error: error.message });
  }
}

async function getById(req, res) {
  const db = req.app.locals.db;

  try {
    const conversation = await getConversationDetails(
      db,
      req.user,
      req.params.conversationId
    );

    return res.json(conversation);
  } catch (error) {
    return res
      .status(statusFromError(error))
      .json({ error: error.message });
  }
}

async function sendMessage(req, res) {
  const db = req.app.locals.db;

  try {
    const message = await sendConversationMessage(
      db,
      req.user,
      req.params.conversationId,
      req.body?.body
    );

    return res.status(201).json(message);
  } catch (error) {
    return res
      .status(statusFromError(error))
      .json({ error: error.message });
  }
}

async function markAsRead(req, res) {
  const db = req.app.locals.db;

  try {
    const result = await markConversationAsRead(
      db,
      req.user,
      req.params.conversationId
    );

    return res.json(result);
  } catch (error) {
    return res
      .status(statusFromError(error))
      .json({ error: error.message });
  }
}

module.exports = {
  createOrGetConversation,
  list,
  getById,
  sendMessage,
  markAsRead,
};
