import express from "express";
import { reverseGeocode, ipLocation } from "../controllers/locationController.js";

const router = express.Router();

router.get("/reverse", reverseGeocode);
router.get("/ip", ipLocation);

export default router;
