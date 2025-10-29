

// import Download from "../Modals/download.js";
// import User from "../Modals/user.js";

// export const canDownloadVideo = async (req, res) => {
//   const { email } = req.query;

//   if (!email) return res.status(400).json({ message: "Email is required" });

//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const today = new Date().toISOString().split("T")[0];

//     // Reset daily count if it's a new day
//     if (user.lastDownloadDate !== today) {
//       user.downloadsToday = 0;
//       user.lastDownloadDate = today;
//       await user.save();
//     }

//     // Set download limit based on subscription plan
//     let limit;
//     switch (user.subscriptionPlan) {
//       case "Free": limit = 1; break;
//       case "Bronze": limit = 3; break;
//       case "Silver": limit = 5; break;
//       case "Gold": limit = Infinity; break; // Unlimited
//     }

//     if (user.downloadsToday >= limit) {
//       return res.json({
//         canDownload: false,
//         message: "Daily download limit reached. Upgrade your plan for more downloads."
//       });
//     }

//     res.json({ canDownload: true });

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export const saveDownload = async (req, res) => {
//   const { email, videoId, videoTitle, fileUrl } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const today = new Date().toISOString().split("T")[0];

//     // Increment user's downloadsToday
//     if (user.lastDownloadDate !== today) {
//       user.downloadsToday = 1;
//       user.lastDownloadDate = today;
//     } else {
//       user.downloadsToday += 1;
//     }
//     await user.save();

//     // Save download record
//     const newDownload = new Download({
//       email,
//       videoId,
//       videoTitle,
//       fileUrl,
//       date: today,
//     });

//     const savedDownload = await newDownload.save();
//     res.json({ success: true, download: savedDownload });

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };





















import Download from "../Modals/download.js";
import User from "../Modals/user.js";

export const canDownloadVideo = async (req, res) => {
  const { email } = req.query;

  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const today = new Date().toISOString().split("T")[0];

    // Reset daily counter if new day
    if (user.lastDownloadDate !== today) {
      user.downloadsToday = 0;
      user.lastDownloadDate = today;
      await user.save();
    }

    // Define limits
    const PLAN_LIMITS = {
      free: 1,
      bronze: 3,
      silver: 5,
      gold: Infinity,
    };

    // Normalize plan name
    const plan = (user.subscriptionPlan || "free").toLowerCase();
    const limit = PLAN_LIMITS[plan] ?? 1;

    if (user.downloadsToday >= limit) {
      return res.json({
        canDownload: false,
        message: `Daily limit reached (${user.downloadsToday}/${limit}).`,
        plan,
        limit,
        downloadsToday: user.downloadsToday,
      });
    }

    res.json({
      canDownload: true,
      plan,
      limit,
      downloadsToday: user.downloadsToday,
    });
  } catch (error) {
    console.error("Error in canDownloadVideo:", error);
    res.status(500).json({ error: error.message });
  }
};
export const saveDownload = async (req, res) => {
  const { email, videoId, videoTitle, fileUrl } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const today = new Date().toISOString().split("T")[0];

    // Reset or increment
    if (user.lastDownloadDate !== today) {
      user.downloadsToday = 1;
      user.lastDownloadDate = today;
    } else {
      user.downloadsToday += 1;
    }
    await user.save();

    // Save record
    const newDownload = new Download({
      email,
      videoId,
      videoTitle,
      fileUrl,
      date: today,
    });

    const savedDownload = await newDownload.save();

    res.json({
      success: true,
      download: savedDownload,
      downloadsToday: user.downloadsToday,
    });
  } catch (error) {
    console.error("Error in saveDownload:", error);
    res.status(500).json({ error: error.message });
  }
};
