

import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/reverse", async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Latitude and longitude required" });
  }

  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse`,
      {
        params: {
          lat,
          lon,
          format: "jsonv2"
        },
        headers: {
          "User-Agent": "YourAppName/1.0" // Nominatim requires a User-Agent
        }
      }
    );

    const city =
      response.data.address.city ||
      response.data.address.town ||
      response.data.address.village ||
      response.data.address.state;

    res.json({ city });
  } catch (err) {
    console.error("Nominatim error:", err.message);
    res.status(500).json({ error: "Failed to fetch location" });
  }
});

export default router;
