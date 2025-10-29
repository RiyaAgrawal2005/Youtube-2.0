// import React, { useRef, useState, useEffect } from 'react';
// import { Fullscreen, Minimize , Play, Pause } from 'lucide-react';

// const CustomVideoPlayer = () => {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const lastTap = useRef<number>(0);
//   const tapTimeout = useRef<NodeJS.Timeout | null>(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [message, setMessage] = useState('');

//   const togglePlayPause = () => {
//     if (!videoRef.current) return;
//     if (videoRef.current.paused) {
//       videoRef.current.play();
//       setIsPlaying(true);
//       showMessage('▶️ Play');
//     } else {
//       videoRef.current.pause();
//       setIsPlaying(false);
//       showMessage('⏸️ Pause');
//     }
//   };

//   const handleFullscreen = () => {
//     const container = containerRef.current;
//     if (!container) return;

//     if (!document.fullscreenElement) {
//       container.requestFullscreen();
//       setIsFullscreen(true);
//     } else {
//       document.exitFullscreen();
//       setIsFullscreen(false);
//     }
//   };

//   const handleTap = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
//     const now = Date.now();
//     const timeSince = now - lastTap.current;

//     const rect = (e.target as HTMLElement).getBoundingClientRect();
//     const x = e.clientX - rect.left;

//     const width = rect.width;

//     if (timeSince < 300) {
//       // Double Tap
//       if (x < width / 3) {
//         rewind();
//       } else if (x > (2 * width) / 3) {
//         forward();
//       } else {
//         tripleTap(); // triple tap in center
//       }
//       clearTimeout(tapTimeout.current!);
//     } else {
//       tapTimeout.current = setTimeout(() => {
//         togglePlayPause();
//       }, 300);
//     }

//     lastTap.current = now;
//   };

//   const forward = () => {
//     if (videoRef.current) {
//       videoRef.current.currentTime += 10;
//       showMessage('⏩ Forward 10s');
//     }
//   };

//   const rewind = () => {
//     if (videoRef.current) {
//       videoRef.current.currentTime -= 10;
//       showMessage('⏪ Rewind 10s');
//     }
//   };

//   const tripleTap = () => {
//     showMessage('🔥 Triple tap detected!');
//   };

//   const showMessage = (text: string) => {
//     setMessage(text);
//     setTimeout(() => {
//       setMessage('');
//     }, 1500);
//   };

//   useEffect(() => {
//     const handleFullscreenChange = () => {
//       setIsFullscreen(!!document.fullscreenElement);
//     };
//     document.addEventListener('fullscreenchange', handleFullscreenChange);
//     return () => {
//       document.removeEventListener('fullscreenchange', handleFullscreenChange);
//     };
//   }, []);

//   return (
//     <div
//       ref={containerRef}
//       className="relative w-full max-w-[800px] mx-auto bg-black aspect-video overflow-hidden"
//       onClick={handleTap}
//     >
//       <video
//         ref={videoRef}
//         src="/video/vdo.mp4"
//         className="w-full h-full object-cover"
//       />

//       {/* Play/Pause Button (centered when paused) */}
//       {!isPlaying && (
//         <button
//           onClick={togglePlayPause}
//           className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-40 rounded-full p-3 z-20"
//         >
//           <Play size={40} className="text-white" />
//         </button>
//       )}

//       {/* Fullscreen Toggle */}
//       <button
//         onClick={handleFullscreen}
//         className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white p-2 rounded z-20"
//       >
//         {isFullscreen ? <Minimize  size={20} /> : <Fullscreen size={20} />}
//       </button>

//       {/* Gesture Message */}
//       {message && (
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
//                         bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg text-lg z-50">
//           {message}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CustomVideoPlayer;









































 




// import React, { useEffect, useRef, useState } from 'react';
// import screenfull from 'screenfull';
// import { useRouter } from 'next/router';

// const CustomVideoPlayer = () => {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [showComments, setShowComments] = useState(false);
//   const router = useRouter();

//   let tapCount = 0;
//   let tapTimer: NodeJS.Timeout;

//   const handleTap = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
//     const { clientX } = e;
//     const container = containerRef.current;
//     if (!container || !videoRef.current) return;

//     const width = container.offsetWidth;
//     const third = width / 3;

//     tapCount++;
//     clearTimeout(tapTimer);

//     tapTimer = setTimeout(() => {
//       if (tapCount === 1) {
//         // Single Tap - Center
//         if (clientX > third && clientX < third * 2) {
//           togglePlay();
//         }
//       } else if (tapCount === 2) {
//         // Double Tap - Left or Right
//         if (clientX < third) {
//           rewind();
//         } else if (clientX > third * 2) {
//           forward();
//         }
//       } else if (tapCount === 3) {
//         // Triple Tap Actions
//         if (clientX > third && clientX < third * 2) {
//           nextVideo();
//         } else if (clientX < third) {
//           setShowComments(true);
//         } else if (clientX > third * 2) {
//           closeWebsite();
//         }
//       }
//       tapCount = 0;
//     }, 300);
//   };

//   const togglePlay = () => {
//     if (!videoRef.current) return;
//     if (videoRef.current.paused) {
//       videoRef.current.play();
//     } else {
//       videoRef.current.pause();
//     }
//   };

//   const forward = () => {
//     if (videoRef.current) {
//       videoRef.current.currentTime += 10;
//     }
//   };

//   const rewind = () => {
//     if (videoRef.current) {
//       videoRef.current.currentTime -= 10;
//     }
//   };

//   const nextVideo = () => {
//     alert('Next video (placeholder action)');
//     // router.push('/watch/nextVideoId');
//   };

//   const closeWebsite = () => {
//     alert('Closing the website');
//     window.close();
//   };

//   const toggleFullscreen = () => {
//     if (screenfull.isEnabled && containerRef.current) {
//       screenfull.toggle(containerRef.current);
//     }
//   };

//   return (
//     <div
//       ref={containerRef}
//       className="relative w-full h-screen bg-black flex items-center justify-center"
//       onClick={handleTap}
//     >
//       <video
//         ref={videoRef}
//         src="/videos/sample.mp4"
//         controls
//         className="w-full max-h-full"
//       />

//       <button
//         onClick={toggleFullscreen}
//         className="absolute top-4 right-4 bg-white text-black px-3 py-1 rounded"
//       >
//         Fullscreen
//       </button>

//       {showComments && (
//         <div className="absolute bottom-0 left-0 w-full bg-white p-4 text-black">
//           <p>📢 Comment Section</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CustomVideoPlayer;















// import React, { useRef, useState } from 'react';
// import screenfull from 'screenfull';
// import { useRouter } from 'next/router';

// const CustomVideoPlayer = () => {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [showComments, setShowComments] = useState(false);
//   const [gestureMessage, setGestureMessage] = useState('');
//   const router = useRouter();

//   const tapCountRef = useRef(0);
//   const tapTimerRef = useRef<NodeJS.Timeout | null>(null);

//   const showFeedback = (message: string) => {
//     console.log('Showing message:', message); // ✅ Log feedback message
//     setGestureMessage(message);
//     setTimeout(() => {
//       setGestureMessage('');
//     }, 1000);
//   };

//   const handleTap = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
//     console.log('handleTap triggered'); // ✅ Log tap received

//     const { clientX } = e;
//     const container = containerRef.current;
//     if (!container || !videoRef.current) return;

//     const width = container.offsetWidth;
//     const third = width / 3;

//     tapCountRef.current += 1;
//     console.log('Tap count:', tapCountRef.current); // ✅ Log tap count

//     if (tapTimerRef.current) {
//       clearTimeout(tapTimerRef.current);
//     }

//     tapTimerRef.current = setTimeout(() => {
//       const tapCount = tapCountRef.current;
//       tapCountRef.current = 0;

//       if (tapCount === 1) {
//         if (clientX > third && clientX < third * 2) {
//           console.log('Single Tap - Center');
//           togglePlay();
//           showFeedback('▶️ Toggled Play');
//         }
//       } else if (tapCount === 2) {
//         if (clientX < third) {
//           console.log('Double Tap - Left');
//           rewind();
//           showFeedback('⏪ Rewind 10s');
//         } else if (clientX > third * 2) {
//           console.log('Double Tap - Right');
//           forward();
//           showFeedback('⏩ Forward 10s');
//         }
//       } else if (tapCount === 3) {
//         if (clientX > third && clientX < third * 2) {
//           console.log('Triple Tap - Center');
//           nextVideo();
//           showFeedback('⏭️ Next Video');
//         } else if (clientX < third) {
//           console.log('Triple Tap - Left');
//           setShowComments(true);
//           showFeedback('💬 Opening Comments');
//         } else if (clientX > third * 2) {
//           console.log('Triple Tap - Right');
//           showFeedback('❌ Closing Website');
//           closeWebsite();
//         }
//       }
//     }, 300);
//   };

//   const togglePlay = () => {
//     if (!videoRef.current) return;
//     if (videoRef.current.paused) {
//       videoRef.current.play();
//     } else {
//       videoRef.current.pause();
//     }
//   };

//   const forward = () => {
//     if (videoRef.current) {
//       videoRef.current.currentTime += 10;
//     }
//   };

//   const rewind = () => {
//     if (videoRef.current) {
//       videoRef.current.currentTime -= 10;
//     }
//   };

//   const nextVideo = () => {
//     console.log('Next video triggered (placeholder)');
//     // router.push('/watch/nextVideoId');
//   };

//   const closeWebsite = () => {
//     console.log('Closing website');
//     window.close(); // May not work depending on browser security
//   };

//   const toggleFullscreen = () => {
//     if (screenfull.isEnabled && containerRef.current) {
//       screenfull.toggle(containerRef.current);
//     }
//   };

//   return (
//     <div
//       ref={containerRef}
//       className="relative w-full h-screen bg-black flex items-center justify-center"
//       onClick={handleTap}
//     >
//       <video
//         ref={videoRef}
//         src="/videos/sample.mp4"
//         controls
//         className="w-full max-h-full pointer-events-none" // ✅ Ensures click goes to container
//       />

//       <button
//         onClick={toggleFullscreen}
//         className="absolute top-4 right-4 bg-white text-black px-3 py-1 rounded z-50"
//       >
//         Fullscreen
//       </button>

//       {gestureMessage && (
//         <div
//           style={{
//             position: 'absolute',
//             top: '10%',
//             left: '50%',
//             transform: 'translateX(-50%)',
//             backgroundColor: 'white',
//             color: 'black',
//             padding: '10px 20px',
//             borderRadius: '10px',
//             zIndex: 9999,
//             fontWeight: 'bold',
//             fontSize: '16px',
//           }}
//         >
//           {gestureMessage}
//         </div>
//       )}

//       {showComments && (
//         <div className="absolute bottom-0 left-0 w-full bg-white p-4 text-black z-40">
//           <p>📢 Comment Section</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CustomVideoPlayer;














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

