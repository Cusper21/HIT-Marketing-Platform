import express from 'express';
import { updateVendorProfile, updateVendorPicture, fetchVendorProfile, updateProfilePicture, fetchUserProfile, changePassword, banUser, fetchAllUser, redeemUser } from '../controllers/user.js';

const router = express.Router()

router.put("/changepassword",changePassword )
router.put("/banuser",banUser )
router.put("/redeemuser",redeemUser )
router.get("/",fetchAllUser)
router.get("/profile",fetchUserProfile)
router.get("/vendorprofile",fetchVendorProfile)
router.put("/updatepic",updateProfilePicture)
router.put("/updatevendorpic",updateVendorPicture)
router.put("/updatevendor",updateVendorProfile)

export default router