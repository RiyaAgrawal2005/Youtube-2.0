// import User from "../Modals/user.js";

// export const setPremiumStatus = async (req, res) => {
//   const { email } = req.body;

//   try {
//     const user = await User.findOneAndUpdate(
//       { email },
//       { isPremium: true },
//       { new: true }
//     );
//     res.status(200).json({ success: true, user });
//   } catch (error) {
//     res.status(500).json({ success: false, error: "Could not update user" });
//   }
// };

















import User from "../Modals/user.js";

// Map plan to benefits
const PLAN_LIMITS = {
  Free: 5,
  Bronze: 7,
  Silver: 10,
  Gold: Infinity, // unlimited
};

export const setPremiumStatus = async (req, res) => {
  const { email, plan } = req.body;

  if (!email || !plan) {
    return res.status(400).json({ success: false, error: "Email and plan are required" });
  }

  if (!PLAN_LIMITS.hasOwnProperty(plan)) {
    return res.status(400).json({ success: false, error: "Invalid plan" });
  }

  try {
    const user = await User.findOneAndUpdate(
      { email },
      {
        isPremium: plan !== "Free",
        subscriptionPlan: plan,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: `Plan updated to ${plan}`,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Could not update user" });
  }
};

// ✅ Add the GET route handler
export const getUserPlan = async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ success: false, error: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.status(200).json({
      success: true,
      plan: user.subscriptionPlan || "Free",
      isPremium: user.isPremium || false,
      planLimit: PLAN_LIMITS[user.subscriptionPlan] || PLAN_LIMITS["Free"],
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};
