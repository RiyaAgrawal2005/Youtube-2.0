
import express from "express";
import { setUserAsPremium } from "../controllers/user.js";

const router = express.Router(); // ❌ This line is missing
router.post("/set-premium", setUserAsPremium);

export default router;
