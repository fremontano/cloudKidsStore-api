import { Router } from "express";
import {
    registerUser,
    authUser,
    logoutUser,
    requestPasswordOtp,
    verifyPasswordOtp,
    requestForgotPasswordOtp,
    resetForgotPassword,
    updateUserProfile,
    userProfile,
    updateProfileImage,
} from "../controllers/user.controller.js";

import {
    registerUserValidator,
    loginUserValidator,
    updateProfileValidator,
    verifyPasswordOtpValidator,
    forgotPasswordRequestValidator,
    forgotPasswordResetValidator,
} from "../validators/user.validator.js";
import { protect } from "../middlewares/authMiddleware.js";
import { uploadProfileImage } from "../middlewares/uploadMiddleware.js";

const router = Router();

router.post("/register", registerUserValidator, registerUser);
router.post("/login", loginUserValidator, authUser);
router.post("/logout", protect, logoutUser);

router.post(
    "/forgot-password/request-otp",
    forgotPasswordRequestValidator,
    requestForgotPasswordOtp,
);
router.post(
    "/forgot-password/verify-otp",
    forgotPasswordResetValidator,
    resetForgotPassword,
);

router.get("/check-status-profile", protect, userProfile);
router.put(
    "/profile",
    protect,
    updateProfileValidator,
    updateUserProfile,
);
router.put(
    "/profile/image",
    protect,
    uploadProfileImage,
    updateProfileImage,
);
router.post(
    "/profile/password/request-otp",
    protect,
    requestPasswordOtp,
);
router.post(
    "/profile/password/verify-otp",
    protect,
    verifyPasswordOtpValidator,
    verifyPasswordOtp,
);


export default router;
