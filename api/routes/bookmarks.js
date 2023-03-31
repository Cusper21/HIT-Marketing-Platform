import express from 'express';
import { fetchBookmarks, addBookmark, deleteBookmark, fetchUserBookmarks } from '../controllers/bookmark.js';

const router = express.Router()

router.get( "/", fetchBookmarks )
router.get( "/userbookmarks", fetchUserBookmarks )
router.post( "/", addBookmark )
router.delete( "/", deleteBookmark )

export default router