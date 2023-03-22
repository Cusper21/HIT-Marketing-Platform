import express from 'express';
import { likes, like, removeLike } from '../controllers/like.js';

const router = express.Router()

router.get("/", likes)
router.post("/", like)
router.delete("/", removeLike)

export default router