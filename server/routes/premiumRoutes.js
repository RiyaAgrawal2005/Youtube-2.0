// import express from "express";
// import { setPremiumStatus } from "../controllers/premiumController.js";

// const router = express.Router();
// router.post("/update", setPremiumStatus);

// export default router;












import express from "express";
import { setPremiumStatus, getUserPlan } from "../controllers/premiumController.js";

const router = express.Router();

router.post("/update", setPremiumStatus); // existing
router.get("/:email", getUserPlan);        // ✅ new route to fetch plan by email

export default router;
