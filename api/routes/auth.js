import express from 'express';
import { login, logout, registerCustomer, registerVendor } from "../controllers/auth.js";

const router = express.Router()

router.post("/registercustomer", registerCustomer)
router.post("/registervendor", registerVendor)
router.post("/login", login)
router.post("/logout", logout)

export default router