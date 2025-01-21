import express from "express";
import { checkPassword, setPresetPassword,isPasswordCracked } from "../controllers/crackController.js";
import { ipRateLimiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

router.post("/check-password",ipRateLimiter, checkPassword);
router.post("/set-preset-password", setPresetPassword);
router.get("/isCracked",isPasswordCracked)

export default router;
