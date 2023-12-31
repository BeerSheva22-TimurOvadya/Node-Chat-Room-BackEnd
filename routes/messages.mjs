import express from 'express';
import asyncHandler from 'express-async-handler';
import authVerification from '../middleware/authVerification.mjs';
import MessagesService from '../service/MessagessService.mjs';
import { chatRoom } from '../chat-appl.mjs';

export const messagesRouter = express.Router();
const messagesService = new MessagesService();

messagesRouter.use(authVerification('ADMIN', 'USER'));

messagesRouter.get(
    '/',
    asyncHandler(async (req, res) => {
        const messages = req.user.roles.includes('ADMIN')
            ? await messagesService.getAllMessages()
            : await messagesService.getUserMessages(req.user.username);
        res.send(messages);
    }),
);

messagesRouter.delete(
    '/:messageId',
    asyncHandler(async (req, res) => {
        await messagesService.deleteMessage(req.params.messageId);
        res.status(201).send(`Message ${req.params.messageId} has been deleted`);
    }),
);

messagesRouter.put(
    '/mark-as-read/:sender',
    asyncHandler(async (req, res) => {
        const recipient = req.user.username;
        const sender = req.params.sender;
        await messagesService.markMessagesAsReadFromSender(recipient, sender);
        res.status(200).send(`Messages from ${sender} are marked as read`);
    }),
);