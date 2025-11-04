
import React, { useEffect, useState } from "react";
import { loadRazorpayScript } from "@/lib/loadRazorpayScript";
import axios from "axios";

const plans = [
  { name: "Free", time: 5, price: 0 },
  { name: "Bronze", time: 7, price: 10 },
  { name: "Silver", time: 10, price: 50 },
  { name: "Gold", time: Infinity, price: 100 },
];

type Plan = {
  name: string;
  time: number;
  price: number;
};

const SubscriptionPlans = () => {
  const [user, setUser] = useState<{ name: string; email: string }>({
    name: "Guest",
    email: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          setUser({
            name: parsed.name || "Guest",
            email: parsed.email || "",
          });
        } catch (err) {
          console.error("Error parsing user data:", err);
        }
      }
    }
  }, []);
console.log("Current user before subscribe:", user);
  const handleSubscribe = async (plan: Plan) => {
    console.log("Clicked subscribe");
    console.log("User at subscribe time:", user); 
    
    if (!user.email) {
      alert("Please log in to subscribe to a plan.");
      return;
    }

    if (plan.price === 0) {
      alert("You are using the Free Plan!");
      return;
    }

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert("Failed to load Razorpay SDK. Please try again.");
      return;
    }

    try {
      // 1️⃣ Create order from backend
      const { data: order } = await axios.post("http://localhost:5000/create-order", { 
        amount: plan.price,
       plan: plan.name,
      },
      {
    headers: {
      "Content-Type": "application/json" // 👈 Here
    }
  }
    );


          console.log("🟢 Order created from backend:", order);

      // 2️⃣ Open Razorpay Checkout
      const options = {
   
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_RZZRjFoI81qh6p",
        amount: order.amount,
        currency: order.currency,
        name: "Your App",
        description: `Subscription: ${plan.name}`,
        // order_id: order.id,
        order_id: order.orderId,

        handler: async function(response: any) {
          console.log("Razorpay response:", response);
console.log("About to call backend verify-payment")



  const verifyPayload = {
            razorpay_order_id: response.razorpay_order_id?.toString().trim(),
            razorpay_payment_id: response.razorpay_payment_id?.toString().trim(),
            razorpay_signature: response.razorpay_signature?.toString().trim(),
            email: user.email,
            plan: plan.name,
          };

  console.log("Sending to backend verify-payment:", verifyPayload);


  
console.log("About to send verifyPayload:", verifyPayload);





try {
  console.log("verifyPayload:", verifyPayload);
  const verifyRes = await axios.post(
    "http://localhost:5000/api/payment/verify-payment",
    verifyPayload,
    { headers: { "Content-Type": "application/json" } }
  );
  console.log("Verify response:", verifyRes.data);



          if (verifyRes.data.success) {
            localStorage.setItem("isPremium", "true");
             sessionStorage.setItem("planJustPurchased", "true");

             console.log("User isPremium:", localStorage.getItem("isPremium"));
console.log("Session planJustPurchased:", sessionStorage.getItem("planJustPurchased"));



            alert("✅ Payment successful! You are now Premium.");
          } else {
            alert("❌ Payment verification failed!");
          }
        }catch (err) {
          console.error("Verification error:", err);
          alert("Verification failed. Please try again.");
        }
      },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: { color: "#3399cc" },
      };





      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center">
        Choose Your Subscription Plan
      </h1>
      {plans.map((plan) => (
        <div
          key={plan.name}
          className="border rounded-lg p-6 shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold">{plan.name}</h2>
          <p className="mt-2 text-gray-600">
            {plan.time === Infinity
              ? "Unlimited viewing time"
              : `${plan.time} minutes of viewing`}
          </p>
          <p className="text-lg font-medium mt-1">₹{plan.price}</p>
          <button
            onClick={() => handleSubscribe(plan)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            {plan.price === 0 ? "Using" : "Subscribe"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default SubscriptionPlans;























