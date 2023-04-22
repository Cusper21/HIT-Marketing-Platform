import express from 'express';
import { postProducts, fetchAllProducts,reportProduct, getFeaturedProducts, getPopularProducts, fetchProducts,fetchVendorProducts, fetchReportedProducts, fetchProduct, deleteProduct } from '../controllers/product.js';

const router = express.Router()

router.post("/postproducts", postProducts)
router.post("/reportproduct", reportProduct)
router.get("/featured", getFeaturedProducts)
router.get("/popular", getPopularProducts)
router.post("/", fetchProducts)
router.get("/", fetchAllProducts)
router.get("/vendor", fetchVendorProducts)
router.get("/reported", fetchReportedProducts)
router.post("/product", fetchProduct)
router.post("/delete", deleteProduct)

export default router