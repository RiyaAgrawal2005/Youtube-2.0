









import React, { useEffect, useRef, useState } from 'react';

const TestGestures = () => {
  const [message, setMessage] = useState('');
  const tapCountRef = useRef(0);
  const lastTapRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tapXPositions = useRef<number[]>([]);

  const showMessage = (msg: string) => {
    console.log('✅ Showing message:', msg);
    setMessage(msg);
    setTimeout(() => setMessage(''), 1000);
  };

  const getTapArea = (x: number, screenWidth: number) => {
    if (x < screenWidth / 3) return 'left';
    if (x > (2 * screenWidth) / 3) return 'right';
    return 'center';
  };

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const x = e.clientX;
    const screenWidth = window.innerWidth;

    console.log('🖱️ Tap detected at X:', x);
    const currentTime = Date.now();

    tapCountRef.current += 1;
    tapXPositions.current.push(x);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    let timeoutDelay = 350;
if (tapCountRef.current === 2) {
  // Wait longer in case a 3rd tap is coming
  timeoutDelay = 500;
}

timeoutRef.current = setTimeout(() => {
  const taps = tapCountRef.current;
  const lastX = tapXPositions.current[tapXPositions.current.length - 1];
  const area = getTapArea(lastX, screenWidth);

  if (taps === 1) {
    showMessage(`Single Tap: ${area.charAt(0).toUpperCase() + area.slice(1)}`);
  } else if (taps === 2) {
    showMessage(`Double Tap: ${area.charAt(0).toUpperCase() + area.slice(1)}`);
  } else if (taps === 3) {
    showMessage(`Triple Tap: ${area.charAt(0).toUpperCase() + area.slice(1)}`);
  }

  tapCountRef.current = 0;
  tapXPositions.current = [];
}, timeoutDelay);
 // wait a bit to determine if user is going for double or triple tap
  };

  return (
    <div
      className="w-screen h-screen flex flex-col items-center justify-center text-white"
      onClick={handleTap}
    >
      {/* Areas to visualize tap zones */}
      <div className="absolute top-0 left-0 w-full h-full flex">
        <div className="w-1/3 h-full bg-red-500 opacity-20" />
        <div className="w-1/3 h-full bg-green-500 opacity-20" />
        <div className="w-1/3 h-full bg-blue-500 opacity-20" />
      </div>

      {/* Message */}
      <div className="relative z-10 text-2xl font-bold bg-black/70 p-4 rounded">
        {message || 'Tap left, center, or right - single/double/triple'}
      </div>
    </div>
  );
};

export default TestGestures;
