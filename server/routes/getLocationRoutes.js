import express from "express";
import { reverseGeocode, ipLocation } from "../controllers/locationController.js";

const router = express.Router();

// Get location from GPS coords
router.get("/get-location", reverseGeocode);

// Get location from IP
router.get("/ip-location", ipLocation);

export default router;
