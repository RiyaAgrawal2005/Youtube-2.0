// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import {
//   collection,
//   doc,
//   setDoc,
//   addDoc,
//   getDoc,
//   onSnapshot,
// } from "firebase/firestore";
// import { videoCallDb, videoCallAuth } from "@/lib/videoCallFirebase";
// import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";

// const VideoCall = () => {
//   const [status, setStatus] = useState("Idle");
//   const [roomId, setRoomId] = useState<string | null>(null);
//   const [user, setUser] = useState<any>(null);
//   const [isRecording, setIsRecording] = useState(false);
//  const [showMenu, setShowMenu] = useState(false);
//   const peerConnection = useRef<RTCPeerConnection | null>(null);
//   const localStream = useRef<MediaStream | null>(null);
//   const remoteStream = useRef<MediaStream | null>(null);
//   const mediaRecorder = useRef<MediaRecorder | null>(null);
//   const recordedChunks = useRef<Blob[]>([]);

//   const localVideoRef = useRef<HTMLVideoElement>(null);
//   const remoteVideoRef = useRef<HTMLVideoElement>(null);

//   const provider = new GoogleAuthProvider();

//   // ================== AUTH CHECK ==================
//   useEffect(() => {
//     console.log("🔍 Checking VideoCall Auth state...");
//     const unsubscribe = onAuthStateChanged(videoCallAuth, (usr) => {
//       if (usr) {
//         console.log("✅ User logged in:", usr.email, "UID:", usr.uid);
//         setUser(usr);
//       } else {
//         console.warn("❌ No user logged in via VideoCall Auth!");
//         setUser(null);
//       }
//     });

//     return () => unsubscribe();
//   }, []);




//   const signInVideoCall = async () => {
//     try {
//       console.log("🟢 Initiating VideoCall Google sign-in...");
//       const result = await signInWithPopup(videoCallAuth, provider);
//       console.log("✅ Signed in:", result.user.email, "UID:", result.user.uid);
//       setUser(result.user);
//     } catch (err) {
//       console.error("❌ VideoCall Auth sign-in failed:", err);
//       alert("Sign-in failed. Check console for details.");
//     }
//   };





// // ---------------- CREATE PEER CONNECTION ----------------

// const createPeerConnection = () => {
//   console.log("⚙️ Creating RTCPeerConnection with full ICE servers...");

//   const configuration = {
//     iceServers: [
//       { urls: "stun:stun.l.google.com:19302" },
//       {
//         urls: [
//           "turn:openrelay.metered.ca:80?transport=tcp",
//           "turn:openrelay.metered.ca:443?transport=tcp",
//           "turn:openrelay.metered.ca:3478?transport=udp",
//         ],
//         username: "openrelayproject",
//         credential: "openrelayproject",
//       },
//     ],
//     iceCandidatePoolSize: 10,
//   };

//   peerConnection.current = new RTCPeerConnection(configuration);
//   console.log("🔗 PeerConnection created:", peerConnection.current);


//   peerConnection.current.onnegotiationneeded = async () => {
//   console.log("🌀 onnegotiationneeded fired — renegotiating...");
//   try {
//     const offer = await peerConnection.current!.createOffer();
//     await peerConnection.current!.setLocalDescription(offer);
//     console.log("🔁 Negotiation offer updated.");
//   } catch (err) {
//     console.error("❌ Error during renegotiation:", err);
//   }
// };



//   // ✅ Prepare remote stream container
//   remoteStream.current = new MediaStream();
//   if (remoteVideoRef.current) {
//     remoteVideoRef.current.srcObject = remoteStream.current;
//   }

//   // ✅ Handle incoming remote tracks
//   peerConnection.current.ontrack = (event) => {
//     console.log("📡 ontrack event fired:", event.streams);
//     console.log("🎧 Remote tracks:", event.streams[0].getTracks());
//     const [stream] = event.streams;

//     // Attach stream only once
//     if (stream && remoteVideoRef.current && remoteVideoRef.current.srcObject !== stream) {
//       remoteVideoRef.current.srcObject = stream;

//       console.log("✅ Remote stream attached once.");
//     } else if (event.track) {
//       remoteStream.current?.addTrack(event.track);
//       if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream.current;
//     }

//     // 🧩 Fallback for autoplay (wait a bit for stream to stabilize)
//     setTimeout(() => {
//       if (remoteVideoRef.current) {
//         const video = remoteVideoRef.current;
//         if (video.paused && video.srcObject) {
//           video.play().catch((err) => {
//             console.warn("⚠️ Remote video autoplay blocked:", err);
//           });
//         }
//       }
//     }, 2000);
//   };




//   // ✅ React when the connection is established
//   peerConnection.current.onconnectionstatechange = () => {
//     console.log("🌐 Connection state:", peerConnection.current?.connectionState);

//     if (peerConnection.current?.connectionState === "connected") {
//       console.log("✅ Connection established — ensuring remote stream is playing...");
//       setTimeout(() => {
//         if (remoteVideoRef.current && remoteStream.current) {
//           remoteVideoRef.current.srcObject = remoteStream.current;
//           const video = remoteVideoRef.current;
//           if (video.paused) {
//             video.play().catch((err) =>
//               console.warn("⚠️ Remote video autoplay blocked after connect:", err)
//             );
//           }
//         }
//       }, 1500);
//     }
//   };


//   if (peerConnection.current?.connectionState === "connected") {
//   setTimeout(() => {
//     const video = remoteVideoRef.current;
//     if (video && video.paused && video.srcObject) {
//       console.log("🔁 Retrying remote video play...");
//       video.play().catch(err => console.warn("⚠️ Still blocked:", err));
//     }
//   }, 4000);
// }

//   // ✅ ICE candidate events
//   peerConnection.current.onicecandidate = (event) => {
//     if (event.candidate) {
//       console.log("🧊 ICE candidate generated:", event.candidate);
//     }
//   };
// };







// // ---------------- START LOCAL CAMERA + MIC ----------------


// const startStream = async () => {
//   try {
//     console.log("🎥 Requesting camera/mic permission...");
//     const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//     localStream.current = stream;

//     console.log("✅ Got local stream:", stream, "tracks:", stream.getTracks().map(t => t.kind));
//     console.log("🎙️ Local audio tracks:", localStream.current.getAudioTracks());



//     if (localVideoRef.current) {
//       localVideoRef.current.srcObject = stream;
//       localVideoRef.current.muted = true; // mute local preview
//       console.log("📺 Local video element attached.");
//     } else {
//       console.warn("⚠️ Local video ref is NULL!");
//     }

//     if (!peerConnection.current) {
//       console.warn("⚠️ PeerConnection not ready when startStream called. Tracks will not be attached.");
//       return;
//     }

//     // add tracks to the peer connection
//     stream.getTracks().forEach((track) => {
//       const sender = peerConnection.current!.addTrack(track, stream);
//       console.log("➕ Added local track to PeerConnection:", track.kind, "sender:", sender);
//     });





//     // debug: show senders/receivers
//     console.log("📤 Senders:", peerConnection.current.getSenders().map(s => ({ kind: s.track?.kind, id: s.track?.id })));
//     console.log("📥 Receivers:", peerConnection.current.getReceivers().map(r => ({ kind: r.track?.kind })));
//   } catch (err) {
//     console.error("🔥 Error accessing camera/mic:", err);
//     alert("Cannot access camera/microphone. Check permissions and allow access.");
//   }
// };





//   const startScreenShare = async () => {
//   try {
//     console.log("🖥 Starting screen share...");
//     const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
//     localStream.current = stream;

//     if (peerConnection.current) {
//       const senders = peerConnection.current.getSenders();
//       stream.getTracks().forEach((track) => {
//         const sender = senders.find((s) => s.track?.kind === track.kind);
//         if (sender) sender.replaceTrack(track);
//         else peerConnection.current!.addTrack(track, stream);
//         console.log("🟢 Screen track added/replaced:", track.kind);
//       });
//     }

//     if (localVideoRef.current) localVideoRef.current.srcObject = stream;
//     console.log("✅ Screen sharing started successfully.");

//     // 🛑 When user stops sharing manually
//     const screenTrack = stream.getVideoTracks()[0];
//     screenTrack.onended = async () => {
//       console.log("🛑 Screen sharing stopped — restoring camera...");

//       try {
//         // 🎥 Restart camera
//         const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//         localStream.current = cameraStream;

//         // Replace back the camera track
//         if (peerConnection.current) {
//           const videoSender = peerConnection.current
//             .getSenders()
//             .find((s) => s.track && s.track.kind === "video");
//           if (videoSender) videoSender.replaceTrack(cameraStream.getVideoTracks()[0]);
//           console.log("🎥 Restored camera track after screen share ended");
//         }

//         // Update local video preview
//         if (localVideoRef.current) {
//           localVideoRef.current.srcObject = cameraStream;
//         }

//         // Stop all screen tracks cleanly
//         stream.getTracks().forEach((t) => t.stop());
//       } catch (err) {
//         console.error("❌ Error restoring camera after screen share:", err);
//       }
//     };
//   } catch (err) {
//     console.error("🔥 Error starting screen share:", err);
//     alert("Cannot start screen sharing.");
//   }
// };





//   // ================== RECORDING ==================
//   const startRecording = () => {
//     if (!localStream.current) return console.warn("❌ Cannot start recording, no local stream.");

//     console.log("⏺ Starting recording...");
//     recordedChunks.current = [];
//     mediaRecorder.current = new MediaRecorder(localStream.current);

//     mediaRecorder.current.ondataavailable = (event) => {
//       if (event.data.size > 0) recordedChunks.current.push(event.data);
//       console.log("📝 Data chunk added:", event.data.size, "bytes");
//     };

//     mediaRecorder.current.onstop = () => {
//       const blob = new Blob(recordedChunks.current, { type: "video/webm" });
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = "videoCallRecording.webm";
//       a.click();
//       console.log("✅ Recording saved locally, total chunks:", recordedChunks.current.length);
//       setIsRecording(false);
//     };

//     mediaRecorder.current.start();
//     setIsRecording(true);
//     console.log("🔴 MediaRecorder started.");
//   };

//   const stopRecording = () => {
//     if (!mediaRecorder.current) return;
//     mediaRecorder.current.stop();
//     console.log("🛑 Recording stopped.");
//   };






// // ---------------- CREATE ROOM ----------------
// const createRoom = async () => {
//   if (!user) return alert("Please log in via VideoCall auth first.");
//   console.log("🟢 Creating room for user:", user.email);
//   try {
//     // IMPORTANT: create PeerConnection first so startStream can add tracks to it
//     createPeerConnection();

//     // Now start stream which will add tracks to the peer connection
//     await startStream();
//     console.log("✅ Local stream started and tracks attached (if any).");

//     const currentUser = videoCallAuth.currentUser;
//     if (!currentUser) return alert("Please log in via VideoCall auth first.");

//     const roomRef = doc(collection(videoCallDb, "rooms"));
//     setRoomId(roomRef.id);
//     console.log("📂 Firestore room path:", roomRef.path);

//     // set up ICE candidate streaming to Firestore for this room
//     const candidatesCol = collection(videoCallDb, "rooms", roomRef.id, "candidates");
//     peerConnection.current!.onicecandidate = (event) => {
//       if (event.candidate) {
//         addDoc(candidatesCol, { ...event.candidate.toJSON(), uid: user.uid })
//           .then(() => console.log("🧊 Local ICE candidate sent:", event.candidate))
//           .catch(e => console.error("❌ Failed to send ICE candidate:", e));
//       } else {
//         console.log("🧊 ICE candidate gathering finished for this side.");
//       }
//     };

//     // create offer after local tracks are attached
//     const offer = await peerConnection.current!.createOffer();
//     await peerConnection.current!.setLocalDescription(offer);
//     console.log("🧠 Local offer created, SDP length:", offer.sdp?.length);

//     await setDoc(roomRef, { offer, creator: currentUser.uid });
//     setStatus("Waiting for answer...");
//     console.log("✅ Offer saved in Firestore for room:", roomRef.id);

//     // Listen for remote ICE candidates (added by other peer)
//     onSnapshot(collection(videoCallDb, "rooms", roomRef.id, "candidates"), async (snapshot) => {
//       snapshot.docChanges().forEach(async (change) => {
//         if (change.type === "added") {
//           const candidateData = change.doc.data();
//           // ignore own candidates
//           if (candidateData?.uid === user.uid) return;
//           try {
//             await peerConnection.current!.addIceCandidate(new RTCIceCandidate(candidateData));
//             console.log("✅ Remote ICE candidate added:", candidateData);
//           } catch (err) {
//             console.error("❌ Error adding remote ICE candidate:", err);
//           }
//         }
//       });
//     });

//     // Listen for answers from joiner(s)
//     onSnapshot(collection(roomRef, "answers"), async (snapshot) => {
//       snapshot.docChanges().forEach(async (change) => {
//         if (change.type === "added") {
//           const answerData = change.doc.data();
//           console.log("📩 Answer detected:", answerData);
//           if (!peerConnection.current?.currentRemoteDescription && answerData?.sdp) {
//             await peerConnection.current!.setRemoteDescription(new RTCSessionDescription(answerData as RTCSessionDescriptionInit));
//             console.log("✅ Remote description set from answer. Connected!");
//             setStatus("Connected!");
//             // optionally unmute remote video here if you muted earlier:
//             // if (remoteVideoRef.current) remoteVideoRef.current.muted = false;
//           }
//         }
//       });
//     });

//   } catch (err) {
//     console.error("🔥 Error creating room:", err);
//     alert("Failed to create room. Check console for details.");
//   }
// };





// // ---------------- JOIN ROOM ----------------
// const joinRoom = async (id: string) => {
//   if (!user) return alert("Please log in via VideoCall auth first.");
//   console.log("🔵 Joining room with ID:", id);

//   try {
//     const roomRef = doc(videoCallDb, "rooms", id);
//     const roomSnap = await getDoc(roomRef);
//     if (!roomSnap.exists()) return alert("Room not found.");

//     console.log("✅ Room found. Creating PeerConnection first...");
//     createPeerConnection();

//     console.log("✅ Creating local stream and attaching to PeerConnection...");
//     await startStream();

//     // Add local tracks (startStream already adds them, but keep this safe)
//     localStream.current?.getTracks().forEach(track => {
//       // guard duplicate senders
//       const already = peerConnection.current!.getSenders().some(s => s.track?.id === track.id);
//       if (!already) {
//         peerConnection.current!.addTrack(track, localStream.current!);
//         console.log("🎤 Added local track (join):", track.kind);
//       }
//     });

//     const roomData = roomSnap.data();
//     console.log("📄 Room offer:", roomData.offer);

//     await peerConnection.current!.setRemoteDescription(new RTCSessionDescription(roomData.offer));
//     console.log("✅ Remote offer set on joiner side.");

//     const answer = await peerConnection.current!.createAnswer();
//     await peerConnection.current!.setLocalDescription(answer);
//     console.log("🧠 Local answer created and set on joiner.");

//     await addDoc(collection(roomRef, "answers"), answer);
//     console.log("✅ Sent answer to Firestore for room:", id);
//     setStatus("Connected!");

//     // ICE candidate handling for joiner
//     const candidatesCol = collection(videoCallDb, "rooms", id, "candidates");
//     peerConnection.current!.onicecandidate = (event) => {
//       if (event.candidate) {
//         addDoc(candidatesCol, { ...event.candidate.toJSON(), uid: user.uid })
//           .then(() => console.log("🧊 Local ICE candidate (joiner) sent:", event.candidate))
//           .catch(e => console.error("❌ Failed to send candidate:", e));
//       } else {
//         console.log("🧊 ICE candidate gathering complete (joiner).");
//       }
//     };

//     onSnapshot(candidatesCol, (snapshot) => {
//       snapshot.docChanges().forEach(async (change) => {
//         if (change.type === "added") {
//           const candidateData = change.doc.data();
//           if (candidateData?.uid === user.uid) return;
//           try {
//             await peerConnection.current!.addIceCandidate(new RTCIceCandidate(candidateData));
//             console.log("✅ Added remote ICE candidate (joiner) successfully:", candidateData);
//           } catch (err) {
//             console.error("❌ Failed to add ICE candidate (joiner):", err);
//           }
//         }
//       });
//     });

//   } catch (err) {
//     console.error("🔥 Error joining room:", err);
//     alert("Failed to join room. Check console.");
//   }
// };





//   // ================== LEAVE ROOM ==================
//   const leaveRoom = () => {
//     try {
//       console.log("👋 Leaving room...");
//       peerConnection.current?.close();
//       peerConnection.current = null;

//       localStream.current?.getTracks().forEach((t) => t.stop());
//       remoteStream.current?.getTracks().forEach((t) => t.stop());

//       localStream.current = null;
//       remoteStream.current = null;
//       setRoomId(null);
//       setStatus("Idle");
//       console.log("✅ Left room and cleaned up streams.");
//     } catch (err) {
//       console.error("🔥 Error leaving room:", err);
//     }
//   };




// return (
  
//      <div className="w-[90vw] h-screen flex flex-col items-center justify-start bg-gray-300 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-x-hidden">
//     {isRecording && (
//       <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-lg shadow-lg animate-pulse z-50">
//         🔴 Recording...
//       </div>
//     )}

//     <h2 className="text-2xl font-bold text-center">🎥 Video Call</h2>
   

// {/* === Status & Room ID Section (Fixed Space) === */}
// <div className="relative w-full flex flex-col items-center mt-4 mb-2">
//   <p className="text-xl text-center">Status: {status}</p>

//   {/* Reserve a fixed height for Room ID (so videos don't move) */}
//   <div className="h-[50px] flex justify-center items-center">
//     {roomId && (
//       <div className="flex justify-center items-center gap-3">
//         <p className="text-center text-lg">
//           Room ID:{" "}
//           <span className="font-mono text-blue-600 dark:text-blue-400">
//             {roomId}
//           </span>
//         </p>
//         <button
//           onClick={async (e) => {
//             e.preventDefault();
//             const btn = e.currentTarget as HTMLButtonElement;
//             try {
//               await navigator.clipboard.writeText(roomId);
//               const originalColor = btn.style.backgroundColor;
//               const originalText = btn.textContent;
//               btn.style.backgroundColor = "#16a34a";
//               btn.textContent = "Copied!";
//               setTimeout(() => {
//                 btn.style.backgroundColor = originalColor;
//                 btn.textContent = originalText;
//               }, 1500);
//             } catch (err) {
//               console.error("❌ Failed to copy Room ID:", err);
//             }
//           }}
//           className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-600 transition-all"
//         >
//           Copy
//         </button>
//       </div>
//     )}
//   </div>
// </div>



//     {!user && (
//       <button
//         onClick={signInVideoCall}
//         className="bg-indigo-500 px-4 py-2 text-white rounded mt-2"
//       >
//         Sign in with VideoCall Google
//       </button>
//     )}





// <div
//   className="
//     flex flex-col md:flex-row justify-center items-center
//     gap-10 mt-10 w-full max-w-none
//     px-2 sm:px-6 transition-all
//   "
// >
//   {/* Local Video */}
//   <div className="w-full md:w-1/2 bg-gray-500 dark:bg-gray-800 p-4 rounded-xl shadow-md flex flex-col items-center">
//     <p className="font-semibold text-center mb-2 text-gray-900 dark:text-gray-100">
//       Local Video
//     </p>
//     <video
//       ref={localVideoRef}
//       autoPlay
//       playsInline
//       muted
//       className="w-full h-[240px] sm:h-[380px] rounded-lg bg-black object-cover"
//     />
//   </div>

//   {/* Remote Video */}
//   <div className="w-full md:w-1/2 bg-gray-500 dark:bg-gray-800 p-4 rounded-xl shadow-md flex flex-col items-center mt-6 md:mt-0">
//     <p className="font-semibold text-center mb-2 text-gray-900 dark:text-gray-100">
//       Remote Video
//     </p>
//     <video
//       ref={remoteVideoRef}
//       autoPlay
//       playsInline
//       controls={false} 
//       muted={false}
//       className="w-full h-[240px] sm:h-[380px] rounded-lg bg-black object-cover"
//     />
//   </div>
// </div>


//     {/* === Buttons Section === */}
//     <div className="flex flex-wrap justify-center gap-4 sm:gap-5 mt-10 mb-10 px-3">
//       <button onClick={createRoom} className="bg-green-500 px-4 py-2 text-white rounded">
//         Create Room
//       </button>
//       <button
//         onClick={() => {
//           const id = prompt('Enter Room ID');
//           if (id) joinRoom(id);
//         }}
//         className="bg-blue-500 px-4 py-2 text-white rounded"
//       >
//         Join Room
//       </button>

//       {/* Three Dots Menu */}
//       <div className="relative">
//         <button
//           onClick={() => setShowMenu(!showMenu)}
//           className="bg-gray-700 px-4 py-2 text-white rounded hover:bg-gray-600 transition"
//         >
//           ⋮
//         </button>
//         {showMenu && (
//           <div className="absolute bg-white  shadow-lg rounded-lg p-2 mt-[-222px] right-[-80px] z-50 w-48 h-40">
//              {/* <div className="absolute bg-white dark:bg-gray-800 shadow-lg rounded-lg p-1 mt-2 right-0 z-50 w-48"> */}
//             <button
//               onClick={startScreenShare}
//               className="block w-full text-left px-3 py-2 m-1 rounded-md bg-amber-900 text-white hover:bg-gray-500 hover:text-black transition"
//             >
//               🖥 Share Screen
//             </button>
//             <button
//               onClick={startRecording}
//               className="block w-full text-left px-3 py-2 m-1 rounded-md bg-green-600 text-white hover:bg-gray-500 hover:text-black transition"
//             >
//               🔴 Start Recording
//             </button>
//             <button
//               onClick={stopRecording}
//               className="block w-full text-left px-3 py-2 m-1 rounded-md bg-blue-900 text-white hover:bg-gray-500 hover:text-black transition"
//             >
//               ⏹ Stop Recording
//             </button>
//           </div>
//         )}
//       </div>

//       <button onClick={leaveRoom} className="bg-red-500 px-5 py-2 text-white rounded-lg">
//         Leave Room
//       </button>

//       <button
//         onClick={() => {
//           const audioTrack = localStream.current?.getAudioTracks()[0];
//           if (audioTrack) {
//             audioTrack.enabled = !audioTrack.enabled;
//             const btn = document.getElementById('mute-btn');
//             if (btn) btn.textContent = audioTrack.enabled ? 'Mute Mic 🎙️' : 'Unmute Mic 🔇';
//           }
//         }}
//         id="mute-btn"
//         className="px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition"
//       >
//         Mute Mic 🎙️
//       </button>

//       <button
//         onClick={() => {
//           const videoTrack = localStream.current?.getVideoTracks()[0];
//           if (videoTrack) {
//             videoTrack.enabled = !videoTrack.enabled;
//             const btn = document.getElementById('camera-btn');
//             if (btn) btn.textContent = videoTrack.enabled ? 'Stop Camera 📷' : 'Start Camera 🚫';
//           }
//         }}
//         id="camera-btn"
//         className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
//       >
//         Stop Camera 📷
//       </button>
//     </div>
//   </div>
// );


// };


// export default VideoCall;



















"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  collection,
  doc,
  setDoc,
  addDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { videoCallDb, videoCallAuth } from "@/lib/videoCallFirebase";
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";

const VideoCall = () => {
  const [status, setStatus] = useState("Idle");
  const [roomId, setRoomId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
 const [showMenu, setShowMenu] = useState(false);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const remoteStream = useRef<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const provider = new GoogleAuthProvider();

  // ================== AUTH CHECK ==================
  useEffect(() => {
    console.log("🔍 Checking VideoCall Auth state...");
    const unsubscribe = onAuthStateChanged(videoCallAuth, (usr) => {
      if (usr) {
        console.log("✅ User logged in:", usr.email, "UID:", usr.uid);
        setUser(usr);
      } else {
        console.warn("❌ No user logged in via VideoCall Auth!");
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);




  const signInVideoCall = async () => {
    try {
      console.log("🟢 Initiating VideoCall Google sign-in...");
      const result = await signInWithPopup(videoCallAuth, provider);
      console.log("✅ Signed in:", result.user.email, "UID:", result.user.uid);
      setUser(result.user);
    } catch (err) {
      console.error("❌ VideoCall Auth sign-in failed:", err);
      alert("Sign-in failed. Check console for details.");
    }
  };





// ---------------- CREATE PEER CONNECTION ----------------

// const createPeerConnection = () => {
//   console.log("⚙️ Creating RTCPeerConnection with full ICE servers...");

//   const configuration = {
//     iceServers: [
//       { urls: "stun:stun.l.google.com:19302" },
//       {
//         urls: [
//           "turn:openrelay.metered.ca:80?transport=tcp",
//           "turn:openrelay.metered.ca:443?transport=tcp",
//           "turn:openrelay.metered.ca:3478?transport=udp",
//         ],
//         username: "openrelayproject",
//         credential: "openrelayproject",
//       },
//     ],
//     iceCandidatePoolSize: 10,
//   };

//   peerConnection.current = new RTCPeerConnection(configuration);
//   console.log("🔗 PeerConnection created:", peerConnection.current);


// //   peerConnection.current.onnegotiationneeded = async () => {
// //   console.log("🌀 onnegotiationneeded fired — renegotiating...");
// //   try {
// //     const offer = await peerConnection.current!.createOffer();
// //     await peerConnection.current!.setLocalDescription(offer);
// //     console.log("🔁 Negotiation offer updated.");
// //   } catch (err) {
// //     console.error("❌ Error during renegotiation:", err);
// //   }
// // };


// peerConnection.current.onnegotiationneeded = async () => {
//   console.log("🌀 onnegotiationneeded fired — attempting safe negotiation...");
//   try {
//     if (!peerConnection.current) return;
//     if (peerConnection.current.signalingState !== "stable") {
//       console.warn("⚠️ Skipping renegotiation — signalingState:", peerConnection.current.signalingState);
//       return;
//     }

//     const offer = await peerConnection.current.createOffer();
//     await peerConnection.current.setLocalDescription(offer);
//     console.log("🔁 Safe renegotiation offer created.");
//   } catch (err) {
//     console.error("❌ Error during safe renegotiation:", err);
//   }
// };




//   // ✅ Prepare remote stream container
//   remoteStream.current = new MediaStream();
//   if (remoteVideoRef.current) {
//     remoteVideoRef.current.srcObject = remoteStream.current;
//   }

//   // ✅ Handle incoming remote tracks
//   peerConnection.current.ontrack = (event) => {
//     console.log("📡 ontrack event fired:", event.streams);
//     console.log("🎧 Remote tracks:", event.streams[0].getTracks());
//     const [stream] = event.streams;

//     // Attach stream only once
//     if (stream && remoteVideoRef.current && remoteVideoRef.current.srcObject !== stream) {
//       remoteVideoRef.current.srcObject = stream;

//       console.log("✅ Remote stream attached once.");
//     } else if (event.track) {
//       remoteStream.current?.addTrack(event.track);
//       if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream.current;
//     }

//     // 🧩 Fallback for autoplay (wait a bit for stream to stabilize)
//     setTimeout(() => {
//       if (remoteVideoRef.current) {
//         const video = remoteVideoRef.current;
//         if (video.paused && video.srcObject) {
//           video.play().catch((err) => {
//             console.warn("⚠️ Remote video autoplay blocked:", err);
//           });
//         }
//       }
//     }, 2000);
//   };




//   // ✅ React when the connection is established
//   peerConnection.current.onconnectionstatechange = () => {
//     console.log("🌐 Connection state:", peerConnection.current?.connectionState);

//     if (peerConnection.current?.connectionState === "connected") {
//       console.log("✅ Connection established — ensuring remote stream is playing...");
//       setTimeout(() => {
//         if (remoteVideoRef.current && remoteStream.current) {
//           remoteVideoRef.current.srcObject = remoteStream.current;
//           const video = remoteVideoRef.current;
//           if (video.paused) {
//             video.play().catch((err) =>
//               console.warn("⚠️ Remote video autoplay blocked after connect:", err)
//             );
//           }
//         }
//       }, 1500);
//     }
//   };


//   if (peerConnection.current?.connectionState === "connected") {
//   setTimeout(() => {
//     const video = remoteVideoRef.current;
//     if (video && video.paused && video.srcObject) {
//       console.log("🔁 Retrying remote video play...");
//       video.play().catch(err => console.warn("⚠️ Still blocked:", err));
//     }
//   }, 4000);
// }

//   // ✅ ICE candidate events
//   peerConnection.current.onicecandidate = (event) => {
//     if (event.candidate) {
//       console.log("🧊 ICE candidate generated:", event.candidate);
//     }
//   };
// };


// ---------------- START LOCAL CAMERA + MIC ----------------

// const startStream = async () => {
//   try {
//     console.log("🎥 Requesting camera/mic permission...");
//     const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//     localStream.current = stream;

//     console.log("✅ Got local stream:", stream, "tracks:", stream.getTracks().map(t => t.kind));
//     console.log("🎙️ Local audio tracks:", localStream.current.getAudioTracks());



//     if (localVideoRef.current) {
//       localVideoRef.current.srcObject = stream;
//       localVideoRef.current.muted = true; // mute local preview
//       console.log("📺 Local video element attached.");
//     } else {
//       console.warn("⚠️ Local video ref is NULL!");
//     }

//     if (!peerConnection.current) {
//       console.warn("⚠️ PeerConnection not ready when startStream called. Tracks will not be attached.");
//       return;
//     }

//     // add tracks to the peer connection
//     // stream.getTracks().forEach((track) => {
//     //   const sender = peerConnection.current!.addTrack(track, stream);
//     //   console.log("➕ Added local track to PeerConnection:", track.kind, "sender:", sender);
//     // });


//     // add tracks to the peer connection
// stream.getAudioTracks().forEach((track) => {
//   const sender = peerConnection.current!.addTrack(track, stream);
//   console.log("🎙️ Added audio track:", track.label);
// });


// stream.getVideoTracks().forEach((track) => {
//   const sender = peerConnection.current!.addTrack(track, stream);
//   console.log("📹 Added video track:", track.label);
// });




//     // debug: show senders/receivers
//     console.log("📤 Senders:", peerConnection.current.getSenders().map(s => ({ kind: s.track?.kind, id: s.track?.id })));
//     console.log("📥 Receivers:", peerConnection.current.getReceivers().map(r => ({ kind: r.track?.kind })));
//   } catch (err) {
//     console.error("🔥 Error accessing camera/mic:", err);
//     alert("Cannot access camera/microphone. Check permissions and allow access.");
//   }
// };






  // ---------------- PEER CONNECTION ----------------
  const createPeerConnection = () => {
    console.log("⚙️ Creating RTCPeerConnection...");

    const configuration = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        {
          urls: [
            "turn:openrelay.metered.ca:80?transport=tcp",
            "turn:openrelay.metered.ca:443?transport=tcp",
            "turn:openrelay.metered.ca:3478?transport=udp",
          ],
          username: "openrelayproject",
          credential: "openrelayproject",
        },
      ],
    };

    peerConnection.current = new RTCPeerConnection(configuration);
    console.log("✅ PeerConnection created");

    // Prepare remote stream
    remoteStream.current = new MediaStream();
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream.current;
      remoteVideoRef.current.muted = false;
      remoteVideoRef.current.volume = 1.0;
    }

    // Handle incoming remote tracks
    peerConnection.current.ontrack = (event) => {
      console.log("📡 ontrack:", event.streams);
      const [stream] = event.streams;

      if (stream && remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
        remoteVideoRef.current.muted = false;
        remoteVideoRef.current.volume = 1.0;

        // Try to play audio immediately
        const playAttempt = () => {
          remoteVideoRef.current!.play().then(() => {
            console.log("🔊 Remote video+audio playing.");
          }).catch((err) => {
            console.warn("⚠️ Autoplay blocked, retrying...");
            setTimeout(playAttempt, 1000);
          });
        };
        playAttempt();
      }
    };

    // ICE candidates
    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("🧊 New ICE candidate:", event.candidate);
      }
    };

    // Debug connection state
    peerConnection.current.onconnectionstatechange = () => {
      console.log("🌐 Connection state:", peerConnection.current?.connectionState);
    };
  };

  // ---------------- START LOCAL STREAM ----------------
  const startStream = async () => {
    try {
      console.log("🎥 Requesting camera + mic...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStream.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.muted = true;
      }

      if (!peerConnection.current) return;

      stream.getTracks().forEach((track) => {
        peerConnection.current!.addTrack(track, stream);
        console.log("➕ Added local track:", track.kind);
      });
    } catch (err) {
      console.error("🔥 Media error:", err);
      alert("Please allow camera and microphone access.");
    }
  };




  const startScreenShare = async () => {
  try {
    console.log("🖥 Starting screen share...");
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
    localStream.current = stream;

    if (peerConnection.current) {
      const senders = peerConnection.current.getSenders();
      stream.getTracks().forEach((track) => {
        const sender = senders.find((s) => s.track?.kind === track.kind);
        if (sender) sender.replaceTrack(track);
        else peerConnection.current!.addTrack(track, stream);
        console.log("🟢 Screen track added/replaced:", track.kind);
      });
    }

    if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    console.log("✅ Screen sharing started successfully.");

    // 🛑 When user stops sharing manually
    const screenTrack = stream.getVideoTracks()[0];
    screenTrack.onended = async () => {
      console.log("🛑 Screen sharing stopped — restoring camera...");

      try {
        // 🎥 Restart camera
        const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStream.current = cameraStream;

        // Replace back the camera track
        if (peerConnection.current) {
          const videoSender = peerConnection.current
            .getSenders()
            .find((s) => s.track && s.track.kind === "video");
          if (videoSender) videoSender.replaceTrack(cameraStream.getVideoTracks()[0]);
          console.log("🎥 Restored camera track after screen share ended");
        }

        // Update local video preview
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = cameraStream;
        }

        // Stop all screen tracks cleanly
        stream.getTracks().forEach((t) => t.stop());
      } catch (err) {
        console.error("❌ Error restoring camera after screen share:", err);
      }
    };
  } catch (err) {
    console.error("🔥 Error starting screen share:", err);
    alert("Cannot start screen sharing.");
  }
};





  // ================== RECORDING ==================
  const startRecording = () => {
    if (!localStream.current) return console.warn("❌ Cannot start recording, no local stream.");

    console.log("⏺ Starting recording...");
    recordedChunks.current = [];
    mediaRecorder.current = new MediaRecorder(localStream.current);

    mediaRecorder.current.ondataavailable = (event) => {
      if (event.data.size > 0) recordedChunks.current.push(event.data);
      console.log("📝 Data chunk added:", event.data.size, "bytes");
    };

    mediaRecorder.current.onstop = () => {
      const blob = new Blob(recordedChunks.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "videoCallRecording.webm";
      a.click();
      console.log("✅ Recording saved locally, total chunks:", recordedChunks.current.length);
      setIsRecording(false);
    };

    mediaRecorder.current.start();
    setIsRecording(true);
    console.log("🔴 MediaRecorder started.");
  };

  const stopRecording = () => {
    if (!mediaRecorder.current) return;
    mediaRecorder.current.stop();
    console.log("🛑 Recording stopped.");
  };






// ---------------- CREATE ROOM ----------------
// const createRoom = async () => {
//   if (!user) return alert("Please log in via VideoCall auth first.");
//   console.log("🟢 Creating room for user:", user.email);
//   try {
//     // IMPORTANT: create PeerConnection first so startStream can add tracks to it
//     createPeerConnection();

//     // Now start stream which will add tracks to the peer connection
//     await startStream();
//     console.log("✅ Local stream started and tracks attached (if any).");

//     const currentUser = videoCallAuth.currentUser;
//     if (!currentUser) return alert("Please log in via VideoCall auth first.");

//     const roomRef = doc(collection(videoCallDb, "rooms"));
//     setRoomId(roomRef.id);
//     console.log("📂 Firestore room path:", roomRef.path);

//     // set up ICE candidate streaming to Firestore for this room
//     const candidatesCol = collection(videoCallDb, "rooms", roomRef.id, "candidates");
//     peerConnection.current!.onicecandidate = (event) => {
//       if (event.candidate) {
//         addDoc(candidatesCol, { ...event.candidate.toJSON(), uid: user.uid })
//           .then(() => console.log("🧊 Local ICE candidate sent:", event.candidate))
//           .catch(e => console.error("❌ Failed to send ICE candidate:", e));
//       } else {
//         console.log("🧊 ICE candidate gathering finished for this side.");
//       }
//     };

//     // create offer after local tracks are attached

//     const offer = await peerConnection.current!.createOffer();
//     await peerConnection.current!.setLocalDescription(offer);
//     console.log("🧠 Local offer created, SDP length:", offer.sdp?.length);
//     await setDoc(roomRef, { offer, creator: currentUser.uid });
//     setStatus("Waiting for answer...");
//     console.log("✅ Offer saved in Firestore for room:", roomRef.id);

//     // Listen for remote ICE candidates (added by other peer)
//     onSnapshot(collection(videoCallDb, "rooms", roomRef.id, "candidates"), async (snapshot) => {
//       snapshot.docChanges().forEach(async (change) => {
//         if (change.type === "added") {
//           const candidateData = change.doc.data();
//           // ignore own candidates
//           if (candidateData?.uid === user.uid) return;
//           try {
//             await peerConnection.current!.addIceCandidate(new RTCIceCandidate(candidateData));
//             console.log("✅ Remote ICE candidate added:", candidateData);
//           } catch (err) {
//             console.error("❌ Error adding remote ICE candidate:", err);
//           }
//         }
//       });
//     });

//     // Listen for answers from joiner(s)
//     onSnapshot(collection(roomRef, "answers"), async (snapshot) => {
//       snapshot.docChanges().forEach(async (change) => {
//         if (change.type === "added") {
//           const answerData = change.doc.data();
//           console.log("📩 Answer detected:", answerData);
//           if (!peerConnection.current?.currentRemoteDescription && answerData?.sdp) {
//             await peerConnection.current!.setRemoteDescription(new RTCSessionDescription(answerData as RTCSessionDescriptionInit));
//             console.log("✅ Remote description set from answer. Connected!");
//             setStatus("Connected!");
//             // optionally unmute remote video here if you muted earlier:
//             // if (remoteVideoRef.current) remoteVideoRef.current.muted = false;
//           }
//         }
//       });
//     });

//   } catch (err) {
//     console.error("🔥 Error creating room:", err);
//     alert("Failed to create room. Check console for details.");
//   }
// };


// ---------------- JOIN ROOM ----------------
// const joinRoom = async (id: string) => {
//   if (!user) return alert("Please log in via VideoCall auth first.");
//   console.log("🔵 Joining room with ID:", id);

//   try {
//     const roomRef = doc(videoCallDb, "rooms", id);
//     const roomSnap = await getDoc(roomRef);
//     if (!roomSnap.exists()) return alert("Room not found.");

//     console.log("✅ Room found. Creating PeerConnection first...");
//     createPeerConnection();

//     console.log("✅ Creating local stream and attaching to PeerConnection...");
//     await startStream();

//     // Add local tracks (startStream already adds them, but keep this safe)
//     localStream.current?.getTracks().forEach(track => {
//       // guard duplicate senders
//       const already = peerConnection.current!.getSenders().some(s => s.track?.id === track.id);
//       if (!already) {
//         peerConnection.current!.addTrack(track, localStream.current!);
//         console.log("🎤 Added local track (join):", track.kind);
//       }
//     });

//     const roomData = roomSnap.data();
//     console.log("📄 Room offer:", roomData.offer);

//     await peerConnection.current!.setRemoteDescription(new RTCSessionDescription(roomData.offer));
//     console.log("✅ Remote offer set on joiner side.");

//     const answer = await peerConnection.current!.createAnswer();
//     await peerConnection.current!.setLocalDescription(answer);
//     console.log("🧠 Local answer created and set on joiner.");

//     await addDoc(collection(roomRef, "answers"), answer);
//     console.log("✅ Sent answer to Firestore for room:", id);
//     setStatus("Connected!");

//     // ICE candidate handling for joiner
//     const candidatesCol = collection(videoCallDb, "rooms", id, "candidates");
//     peerConnection.current!.onicecandidate = (event) => {
//       if (event.candidate) {
//         addDoc(candidatesCol, { ...event.candidate.toJSON(), uid: user.uid })
//           .then(() => console.log("🧊 Local ICE candidate (joiner) sent:", event.candidate))
//           .catch(e => console.error("❌ Failed to send candidate:", e));
//       } else {
//         console.log("🧊 ICE candidate gathering complete (joiner).");
//       }
//     };

//     onSnapshot(candidatesCol, (snapshot) => {
//       snapshot.docChanges().forEach(async (change) => {
//         if (change.type === "added") {
//           const candidateData = change.doc.data();
//           if (candidateData?.uid === user.uid) return;
//           try {
//             await peerConnection.current!.addIceCandidate(new RTCIceCandidate(candidateData));
//             console.log("✅ Added remote ICE candidate (joiner) successfully:", candidateData);
//           } catch (err) {
//             console.error("❌ Failed to add ICE candidate (joiner):", err);
//           }
//         }
//       });
//     });

//   } catch (err) {
//     console.error("🔥 Error joining room:", err);
//     alert("Failed to join room. Check console.");
//   }
// };










// ---------------- CREATE ROOM ----------------
  const createRoom = async () => {
    if (!user) return alert("Login first");
    console.log("🟢 Creating room for:", user.email);

    createPeerConnection();
    await startStream();

    const roomRef = doc(collection(videoCallDb, "rooms"));
    setRoomId(roomRef.id);

    const candidatesCol = collection(videoCallDb, "rooms", roomRef.id, "candidates");
    peerConnection.current!.onicecandidate = (event) => {
      if (event.candidate) {
        addDoc(candidatesCol, { ...event.candidate.toJSON(), uid: user.uid });
      }
    };

    // ✅ Create stable offer
    const offer = await peerConnection.current!.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    });
    await peerConnection.current!.setLocalDescription(offer);

    await setDoc(roomRef, { offer, creator: user.uid });
    setStatus("Waiting for answer...");

    // Listen for answer
    onSnapshot(collection(roomRef, "answers"), async (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === "added") {
          const answerData = change.doc.data();
          if (!peerConnection.current?.currentRemoteDescription && answerData?.sdp) {
            await peerConnection.current!.setRemoteDescription(
              new RTCSessionDescription(answerData as RTCSessionDescriptionInit)
            );
            console.log("✅ Remote answer applied.");
            setStatus("Connected!");
          }
        }
      });
    });

    // Listen for remote ICE
    onSnapshot(candidatesCol, async (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === "added") {
          const data = change.doc.data();
          if (data?.uid === user.uid) return;
          try {
            await peerConnection.current!.addIceCandidate(new RTCIceCandidate(data));
          } catch (err) {
            console.error("❌ addIceCandidate error:", err);
          }
        }
      });
    });
  };

  // ---------------- JOIN ROOM ----------------
  const joinRoom = async (id: string) => {
    if (!user) return alert("Login first");

    const roomRef = doc(videoCallDb, "rooms", id);
    const roomSnap = await getDoc(roomRef);
    if (!roomSnap.exists()) return alert("Room not found");

    createPeerConnection();
    await startStream();

    const roomData = roomSnap.data();
    await peerConnection.current!.setRemoteDescription(
      new RTCSessionDescription(roomData!.offer)
    );

    const answer = await peerConnection.current!.createAnswer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    });
    await peerConnection.current!.setLocalDescription(answer);
    await addDoc(collection(roomRef, "answers"), answer);

    setStatus("Connected!");

    // ICE exchange
    const candidatesCol = collection(videoCallDb, "rooms", id, "candidates");
    peerConnection.current!.onicecandidate = (event) => {
      if (event.candidate) {
        addDoc(candidatesCol, { ...event.candidate.toJSON(), uid: user.uid });
      }
    };

    onSnapshot(candidatesCol, async (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        const data = change.doc.data();
        if (data?.uid === user.uid) return;
        try {
          await peerConnection.current!.addIceCandidate(new RTCIceCandidate(data));
        } catch (err) {
          console.error("❌ addIceCandidate (join) error:", err);
        }
      });
    });
  };













  // ================== LEAVE ROOM ==================
  const leaveRoom = () => {
    try {
      console.log("👋 Leaving room...");
      peerConnection.current?.close();
      peerConnection.current = null;

      localStream.current?.getTracks().forEach((t) => t.stop());
      remoteStream.current?.getTracks().forEach((t) => t.stop());

      localStream.current = null;
      remoteStream.current = null;
      setRoomId(null);
      setStatus("Idle");
      console.log("✅ Left room and cleaned up streams.");
    } catch (err) {
      console.error("🔥 Error leaving room:", err);
    }
  };




return (
  
     <div className="w-[90vw] h-screen flex flex-col items-center justify-start bg-gray-300 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-x-hidden">
    {isRecording && (
      <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-lg shadow-lg animate-pulse z-50">
        🔴 Recording...
      </div>
    )}

    <h2 className="text-2xl font-bold text-center">🎥 Video Call</h2>
   

{/* === Status & Room ID Section (Fixed Space) === */}
<div className="relative w-full flex flex-col items-center mt-4 mb-2">
  <p className="text-xl text-center">Status: {status}</p>

  {/* Reserve a fixed height for Room ID (so videos don't move) */}
  <div className="h-[50px] flex justify-center items-center">
    {roomId && (
      <div className="flex justify-center items-center gap-3">
        <p className="text-center text-lg">
          Room ID:{" "}
          <span className="font-mono text-blue-600 dark:text-blue-400">
            {roomId}
          </span>
        </p>
        <button
          onClick={async (e) => {
            e.preventDefault();
            const btn = e.currentTarget as HTMLButtonElement;
            try {
              await navigator.clipboard.writeText(roomId);
              const originalColor = btn.style.backgroundColor;
              const originalText = btn.textContent;
              btn.style.backgroundColor = "#16a34a";
              btn.textContent = "Copied!";
              setTimeout(() => {
                btn.style.backgroundColor = originalColor;
                btn.textContent = originalText;
              }, 1500);
            } catch (err) {
              console.error("❌ Failed to copy Room ID:", err);
            }
          }}
          className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-600 transition-all"
        >
          Copy
        </button>
      </div>
    )}
  </div>
</div>



    {!user && (
      <button
        onClick={signInVideoCall}
        className="bg-indigo-500 px-4 py-2 text-white rounded mt-2"
      >
        Sign in with VideoCall Google
      </button>
    )}





<div
  className="
    flex flex-col md:flex-row justify-center items-center
    gap-10 mt-10 w-full max-w-none
    px-2 sm:px-6 transition-all
  "
>
  {/* Local Video */}
  <div className="w-full md:w-1/2 bg-gray-500 dark:bg-gray-800 p-4 rounded-xl shadow-md flex flex-col items-center">
    <p className="font-semibold text-center mb-2 text-gray-900 dark:text-gray-100">
      Local Video
    </p>
    <video
      ref={localVideoRef}
      autoPlay
      playsInline
      muted
      className="w-full h-[240px] sm:h-[380px] rounded-lg bg-black object-cover"
    />
  </div>

  {/* Remote Video */}
  <div className="w-full md:w-1/2 bg-gray-500 dark:bg-gray-800 p-4 rounded-xl shadow-md flex flex-col items-center mt-6 md:mt-0">
    <p className="font-semibold text-center mb-2 text-gray-900 dark:text-gray-100">
      Remote Video
    </p>
    <video
      ref={remoteVideoRef}
      autoPlay
      playsInline
      
      className="w-full h-[240px] sm:h-[380px] rounded-lg bg-black object-cover"
    />
  </div>
</div>


    {/* === Buttons Section === */}
    <div className="flex flex-wrap justify-center gap-4 sm:gap-5 mt-10 mb-10 px-3">
      <button onClick={createRoom} className="bg-green-500 px-4 py-2 text-white rounded">
        Create Room
      </button>
      <button
        onClick={() => {
          const id = prompt('Enter Room ID');
          if (id) joinRoom(id);
        }}
        className="bg-blue-500 px-4 py-2 text-white rounded"
      >
        Join Room
      </button>

      {/* Three Dots Menu */}
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="bg-gray-700 px-4 py-2 text-white rounded hover:bg-gray-600 transition"
        >
          ⋮
        </button>
        {showMenu && (
          <div className="absolute bg-white  shadow-lg rounded-lg p-2 mt-[-222px] right-[-80px] z-50 w-48 h-40">
             {/* <div className="absolute bg-white dark:bg-gray-800 shadow-lg rounded-lg p-1 mt-2 right-0 z-50 w-48"> */}
            <button
              onClick={startScreenShare}
              className="block w-full text-left px-3 py-2 m-1 rounded-md bg-amber-900 text-white hover:bg-gray-500 hover:text-black transition"
            >
              🖥 Share Screen
            </button>
            <button
              onClick={startRecording}
              className="block w-full text-left px-3 py-2 m-1 rounded-md bg-green-600 text-white hover:bg-gray-500 hover:text-black transition"
            >
              🔴 Start Recording
            </button>
            <button
              onClick={stopRecording}
              className="block w-full text-left px-3 py-2 m-1 rounded-md bg-blue-900 text-white hover:bg-gray-500 hover:text-black transition"
            >
              ⏹ Stop Recording
            </button>
          </div>
        )}
      </div>

      <button onClick={leaveRoom} className="bg-red-500 px-5 py-2 text-white rounded-lg">
        Leave Room
      </button>

      <button
        onClick={() => {
          const audioTrack = localStream.current?.getAudioTracks()[0];
          if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            const btn = document.getElementById('mute-btn');
            if (btn) btn.textContent = audioTrack.enabled ? 'Mute Mic 🎙️' : 'Unmute Mic 🔇';
          }
        }}
        id="mute-btn"
        className="px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition"
      >
        Mute Mic 🎙️
      </button>

      <button
        onClick={() => {
          const videoTrack = localStream.current?.getVideoTracks()[0];
          if (videoTrack) {
            videoTrack.enabled = !videoTrack.enabled;
            const btn = document.getElementById('camera-btn');
            if (btn) btn.textContent = videoTrack.enabled ? 'Stop Camera 📷' : 'Start Camera 🚫';
          }
        }}
        id="camera-btn"
        className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
      >
        Stop Camera 📷
      </button>
    </div>
  </div>
);


};


export default VideoCall;





















































