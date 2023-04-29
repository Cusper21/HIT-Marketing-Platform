import express from 'express';
import { restoreProduct, postProducts, fetchCleanProducts,reportProduct, getFeaturedProducts, getPopularProducts, fetchProducts,fetchVendorProducts, fetchReportedProducts, fetchProduct, deleteProduct,fetchAllProducts } from '../controllers/product.js';

const router = express.Router()

router.post("/postproducts", postProducts)
router.post("/reportproduct", reportProduct)
router.get("/featured", getFeaturedProducts)
router.get("/popular", getPopularProducts)
router.post("/", fetchProducts)
router.get("/", fetchCleanProducts)
router.get("/all", fetchAllProducts)
router.get("/vendor", fetchVendorProducts)
router.get("/reported", fetchReportedProducts)
router.post("/product", fetchProduct)
router.post("/delete", deleteProduct)
router.post("/restore", restoreProduct)

export default router