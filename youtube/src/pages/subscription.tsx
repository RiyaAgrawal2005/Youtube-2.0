// pages/subscription.tsx
import SubscriptionPlans from '@/components/SubscriptionPlans';

export default function SubscriptionPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-center my-4">Choose Your Plan</h1>
      <SubscriptionPlans />
    </div>
  );
}
