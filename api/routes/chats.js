import express from 'express';
import { createChat, fetchChat, fetchChats, saveMessage } from '../controllers/chat.js';

const router = express.Router()

router.post("/createchat", createChat)
router.post("/send", saveMessage)
router.post("/messages", fetchChat)
router.get("/", fetchChats)

export default router