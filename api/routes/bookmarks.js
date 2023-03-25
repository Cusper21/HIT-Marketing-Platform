import express from 'express';
import { fetchBookmarks, addBookmark, deleteBookmark } from '../controllers/bookmark.js';

const router = express.Router()

router.get( "/", fetchBookmarks )
router.post( "/", addBookmark )
router.delete( "/", deleteBookmark )

export default router