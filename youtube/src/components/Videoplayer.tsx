// "use client";

// import { useRef, useEffect } from "react";

// interface VideoPlayerProps {
//   video: {
//     _id: string;
//     videotitle: string;
//     filepath: string;
//   };
// }

// export default function VideoPlayer({ video }: VideoPlayerProps) {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const videos = "/video/vdo.mp4";

//   return (
//     <div className="aspect-video bg-black rounded-lg overflow-hidden">
//       <video
//         ref={videoRef}
//         className="w-full h-full"
//         controls
//         poster={`/placeholder.svg?height=480&width=854`}
//       >
//         <source
//           src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${video?.filepath}`}
//           type="video/mp4"
//         />
//         Your browser does not support the video tag.
//       </video>
//     </div>
//   );
// }















// "use client";

// import { useRef, useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { auth, db } from "@/lib/firebase";
// import {
//   doc,
//   getDoc,
//   setDoc,
//   updateDoc,
//   arrayUnion,
// } from "firebase/firestore";

// interface VideoPlayerProps {
//   video: {
//     _id: string;
//     videotitle: string;
//     filepath: string;
//   };
// }

// export default function VideoPlayer({ video }: VideoPlayerProps) {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const [message, setMessage] = useState("");
// const [toast, setToast] = useState("");
//   useEffect(() => {
//     const handleVideoEnd = async () => {
//       const user = auth.currentUser;
//       if (!user) return;

//       const userRef = doc(db, "users", user.uid);
//       const userSnap = await getDoc(userRef);

//       if (userSnap.exists()) {
//         const userData = userSnap.data();
//         const watched = userData?.watchedVideos || [];
//         const currentPoints = userData?.points || 0;

//         if (!watched.includes(video._id)) {
//           // First time watching – Add points
//           await updateDoc(userRef, {
//             watchedVideos: arrayUnion(video._id),
//             points: currentPoints + 5,
//           });
//           setMessage("🎉 You watched this video for the first time and earned +5 points!");
//         } else {
//           // Already watched – Show replay message
//           setMessage("🔁 You already watched this video. No points earned this time.");
//         }
//       } else {
//         // No user doc yet – create and award points
//         await setDoc(userRef, {
//           email: user.email,
//           watchedVideos: [video._id],
//           points: 5,
//         });
//         setMessage("🎉 You watched this video for the first time and earned +5 points!");
//       }
//     };

//     const videoElement = videoRef.current;
//     if (videoElement) {
//       videoElement.addEventListener("ended", handleVideoEnd);
//     }

//     return () => {
//       if (videoElement) {
//         videoElement.removeEventListener("ended", handleVideoEnd);
//       }
//     };
//   }, [video._id]);

//   return (
//     <div>
//       <div className="aspect-video bg-black rounded-lg overflow-hidden">
//         <video
//           ref={videoRef}
//           className="w-full h-full"
//           controls
//           poster={`/placeholder.svg?height=480&width=854`}
//         >
//           <source
//             src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${video?.filepath}`}
//             type="video/mp4"
//           />
//           Your browser does not support the video tag.
//         </video>
//       </div>

//       {/* 👇 Feedback Message */}
//       {message && (
//         <div className="mt-2 text-center text-sm font-semibold text-blue-600">
//           {message}
//         </div>
//       )}
//     </div>
//   );
// }






















// "use client";

// import { useRef, useEffect, useState } from "react";
// import { useRouter, useParams, usePathname } from "next/navigation";
// import { auth, db } from "@/lib/firebase";
// import {
//   doc,
//   getDoc,
//   setDoc,
//   updateDoc,
//   arrayUnion,
// } from "firebase/firestore";
// import axios from "axios"; // ✅ For dynamic video fetching

// interface VideoPlayerProps {
//   video: {
//     _id: string;
//     videotitle: string;
//     filepath: string;
//     poster: string; 
//   };
// }

// export default function VideoPlayer({ video }: VideoPlayerProps) {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const [message, setMessage] = useState("");
//   const [points, setPoints] = useState(0);
//   const [currentVideo, setCurrentVideo] = useState(video);
//   const router = useRouter();
//   const params = useParams();
//   const [showPopup, setShowPopup] = useState(false);
//   const tapCountRef = useRef(0);
//   const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null);
//   const [gestureMessage, setGestureMessage] = useState("");
//   const [tapArea, setTapArea] = useState("");
//   const [showCountdown, setShowCountdown] = useState(false);
// const [countdownSeconds, setCountdownSeconds] = useState(300); // 5 minutes


// const formatTime = (sec: number) => {
//   const m = Math.floor(sec / 60);
//   const s = sec % 60;
//   return `${m}:${s < 10 ? "0" : ""}${s}`;
// };





//   const handleTap = (e: React.PointerEvent<HTMLDivElement>) => {
//     const x = e.clientX;
//     const rect = e.currentTarget.getBoundingClientRect();
//     const relativeX = x - rect.left;
//     const width = rect.width;

//     let area = "";
//     if (relativeX < width / 3) area = "left";
//     else if (relativeX < (2 * width) / 3) area = "center";
//     else area = "right";

//     setTapArea(area);
//     tapCountRef.current += 1;

//     if (tapTimeoutRef.current) clearTimeout(tapTimeoutRef.current);

//     tapTimeoutRef.current = setTimeout(() => {
//       const tapCount = tapCountRef.current;
//       tapCountRef.current = 0;

//       const videoEl = videoRef.current;

//       if (tapCount === 1) {
//         if (area === "center" && videoEl) {
//           videoEl.paused ? videoEl.play() : videoEl.pause();
//           setGestureMessage("▶️ Play/Pause toggled");
//         }
//       } else if (tapCount === 2 && videoEl) {
//         if (area === "left") {
//           videoEl.currentTime = Math.max(0, videoEl.currentTime - 10);
//           setGestureMessage("⏪ Rewind 10s");
//         } else if (area === "right") {
//           videoEl.currentTime = Math.min(
//             videoEl.duration,
//             videoEl.currentTime + 10
//           );
//           setGestureMessage("⏩ Forward 10s");
//         }
//       } else if (tapCount >= 3) {
//         if (area === "center") {
//           setGestureMessage("⏭️ Moving to next video...");
//           setTimeout(async () => {
//             try {
//               const response = await axios.get(
//                 `${process.env.NEXT_PUBLIC_BACKEND_URL}/video/getall`
//               );
//               const videos = response.data;

//               const currentIndex = videos.findIndex(
//                 (v: any) => v._id === currentVideo._id
//               );

//               if (currentIndex !== -1 && currentIndex < videos.length - 1) {
//                 const nextVideo = videos[currentIndex + 1];
//                 console.log("Next video selected:", nextVideo);

//                window.open(`/watch/${nextVideo._id}`, "_blank");
//                 // router.push(`/watch/${nextVideo._id}`);
//               } else {
//                 setGestureMessage("✅ This was the last video.");
//               }
//             } catch (err) {
//               console.error("Failed to fetch video list:", err);
//               setGestureMessage("❌ Failed to load next video.");
//             }
//           }, 500);
//         } else if (area === "right") {
//           setGestureMessage("❌ Closing site...");
//           setTimeout(() => {
//             window.open("/goodbye", "_blank");
//           }, 500);
//         } else if (area === "left") {
//           setGestureMessage("💬 Showing comments...");
//           setTimeout(() => {
//             window.open("/comments", "_blank");
//           }, 500);
//         }
//       }

//       setTimeout(() => setGestureMessage(""), 1500);
//     }, 350);
//   };






//   useEffect(() => {
//     const fetchPoints = async () => {
//       const user = auth.currentUser;
//       if (!user) return;

//       const userRef = doc(db, "users", user.uid);
//       const userSnap = await getDoc(userRef);
//       if (userSnap.exists()) {
//         const userData = userSnap.data();
//         setPoints(userData?.points || 0);
//       }
//     };

//     fetchPoints();
//   }, []);





//   useEffect(() => {
//     const handleVideoEnd = async () => {
//       const user = auth.currentUser;
//       if (!user) return;

//       const userRef = doc(db, "users", user.uid);
//       const userSnap = await getDoc(userRef);

//       if (userSnap.exists()) {
//         const userData = userSnap.data();
//         const watched = userData?.watchedVideos || [];
//         const currentPoints = userData?.points || 0;

//         if (!watched.includes(currentVideo._id)) {
//           await updateDoc(userRef, {
//             watchedVideos: arrayUnion(currentVideo._id),
//             points: currentPoints + 5,
//           });
//           setPoints(currentPoints + 5);
//           setMessage(
//             "🎉 You watched this video for the first time and earned +5 points!"
//           );
//         } else {
//           setMessage(
//             "🔁 You already watched this video. No points earned this time."
//           );
//         }
//       } else {
//         await setDoc(userRef, {
//           email: user.email,
//           watchedVideos: [currentVideo._id],
//           points: 5,
//         });
//         setPoints(5);
//         setMessage(
//           "🎉 You watched this video for the first time and earned +5 points!"
//         );
//       }
//     };

//     const videoElement = videoRef.current;
//     if (videoElement) {
//       videoElement.addEventListener("ended", handleVideoEnd);
//     }

//     return () => {
//       if (videoElement) {
//         videoElement.removeEventListener("ended", handleVideoEnd);
//       }
//     };
//   }, [currentVideo._id]);













//   useEffect(() => {
//     const gestureArea = document.getElementById("gesture-overlay");
//     const handleFullscreenChange = () => {
//       if (gestureArea) {
//         gestureArea.style.height = document.fullscreenElement ? "85%" : "85%";
//       }
//     };
//     document.addEventListener("fullscreenchange", handleFullscreenChange);
//     return () => {
//       document.removeEventListener("fullscreenchange", handleFullscreenChange);
//     };
//   }, []);

//   if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
//     console.warn("⚠️ NEXT_PUBLIC_BACKEND_URL is undefined at runtime!");
//   }


//   if (!currentVideo || !currentVideo.filepath) {
//     return (
//       <p className="text-red-500">⚠️ Video not found or still loading...</p>
//     );
//   }




// useEffect(() => {
//   if (!showCountdown) return;

//   if (countdownSeconds <= 0) {
//     setShowPopup(true);
//     setShowCountdown(false);
//     const video = videoRef.current;
//     if (video) video.pause();
//     return;
//   }

//   const timer = setInterval(() => {
//     setCountdownSeconds(prev => prev - 1);
//   }, 1000);

//   return () => clearInterval(timer);
// }, [showCountdown, countdownSeconds]);


// useEffect(() => {
//   const video = videoRef.current;
//   if (!video) return;

//   let countdownStartTimeout: NodeJS.Timeout;

//   const onPlay = () => {
//     // Start countdown after 5 seconds delay from play
//     countdownStartTimeout = setTimeout(() => {
//       setShowCountdown(true);
//     }, 5000);
//   };

//   video.addEventListener("play", onPlay);

//   return () => {
//     if (countdownStartTimeout) clearTimeout(countdownStartTimeout);
//     video.removeEventListener("play", onPlay);
//   };
// }, []);









// console.log("Current video object:", currentVideo);
//  console.log("ENV:", process.env.NEXT_PUBLIC_BACKEND_URL);
// console.log("Current video:", currentVideo);

//   const videoUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${currentVideo.filepath.replace(/\\/g, "/")}`;
// console.log("🎥 Final Video URL:", videoUrl);
//   return (
//     <div>
//       <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
//         <video
//           key={currentVideo.filepath}
//           ref={videoRef}
//           className="w-[840px] h-full"
//           controls
//            controlsList="nodownload" // <-- this disables native download option
//   onContextMenu={(e) => e.preventDefault()} // disables right-click save
//           poster="/poster1.png"
//       // poster={`/${currentVideo.poster}`}
//         >
//           <source src={videoUrl} type="video/mp4" />
//           Your browser does not support the video tag.
//         </video>



// {showCountdown && (
//   <div
//     style={{
//       position: "absolute",
//       top: 10,
//       left: 10,
//       backgroundColor: "rgba(0,0,0,0.6)",
//       color: "white",
//       padding: "5px 10px",
//       borderRadius: 5,
//       fontWeight: "bold",
//       fontSize: 14,
//       zIndex: 1000,
//     }}
//   >
//     Watch video ends in {formatTime(countdownSeconds)}
//   </div>
// )}


//         <div
//           id="gesture-overlay"
//           className="absolute inset-0 z-50 top-0 left-0 w-full"
//           style={{
//             height: "85%",
//             backgroundColor: "rgba(255,255,255,0.01)",
//             pointerEvents: "auto",
//           }}
//           onPointerDown={handleTap}
//         />

//         {gestureMessage && (
//           <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded z-50">
//             {gestureMessage}
//           </div>
//         )}
//       </div>


// {showPopup && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100vw",
//             height: "100vh",
//             backgroundColor: "rgba(0,0,0,0.7)",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             zIndex: 10000,
//           }}
//         >
//           <div
//             style={{
//               backgroundColor: "white",
//               padding: 30,
//               borderRadius: 10,
//               maxWidth: 400,
//               textAlign: "center",
//             }}
//           >
//             <h2>Your free watch time is over</h2>
//             <p>Upgrade to premium for unlimited access.</p>
//             <img
//               src="/path-to-upgrade-image.png"
//               alt="Upgrade"
//               style={{ width: "100%", marginBottom: 20 }}
//             />

//             <button
//               onClick={() => {
//                 setShowPopup(false);
//                 router.back(); // Go Back
//               }}
//               style={{ marginRight: 20 }}
//             >
//               Go Back
//             </button>

//             <button
//               onClick={() => {
//                 setShowPopup(false);
//                 router.push("/subscription"); // Go to subscription page
//               }}
//             >
//               Go to Premium
//             </button>
//           </div>
//         </div>
//       )}



//       <div className="mt-3 text-center text-base font-medium text-green-600">
//         🌟 Total Points: {points}
//       </div>

//       {message && (
//         <div className="mt-2 text-center text-sm font-semibold text-blue-600">
//           {message}
//         </div>
//       )}
//     </div>
//   );
// }













































// "use client";

// import { useRef, useEffect, useState } from "react";
// import { useRouter, useParams, usePathname } from "next/navigation";
// import { auth, db } from "@/lib/firebase";
// import {
//   doc,
//   getDoc,
//   setDoc,
//   updateDoc,
//   arrayUnion,
// } from "firebase/firestore";
// import axios from "axios"; // ✅ For dynamic video fetching

// interface VideoPlayerProps {
//   video: {
//     _id: string;
//     videotitle: string;
//     filepath: string;
//     poster: string; 
//   };
// }

// export default function VideoPlayer({ video }: VideoPlayerProps) {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const [message, setMessage] = useState("");
//   const [points, setPoints] = useState(0);
//   const [currentVideo, setCurrentVideo] = useState(video);
//   const router = useRouter();
//   const params = useParams();
//   const [showPopup, setShowPopup] = useState(false);
//   const tapCountRef = useRef(0);
//   const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null);
//   const [gestureMessage, setGestureMessage] = useState("");
//   const [tapArea, setTapArea] = useState("");
//   const [showCountdown, setShowCountdown] = useState(false);
// const [countdownSeconds, setCountdownSeconds] = useState(300); // 5 minutes
// const [userPlan, setUserPlan] = useState<{ name: string; time: number }>({
//   name: "Free",
//   time: 5 * 60,
// });

// const formatTime = (sec: number) => {
//   const m = Math.floor(sec / 60);
//   const s = Math.floor(sec % 60);
//   return `${m}:${s < 10 ? "0" : ""}${s}`;
// };




//   const handleTap = (e: React.PointerEvent<HTMLDivElement>) => {
//     const x = e.clientX;
//     const rect = e.currentTarget.getBoundingClientRect();
//     const relativeX = x - rect.left;
//     const width = rect.width;

//     let area = "";
//     if (relativeX < width / 3) area = "left";
//     else if (relativeX < (2 * width) / 3) area = "center";
//     else area = "right";

//     setTapArea(area);
//     tapCountRef.current += 1;

//     if (tapTimeoutRef.current) clearTimeout(tapTimeoutRef.current);

//     tapTimeoutRef.current = setTimeout(() => {
//       const tapCount = tapCountRef.current;
//       tapCountRef.current = 0;

//       const videoEl = videoRef.current;

//       if (tapCount === 1) {
//         if (area === "center" && videoEl) {
//           videoEl.paused ? videoEl.play() : videoEl.pause();
//           setGestureMessage("▶️ Play/Pause toggled");
//         }
//       } else if (tapCount === 2 && videoEl) {
//         if (area === "left") {
//           videoEl.currentTime = Math.max(0, videoEl.currentTime - 10);
//           setGestureMessage("⏪ Rewind 10s");
//         } else if (area === "right") {
//           videoEl.currentTime = Math.min(
//             videoEl.duration,
//             videoEl.currentTime + 10
//           );
//           setGestureMessage("⏩ Forward 10s");
//         }
//       } else if (tapCount >= 3) {
//         if (area === "center") {
//           setGestureMessage("⏭️ Moving to next video...");
//           setTimeout(async () => {
//             try {
//               const response = await axios.get(
//                 `${process.env.NEXT_PUBLIC_BACKEND_URL}/video/getall`
//               );
//               const videos = response.data;

//               const currentIndex = videos.findIndex(
//                 (v: any) => v._id === currentVideo._id
//               );

//               if (currentIndex !== -1 && currentIndex < videos.length - 1) {
//                 const nextVideo = videos[currentIndex + 1];
//                 console.log("Next video selected:", nextVideo);

//                window.open(`/watch/${nextVideo._id}`, "_blank");
//                 // router.push(`/watch/${nextVideo._id}`);
//               } else {
//                 setGestureMessage("✅ This was the last video.");
//               }
//             } catch (err) {
//               console.error("Failed to fetch video list:", err);
//               setGestureMessage("❌ Failed to load next video.");
//             }
//           }, 500);
//         } else if (area === "right") {
//           setGestureMessage("❌ Closing site...");
//           setTimeout(() => {
//             window.open("/goodbye", "_blank");
//           }, 500);
//         } else if (area === "left") {
//           setGestureMessage("💬 Showing comments...");
//           setTimeout(() => {
//             // window.open("/comments", "_blank");
//              window.open(
//       `/comments?videoId=${currentVideo._id}`,
//       "_blank",
//       "noopener,noreferrer"
//     );
//           }, 500);
//         }
//       }
//       setTimeout(() => setGestureMessage(""), 1500);
//     }, 350);
//   };





//   useEffect(() => {
//     const fetchPoints = async () => {
//       const user = auth.currentUser;
//       if (!user) return;

//       const userRef = doc(db, "users", user.uid);
//       const userSnap = await getDoc(userRef);
//       if (userSnap.exists()) {
//         const userData = userSnap.data();
//         setPoints(userData?.points || 0);
//       }
//     };

//     fetchPoints();
//   }, []);





//   useEffect(() => {
//     const handleVideoEnd = async () => {
//       const user = auth.currentUser;
//       if (!user) return;

//       const userRef = doc(db, "users", user.uid);
//       const userSnap = await getDoc(userRef);

//       if (userSnap.exists()) {
//         const userData = userSnap.data();
//         const watched = userData?.watchedVideos || [];
//         const currentPoints = userData?.points || 0;

//         if (!watched.includes(currentVideo._id)) {
//           await updateDoc(userRef, {
//             watchedVideos: arrayUnion(currentVideo._id),
//             points: currentPoints + 5,
//           });
//           setPoints(currentPoints + 5);
//           setMessage(
//             "🎉 You watched this video for the first time and earned +5 points!"
//           );
//         } else {
//           setMessage(
//             "🔁 You already watched this video. No points earned this time."
//           );
//         }
//       } else {
//         await setDoc(userRef, {
//           email: user.email,
//           watchedVideos: [currentVideo._id],
//           points: 5,
//         });
//         setPoints(5);
//         setMessage(
//           "🎉 You watched this video for the first time and earned +5 points!"
//         );
//       }
//     };






//     const videoElement = videoRef.current;
//     if (videoElement) {
//       videoElement.addEventListener("ended", handleVideoEnd);
//     }

//     return () => {
//       if (videoElement) {
//         videoElement.removeEventListener("ended", handleVideoEnd);
//       }
//     };
//   }, [currentVideo._id]);









//   useEffect(() => {
//     const gestureArea = document.getElementById("gesture-overlay");
//     const handleFullscreenChange = () => {
//       if (gestureArea) {
//         gestureArea.style.height = document.fullscreenElement ? "85%" : "85%";
//       }
//     };
//     document.addEventListener("fullscreenchange", handleFullscreenChange);
//     return () => {
//       document.removeEventListener("fullscreenchange", handleFullscreenChange);
//     };
//   }, []);





//   if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
//     console.warn("⚠️ NEXT_PUBLIC_BACKEND_URL is undefined at runtime!");
//   }

//   if (!currentVideo || !currentVideo.filepath) {
//     return (
//       <p className="text-red-500">⚠️ Video not found or still loading...</p>
//     );
//   }


  

// useEffect(() => {
//   if (!showCountdown) return;

//   const video = videoRef.current;
//   if (!video) return;

//   const timer = setInterval(() => {
//     setCountdownSeconds(prev => {
//       if (prev <= 1) {
//         clearInterval(timer);
//         setShowPopup(true);
//         setShowCountdown(false);
//         video.pause();
//         return 0;
//       }
//       return prev - 1;
//     });
//   }, 1000);

//   return () => clearInterval(timer);
// }, [showCountdown]);









// // useEffect(() => {
// //   const video = videoRef.current;
// //   if (!video) return;

// //   let countdownStartTimeout: NodeJS.Timeout;

// //   const handlePlay = () => {
// //     // Start countdown after 5 seconds from play
// //     if (!showCountdown) {
// //       countdownStartTimeout = setTimeout(() => {
// //         setShowCountdown(true);
// //       }, 5000);
// //     }
// //   };

// //   const handlePause = () => {
// //     // Pause countdown immediately
// //     setShowCountdown(false);
// //   };

// //   const handleSeeked = () => {
// //     // Optional: keep countdown running from current value
// //   };

// //   video.addEventListener("play", handlePlay);
// //   video.addEventListener("pause", handlePause);
// //   video.addEventListener("seeked", handleSeeked);

// //   return () => {
// //     if (countdownStartTimeout) clearTimeout(countdownStartTimeout);
// //     video.removeEventListener("play", handlePlay);
// //     video.removeEventListener("pause", handlePause);
// //     video.removeEventListener("seeked", handleSeeked);
// //   };
// // }, []);
















// // Countdown interval reference
// // const countdownRef = useRef<NodeJS.Timeout | null>(null);
// // const countdownStartTimeoutRef = useRef<NodeJS.Timeout | null>(null);

// // Start/stop countdown based on play/pause and forward/rewind
// useEffect(() => {
//   const video = videoRef.current;
//   if (!video) return;
//   if (!userPlan || userPlan.time === Infinity) return; // Gold plan: unlimited

//   let countdownStartTimeout: NodeJS.Timeout;
//   let countdownInterval: NodeJS.Timeout;

//   const updateCountdown = () => {
//     const remaining = Math.max(userPlan.time - video.currentTime, 0);
//     setCountdownSeconds(remaining);

//     if (remaining <= 0) {
//       clearInterval(countdownInterval);
//       setShowCountdown(false);
//       setShowPopup(true);
//       video.pause();
//     }
//   };

//   const startCountdown = () => {
//     // update immediately once
//     updateCountdown();
//     // then keep updating while video is playing
//     countdownInterval = setInterval(() => {
//       // if (!video.paused) {
//       //   updateCountdown();
//       // }
//       updateCountdown();
//     }, 1000); // every 0.5s for smooth countdown
//   };

//   const handlePlay = () => {
//     countdownStartTimeout = setTimeout(() => {
//       setShowCountdown(true);
//       startCountdown();
//     }, 1000); // start countdown 1 second after play
//   };

//   const handlePause = () => {
//     // no decrement when paused
//   //  if (countdownInterval) clearInterval(countdownInterval);
//   };

//   const handleSeeked = () => {
//     // update countdown immediately after forward/rewind
//     updateCountdown();
//   };

//   video.addEventListener("play", handlePlay);
//   video.addEventListener("pause", handlePause);
//   video.addEventListener("seeked", handleSeeked);

//   return () => {
//     if (countdownStartTimeout) clearTimeout(countdownStartTimeout);
//     if (countdownInterval) clearInterval(countdownInterval);

//     video.removeEventListener("play", handlePlay);
//     video.removeEventListener("pause", handlePause);
//     video.removeEventListener("seeked", handleSeeked);
//   };
// }, [userPlan]);









// console.log("Current video object:", currentVideo);
//  console.log("ENV:", process.env.NEXT_PUBLIC_BACKEND_URL);
// console.log("Current video:", currentVideo);


// //   const videoUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${currentVideo.filepath.replace(/\\/g, "/")}`;
// // console.log("🎥 Final Video URL:", videoUrl);

// // const videoUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${currentVideo.filepath.replace(/\\/g, "/")}`;
// // console.log("🎥 Final Video URL:", videoUrl);
// const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

// let videoUrl = "";
// if (currentVideo?.filepath) {
//   const cleanPath = currentVideo.filepath.replace(/\\/g, "/"); // fix Windows slashes
//   videoUrl = `${backendUrl}/${cleanPath.replace(/^\/+/, "")}`;
// }
// console.log("Backend URL:", process.env.NEXT_PUBLIC_BACKEND_URL);
// // console.log("Response from backend:", response.data);
// console.log("🎥 Final Video URL:", videoUrl);




// // const videoUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${currentVideo.filepath.replace(/^\/?/, "")}`;

//   return (
//     <div>
//       {/* <div className="relative aspect-video bg-black rounded-lg overflow-hidden"> */}
//         <div className="relative aspect-video rounded-lg overflow-hidden bg-black dark:bg-gray-900 transition-colors duration-300">

//         <video
//           key={currentVideo.filepath}
//           // key={currentVideo?._id}

//           ref={videoRef}
//           // className="w-[840px] h-full"
//           className="w-full h-full  max-w-[840px] mx-auto rounded-lg"
//           controls
//            controlsList="nodownload" // <-- this disables native download option
//   onContextMenu={(e) => e.preventDefault()} // disables right-click save
//           poster="/poster1.png"
//       // poster={`/${currentVideo.poster}`}
//         >
//           <source src={videoUrl} type="video/mp4" />
//           Your browser does not support the video tag.
//         </video>



// {/* {showCountdown && (
//   <div
//     style={{
//       position: "absolute",
//       top: 10,
//       left: 10,
//       backgroundColor: "rgba(0,0,0,0.6)",
//       color: "white",
//       padding: "5px 10px",
//       borderRadius: 5,
//       fontWeight: "bold",
//       fontSize: 14,
//       zIndex: 1000,
//     }}
//   >
//     Free Watch ends in {formatTime(countdownSeconds)}
//   </div>
// )} */}
// {showCountdown && (
//   <div
//     className="absolute top-2 left-2 px-2 py-1 rounded font-bold text-sm z-50 bg-black text-white dark:bg-gray-800 dark:text-white transition-colors duration-300"
//   >
//     Free Watch ends in {formatTime(countdownSeconds)}
//   </div>

// )}


//         <div
//           id="gesture-overlay"
//           className="absolute inset-0 z-50 top-0 left-0 w-full"
//           style={{
//             height: "85%",
//             backgroundColor: "rgba(255,255,255,0.01)",
//             pointerEvents: "auto",
//           }}
//           onPointerDown={handleTap}
//         />

//         {/* {gestureMessage && (
//           <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded z-50">
//             {gestureMessage}
//           </div>
//         )} */}
// {gestureMessage && (
//   <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded z-50 dark:bg-gray-800 dark:text-white transition-colors duration-300">
//     {gestureMessage}
//   </div>
// )}

//       </div>

// {/* 
// {showPopup && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100vw",
//             height: "100vh",
//             backgroundColor: "rgba(0,0,0,0.7)",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             zIndex: 10000,
//           }}
//         >
//           <div
//             style={{
//               backgroundColor: "white",
//               padding: 30,
//               borderRadius: 10,
//               maxWidth: 400,
//               textAlign: "center",
//             }}
//           >
//             <h2>Your free watch time is over</h2>
//             <p>Upgrade to premium for unlimited access.</p>
//             <img
//               src="/path-to-upgrade-image2.png"
//               alt="Upgrade"
//               style={{ width: "100%", marginBottom: 20 }}
//             />

//             <button
//               onClick={() => {
//                 setShowPopup(false);
//                 router.back(); // Go Back
//               }}
              
//               className="px-4 py-2 bg-gray-500 text-white rounded-lg m-3"
//             >
//               Go Back
//             </button>

//             <button
//               onClick={() => {
//                 setShowPopup(false);
//                 window.open("/subscription", "_blank");
//               }}
              
//                className="px-4 py-2 bg-green-600 text-white rounded-lg"
//             >
//               Go to Premium
//             </button>
//           </div>
//         </div>
//       )} */}


// {showPopup && (
//   <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 z-50">
//     <div className="bg-white dark:bg-gray-800 p-8 rounded-lg max-w-sm text-center transition-colors duration-300">
//       <h2 className="text-lg font-semibold text-black dark:text-white">
//         Your free watch time is over
//       </h2>
//       <p className="mt-2 text-gray-700 dark:text-gray-300">
//         Upgrade to premium for unlimited access.
//       </p>
//       <img
//         src="/path-to-upgrade-image2.png"
//         alt="Upgrade"
//         className="w-full mt-4 mb-4"
//       />
//       <div className="flex justify-between">
//         <button
//           onClick={() => { setShowPopup(false); router.back(); }}
//           className="px-4 py-2 bg-gray-500 text-white rounded-lg"
//         >
//           Go Back
//         </button>
//         <button
//           onClick={() => { setShowPopup(false); window.open("/subscription", "_blank"); }}
//           className="px-4 py-2 bg-green-600 text-white rounded-lg"
//         >
//           Go to Premium
//         </button>
//       </div>
//     </div>
//   </div>
// )}



//       <div className="mt-3 text-center text-base font-medium text-green-600">
//         🌟 Total Points: {points}
//       </div>

//       {message && (
//         <div className="mt-2 text-center text-sm font-semibold text-blue-600">
//           {message}
//         </div>
//       )}
//     </div>
//   );
// }
























"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import axios from "axios";

interface VideoPlayerProps {
  video: {
    _id: string;
    videotitle: string;
    filepath: string;
    poster: string;
   
  };
}

export default function VideoPlayer({ video }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [message, setMessage] = useState("");
  const [points, setPoints] = useState(0);
  const [currentVideo, setCurrentVideo] = useState(video);

  // keep currentVideo in sync with prop
useEffect(() => {
  setCurrentVideo(video);
}, [video]);

  // Reset states when video changes
  const [duration, setDuration] = useState<number>(0);

  const router = useRouter();
  const params = useParams();

  // Popups
  const [showPopup, setShowPopup] = useState(false); // Free watch over
  const [showPlanPopup, setShowPlanPopup] = useState(false); // Purchased plan

  // Countdown
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(300);

  // User plan
  const [userPlan, setUserPlan] = useState<{ name: string; time: number }>({
    name: "Free",
    time: 5 * 60,
  });

// Reset countdown when video changes
useEffect(() => {
  if (!userPlan || userPlan.time === Infinity) return;


    if (videoRef.current) {
    videoRef.current.currentTime = 0;
  }
  setCountdownSeconds(userPlan.time); // reset to full plan time
  setShowCountdown(false);            // hide until play starts
  setShowPopup(false);                // close popup if open
}, [currentVideo, userPlan]);



  // Gesture logic
  const tapCountRef = useRef(0);
  const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [gestureMessage, setGestureMessage] = useState("");
  const [tapArea, setTapArea] = useState("");

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

 

  const handleTap = (e: React.PointerEvent<HTMLDivElement>) => {
    const x = e.clientX;
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeX = x - rect.left;
    const width = rect.width;

    let area = "";
    if (relativeX < width / 3) area = "left";
    else if (relativeX < (2 * width) / 3) area = "center";
    else area = "right";

    setTapArea(area);
    tapCountRef.current += 1;

    if (tapTimeoutRef.current) clearTimeout(tapTimeoutRef.current);

    tapTimeoutRef.current = setTimeout(() => {
      const tapCount = tapCountRef.current;
      tapCountRef.current = 0;

      const videoEl = videoRef.current;

      if (tapCount === 1) {
        if (area === "center" && videoEl) {
          videoEl.paused ? videoEl.play() : videoEl.pause();
          setGestureMessage("▶️ Play/Pause toggled");
        }
      } else if (tapCount === 2 && videoEl) {
        if (area === "left") {
          videoEl.currentTime = Math.max(0, videoEl.currentTime - 10);
          setGestureMessage("⏪ Rewind 10s");
        } else if (area === "right") {
          videoEl.currentTime = Math.min(videoEl.duration, videoEl.currentTime + 10);
          setGestureMessage("⏩ Forward 10s");
        }
      } else if (tapCount >= 3) {
        if (area === "center") {
          setGestureMessage("⏭️ Moving to next video...");
          setTimeout(async () => {
            try {
              const response = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/video/getall`
              );
              const videos = response.data;
              const currentIndex = videos.findIndex((v: any) => v._id === currentVideo._id);

              if (currentIndex !== -1 && currentIndex < videos.length - 1) {
                const nextVideo = videos[currentIndex + 1];
                window.open(`/watch/${nextVideo._id}`, "_blank");
              } else {
                setGestureMessage("✅ This was the last video.");
              }
            } catch (err) {
              console.error("Failed to fetch video list:", err);
              setGestureMessage("❌ Failed to load next video.");
            }
          }, 500);
        } else if (area === "right") {
          setGestureMessage("❌ Closing site...");
          setTimeout(() => window.open("/goodbye", "_blank"), 500);
        } else if (area === "left") {
          setGestureMessage("💬 Showing comments...");
          setTimeout(() => window.open(`/comments?videoId=${currentVideo._id}`, "_blank"), 500);
        }
      }

      setTimeout(() => setGestureMessage(""), 1500);
    }, 350);
  };

  // Fetch user points
  useEffect(() => {
    const fetchPoints = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        setPoints(userData?.points || 0);
      }
    };
    fetchPoints();
  }, []);

  // Award points on video end
  useEffect(() => {
    const handleVideoEnd = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const watched = userData?.watchedVideos || [];
        const currentPoints = userData?.points || 0;

        if (!watched.includes(currentVideo._id)) {
          await updateDoc(userRef, {
            watchedVideos: arrayUnion(currentVideo._id),
            points: currentPoints + 5,
          });
          setPoints(currentPoints + 5);
          setMessage("🎉 You watched this video for the first time and earned +5 points!");
        } else {
          setMessage("🔁 You already watched this video. No points earned this time.");
        }
      } else {
        await setDoc(userRef, {
          email: user.email,
          watchedVideos: [currentVideo._id],
          points: 5,
        });
        setPoints(5);
        setMessage("🎉 You watched this video for the first time and earned +5 points!");
      }
    };

    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener("ended", handleVideoEnd);
    }

    return () => {
      if (videoElement) videoElement.removeEventListener("ended", handleVideoEnd);
    };
  }, [currentVideo._id]);

  // Gesture overlay resize
  useEffect(() => {
    const gestureArea = document.getElementById("gesture-overlay");
    const handleFullscreenChange = () => {
      if (gestureArea) gestureArea.style.height = document.fullscreenElement ? "85%" : "85%";
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);




  // Fetch user plan and show purchased plan popup
//   useEffect(() => {
//   const fetchUserPlan = async () => {
//     const user = auth.currentUser;
//     if (!user) return;

//     try {
//       const res = await axios.get(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/premium/${user.email}`
//       );
//       if (res.data.success) {
//         setUserPlan({ name: res.data.plan, time: res.data.planLimit *60});

//         // ✅ Show purchased plan popup if plan is not Free
//         // if (res.data.plan !== "Free") {
//         //   setShowPlanPopup(true);
//         // }

//  const justPurchased = sessionStorage.getItem("planJustPurchased");
//         if (res.data.plan !== "Free" && justPurchased) {
//           setShowPlanPopup(true);
//           sessionStorage.removeItem("planJustPurchased"); // show once
//         }

//       }

//     } catch (err) {
//       console.error("Failed to fetch user plan: ", err);
//     }
//   };

//   fetchUserPlan();
// }, []);


// Fetch user plan and refresh on video change or reload
useEffect(() => {
  const fetchUserPlan = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/premium/${user.email}`
      );
      console.log("✅ Plan API Response:", res.data);

      if (res.data.success) {
        setUserPlan({
          name: res.data.plan,
          time: res.data.plan === "Gold" ? Infinity : res.data.planLimit * 60,
        });

        const justPurchased = sessionStorage.getItem("planJustPurchased");
        if (res.data.plan !== "Free" && justPurchased) {
          setShowPlanPopup(true);
          sessionStorage.removeItem("planJustPurchased");
        }
      }
    } catch (err) {
      console.error("❌ Failed to fetch user plan: ", err);
    }
  };

  fetchUserPlan();
}, [currentVideo._id, auth.currentUser]);  // <--- run again when video changes or user changes


  // Countdown for limited plans
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (!userPlan || userPlan.time === Infinity) return;

    let countdownStartTimeout: NodeJS.Timeout;
    let countdownInterval: NodeJS.Timeout;

    const updateCountdown = () => {
      const remaining = Math.max(userPlan.time - video.currentTime, 0);
      setCountdownSeconds(remaining);

      if (remaining <= 0) {
        clearInterval(countdownInterval);
        setShowCountdown(false);
        setShowPopup(true);
        video.pause();
      }
    };


    const startCountdown = () => {
      updateCountdown();
      countdownInterval = setInterval(updateCountdown, 1000);
    };

    const handlePlay = () => {
      countdownStartTimeout = setTimeout(() => {
        setShowCountdown(true);
        startCountdown();
      }, 1000);
    };

    const handlePause = () => {};
    const handleSeeked = () => updateCountdown();

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("seeked", handleSeeked);

    return () => {
      if (countdownStartTimeout) clearTimeout(countdownStartTimeout);
      if (countdownInterval) clearInterval(countdownInterval);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("seeked", handleSeeked);
    };
  }, [userPlan,  currentVideo._id]);



  // Video URL
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
  const videoUrl = currentVideo?.filepath
    ? `${backendUrl}/${currentVideo.filepath.replace(/\\/g, "/").replace(/^\/+/, "")}`
    : "";

  return (
    <div>
      <div className="relative aspect-video rounded-lg overflow-hidden bg-black dark:bg-gray-900 transition-colors duration-300">
        <video
          key={currentVideo._id}
          ref={videoRef}
          className="w-full h-full max-w-[840px] mx-auto rounded-lg"
          controls
          controlsList="nodownload"
          onContextMenu={(e) => e.preventDefault()}
          // poster="/poster1.png"
        //  poster={posterUrl}
           onLoadedMetadata={(e) => {
          const videoElement = e.currentTarget as HTMLVideoElement;
          setDuration(videoElement.duration); // get real duration in seconds
        }}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>


        {showCountdown && (
          <div className="absolute top-2 left-2 px-2 py-1 rounded font-bold text-sm z-50 bg-black text-white dark:bg-gray-800 dark:text-white transition-colors duration-300">
            Free Watch ends in {formatTime(countdownSeconds)}
          </div>
        )}

        <div
          id="gesture-overlay"
          className="absolute inset-0 z-50 top-0 left-0 w-full"
          style={{ height: "85%", backgroundColor: "rgba(255,255,255,0.01)", pointerEvents: "auto" }}
          onPointerDown={handleTap}
        />

        {gestureMessage && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded z-50 dark:bg-gray-800 dark:text-white transition-colors duration-300">
            {gestureMessage}
          </div>
        )}
      </div>

    
     {/* Purchased Plan Popup - only shows for purchased plans */}
{showPlanPopup && (
  <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 z-50">
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg max-w-sm text-center transition-colors duration-300">
      <h2 className="text-lg font-semibold text-black dark:text-white">
        🎉 Plan Activated: {userPlan.name}
      </h2>
      {userPlan.time !== Infinity ? (
        <p className="mt-2 text-gray-700 dark:text-gray-300">
          Your watch time: {formatTime(userPlan.time)}
        </p>
      ) : (
        <p className="mt-2 text-gray-700 dark:text-gray-300">
          Unlimited access enabled
        </p>
      )}
      <div className="flex justify-center mt-4 gap-4">
        <button
          onClick={() => setShowPlanPopup(false)}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg"
        >
          Cancel
        </button>
        <button
          onClick={() => setShowPlanPopup(false)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          Watch Video
        </button>
      </div>
    </div>
  </div>
)}


      {/* Free watch over popup */}
      {showPopup && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg max-w-sm text-center transition-colors duration-300">
            <h2 className="text-lg font-semibold text-black dark:text-white">
              Your free watch time is over
            </h2>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Upgrade to premium for unlimited access.
            </p>
            <img src="/path-to-upgrade-image2.png" alt="Upgrade" className="w-full mt-4 mb-4" />
            <div className="flex justify-between">
              <button
                onClick={() => {
                  setShowPopup(false);
                  router.back();
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
              >
                Go Back
              </button>
              <button
                onClick={() => {
                  setShowPopup(false);
                  window.open("/subscription", "_blank");
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                Go to Premium
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-3 text-center text-base font-medium text-green-600">🌟 Total Points: {points}</div>

      {message && <div className="mt-2 text-center text-sm font-semibold text-blue-600">{message}</div>}
    </div>
  );
}
