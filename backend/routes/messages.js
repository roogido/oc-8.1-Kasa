/**
 * @file routes/messages.js
 * @description
 * Routes Express dédiées à la messagerie Kasa.
 */

const express = require('express');

const messages = require('../controllers/messagesController');

const router = express.Router();

router.post('/conversations', messages.createOrGetConversation);
router.get('/conversations', messages.list);
router.get('/conversations/:conversationId', messages.getById);
router.post(
  '/conversations/:conversationId/messages',
  messages.sendMessage
);
router.post(
  '/conversations/:conversationId/read',
  messages.markAsRead
);

module.exports = router;
