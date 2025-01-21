import express from "express";
import { checkPassword, setPresetPassword } from "../controllers/crackController.js";

const router = express.Router();

router.post("/check-password", checkPassword);
router.post("/set-preset-password", setPresetPassword);

export default router;
