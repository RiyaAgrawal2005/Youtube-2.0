// import React, { useRef, useState } from 'react';

// const TestGestures = () => {
//   const tapCountRef = useRef(0);
//   const tapTimerRef = useRef<NodeJS.Timeout | null>(null);
//   const [message, setMessage] = useState('');

//   const showFeedback = (text: string) => {
//     console.log('✅ Showing message:', text);
//     setMessage(text);
//     setTimeout(() => setMessage(''), 1000);
//   };

//   const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
//     const clientX = e.clientX;
//     const width = e.currentTarget.offsetWidth;
//     const third = width / 3;

//     console.log('🖱️ Tap detected at X:', clientX);

//     tapCountRef.current++;

//     if (tapTimerRef.current) {
//       clearTimeout(tapTimerRef.current);
//     }

//     tapTimerRef.current = setTimeout(() => {
//       const count = tapCountRef.current;
//       console.log('👉 Detected', count, 'tap(s)');
//       tapCountRef.current = 0;

//       if (count === 1) {
//         if (clientX >= third && clientX <= third * 2) {
//           showFeedback('Single Tap: Center');
//         } else {
//           console.log('Single Tap: Not center');
//         }
//       } else if (count === 2) {
//         if (clientX <= third) {
//           showFeedback('Double Tap: Left');
//         } else if (clientX >= third * 2) {
//           showFeedback('Double Tap: Right');
//         } else {
//           console.log('Double Tap: Not left/right');
//         }
//       } else if (count === 3) {
//         if (clientX >= third && clientX <= third * 2) {
//           showFeedback('Triple Tap: Center');
//         } else {
//           console.log('Triple Tap: Not center');
//         }
//       }
//     }, 300);
//   };

//   return (
//     <div
//       onClick={handleTap}
//       style={{
//         width: '100vw',
//         height: '100vh',
//         background: 'black',
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         color: 'white',
//         fontSize: 24,
//         position: 'relative',
//         userSelect: 'none',
//       }}
//     >
//       Tap Screen
//       {message && (
//         <div
//           style={{
//             position: 'absolute',
//             top: 50,
//             left: '50%',
//             transform: 'translateX(-50%)',
//             background: 'white',
//             color: 'black',
//             padding: '10px 20px',
//             borderRadius: '8px',
//             zIndex: 9999,
//             fontWeight: 'bold',
//           }}
//         >
//           {message}
//         </div>
//       )}
//     </div>
//   );
// };

// export default TestGestures;

















// different background


// import React, { useEffect, useRef, useState } from 'react';

// const TestGestures = () => {
//   const [tapCount, setTapCount] = useState(0);
//   const [lastTapTime, setLastTapTime] = useState(0);
//   const timeoutRef = useRef<NodeJS.Timeout | null>(null);
//   const screenRef = useRef<HTMLDivElement>(null);
//   const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 0;

//   const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
//     const tapX = e.clientX;
//     const currentTime = new Date().getTime();
//     console.log(`🖱️ Tap detected at X: ${tapX}`);

//     if (currentTime - lastTapTime < 400) {
//       setTapCount(prev => prev + 1);
//     } else {
//       setTapCount(1);
//     }

//     setLastTapTime(currentTime);

//     if (timeoutRef.current) clearTimeout(timeoutRef.current);

//     timeoutRef.current = setTimeout(() => {
//       console.log(`👉 Detected ${tapCount} tap(s)`);

//       // LEFT (0% - 30%)
//       if (tapX < screenWidth * 0.3) {
//         if (tapCount === 1) {
//           console.log('✅ Showing message: Single Tap: Left');
//         } else if (tapCount === 2) {
//           console.log('✅ Showing message: Double Tap: Left');
//         } else {
//           console.log('⚠️ Triple Tap or more on Left');
//         }
//       }
//       // CENTER (30% - 70%)
//       else if (tapX >= screenWidth * 0.3 && tapX <= screenWidth * 0.7) {
//         if (tapCount === 1) {
//           console.log('✅ Showing message: Single Tap: Center');
//         } else if (tapCount === 2) {
//           console.log('✅ Showing message: Double Tap: Center');
//         } else {
//           console.log('⚠️ Triple Tap or more on Center');
//         }
//       }
//       // RIGHT (70% - 100%)
//       else {
//         if (tapCount === 1) {
//           console.log('✅ Showing message: Single Tap: Right');
//         } else if (tapCount === 2) {
//           console.log('✅ Showing message: Double Tap: Right');
//         } else {
//           console.log('⚠️ Triple Tap or more on Right');
//         }
//       }

//       setTapCount(0);
//     }, 450);
//   };

//   return (
//     <div
//       ref={screenRef}
//       onClick={handleTap}
//       className="w-full h-screen flex"
//     >
//       {/* Left */}
//       <div className="w-1/3 h-full bg-red-500 opacity-40 flex items-center justify-center">
//         <span className="text-white text-xl font-bold">Left</span>
//       </div>

//       {/* Center */}
//       <div className="w-1/3 h-full bg-green-500 opacity-40 flex items-center justify-center">
//         <span className="text-white text-xl font-bold">Center</span>
//       </div>

//       {/* Right */}
//       <div className="w-1/3 h-full bg-blue-500 opacity-40 flex items-center justify-center">
//         <span className="text-white text-xl font-bold">Right</span>
//       </div>
//     </div>
//   );
// };

// export default TestGestures;













// single or double tap

// import React, { useRef, useState } from 'react';

// const TestGestures = () => {
//   const [message, setMessage] = useState('');
//   const tapTimeout = useRef<NodeJS.Timeout | null>(null);
//   const tapCount = useRef(0);

//   const handleTap = (event: React.MouseEvent<HTMLDivElement>) => {
//     const tapX = event.clientX;
//     const screenWidth = window.innerWidth;
//     console.log(`🖱️ Tap detected at X: ${tapX}`);

//     tapCount.current += 1;

//     if (tapTimeout.current) {
//       clearTimeout(tapTimeout.current);
//     }

//     tapTimeout.current = setTimeout(() => {
//       const count = tapCount.current;
//       tapCount.current = 0;

//       console.log(`👉 Detected ${count} tap(s)`);

//       const position =
//         tapX < screenWidth * 0.33
//           ? 'Left'
//           : tapX > screenWidth * 0.66
//           ? 'Right'
//           : 'Center';

//       if (count === 1) {
//         setMessage(`Single Tap: ${position}`);
//         console.log(`✅ Showing message: Single Tap: ${position}`);
//       } else if (count === 2) {
//         setMessage(`Double Tap: ${position}`);
//         console.log(`✅ Showing message: Double Tap: ${position}`);
//       } else if (count >= 3) {
//         setMessage(`Triple Tap or More: ${position}`);
//         console.log(`✅ Showing message: Triple Tap or More: ${position}`);
//       }
//     }, 300); // Wait 300ms to determine if more taps follow
//   };

//   return (
//     <div
//       onClick={handleTap}
//       className="w-full h-screen flex items-center justify-center bg-black text-white text-2xl"
//     >
//       {message || 'Tap anywhere'}
//     </div>
//   );
// };

// export default TestGestures;























// triple tap

// import React, { useRef, useState } from 'react';

// const TestGestures = () => {
//   const [message, setMessage] = useState('');
//   const tapTimeout = useRef<NodeJS.Timeout | null>(null);
//   const tapCount = useRef(0);
//   const lastTapTime = useRef(0);

//   const handleTap = (event: React.MouseEvent<HTMLDivElement>) => {
//     const tapX = event.clientX;
//     const screenWidth = window.innerWidth;
//     const position =
//       tapX < screenWidth * 0.33
//         ? 'Left'
//         : tapX > screenWidth * 0.66
//         ? 'Right'
//         : 'Center';

//     console.log(`🖱️ Tap detected at X: ${tapX}`);

//     const currentTime = Date.now();
//     const timeDiff = currentTime - lastTapTime.current;
//     lastTapTime.current = currentTime;

//     // Reset if taps are too far apart
//     if (timeDiff > 600) {
//       tapCount.current = 0;
//     }

//     tapCount.current += 1;

//     if (tapTimeout.current) clearTimeout(tapTimeout.current);

//     tapTimeout.current = setTimeout(() => {
//       const count = tapCount.current;
//       tapCount.current = 0;

//       console.log(`👉 Detected ${count} tap(s)`);

//       if (count === 1) {
//         setMessage(`Single Tap: ${position}`);
//         console.log(`✅ Showing message: Single Tap: ${position}`);
//       } else if (count === 2) {
//         setMessage(`Double Tap: ${position}`);
//         console.log(`✅ Showing message: Double Tap: ${position}`);
//       } else if (count >= 3) {
//         setMessage(`Triple Tap or More: ${position}`);
//         console.log(`✅ Showing message: Triple Tap or More: ${position}`);
//       }
//     }, 650); // Wait long enough for triple tap
//   };

//   return (
//     <div
//       onClick={handleTap}
//       className="w-full h-screen flex items-center justify-center bg-black text-white text-2xl"
//     >
//       {message || 'Tap anywhere'}
//     </div>
//   );
// };

// export default TestGestures;













// fixing area of left, center, right

// import React, { useRef, useState, useEffect } from 'react';

// const TapGestureTest = () => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const leftRef = useRef<HTMLDivElement>(null);
//   const centerRef = useRef<HTMLDivElement>(null);
//   const rightRef = useRef<HTMLDivElement>(null);
//   const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null);
//   const [tapCount, setTapCount] = useState(0);

//   const getTapArea = (x: number): 'Left' | 'Center' | 'Right' => {
//     if (!leftRef.current || !centerRef.current || !rightRef.current) return 'Center';

//     const leftBounds = leftRef.current.getBoundingClientRect();
//     const centerBounds = centerRef.current.getBoundingClientRect();
//     const rightBounds = rightRef.current.getBoundingClientRect();

//     console.log('🟥 Left:', leftBounds);
//     console.log('🟨 Center:', centerBounds);
//     console.log('🟩 Right:', rightBounds);
//     console.log(`👉 Tap X: ${x}`);

//     if (x >= leftBounds.left && x < leftBounds.right) return 'Left';
//     if (x >= centerBounds.left && x < centerBounds.right) return 'Center';
//     if (x >= rightBounds.left && x <= rightBounds.right) return 'Right';

//     return 'Center';
//   };

//   const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
//     const x = e.clientX;
//     const area = getTapArea(x);
//     console.log(`✅ Tap Area Detected: ${area}`);

//     setTapCount((prev) => {
//       const newCount = prev + 1;

//       if (tapTimeoutRef.current) {
//         clearTimeout(tapTimeoutRef.current);
//       }

//       tapTimeoutRef.current = setTimeout(() => {
//         if (newCount === 1) {
//           alert(`Single Tap: ${area}`);
//         } else if (newCount === 2) {
//           alert(`Double Tap: ${area}`);
//         } else {
//           alert(`Triple Tap or more: ${area}`);
//         }

//         setTapCount(0);
//       }, 300);

//       return newCount;
//     });
//   };

//   return (
//     <div
//       ref={containerRef}
//       onClick={handleTap}
//       className="flex w-full h-screen"
//     >
//       <div
//         ref={leftRef}
//         className="flex-1 bg-red-600 flex items-center justify-center text-white text-2xl font-bold"
//       >
//         Left
//       </div>
//       <div
//         ref={centerRef}
//         className="flex-1 bg-yellow-600 flex items-center justify-center text-black text-2xl font-bold"
//       >
//         Center
//       </div>
//       <div
//         ref={rightRef}
//         className="flex-1 bg-green-600 flex items-center justify-center text-white text-2xl font-bold"
//       >
//         Right
//       </div>
//     </div>
//   );
// };

// export default TapGestureTest;





























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
