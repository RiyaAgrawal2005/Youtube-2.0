// youtube/src/pages/goodbye.tsx
import React from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';

const GoodbyePage = () => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6">
      <h1 className="text-4xl font-bold mb-4">Thanks for Watching!</h1>
      <p className="text-lg mb-6">We hope you enjoyed the video.</p>
      <Button onClick={handleGoHome} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded">
        Go to Home
      </Button>
    </div>
  );
};

export default GoodbyePage;
