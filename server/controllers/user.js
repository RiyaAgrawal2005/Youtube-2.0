import User from "../Modals/user.js";  // adjust path accordingly

export const setUserAsPremium = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { email },
      { isPremium: true },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User upgraded to premium", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
