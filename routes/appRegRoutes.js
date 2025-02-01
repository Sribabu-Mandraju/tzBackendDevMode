import express from "express";
import { login, signUp } from "../controllers/appReg.controller.js";

const router = express.Router();

router.post("/register", signUp);
router.post("/login", login);

export default router;
