import express from "express";
import {
  loginUser,
  registerUser,
  fetchUser,
  fetchUsers,
  fetchUserById,
  createOrder,
  paymentVerification,
  getTopReferrals,
  editUser,
  deleteUser,
  userDeatilsonScan,
  toggleIsDeletedAccount,
} from "../controllers/userControllers.js";
import { addCredits } from "../controllers/userControllers.js";
import { verifyUserToken } from "../middleware/auth.js";
import adminTokenCheck from "../middleware/adminTokenCheck.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", adminTokenCheck, registerUser);
router.put("/edit/:id", adminTokenCheck, editUser);
router.delete("/delete/:id", deleteUser);
router.get("/getAll", adminTokenCheck, fetchUsers);
router.get("/", verifyUserToken, fetchUser);
router.get("/:id", adminTokenCheck, fetchUserById);
router.put("/addcredits", addCredits);

router.post("/order/create", createOrder);
router.post("/order/verify", paymentVerification);

router.get("/refs/top", getTopReferrals);

// Route to handle QR code scanning
router.get("/user-info/:userId", userDeatilsonScan);

router.put("/deleteAccount",verifyUserToken,toggleIsDeletedAccount);

export default router;
