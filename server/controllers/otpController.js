





// import User from "../Modals/user.js";
// import {
//   generateAndStoreOtp,
//   sendEmailOtp,
//   sendSmsOtp,
//   verifyOtp as verifyOtpService,
// } from "../services/otpService.js";








// // export const sendOtpController = async (req, res) => {
// //   try {
// //     const { email, location, otpMethod: clientMethod } = req.body;
// //     console.log("📥 Incoming sendOtp request:", req.body);

// //     if (!email) {
// //       return res.status(400).json({ success: false, message: "Email is required" });
// //     }

// //     // 1️⃣ Decide OTP method based on location
// //     const southernStates = ["Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana"];
// //     let otpMethod = clientMethod || "mobile"; // fallback

// //     if (location?.state && southernStates.includes(location.state)) {
// //       otpMethod = "email";
// //     } else {
// //       otpMethod = "mobile";
// //     }

// //     console.log(`📍 Location: ${location?.state || "unknown"} → Using OTP method: ${otpMethod}`);

// //     // 2️⃣ Get mobile if needed
// //     let mobile;
// //     if (otpMethod === "mobile") {
// //       const user = await User.findOne({ email });
// //       if (!user?.mobile) {
// //         return res.status(400).json({ success: false, message: "No mobile number registered for this email" });
// //       }
// //       mobile = user.mobile;
// //     }

// //     // 3️⃣ Generate OTP
// //     const otp = generateAndStoreOtp(email, otpMethod, mobile);
// //     console.log("🔑 Generated OTP:", otp);

// //     // 4️⃣ Send OTP
// //     if (otpMethod === "email") {
// //       await sendEmailOtp(email, otp);
// //     } else {
// //       await sendSmsOtp(mobile, otp);
// //     }

// //     res.status(200).json({
// //       success: true,
// //       message: `OTP sent via ${otpMethod}`,
// //       otpMethod,
// //     });
// //   } catch (error) {
// //     console.error("❌ Error in sendOtpController:", error);
// //     res.status(500).json({ success: false, message: "Error sending OTP" });
// //   }
// // };



// export const sendOtpController = async (req, res) => {
//   try {
//     const { email, mobile, location } = req.body;
//     console.log("📥 Incoming sendOtp request:", req.body);

//     // 1️⃣ Decide OTP method based on location
//     const southernStates = ["Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana"];
//     let otpMethod: "email" | "mobile" = "mobile"; // default

//     if (location?.state && southernStates.includes(location.state)) {
//       otpMethod = "email";
//     } else {
//       otpMethod = "mobile";
//     }

//     // 2️⃣ Determine identifier
//     let identifier: string;
//     if (otpMethod === "email") {
//       if (!email) return res.status(400).json({ success: false, message: "Email is required" });
//       identifier = email;
//     } else {
//       if (!mobile) return res.status(400).json({ success: false, message: "Mobile number is required" });
//       identifier = mobile;
//     }

//     // 3️⃣ Generate OTP
//     const otp = generateAndStoreOtp(identifier, otpMethod, mobile);
//     console.log("🔑 Generated OTP:", otp);

//     // 4️⃣ Send OTP
//     if (otpMethod === "email") {
//       await sendEmailOtp(email!, otp);
//     } else {
//       await sendSmsOtp(mobile!, otp);
//     }

//     res.status(200).json({
//       success: true,
//       message: `OTP sent via ${otpMethod}`,
//       otpMethod,
//     });
//   } catch (error) {
//     console.error("❌ Error in sendOtpController:", error);
//     res.status(500).json({ success: false, message: "Error sending OTP" });
//   }
// };




// // ✅ Verify OTP
// export const verifyOtpController = async (req, res) => {
//   try {
//     const { email, mobile, otp, otpMethod } = req.body;
//     console.log("📥 Incoming verifyOtp request:", req.body);

//     // Use whichever identifier is available
//     const identifier = otpMethod === "email" ? email : mobile;
//     if (!identifier) {
//       return res.status(400).json({ success: false, message: "Identifier missing for verification" });
//     }

//     // Verify OTP
//     const isValid = verifyOtpService(identifier, otp, mobile);
//     console.log("✅ OTP validation result:", isValid);

//     if (!isValid) {
//       return res.status(400).json({ success: false, message: "Invalid OTP" });
//     }

//     // Ensure user exists
//     let user = await User.findOne({ email });
//     if (!user) {
//       user = await User.create({ email, mobile });
//     } else if (mobile && !user.mobile) {
//       user.mobile = mobile;
//       await user.save();
//     }

//     res.status(200).json({
//       success: true,
//       message: "OTP verified successfully",
//       user,
//     });
//   } catch (error) {
//     console.error("❌ Error in verifyOtpController:", error);
//     res.status(500).json({ success: false, message: "Error verifying OTP" });
//   }
// };





























// import User from "../Modals/user.js";
// import {
//   generateAndStoreOtp,
//   sendEmailOtp,
//   sendSmsOtp,
//   verifyOtp as verifyOtpService,
// } from "../services/otpService.js";

// // ✅ Send OTP
// export const sendOtpController = async (req, res) => {
//   try {
//     const { email, mobile, location } = req.body;
//     console.log("📥 Incoming sendOtp request:", req.body);

//     // 1️⃣ Decide OTP method based on location
//     const southernStates = ["Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana"];
//     // let otpMethod = "mobile"; // default
//    let otpMethod;
  

    // if (location?.state && southernStates.includes(location.state)) {
    //   otpMethod = "email";
    // } else {
    //   otpMethod = "mobile";
    // }


//  const testState = "Tamil Nadu"; // Change to Kerala, Karnataka, etc. to test

//   if (southernStates.includes(testState)) {
//     otpMethod = "email";
//   } else {
//     otpMethod = "mobile";
//   }


//     // 2️⃣ Determine identifier
//     let identifier;
//     if (otpMethod === "email") {
//       if (!email) return res.status(400).json({ success: false, message: "Email is required" });
//       identifier = email;
//     } else {
//       if (!mobile) return res.status(400).json({ success: false, message: "Mobile number is required" });
//       identifier = mobile;
//     }




//     // 3️⃣ Generate OTP
//     const otp = generateAndStoreOtp(identifier, otpMethod, mobile);
//     console.log("🔑 Generated OTP:", otp);

//     // 4️⃣ Send OTP
//     if (otpMethod === "email") {
//       await sendEmailOtp(email, otp);
//     } else {
//       await sendSmsOtp(mobile, otp);
//     }

//     res.status(200).json({
//       success: true,
//       message: `OTP sent via ${otpMethod}`,
//       otpMethod,
//     });
//   } catch (error) {
//     console.error("❌ Error in sendOtpController:", error);
//     res.status(500).json({ success: false, message: "Error sending OTP" });
//   }
// };

// // ✅ Verify OTP
// export const verifyOtpController = async (req, res) => {
//   try {
//     const { email, mobile, otp, otpMethod } = req.body;
//     console.log("📥 Incoming verifyOtp request:", req.body);

//     // Use whichever identifier is available
//     const identifier = otpMethod === "email" ? email : mobile;
//     if (!identifier) {
//       return res.status(400).json({ success: false, message: "Identifier missing for verification" });
//     }

//     // Verify OTP
//     const isValid = verifyOtpService(identifier, otp, mobile);
//     console.log("✅ OTP validation result:", isValid);

//     if (!isValid) {
//       return res.status(400).json({ success: false, message: "Invalid OTP" });
//     }

//     // Ensure user exists
//     let user = await User.findOne({ email });
//     if (!user) {
//       user = await User.create({ email, mobile });
//     } else if (mobile && !user.mobile) {
//       user.mobile = mobile;
//       await user.save();
//     }

//     res.status(200).json({
//       success: true,
//       message: "OTP verified successfully",
//       user,
//     });
//   } catch (error) {
//     console.error("❌ Error in verifyOtpController:", error);
//     res.status(500).json({ success: false, message: "Error verifying OTP" });
//   }
// };


























import User from "../Modals/user.js"; 
import {
  generateAndStoreOtp,
  sendEmailOtp,
  sendSmsOtp,
  verifyOtp as verifyOtpService,
} from "../services/otpService.js";

// ✅ Send OTP
export const sendOtpController = async (req, res) => {
  try {
    const { email, mobile, location, loginEmail } = req.body; // include loginEmail always
    console.log("📥 Incoming sendOtp request:", req.body);

    // 1️⃣ Decide OTP method based on location
    const southernStates = ["Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana"];
    let otpMethod;


if (location?.state && southernStates.includes(location.state)) {
      otpMethod = "email";
    } else {
      otpMethod = "mobile";
    }



    // 🟢 For testing, use hardcoded state
    // const testState = "Tamil Nadu"; 
    // if (southernStates.includes(testState)) {
    //   otpMethod = "email";
    // } else {
    //   otpMethod = "mobile";
    // }

    // 2️⃣ Determine OTP identifier
    let otpIdentifier;
    if (otpMethod === "email") {
      if (!email) return res.status(400).json({ success: false, message: "Email is required" });
      otpIdentifier = email;
    } else {
      if (!mobile) return res.status(400).json({ success: false, message: "Mobile number is required" });
      otpIdentifier = mobile;
    }

    // 3️⃣ Generate OTP
    const otp = generateAndStoreOtp(otpIdentifier, otpMethod, mobile);
    console.log("🔑 Generated OTP:", otp);

    // 4️⃣ Send OTP
    if (otpMethod === "email") {
      await sendEmailOtp(email, otp);
    } else {
      await sendSmsOtp(mobile, otp);
    }

    res.status(200).json({
      success: true,
      message: `OTP sent via ${otpMethod}`,
      otpMethod,
      otpIdentifier,
      loginEmail, // keep track of login email separately
    });
  } catch (error) {
    console.error("❌ Error in sendOtpController:", error);
    res.status(500).json({ success: false, message: "Error sending OTP" });
  }
};

// ✅ Verify OTP
export const verifyOtpController = async (req, res) => {
  try {
    const { email, mobile, otp, otpMethod, loginEmail } = req.body;
    console.log("📥 Incoming verifyOtp request:", req.body);

    // Use OTP identifier for verification
    const otpIdentifier = otpMethod === "email" ? email : mobile;
    if (!otpIdentifier) {
      return res.status(400).json({ success: false, message: "OTP identifier missing" });
    }

    // Verify OTP
    const isValid = verifyOtpService(otpIdentifier, otp, mobile);
    console.log("✅ OTP validation result:", isValid);

    if (!isValid) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // Always log user in with loginEmail
    let user = await User.findOne({ email: loginEmail });
    if (!user) {
      user = await User.create({ email: loginEmail, mobile });
    } else if (mobile && !user.mobile) {
      user.mobile = mobile;
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      user,
    });
  } catch (error) {
    console.error("❌ Error in verifyOtpController:", error);
    res.status(500).json({ success: false, message: "Error verifying OTP" });
  }
};
