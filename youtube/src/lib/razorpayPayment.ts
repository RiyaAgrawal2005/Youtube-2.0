// // lib/razorpayPayment.ts
// import axios from 'axios';

// export const razorpayPayment = async (plan: any) => {
//   const options = {
//     key: 'rzp_test_dKhcxDjWsFA98sz', // Replace with Razorpay key
//     amount: plan.price * 100,
//     currency: 'INR',
//     name: 'Your Brand Name',
//     description: `Subscription for ${plan.name}`,
//     handler: async (response: any) => {
//       await axios.post('/api/send-invoice', {
//         plan,
//         razorpay_payment_id: response.razorpay_payment_id,
//       });
//       alert(`Payment Successful! Plan: ${plan.name}`);
//     },
//     prefill: {
//       name: 'Your Name',
//       email: 'user@example.com',
//     },
//     theme: { color: '#3399cc' },
//   };
//   const rzp = new (window as any).Razorpay(options);
//   rzp.open();
// };







// lib/razorpayPayment.ts

// lib/razorpayPayment.ts
import axios from 'axios';

export const razorpayPayment = async (plan: any, user: any) => {
  const options = {
    key: 'rzp_test_dKhcxDjWsFA98sz', // Replace with live key in production
    amount: plan.price * 100,
    currency: 'INR',
    name: 'Your Brand Name',
    description: `Subscription for ${plan.name}`,
    handler: async (response: any) => {
      await axios.post('/api/send-invoice', {
        plan,
        user,
        razorpay_payment_id: response.razorpay_payment_id,
      });
      alert(`Payment Successful! Plan: ${plan.name}`);
    },
    prefill: {
      name: user?.name || 'User',
      email: user?.email || 'user@example.com',
    },
    theme: { color: '#3399cc' },
  };

  const rzp = new (window as any).Razorpay(options);
  rzp.open();
};
