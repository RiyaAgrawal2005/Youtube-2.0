// utils/razorpay.ts
export const plans = {
  free: { name: "Free", duration: 5, price: 0 },
  bronze: { name: "Bronze", duration: 7, price: 10 },
  silver: { name: "Silver", duration: 10, price: 50 },
  gold: { name: "Gold", duration: Infinity, price: 100 }, // unlimited time
};
