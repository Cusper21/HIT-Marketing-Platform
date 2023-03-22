import express from 'express';
import { fetchSubCategories, fetchAllCategories, fetchCategory } from '../controllers/category.js';

const router = express.Router()

router.get("/all", fetchAllCategories)
router.post("/category", fetchCategory)
router.post("/subcategories", fetchSubCategories)

export default router