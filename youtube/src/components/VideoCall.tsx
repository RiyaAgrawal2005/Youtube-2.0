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

  // ================== CREATE PEER CONNECTION ==================
  const createPeerConnection = () => {
    peerConnection.current = new RTCPeerConnection();

    // Handle incoming remote tracks
    peerConnection.current.ontrack = (event) => {
      console.log("📡 Remote track received:", event.streams);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };
  };

  // ================== LOCAL CAMERA + MIC ==================
  const startStream = async () => {
    try {
      console.log("🎥 Starting local camera/mic stream...");
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStream.current = stream;

      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      console.log("✅ Local stream ready with tracks:", stream.getTracks().map(t => t.kind));

      // Add tracks to PeerConnection
      if (peerConnection.current) {
        stream.getTracks().forEach((track) => {
          peerConnection.current!.addTrack(track, stream);
          console.log("➕ Track added to PeerConnection:", track.kind);
        });
      }
    } catch (err) {
      console.error("🔥 Error accessing camera/mic:", err);
      alert("Cannot access camera/microphone. Check permissions.");
    }
  };

  // ================== SCREEN SHARE ==================
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

  // ================== CREATE ROOM ==================
  // const createRoom = async () => {
  //   if (!user) return alert("Please log in via VideoCall auth first.");

  //   console.log("🟢 Creating room for user:", user.email);

  //   try {
  //     createPeerConnection();
  //     remoteStream.current = new MediaStream();
  //     if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream.current;

  //     await startStream();

  //     const currentUser = videoCallAuth.currentUser;
  //     if (!currentUser) return alert("Please log in via VideoCall auth first.");

  //     const token = await currentUser.getIdToken(true);
  //     console.log("🛡️ Auth token refreshed, exists:", !!token);

  //     const roomRef = doc(collection(videoCallDb, "rooms"));
  //     setRoomId(roomRef.id);
  //     console.log("📂 Firestore write path:", roomRef.path);

  //     const offer = await peerConnection.current!.createOffer();
  //     await peerConnection.current!.setLocalDescription(offer);
  //     console.log("📄 Local offer created:", offer);

  //     await setDoc(roomRef, { offer, creator: currentUser.uid });
  //     setStatus("Waiting for answer...");
  //     console.log("✅ Room created in Firestore with ID:", roomRef.id);

  //     const answersCol = collection(roomRef, "answers");
  //     onSnapshot(answersCol, async (snapshot) => {
  //       snapshot.docChanges().forEach(async (change) => {
  //         if (change.type === "added") {
  //           const answerData = change.doc.data() as { type: "answer"; sdp: string };
  //           console.log("📩 New answer received:", answerData);

  //           if (!peerConnection.current || peerConnection.current.currentRemoteDescription) return;

  //           if (answerData.type && answerData.sdp) {
  //             const rtcAnswer: RTCSessionDescriptionInit = { type: answerData.type, sdp: answerData.sdp };
  //             await peerConnection.current.setRemoteDescription(rtcAnswer);
  //             console.log("✅ Remote description set:", rtcAnswer);
  //             setStatus("Connected!");
  //           } else {
  //             console.warn("⚠️ Invalid answer data:", answerData);
  //           }
  //         }
  //       });
  //     });

  //   } catch (err) {
  //     console.error("🔥 Error creating room:", err);
  //     alert("Failed to create room.");
  //   }
  // };

  // // ================== JOIN ROOM ==================
  // const joinRoom = async (id: string) => {
  //   if (!user) return alert("Please log in via VideoCall auth first.");

  //   try {
  //     console.log("🔵 Joining room:", id);
  //     const roomRef = doc(videoCallDb, "rooms", id);
  //     const roomSnap = await getDoc(roomRef);

  //     if (!roomSnap.exists()) return alert("Room not found");
  //     console.log("✅ Room exists:", id);

  //     createPeerConnection();
  //     remoteStream.current = new MediaStream();
  //     if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream.current;

  //     await startStream();

  //     const roomData = roomSnap.data();
  //     console.log("📄 Room offer data:", roomData.offer);

  //     await peerConnection.current!.setRemoteDescription(roomData.offer);
  //     console.log("✅ Remote offer set");

  //     const answer = await peerConnection.current!.createAnswer();
  //     await peerConnection.current!.setLocalDescription(answer);
  //     console.log("📄 Local answer created:", answer);

  //     const answersCol = collection(roomRef, "answers");
  //     await addDoc(answersCol, answer);
  //     setStatus("Connected!");
  //     console.log("✅ Answer sent to Firestore for room:", id);

  //   } catch (err) {
  //     console.error("🔥 Error joining room:", err);
  //     alert("Failed to join room.");
  //   }
  // };





// ================== CREATE ROOM ==================
const createRoom = async () => {
  if (!user) return alert("Please log in via VideoCall auth first.");

  console.log("🟢 Creating room for user:", user.email);

  try {
    createPeerConnection();
    remoteStream.current = new MediaStream();
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream.current;

    await startStream();

    const currentUser = videoCallAuth.currentUser;
    if (!currentUser) return alert("Please log in via VideoCall auth first.");

    const token = await currentUser.getIdToken(true);
    console.log("🛡️ Auth token refreshed, exists:", !!token);

    const roomRef = doc(collection(videoCallDb, "rooms"));
    setRoomId(roomRef.id);
    console.log("📂 Firestore write path:", roomRef.path);

    const offer = await peerConnection.current!.createOffer();
    await peerConnection.current!.setLocalDescription(offer);
    console.log("📄 Local offer created:", offer);

    await setDoc(roomRef, { offer, creator: currentUser.uid });
    setStatus("Waiting for answer...");
    console.log("✅ Room created in Firestore with ID:", roomRef.id);

    // ===== ICE CANDIDATE HANDLER =====
    const candidatesCol = collection(videoCallDb, "rooms", roomRef.id, "candidates");

    peerConnection.current!.onicecandidate = (event) => {
      if (event.candidate) {
     addDoc(candidatesCol, { ...event.candidate.toJSON(), uid: user.uid });
console.log("🧩 ICE candidate sent:", event.candidate);

      }
    };

onSnapshot(candidatesCol, (snapshot) => {
  snapshot.docChanges().forEach(async (change) => {
    if (change.type === "added") {
      const candidateData = change.doc.data();
      // Avoid adding your own candidate
      if (candidateData && candidateData?.uid !== user.uid) {
        try {
          await peerConnection.current!.addIceCandidate(new RTCIceCandidate(candidateData));
          console.log("🧩 ICE candidate received and added:", candidateData);
        } catch (err) {
          console.error("❌ Error adding ICE candidate:", err);
        }
      }
    }
  });
});


    // Listen for answers
    const answersCol = collection(roomRef, "answers");
    onSnapshot(answersCol, async (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === "added") {
          const answerData = change.doc.data() as { type: "answer"; sdp: string };
          console.log("📩 New answer received:", answerData);

          if (!peerConnection.current || peerConnection.current.currentRemoteDescription) return;

          if (answerData.type && answerData.sdp) {
            const rtcAnswer: RTCSessionDescriptionInit = { type: answerData.type, sdp: answerData.sdp };
            await peerConnection.current.setRemoteDescription(rtcAnswer);
            console.log("✅ Remote description set:", rtcAnswer);
            setStatus("Connected!");
          } else {
            console.warn("⚠️ Invalid answer data:", answerData);
          }
        }
      });
    });

  } catch (err) {
    console.error("🔥 Error creating room:", err);
    alert("Failed to create room.");
  }
};

// ================== JOIN ROOM ==================
const joinRoom = async (id: string) => {
  if (!user) return alert("Please log in via VideoCall auth first.");

  try {
    console.log("🔵 Joining room:", id);
    const roomRef = doc(videoCallDb, "rooms", id);
    const roomSnap = await getDoc(roomRef);

    if (!roomSnap.exists()) return alert("Room not found");
    console.log("✅ Room exists:", id);

    createPeerConnection();
    remoteStream.current = new MediaStream();
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream.current;

    await startStream();

    const roomData = roomSnap.data();
    console.log("📄 Room offer data:", roomData.offer);

    await peerConnection.current!.setRemoteDescription(roomData.offer);
    console.log("✅ Remote offer set");

    const answer = await peerConnection.current!.createAnswer();
    await peerConnection.current!.setLocalDescription(answer);
    console.log("📄 Local answer created:", answer);

    const answersCol = collection(roomRef, "answers");
    await addDoc(answersCol, answer);
    setStatus("Connected!");
    console.log("✅ Answer sent to Firestore for room:", id);

    // ===== ICE CANDIDATE HANDLER =====
    const candidatesCol = collection(videoCallDb, "rooms", id, "candidates");

    peerConnection.current!.onicecandidate = (event) => {
      if (event.candidate) {
        addDoc(candidatesCol, event.candidate.toJSON());
        console.log("🧩 ICE candidate sent:", event.candidate);
      }
    };

    onSnapshot(candidatesCol, (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === "added") {
          const candidateData = change.doc.data();
          try {
            await peerConnection.current!.addIceCandidate(new RTCIceCandidate(candidateData));
            console.log("🧩 ICE candidate received and added:", candidateData);
          } catch (err) {
            console.error("❌ Error adding ICE candidate:", err);
          }
        }
      });
    });

  } catch (err) {
    console.error("🔥 Error joining room:", err);
    alert("Failed to join room.");
  }
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

  // return (
  //   <div className="p-4 relative">
  //     {isRecording && (
  //       <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-lg shadow-lg animate-pulse z-50">
  //         🔴 Recording...
  //       </div>
  //     )}

  //     <h2 className="text-2xl font-bold text-center">🎥 Video Call</h2>
  //     <p className="text-center text-xl">Status: {status}</p>
  //     {roomId && <p className="text-center text-xl">Room ID: {roomId}</p>}

  //     {!user && (
  //       <button
  //         onClick={signInVideoCall}
  //         className="bg-indigo-500 px-4 py-2 text-white rounded mt-2"
  //       >
  //         Sign in with VideoCall Google
  //       </button>
  //     )}

  //     <div className="flex justify-center gap-2 mt-16">
  //       <button onClick={createRoom} className="bg-green-500 px-4 py-2 text-white rounded">Create Room</button>
  //       <button onClick={() => { const id = prompt("Enter Room ID"); if(id) joinRoom(id); }} className="bg-blue-500 px-4 py-2 text-white rounded">Join Room</button>
  //      {/* <button onClick={leaveRoom} className="bg-red-500 px-4 py-2 text-white rounded">Leave Room</button> */}
       
  //       <button onClick={startScreenShare} className="bg-yellow-500 px-4 py-2 text-white rounded">Share Screen</button>
  //       <button onClick={startRecording} className="bg-purple-500 px-4 py-2 text-white rounded">Start Recording</button>
  //       <button onClick={stopRecording} className="bg-pink-500 px-4 py-2 text-white rounded">Stop Recording</button>
  //     </div>

  //     <div className="flex gap-4 mt-24 ml-30 ">
  //       <div>
  //         <p className="font-semibold text-center">Local Video</p>
  //         <video ref={localVideoRef} autoPlay playsInline muted className="w-168 h-88 bg-gray-900" />
  //       </div>
  //       <div>
  //         <p className="font-semibold text-center">Remote Video</p>
  //         <video ref={remoteVideoRef} autoPlay playsInline className="w-168 h-88 bg-gray-900" />
  //       </div>
  //     </div>

  // <div className="flex justify-center mt-16">
  //     <button
  //       onClick={leaveRoom}
  //       className="bg-red-500 px-5 py-2 text-white rounded-lg"
  //     >
  //       Leave Room
  //     </button>
  //   </div>
    

  //   </div>
  // );

 return (
    <div className="p-4 relative">
      {isRecording && (
        <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-lg shadow-lg animate-pulse z-50">
          🔴 Recording...
        </div>
      )}

      <h2 className="text-2xl font-bold text-center">🎥 Video Call</h2>
      <p className="text-center text-xl">Status: {status}</p>
      {roomId && <p className="text-center text-xl">Room ID: {roomId}</p>}

      {!user && (
        <button
          onClick={signInVideoCall}
          className="bg-indigo-500 px-4 py-2 text-white rounded mt-2"
        >
          Sign in with VideoCall Google
        </button>
      )}

      <div className="flex gap-10 mb-23 mt-32 ml-30 justify-center">
        <div>
          <p className="font-semibold text-center">Local Video</p>
          <video ref={localVideoRef} autoPlay playsInline muted className="w-168 h-88 bg-gray-900" />
        </div>
        <div>
          <p className="font-semibold text-center">Remote Video</p>
          <video ref={remoteVideoRef} autoPlay playsInline className="w-168 h-88 bg-gray-900" />
        </div>
      </div>

      {/* All buttons in one row */}
      <div className="flex justify-center gap-5 mt-6 ">
        <button onClick={createRoom} className="bg-green-500 px-4 py-2 text-white rounded">Create Room</button>
        <button
          onClick={() => {
            const id = prompt("Enter Room ID");
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
            className="bg-gray-700 px-4 py-2 text-white rounded"
          >
            ⋮
          </button>
          {showMenu && (
            <div className="absolute bg-white shadow-lg rounded p-2 mt-2 right-0 z-50">
              <button onClick={startScreenShare} className="block w-full text-left px-3 py-1 hover:bg-gray-200 text-black rounded">
                Share Screen
              </button>
              <button onClick={startRecording} className="block w-full text-left px-3 py-1 hover:bg-gray-200 text-black rounded">
                Start Recording
              </button>
              <button onClick={stopRecording} className="block w-full text-left px-3 py-1 hover:bg-gray-200 text-black rounded">
                Stop Recording
              </button>
            </div>
          )}
        </div>

        <button
          onClick={leaveRoom}
          className="bg-red-500 px-5 py-2 text-white rounded-lg"
        >
          Leave Room
        </button>
      </div>
    </div>
  );


};


export default VideoCall;

















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
//   const [isRecording, setIsRecording] = useState(false); // ✅ new state

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

//   // ================== LOCAL CAMERA + MIC ==================
//   const startStream = async () => {
//     try {
//       console.log("🎥 Starting local camera/mic stream...");
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//       localStream.current = stream;

//       if (localVideoRef.current) localVideoRef.current.srcObject = stream;

//       console.log("✅ Local stream ready with tracks:", stream.getTracks().map(t => t.kind));
//       if (peerConnection.current) {
//         stream.getTracks().forEach((track) => {
//           peerConnection.current!.addTrack(track, stream);
//           console.log("➕ Track added to PeerConnection:", track.kind);
//         });
//       }
//     } catch (err) {
//       console.error("🔥 Error accessing camera/mic:", err);
//       alert("Cannot access camera/microphone. Check permissions.");
//     }
//   };

//   // ================== SCREEN SHARE ==================
//   const startScreenShare = async () => {
//     try {
//       console.log("🖥 Starting screen share...");
//       const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
//       localStream.current = stream;

//       if (peerConnection.current) {
//         const senders = peerConnection.current.getSenders();
//         stream.getTracks().forEach((track) => {
//           const sender = senders.find((s) => s.track?.kind === track.kind);
//           if (sender) sender.replaceTrack(track);
//           else peerConnection.current!.addTrack(track, stream);
//           console.log("🟢 Screen track added/replaced:", track.kind);
//         });
//       }

//       if (localVideoRef.current) localVideoRef.current.srcObject = stream;
//       console.log("✅ Screen sharing started successfully.");
//     } catch (err) {
//       console.error("🔥 Error starting screen share:", err);
//       alert("Cannot start screen sharing.");
//     }
//   };

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
//       setIsRecording(false); // ✅ hide banner when stopped
//     };

//     mediaRecorder.current.start();
//     setIsRecording(true); // ✅ show banner when started
//     console.log("🔴 MediaRecorder started.");
//   };

//   const stopRecording = () => {
//     if (!mediaRecorder.current) return;
//     mediaRecorder.current.stop();
//     console.log("🛑 Recording stopped.");
//   };

//   // ================== CREATE ROOM ==================
//   const createRoom = async () => {
//     if (!user) return alert("Please log in via VideoCall auth first.");

//     console.log("🟢 Creating room for user:", user.email);

//     try {
//       peerConnection.current = new RTCPeerConnection();
//       remoteStream.current = new MediaStream();

//       if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream.current;

//       peerConnection.current.ontrack = (event) => {
//         event.streams[0].getTracks().forEach((track) => remoteStream.current!.addTrack(track));
//         console.log("📡 Received remote track:", event.streams[0].getTracks().map(t => t.kind));
//       };

//       await startStream();

//       const currentUser = videoCallAuth.currentUser;
//       if (!currentUser) return alert("Please log in via VideoCall auth first.");

//       const token = await currentUser.getIdToken(true);
//       console.log("🛡️ Auth token refreshed, exists:", !!token);

//       const roomRef = doc(collection(videoCallDb, "rooms"));
//       setRoomId(roomRef.id);
//       console.log("📂 Firestore write path:", roomRef.path);

//       const offer = await peerConnection.current.createOffer();
//       await peerConnection.current.setLocalDescription(offer);
//       console.log("📄 Local offer created:", offer);

//       await setDoc(roomRef, { offer, creator: currentUser.uid });
//       setStatus("Waiting for answer...");
//       console.log("✅ Room created in Firestore with ID:", roomRef.id);

//       const answersCol = collection(roomRef, "answers");
//       onSnapshot(answersCol, async (snapshot) => {
//         snapshot.docChanges().forEach(async (change) => {
//           if (change.type === "added") {
//             const answerData = change.doc.data() as { type: "answer"; sdp: string };
//             console.log("📩 New answer received:", answerData);

//             if (!peerConnection.current || peerConnection.current.currentRemoteDescription) return;

//             if (answerData.type && answerData.sdp) {
//               const rtcAnswer: RTCSessionDescriptionInit = { type: answerData.type, sdp: answerData.sdp };
//               await peerConnection.current.setRemoteDescription(rtcAnswer);
//               console.log("✅ Remote description set:", rtcAnswer);
//               setStatus("Connected!");
//             } else {
//               console.warn("⚠️ Invalid answer data:", answerData);
//             }
//           }
//         });
//       });

//     } catch (err) {
//       console.error("🔥 Error creating room:", err);
//       alert("Failed to create room.");
//     }
//   };

//   // ================== JOIN ROOM ==================
//   const joinRoom = async (id: string) => {
//     if (!user) return alert("Please log in via VideoCall auth first.");

//     try {
//       console.log("🔵 Joining room:", id);
//       const roomRef = doc(videoCallDb, "rooms", id);
//       const roomSnap = await getDoc(roomRef);

//       if (!roomSnap.exists()) return alert("Room not found");
//       console.log("✅ Room exists:", id);

//       peerConnection.current = new RTCPeerConnection();
//       remoteStream.current = new MediaStream();
//       if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream.current;

//       peerConnection.current.ontrack = (event) => {
//         event.streams[0].getTracks().forEach((track) => remoteStream.current!.addTrack(track));
//         console.log("📡 Remote track received:", event.streams[0].getTracks().map(t => t.kind));
//       };

//       await startStream();

//       const roomData = roomSnap.data();
//       console.log("📄 Room offer data:", roomData.offer);

//       await peerConnection.current.setRemoteDescription(roomData.offer);
//       console.log("✅ Remote offer set");

//       const answer = await peerConnection.current.createAnswer();
//       await peerConnection.current.setLocalDescription(answer);
//       console.log("📄 Local answer created:", answer);

//       const answersCol = collection(roomRef, "answers");
//       await addDoc(answersCol, answer);
//       setStatus("Connected!");
//       console.log("✅ Answer sent to Firestore for room:", id);

//     } catch (err) {
//       console.error("🔥 Error joining room:", err);
//       alert("Failed to join room.");
//     }
//   };

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

//   return (
//     <div className="p-4 relative">
//       {/* 🔴 Recording Banner */}
//       {isRecording && (
//         <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-lg shadow-lg animate-pulse z-50">
//           🔴 Recording...
//         </div>
//       )}

//       <h2 className="text-xl font-bold">🎥 Video Call</h2>
//       <p>Status: {status}</p>
//       {roomId && <p>Room ID: {roomId}</p>}

//       {!user && (
//         <button
//           onClick={signInVideoCall}
//           className="bg-indigo-500 px-4 py-2 text-white rounded mt-2"
//         >
//           Sign in with VideoCall Google
//         </button>
//       )}

//       <div className="flex gap-2 mt-4">
//         <button onClick={createRoom} className="bg-green-500 px-4 py-2 text-white rounded">Create Room</button>
//         <button onClick={() => { const id = prompt("Enter Room ID"); if(id) joinRoom(id); }} className="bg-blue-500 px-4 py-2 text-white rounded">Join Room</button>
//         <button onClick={leaveRoom} className="bg-red-500 px-4 py-2 text-white rounded">Leave Room</button>
//         <button onClick={startScreenShare} className="bg-yellow-500 px-4 py-2 text-white rounded">Share Screen</button>
//         <button onClick={startRecording} className="bg-purple-500 px-4 py-2 text-white rounded">Start Recording</button>
//         <button onClick={stopRecording} className="bg-pink-500 px-4 py-2 text-white rounded">Stop Recording</button>
//       </div>

//       <div className="flex gap-4 mt-4">
//         <div>
//           <p className="font-semibold">Local Video</p>
//           <video ref={localVideoRef} autoPlay playsInline muted className="w-64 h-48 bg-black" />
//         </div>
//         <div>
//           <p className="font-semibold">Remote Video</p>
//           <video ref={remoteVideoRef} autoPlay playsInline className="w-64 h-48 bg-black" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VideoCall;





















// chrome.exe --use-fake-device-for-media-stream --use-fake-ui-for-media-stream
//  "C:\Program Files\Google\Chrome\Application\chrome.exe" --use-fake-device-for-media-stream --use-fake-ui-for-media-stream
// ``` )  


