



// import React, { useState } from "react";
// import axiosInstance from "@/lib/axiosinstance";

// interface OtpPopupProps {
//   isOpen: boolean;
//   identifier: string;
//   method: "email" | "mobile";
//   pendingLogin?: any;
//   setIdentifier: React.Dispatch<React.SetStateAction<string>>;
//   onClose: () => void;
//   onVerified: (user: any) => void;
//   state?: string; // ✅ pass location state from AuthContext
// }

// export default function OtpPopup({
//   isOpen,
//   identifier,
//   method,
//   pendingLogin,
//   setIdentifier,
//   onClose,
//   onVerified,
//   state,
// }: OtpPopupProps) {
//   const [otp, setOtp] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [otpSent, setOtpSent] = useState(false);
//   const [otpMethod, setOtpMethod] = useState<"email" | "mobile">(method);

//   // 🔹 Simple identifier check
//   const validateIdentifier = () => {
//     if (!identifier) {
//       setError(`Enter ${method}`);
//       return false;
//     }
//     if (method === "mobile" && identifier.length !== 10) {
//       setError("Enter a valid 10-digit mobile number");
//       return false;
//     }
//     return true;
//   };






// const sendOtp = async () => {
//   if (!identifier) {
//     setError("Please enter your email");
//     return;
//   }

//   try {
//     setLoading(true);
//     setError(null);

//     // Force otpMethod to undefined, backend will decide
//     const payload: any = { email: identifier, state };

//     console.log("📤 Sending OTP payload to backend:", payload);

//     const res = await axiosInstance.post("/api/otp/send", payload);
//     console.log("✅ OTP send response:", res.data);

//     if (res.data.success) {
//       setOtpSent(true);
//       setOtpMethod(res.data.otpMethod); // backend decides email/mobile
//     } else {
//       setError(res.data.message || "Failed to send OTP");
//     }
//   } catch (err: any) {
//     console.error("❌ sendOtp error:", err.response?.data || err.message);
//     setError(err?.response?.data?.message || "Failed to send OTP");
//   } finally {
//     setLoading(false);
//   }
// };



//   // 🔹 Verify OTP
//   const verifyOtp = async () => {
//     if (!otp) {
//       setError("Enter OTP");
//       return;
//     }
//     try {
//       setLoading(true);
//       setError(null);

//       const payload: any = { otp, otpMethod };

//       if (otpMethod === "email") {
//         payload.email = identifier;
//       } else {
//         payload.mobile = identifier;
//         payload.email = pendingLogin?.email; // link OTP to login email
//       }

//       console.log("📤 Sending verify payload:", payload);

//       const res = await axiosInstance.post("/api/otp/verify", payload);
//       console.log("✅ OTP verify response:", res.data);

//       if (res.data.success) {
//         onVerified(res.data.user);
//         setOtp("");
//         setOtpSent(false);
//       } else {
//         setError(res.data.message || "OTP invalid");
//       }
//     } catch (err: any) {
//       console.error("❌ verifyOtp error:", err.response?.data || err.message);
//       setError(err?.response?.data?.message || "OTP verify failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div
//       style={{
//         position: "fixed",
//         inset: 0,
//         background: "rgba(0,0,0,0.5)",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         zIndex: 9999,
//       }}
//     >
//       <div style={{ background: "#fff", padding: 24, width: 360, borderRadius: 8 }}>
//         <h3 style={{ marginBottom: 12 }}>Verify OTP</h3>

//         {!otpSent ? (
//           <div style={{ marginBottom: 12 }}>
//             <p>Enter your {method === "email" ? "email" : "mobile"} to receive OTP:</p>
//             <input
//               type={method === "email" ? "email" : "tel"}
//               value={identifier || ""}
//               onChange={(e) => setIdentifier(e.target.value)}
//               placeholder={method === "email" ? "Enter email" : "Enter mobile"}
//               style={{ width: "100%", padding: 8 }}
//             />
//             <button onClick={sendOtp} disabled={loading} style={{ marginTop: 8, padding: "6px 12px" }}>
//               Send OTP
//             </button>
//             {error && <p style={{ color: "red", marginTop: 6 }}>{error}</p>}
//           </div>
//         ) : (
//           <>
//             <p>
//               We have sent an OTP to <strong>{identifier}</strong> via {otpMethod}.
//             </p>
//             {error && <p style={{ color: "red" }}>{error}</p>}
//             <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
//               <input
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//                 placeholder="Enter OTP"
//                 style={{ flex: 1, padding: 8 }}
//               />
//               <button onClick={verifyOtp} disabled={loading} style={{ padding: "8px 12px" }}>
//                 Verify
//               </button>
//             </div>
//             <button onClick={() => setOtpSent(false)} style={{ padding: "6px 10px", marginBottom: 8 }}>
//               Edit {otpMethod}
//             </button>
//           </>
//         )}

//         <button onClick={onClose} style={{ padding: "6px 10px" }}>
//           Cancel
//         </button>
//       </div>
//     </div>
//   );
// }




































import React, { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosinstance";

interface OtpPopupProps {
  isOpen: boolean;
  identifier: string;
  pendingLogin?: any;
  setIdentifier: React.Dispatch<React.SetStateAction<string>>;
  onClose: () => void;
  onVerified: (user: any) => void;
  state?: string; // Location state from AuthContext
  location?: { state?: string }; // optional for extra safety
}

export default function OtpPopup({
  isOpen,
  identifier,
  pendingLogin,
  setIdentifier,
  onClose,
  onVerified,
  state,
  location,
}: OtpPopupProps) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpMethod, setOtpMethod] = useState<"email" | "mobile">("email");
 

  // Decide OTP method dynamically based on location
  useEffect(() => {
    const southernStates = ["Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana"];
    if (location?.state && southernStates.includes(location.state)) {
      setOtpMethod("email");
    } else {
      setOtpMethod("mobile");
    }
    setOtpSent(false);
    setOtp("");
    setError(null);
  }, [identifier, location?.state]);


// useEffect(() => {
//   // 🟢 Force test state manually
//   const testState = "Tamil Nadu"; // Change to Kerala, Karnataka, etc. to test

//   if (southernStates.includes(testState)) {
//     setOtpMethod("email");
    
//   } else {
//     setOtpMethod("mobile");
    
//   }
// }, []);



  // Validate input
  const validateIdentifier = () => {
    if (!identifier) {
      setError(`Enter ${otpMethod === "email" ? "email" : "mobile"}`);
      return false;
    }
    if (otpMethod === "mobile" && identifier.length !== 10) {
      setError("Enter a valid 10-digit mobile number");
      return false;
    }
    return true;
  };

  // Send OTP
  // const sendOtp = async () => {
  //   if (!validateIdentifier()) return;

  //   try {
  //     setLoading(true);
  //     setError(null);

  //     const payload: any = { state };
  //     if (otpMethod === "email") {
  //       payload.email = identifier;
  //     } else {
  //       payload.mobile = identifier;
  //     }

  //     console.log("📤 Sending OTP payload:", payload);

  //     const res = await axiosInstance.post("/api/otp/send", payload);
  //     console.log("✅ OTP send response:", res.data);

  //     if (res.data.success) {
  //       setOtpSent(true);
  //     } else {
  //       setError(res.data.message || "Failed to send OTP");
  //     }
  //   } catch (err: any) {
  //     console.error("❌ sendOtp error:", err.response?.data || err.message);
  //     setError(err?.response?.data?.message || "Failed to send OTP");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // // Verify OTP
  // const verifyOtp = async () => {
  //   if (!otp) {
  //     setError("Enter OTP");
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     setError(null);

  //     const payload: any = { otp, otpMethod };
  //     if (otpMethod === "email") {
  //       payload.email = identifier;
  //     } else {
  //       payload.mobile = identifier;
  //       payload.email = pendingLogin?.email; // link OTP to login email
  //     }

  //     console.log("📤 Verifying OTP payload:", payload);

  //     const res = await axiosInstance.post("/api/otp/verify", payload);
  //     console.log("✅ OTP verify response:", res.data);

  //     if (res.data.success) {
  //       onVerified(res.data.user);
  //       setOtp("");
  //       setOtpSent(false);
  //     } else {
  //       setError(res.data.message || "OTP invalid");
  //     }
  //   } catch (err: any) {
  //     console.error("❌ verifyOtp error:", err.response?.data || err.message);
  //     setError(err?.response?.data?.message || "OTP verification failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };



// Send OTP
const sendOtp = async () => {
  if (!validateIdentifier()) return;

  try {
    setLoading(true);
    setError(null);

    const payload: any = { state, loginEmail: pendingLogin?.email }; // always send loginEmail
    if (otpMethod === "email") {
      payload.email = identifier; // OTP goes here
    } else {
      payload.mobile = identifier; // OTP goes here
    }

    console.log("📤 Sending OTP payload:", payload);

    const res = await axiosInstance.post("/api/otp/send", payload);
    console.log("✅ OTP send response:", res.data);

    if (res.data.success) {
      setOtpSent(true);
    } else {
      setError(res.data.message || "Failed to send OTP");
    }
  } catch (err: any) {
    console.error("❌ sendOtp error:", err.response?.data || err.message);
    setError(err?.response?.data?.message || "Failed to send OTP");
  } finally {
    setLoading(false);
  }
};

// Verify OTP
const verifyOtp = async () => {
  if (!otp) {
    setError("Enter OTP");
    return;
  }

  try {
    setLoading(true);
    setError(null);

    const payload: any = { otp, otpMethod, loginEmail: pendingLogin?.email };
    if (otpMethod === "email") {
      payload.email = identifier; // OTP sent email
    } else {
      payload.mobile = identifier; // OTP sent mobile
    }

    console.log("📤 Verifying OTP payload:", payload);

    const res = await axiosInstance.post("/api/otp/verify", payload);
    console.log("✅ OTP verify response:", res.data);

    if (res.data.success) {
      onVerified(res.data.user);
      setOtp("");
      setOtpSent(false);
    } else {
      setError(res.data.message || "OTP invalid");
    }
  } catch (err: any) {
    console.error("❌ verifyOtp error:", err.response?.data || err.message);
    setError(err?.response?.data?.message || "OTP verification failed");
  } finally {
    setLoading(false);
  }
};




  if (!isOpen) return null;

//   return (
//     <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
//       <div style={{ background: "#fff", padding: 24, width: 360, borderRadius: 8 }}>
//         <h3 style={{ marginBottom: 12 }}>Verify OTP</h3>

//         {!otpSent ? (
//           <div style={{ marginBottom: 12 }}>
//             <p>Enter your {otpMethod === "email" ? "email" : "mobile"} to receive OTP:</p>
//             <input
//               type={otpMethod === "email" ? "email" : "tel"}
//               value={identifier || ""}
//               onChange={(e) => setIdentifier(e.target.value)}
//               placeholder={otpMethod === "email" ? "Enter email" : "Enter mobile"}
//               style={{ width: "100%", padding: 8 }}
//             />
//             <button onClick={sendOtp} disabled={loading} style={{ marginTop: 8, padding: "6px 12px" }}>
//               Send OTP
//             </button>
//             {error && <p style={{ color: "red", marginTop: 6 }}>{error}</p>}
//           </div>
//         ) : (
//           <>
//             <p>
//               We have sent an OTP to <strong>{identifier}</strong> via {otpMethod}.
//             </p>
//             {error && <p style={{ color: "red" }}>{error}</p>}
//             <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
//               <input
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//                 placeholder="Enter OTP"
//                 style={{ flex: 1, padding: 8 }}
//               />
//               <button onClick={verifyOtp} disabled={loading} style={{ padding: "8px 12px" }}>
//                 Verify
//               </button>
//             </div>
//             <button onClick={() => setOtpSent(false)} style={{ padding: "6px 10px", marginBottom: 8 }}>
//               Edit {otpMethod}
//             </button>
//           </>
//         )}

//         <button onClick={onClose} style={{ padding: "6px 10px" }}>
//           Cancel
//         </button>
//       </div>
//     </div>
//   );
// }
return (
  // <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
 <div className="fixed inset-0 bg-gray-300/60 dark:bg-[#1e1e1e]/70 flex items-center justify-center z-50">


    <div className="bg-gray-500 dark:bg-gray-800 p-6 w-80 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-3 text-black dark:text-white">Verify OTP</h3>

      {!otpSent ? (
        <div className="mb-3">
          <p className="text-black dark:text-gray-200 mb-2">
            Enter your {otpMethod === "email" ? "email" : "mobile"} to receive OTP:
          </p>
          <input
            type={otpMethod === "email" ? "email" : "tel"}
            value={identifier || ""}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder={otpMethod === "email" ? "Enter email" : "Enter mobile"}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
          />
          <button
            onClick={sendOtp}
            disabled={loading}
            className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
          >
            Send OTP
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      ) : (
        <>
          <p className="text-black dark:text-gray-200 mb-2">
            We have sent an OTP to <strong>{identifier}</strong> via {otpMethod}.
          </p>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <div className="flex gap-2 mb-3">
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
            />
            <button
              onClick={verifyOtp}
              disabled={loading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded disabled:opacity-50"
            >
              Verify
            </button>
          </div>
          <button
            onClick={() => setOtpSent(false)}
            className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded mb-3"
          >
            Edit {otpMethod}
          </button>
        </>
      )}

      <button
        onClick={onClose}
        className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
      >
        Cancel
      </button>
    </div>
  </div>
);
}















