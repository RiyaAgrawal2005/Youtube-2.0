

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

//  return (
// <div className="flex flex-col p-4 sm:p-6 mt-5 mx-auto border-2 border-black rounded-lg 
//                 h-[80vh] sm:h-[85vh] md:h-[90vh] w-full max-w-[1000px] bg-amber-100 dark:bg-gray-900 transition-colors duration-300">

//   {/* Header */}
//   <h2 className="text-blue-700 dark:text-blue-400 text-2xl sm:text-3xl md:text-4xl font-bold text-center">
//     💬 Private Group Chat Room:
//   </h2>
//   <span className="text-green-900 dark:text-green-400 text-center text-lg sm:text-xl md:text-2xl">
//     {roomId}
//   </span>

//   {/* Messages */}
//   <div className="flex-1 mt-4 mb-2 p-2 overflow-y-auto">
//         {(() => {
//           const groupedByDate: { [date: string]: typeof messages } = {};
//           messages.forEach((msg) => {
//             const dateObj = msg.timestamp?.toDate?.();
//             if (!dateObj) return;
//             const date = dateObj.toLocaleDateString('en-GB', {
//               day: '2-digit',
//               month: 'short',
//               year: 'numeric',
//             });
//             groupedByDate[date] = groupedByDate[date] || [];
//             groupedByDate[date].push(msg);
//           });

//       return Object.entries(groupedByDate).map(([date, msgs]) => (
//         <div key={date}>
//           <div className="text-center font-bold my-2 text-gray-500 dark:text-gray-300">
//             📅 {date}
//           </div>

//           {msgs.map((msg) => {
//             const isSender = msg.sender === user?.email;
//             return (
//               <div key={msg.id} className={`flex mb-2 ${isSender ? "justify-end" : "justify-start"}`}>
//                 <div className={`flex items-center max-w-[70%] p-2 rounded-lg 
//                                 ${isSender ? "bg-blue-100 dark:bg-blue-700" : "bg-gray-100 dark:bg-gray-800"}`}>
                  
//                   {msg.photoURL && msg.photoURL.trim() !== "" ? (
//                     <img
//                       src={msg.photoURL}
//                       alt="User Avatar"
//                       className="w-8 h-8 rounded-full mr-2 object-cover"
//                       onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = ""; }}
//                     />
//                   ) : (
//                     <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center mr-2">
//                       {(msg.name || msg.sender || "U")[0]?.toUpperCase()}
//                     </div>
//                   )}

//                   <div className="break-words">
//                     <div>
//                       <strong className="font-bold pr-1">{msg.sender}:</strong> {msg.text}
//                     </div>
//                     <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 text-right">
//                       🕒 {msg.timestamp?.toDate?.().toLocaleTimeString("en-IN", {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                         second: "2-digit",
//                         hour12: true,
//                       })}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       ));
//     })()}
//   </div>

//   {/* Input box */}
//   <div className="flex flex-col sm:flex-row items-center mt-auto gap-2 mb-2">
//     <input
//       value={message}
//       onChange={(e) => setMessage(e.target.value)}
//       placeholder="Type your message"
//       className="p-2 w-full sm:w-3/4 rounded-lg border border-black dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
//       onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//     />
//     <button
//       onClick={sendMessage}
//       className="w-full sm:w-auto px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300"
//     >
//       Send
//     </button>
//   </div>
// </div> 

//   );



return (
  <div
    className="flex flex-col p-3 sm:p-5 mt-4 mx-auto border-2 border-black rounded-lg 
                h-[80vh] sm:h-[85vh] md:h-[90vh] 
                w-full max-w-[1000px] 
                bg-amber-100 dark:bg-gray-900 transition-all duration-300"
  >
    {/* Header */}
    <h2 className="text-blue-700 dark:text-blue-400 text-xl sm:text-2xl md:text-3xl font-bold text-center break-words">
      💬 Private Group Chat Room:
    </h2>
    <span className="text-green-900 dark:text-green-400 text-sm sm:text-lg md:text-xl text-center break-all">
      {roomId}
    </span>

    {/* Messages Area */}
    <div
      className="flex-1 mt-3 mb-2 p-2 overflow-y-auto 
                 bg-white/40 dark:bg-gray-800/30 
                 rounded-md shadow-inner"
    >
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
            <div className="text-center font-semibold my-2 text-gray-500 dark:text-gray-300 text-sm sm:text-base">
              📅 {date}
            </div>

            {msgs.map((msg) => {
              const isSender = msg.sender === user?.email;
              return (
                <div
                  key={msg.id}
                  className={`flex mb-2 ${
                    isSender ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`flex items-start sm:items-center gap-2 max-w-[85%] sm:max-w-[70%] p-2 rounded-lg text-sm sm:text-base
                                ${
                                  isSender
                                    ? 'bg-blue-100 dark:bg-blue-700'
                                    : 'bg-gray-100 dark:bg-gray-500'
                                }`}
                  >
                    {/* Avatar */}
                    {msg.photoURL && msg.photoURL.trim() !== '' ? (
                      <img
                        src={msg.photoURL}
                        alt="User Avatar"
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover flex-shrink-0"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '';
                        }}
                      />
                    ) : (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-orange-500 text-white flex items-center justify-center flex-shrink-0">
                        {(msg.name || msg.sender || 'U')[0]?.toUpperCase()}
                      </div>
                    )}

                    {/* Message Text */}
                    <div className="break-words w-full">
                      <div>
                        <strong className="font-semibold pr-1 break-all text-red-800 dark:text-black">
                          {msg.sender}:
                        </strong>
                       <strong className='text-black font-bold dark:text-white'>{msg.text}</strong>
                      </div>
                      <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-300 mt-1 text-right">
                        🕒{' '}
                        {msg.timestamp?.toDate?.().toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
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

    {/* Input Area */}
    <div
      className="flex flex-col sm:flex-row items-center mt-auto gap-2 sm:gap-3 mb-1 sm:mb-2 
                 w-full"
    >
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message"
        className="p-2 w-full sm:flex-1 rounded-lg border border-black dark:border-gray-700 
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 
                   text-sm sm:text-base"
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button
        onClick={sendMessage}
        className="w-full sm:w-auto px-3 sm:px-5 py-2 rounded-lg 
                   bg-blue-600 text-white font-semibold 
                   hover:bg-blue-700 active:scale-95 
                   transition-all duration-200 
                   text-sm sm:text-base"
      >
        Send
      </button>
    </div>
  </div>
);



};

export default PrivateChatPage;