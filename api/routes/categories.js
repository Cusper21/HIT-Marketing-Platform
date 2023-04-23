import express from 'express';
import { fetchSubCategories, fetchAllCategories, fetchCategory,fetchAllSubCategories } from '../controllers/category.js';

const router = express.Router()

router.get("/all", fetchAllCategories)
router.post("/category", fetchCategory)
router.post("/subcategories", fetchSubCategories)
router.post("/", fetchAllSubCategories)

export default router