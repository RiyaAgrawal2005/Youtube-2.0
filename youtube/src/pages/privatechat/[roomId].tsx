// import { useRouter } from "next/router";
// import { useEffect, useState } from "react";
// import { db, auth } from "@/lib/firebase";
// import { chatDB } from "@/lib/chatFirebase"; // Make sure auth is correctly initialized
// import {
//   addDoc,
//   collection,
//   query,
//   onSnapshot,
//   orderBy,
//   serverTimestamp,
// } from "firebase/firestore";
// import CryptoJS from "crypto-js";
// import { onAuthStateChanged } from "firebase/auth";

// const PrivateChat = () => {
//   const router = useRouter();
//   const { roomId } = router.query;

//   const [messages, setMessages] = useState<any[]>([]);
//   const [input, setInput] = useState("");
//   const [userEmail, setUserEmail] = useState<string>("");

//   const secretKey = "your-secret-key"; // Replace with env var in production

//   useEffect(() => {
//     const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setUserEmail(user.email || "Unknown");
//       }
//     });

//     return () => unsubscribeAuth();
//   }, []);

//   useEffect(() => {
//     if (!roomId || typeof roomId !== "string") return;

//     const q = query(
//       collection(db, "privateChats", roomId, "messages"),
//       orderBy("timestamp", "asc")
//     );

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const decryptedMessages = snapshot.docs.map((doc) => {
//         const data = doc.data();
//         const decryptedText = CryptoJS.AES.decrypt(data.text, secretKey).toString(CryptoJS.enc.Utf8);
//         const timestamp = data.timestamp?.toDate().toLocaleString() || "Just now";

//         return {
//           ...data,
//           text: decryptedText,
//           id: doc.id,
//           timestamp,
//         };
//       });

//       setMessages(decryptedMessages);
//     });

//     return () => unsubscribe();
//   }, [roomId]);

//   const sendMessage = async () => {
//     if (!input.trim() || typeof roomId !== "string") return;

//     const encryptedText = CryptoJS.AES.encrypt(input, secretKey).toString();

//     await addDoc(collection(db, "privateChats", roomId, "messages"), {
//       text: encryptedText,
//       timestamp: serverTimestamp(),
//       sender: userEmail || "Unknown",
//     });

//     setInput("");
//   };

//     return (
//         <div
//             style={{
//                 padding: 30,
//                 marginLeft: '300px',
//                 marginTop: '20px',
//                 border: '2px solid black',
//                 width: '1000px',
//                 display: 'flex',
//                 flexDirection: 'column',
//                 justifyContent: 'space-between',
//                 height: '700px',
//             }}
//         >
//             <h2 className='text-blue-700 text-4xl font-bold text-center'>
//                 💬 Private Group Chat Room:  </h2><span className='text-green-900 text-center text-xl'>{roomId}</span>
//  {/* </h2>            */}

//             {/* Chat messages container */}
//             <div
//                 style={{
//                     marginTop: '10px',
//                     marginBottom: '10px',
//                     // border: '2px solid blue',
//                     padding: '10px',
//                     overflowY: 'auto',
//                     flex: 1,
//                 }}
//             >
//                 {(() => {
//                     const groupedByDate: { [date: string]: typeof messages } = {};

//                     messages.forEach((msg) => {
//                         console.log("SENDER:", msg.sender);
//                         console.log("PHOTO URL:", msg.photoURL);
//                         const dateObj = msg.timestamp?.toDate?.();
//                         if (!dateObj) return; // Ignore until timestamp is available
//                         const date = dateObj.toLocaleDateString('en-GB', {
//                             day: '2-digit',
//                             month: 'short',
//                             year: 'numeric',
//                         });

//                         if (!groupedByDate[date]) {
//                             groupedByDate[date] = [];
//                         }
//                         groupedByDate[date].push(msg);
//                     });
// console.log("🔥 Auth user email:", user?.email);
// console.log("🔥 Auth user photoURL:", user?.photoURL);
//                     return Object.entries(groupedByDate).map(([date, msgs]) => (
//                         <div key={date}>
//                             {/* 📅 Date separator */}
//                             <div
//                                 style={{
//                                     textAlign: 'center',
//                                     margin: '10px 0',
//                                     fontWeight: 'bold',
//                                     color: '#555',
//                                 }}
//                             >
//                                 📅 {date}
//                             </div>

//                             {msgs.map((msg) =>
//                             // ( 
//                                 {
//     console.log("Rendering:", msg.sender, "->", msg.photoURL);
//     return (
//                                 <div
//                                     key={msg.id}
//                                     style={{
//                                         display: 'flex',
//                                         justifyContent: 'space-between',
//                                         alignItems: 'center',
//                                         background: '#f1f1f1',
//                                         margin: '6px 0px',
//                                         padding: '10px 12px',
//                                         borderRadius: '8px',
//                                     }}
//                                 >
//                                     <div style={{ whiteSpace: 'pre-wrap' }}>
//                                         {/* <strong className='font-bold pr-1'>{msg.sender} : </strong> {msg.text} */}

//                                         <div style={{ display: 'flex', alignItems: 'center' }}>
//                                             { {msg.photoURL && (
//                                                 // <img
//                                                 //     src={msg.photoURL} 
//                                                 // // fallback
//                                                 <img
//  src={msg.photoURL || `https://i.pravatar.cc/32?u=${msg.sender}`}

//                                                     alt={msg.sender}
//                                                     style={{
//                                                         width: 30,
//                                                         height: 30,
//                                                         borderRadius: '50%',
//                                                         marginRight: 8,
//                                                         objectFit: 'cover',
//                                                     }}
//                                                     onError={(e) => {
//                                                         e.currentTarget.src = `https://i.pravatar.cc/32?u=${msg.sender}`;
//                                                     }}
//                                                 />

//                                             )} }




//                                           {msg.photoURL ? (
//     <img
//         src={msg.photoURL}
//         alt={msg.sender}
//         style={{
//             width: 30,
//             height: 30,
//             borderRadius: '50%',
//             marginRight: 8,
//             objectFit: 'cover',
//         }}
//         onError={(e) => {
//             e.currentTarget.style.display = 'none';
//         }}
//     />
// ) : (
//     <div
//         style={{
//             width: 30,
//             height: 30,
//             borderRadius: '50%',
//             backgroundColor: '#888',
//             color: '#fff',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             fontWeight: 'bold',
//             marginRight: 8,
//             fontSize: '0.9rem',
//         }}
//     >
//         {msg.sender?.charAt(0)?.toUpperCase() || 'U'}
//     </div>
// )}


//                                             <div>
//                                                 <strong className="font-bold pr-1">{msg.sender} :</strong> {msg.text}
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <span
//                                         style={{
//                                             fontSize: '0.75em',
//                                             color: '#666',
//                                             marginLeft: '10px',
//                                             whiteSpace: 'nowrap',
//                                         }}
//                                     >
//                                         🕒{' '}
//                                         {msg.timestamp?.toDate?.().toLocaleTimeString('en-IN', {
//                                             hour: '2-digit',
//                                             minute: '2-digit',
//                                             second: '2-digit',
//                                             hour12: true,
//                                         })}
//                                     </span>
//                                 </div>
//     )
//                 })}
//                         </div>
//                     ));
//                 })()}
//             </div>

//             {/* Input and Send Button fixed at bottom of chat box */}
//             <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
//                 <input
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     placeholder="Type your message"
//                     style={{
//                         padding: 10,
//                         width: '70%',
//                         marginRight: 10,
//                         borderRadius: 8,
//                         border: '1px solid #ccc',
//                     }}
//                 />
//                 <button
//                     onClick={sendMessage}
//                     style={{
//                         padding: '10px 16px',
//                         borderRadius: 8,
//                         backgroundColor: '#007bff',
//                         color: '#fff',
//                         border: 'none',
//                     }}
//                 >
//                     Send
//                 </button>
//             </div>
//         </div>
//     );
// }
// export default PrivateChatPage;


















//  add css in dark theme 


// import { useEffect, useState } from 'react';
// import {
//   collection,
//   getFirestore,
//   addDoc,
//   onSnapshot,
//   serverTimestamp,
//   query,
//   orderBy,
// } from 'firebase/firestore';
// import { useRouter } from 'next/router';
// import { chatDB } from '@/lib/chatFirebase';
// import CryptoJS from 'crypto-js';
// import { getAuth } from 'firebase/auth';

// const PrivateChatPage = () => {
//   const router = useRouter();
//   const { roomId } = router.query;
//   const auth = getAuth();
//   const user = auth.currentUser;

//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState<
//     { id: string; text: string; sender: string;  name?: string;  timestamp: any; photoURL?: string }[]
//   >([]);
  


//   useEffect(() => {
//     if (!roomId || typeof roomId !== 'string') return;

//     const messagesRef = collection(chatDB, 'privateChats', roomId, 'messages');
//     const q = query(messagesRef, orderBy('timestamp', 'asc'));

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const newMessages = snapshot.docs.map((doc) => {
//         const data = doc.data();
//         let decrypted = '';
//         try {
//           decrypted = CryptoJS.AES.decrypt(data.text, 'your-secret-key').toString(CryptoJS.enc.Utf8);
//         } catch {
//           decrypted = '[Decryption error]';
//         }

//         return {
//           id: doc.id,
//           text: decrypted,
//           sender: data.sender,
//              name: data.name || '',
//           timestamp: data.timestamp,
//           photoURL: data.photoURL || '',
//         };
//       });
//       setMessages(newMessages);
//     });

//     return () => unsubscribe();
//   }, [roomId]);

//   const sendMessage = async () => {
//     if (!message.trim() || !roomId || typeof roomId !== 'string') return;

//     const encryptedMessage = CryptoJS.AES.encrypt(message, 'your-secret-key').toString();

//     try {
//       await addDoc(collection(chatDB, 'privateChats', roomId, 'messages'), {
//         text: encryptedMessage,
//         sender: user?.email || 'Anonymous',
//          name: user?.displayName || '',
//         photoURL: user?.photoURL || '',
//         timestamp: serverTimestamp(),
//       });
   

//       setMessage('');
//     } catch (error) {
//       console.error('❌ Error sending message:', error);
//     }
//   };

//   return (
//     // <div
//     //   style={{
//     //     padding: 30,
//     //     marginLeft: '300px',
//     //     marginTop: '20px',
//     //     border: '2px solid black',
//     //     width: '1000px',
//     //     display: 'flex',
//     //     flexDirection: 'column',
//     //     justifyContent: 'space-between',
//     //     height: '700px',
//     //   }}
//     // >
//     //   <h2 className='text-blue-700 text-4xl font-bold text-center'>
//     //     💬 Private Group Chat Room:
//     //   </h2>
//     //   <span className='text-green-900 text-center text-xl'>{roomId}</span>
//  <div className="flex flex-col p-6 md:ml-72 mt-5 border-2 border-black rounded-lg h-[700px] w-full max-w-[1000px] bg-white dark:bg-gray-900">
//       <h2 className="text-blue-700 dark:text-blue-400 text-4xl font-bold text-center">
//         💬 Private Group Chat Room:
//       </h2>
//       <span className="text-green-900 dark:text-green-400 text-center text-xl">{roomId}</span>
//       {/* Messages */}
//       {/* <div
//         style={{
//           marginTop: '10px',
//           marginBottom: '10px',
//           padding: '10px',
//           overflowY: 'auto',
//           flex: 1,
//         }}
//       > */}
      //  <div className="flex-1 mt-4 mb-2 p-2 overflow-y-auto">
      //   {(() => {
      //     const groupedByDate: { [date: string]: typeof messages } = {};
      //     messages.forEach((msg) => {
      //       const dateObj = msg.timestamp?.toDate?.();
      //       if (!dateObj) return;
      //       const date = dateObj.toLocaleDateString('en-GB', {
      //         day: '2-digit',
      //         month: 'short',
      //         year: 'numeric',
      //       });
      //       groupedByDate[date] = groupedByDate[date] || [];
      //       groupedByDate[date].push(msg);
      //     });

//           return Object.entries(groupedByDate).map(([date, msgs]) => (
//             <div key={date}>
//               {/* <div style={{ textAlign: 'center', fontWeight: 'bold', margin: '10px 0', color: '#555' }}> */}
//                 <div className="text-center font-bold my-2 text-gray-500 dark:text-gray-300">
//                 📅 {date}
//               </div>

//               {msgs.map((msg) => {
//                 const isSender = msg.sender === user?.email;
//                 return (
//                   // <div
//                   //   key={msg.id}
//                   //   style={{
//                   //     display: 'flex',
//                   //     justifyContent: isSender ? 'flex-end' : 'flex-start',
//                   //     marginBottom: 6,
//                   //   }}
//                   // >
//                   //   <div
//                   //     style={{
//                   //       background: isSender ? '#d4eaff' : '#f1f1f1',
//                   //       padding: 10,
//                   //       borderRadius: 8,
//                   //       maxWidth: '70%',
//                   //       display: 'flex',
//                   //       alignItems: 'center',
//                   //     }}
//                   //   >
//                   <div key={msg.id} className={`flex mb-2 ${isSender ? "justify-end" : "justify-start"}`}>
//                   <div
//                     className={`flex items-center max-w-[70%] p-2 rounded-lg ${
//                       isSender ? "bg-blue-100 dark:bg-blue-700" : "bg-gray-100 dark:bg-gray-800"
//                     }`}
//                   >
              
                  
 


// {msg.photoURL && msg.photoURL.trim() !== '' ? (
//   <img
//     src={msg.photoURL}
//     alt="User Avatar"
//     className="w-8 h-8 rounded-full mr-2 object-cover"
//     onError={(e) => {
//       e.currentTarget.onerror = null;
//       //  e.currentTarget.style.display = 'none';
//       e.currentTarget.src = ''; // force fallback to initial
//     }}
//   />
// ) : (
//   <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center mr-2">
//     {(msg.name || msg.sender || 'U')[0]?.toUpperCase()}
//   </div>
// )}


                                         
//                       <div>
//                         <div>
//                           <strong className="font-bold pr-1">{msg.sender}:</strong> {msg.text}
//                         </div>
//                         {/* <div
//                           style={{
//                             fontSize: '0.75em',
//                             color: '#666',
//                             marginTop: 4,
//                             textAlign: 'right',
//                           }}
//                         > */}
//                          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 text-right">
//                           🕒{' '}
//                           {msg.timestamp?.toDate?.().toLocaleTimeString('en-IN', {
//                             hour: '2-digit',
//                             minute: '2-digit',
//                             second: '2-digit',
//                             hour12: true,
//                           })}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           ));
//         })()}
//       </div>

//       {/* Input box */}
//       <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
//         <input
//           value={message}
//           onChange={(e) => {setMessage(e.target.value)
          
//           }}
//           placeholder="Type your message"
//           // style={{
//           //   padding: 10,
//           //   width: '70%',
//           //   marginRight: 10,
//           //   borderRadius: 8,
//           //   border: '1px solid #ccc',
//           // }}
//           className="p-2 w-3/4 mr-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//         />
//         <button
//           onClick={sendMessage}
//           style={{
//             padding: '10px 16px',
//             borderRadius: 8,
//             backgroundColor: '#007bff',
//             color: '#fff',
//             border: 'none',
//           }}
//         >
//           Send
//         </button>
//       </div>
//     </div>  

//   );
// };

// export default PrivateChatPage;
















// add css to make responsive

import { useEffect, useState } from 'react';
import {
  collection,
  getFirestore,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import { useRouter } from 'next/router';
import { chatDB } from '@/lib/chatFirebase';
import CryptoJS from 'crypto-js';
import { getAuth } from 'firebase/auth';

const PrivateChatPage = () => {
  const router = useRouter();
  const { roomId } = router.query;
  const auth = getAuth();
  const user = auth.currentUser;

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<
    { id: string; text: string; sender: string;  name?: string;  timestamp: any; photoURL?: string }[]
  >([]);
  


  useEffect(() => {
    if (!roomId || typeof roomId !== 'string') return;

    const messagesRef = collection(chatDB, 'privateChats', roomId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => {
        const data = doc.data();
        let decrypted = '';
        try {
          decrypted = CryptoJS.AES.decrypt(data.text, 'your-secret-key').toString(CryptoJS.enc.Utf8);
        } catch {
          decrypted = '[Decryption error]';
        }

        return {
          id: doc.id,
          text: decrypted,
          sender: data.sender,
             name: data.name || '',
          timestamp: data.timestamp,
          photoURL: data.photoURL || '',
        };
      });
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [roomId]);

  const sendMessage = async () => {
    if (!message.trim() || !roomId || typeof roomId !== 'string') return;

    const encryptedMessage = CryptoJS.AES.encrypt(message, 'your-secret-key').toString();

    try {
      await addDoc(collection(chatDB, 'privateChats', roomId, 'messages'), {
        text: encryptedMessage,
        sender: user?.email || 'Anonymous',
         name: user?.displayName || '',
        photoURL: user?.photoURL || '',
        timestamp: serverTimestamp(),
      });
   

      setMessage('');
    } catch (error) {
      console.error('❌ Error sending message:', error);
    }
  };

 return (
<div className="flex flex-col p-4 sm:p-6 mt-5 mx-auto border-2 border-black rounded-lg 
                h-[80vh] sm:h-[85vh] md:h-[90vh] w-full max-w-[1000px] bg-amber-100 dark:bg-gray-900 transition-colors duration-300">

  {/* Header */}
  <h2 className="text-blue-700 dark:text-blue-400 text-2xl sm:text-3xl md:text-4xl font-bold text-center">
    💬 Private Group Chat Room:
  </h2>
  <span className="text-green-900 dark:text-green-400 text-center text-lg sm:text-xl md:text-2xl">
    {roomId}
  </span>

  {/* Messages */}
  <div className="flex-1 mt-4 mb-2 p-2 overflow-y-auto">
        {(() => {
          const groupedByDate: { [date: string]: typeof messages } = {};
          messages.forEach((msg) => {
            const dateObj = msg.timestamp?.toDate?.();
            if (!dateObj) return;
            const date = dateObj.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            });
            groupedByDate[date] = groupedByDate[date] || [];
            groupedByDate[date].push(msg);
          });

      return Object.entries(groupedByDate).map(([date, msgs]) => (
        <div key={date}>
          <div className="text-center font-bold my-2 text-gray-500 dark:text-gray-300">
            📅 {date}
          </div>

          {msgs.map((msg) => {
            const isSender = msg.sender === user?.email;
            return (
              <div key={msg.id} className={`flex mb-2 ${isSender ? "justify-end" : "justify-start"}`}>
                <div className={`flex items-center max-w-[70%] p-2 rounded-lg 
                                ${isSender ? "bg-blue-100 dark:bg-blue-700" : "bg-gray-100 dark:bg-gray-800"}`}>
                  
                  {msg.photoURL && msg.photoURL.trim() !== "" ? (
                    <img
                      src={msg.photoURL}
                      alt="User Avatar"
                      className="w-8 h-8 rounded-full mr-2 object-cover"
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = ""; }}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center mr-2">
                      {(msg.name || msg.sender || "U")[0]?.toUpperCase()}
                    </div>
                  )}

                  <div className="break-words">
                    <div>
                      <strong className="font-bold pr-1">{msg.sender}:</strong> {msg.text}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 text-right">
                      🕒 {msg.timestamp?.toDate?.().toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ));
    })()}
  </div>

  {/* Input box */}
  <div className="flex flex-col sm:flex-row items-center mt-auto gap-2 mb-2">
    <input
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      placeholder="Type your message"
      className="p-2 w-full sm:w-3/4 rounded-lg border border-black dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
    />
    <button
      onClick={sendMessage}
      className="w-full sm:w-auto px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300"
    >
      Send
    </button>
  </div>
</div> 

  );
};

export default PrivateChatPage;