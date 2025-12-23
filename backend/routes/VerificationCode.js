import express from "express";
import { 
  generateCode, 
  verifyCode, 
  getCodes 
} from "../controllers/verificationCodeController.js";

const router = express.Router();

router.post("/generate", generateCode);
router.post("/verify", verifyCode);
router.get("/", getCodes);

export default router;
