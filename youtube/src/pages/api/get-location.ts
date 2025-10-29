// pages/api/get-location.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Example static location (replace with real lookup using IP/lat-lon if needed)
    res.status(200).json({
      city: "Bengaluru",
      state: "Karnataka",
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch location" });
  }
}
