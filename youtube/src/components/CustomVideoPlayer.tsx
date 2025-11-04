

'use client';

import React, { useRef, useState } from 'react';

const CustomVideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const tapCountRef = useRef(0);
  const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [message, setMessage] = useState('');
  const [tapArea, setTapArea] = useState('');

  
const handleTap = (e: React.PointerEvent<HTMLDivElement>) => {
  const x = e.clientX;
  const rect = e.currentTarget.getBoundingClientRect();
  const relativeX = x - rect.left;
  const width = rect.width;

  let area = '';
  if (relativeX < width / 3) {
    area = 'left';
  } else if (relativeX < (2 * width) / 3) {
    area = 'center';
  } else {
    area = 'right';
  }

  setTapArea(area);
  console.log('Tap area:', area);

  tapCountRef.current += 1;

  if (tapTimeoutRef.current) {
    clearTimeout(tapTimeoutRef.current);
  }

  tapTimeoutRef.current = setTimeout(() => {
    const tapCount = tapCountRef.current;
    tapCountRef.current = 0;

    let tapType = '';
    if (tapCount === 1) {
      tapType = 'Single Tap';
    } else if (tapCount === 2) {
      tapType = 'Double Tap';
    } else if (tapCount >= 3) {
      tapType = 'Triple Tap';
    }

    setMessage(`${tapType} on ${area}`);
    console.log(`${tapType} on ${area}`);

    setTimeout(() => setMessage(''), 1500);
  }, 350);
};


  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* Video without native controls */}
      <video
        ref={videoRef}
        src="/video/vdo.mp4" // ✅ your updated video path
        className="w-full"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Overlay for tap detection */}
      <div
        className="absolute inset-0 z-50"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)', // light overlay just for testing
          pointerEvents: 'all',
        }}
        onPointerDown={handleTap}
      />

      {/* Show tap feedback message */}
      {message && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded z-50">
          {message}
        </div>
      )}
    </div>
  );
};

export default CustomVideoPlayer;

