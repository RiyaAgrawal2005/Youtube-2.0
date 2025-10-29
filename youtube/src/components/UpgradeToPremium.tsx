import { useEffect } from "react";
import axios from "axios";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function UpgradeToPremium() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleUpgrade = async () => {
    try {
      const res = await axios.post("/api/payment/create-order");
      const order = res.data;

      const options = {
        key: "rzp_test_dKhcxDjWsFA98s", // ✅ Replace with your real test key
        amount: order.amount,
        currency: order.currency,
        name: "YouTube Premium",
        description: "Unlimited Video Downloads",
        order_id: order.id,
        handler: async function (response: any) {
          localStorage.setItem("isPremium", "true");
          alert("✅ Payment successful! You're now a premium user.");

          // 🔄 Update premium status in backend
          await axios.post("/api/premium/update", {
            email: localStorage.getItem("userEmail"),
          });
        },
        prefill: {
          name: "User",
          email: localStorage.getItem("userEmail") || "",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("❌ Payment failed");
    }
  };

  return (
    <button
      onClick={handleUpgrade}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-4"
    >
      Upgrade to Premium
    </button>
  );
}
