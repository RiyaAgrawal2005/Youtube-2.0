

import React, { useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import { chatDB } from "../lib/chatFirebase"; // This is for chat storage
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  query,
  orderBy,
  DocumentData,
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'my_secret_key_123'; // 🔒 You can make it more secure later

const PrivateChat: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [chatPartnerEmail, setChatPartnerEmail] = useState('');
  const [roomId, setRoomId] = useState<string>('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<DocumentData[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const generateRoomId = (email1: string, email2: string) => {
    const sorted = [email1, email2].sort();
    return `room_${sorted[0]}_${sorted[1]}`;
  };

  useEffect(() => {
    if (user?.email && chatPartnerEmail) {
      const newRoomId = generateRoomId(user.email, chatPartnerEmail);
      setRoomId(newRoomId);
      ensureRoomExists(newRoomId);
    }
  }, [chatPartnerEmail, user?.email]);

  const ensureRoomExists = async (roomId: string) => {
    if (!user?.email || !chatPartnerEmail) return;
    const roomRef = doc(chatDB, 'privateRooms', roomId);
    const roomSnap = await getDoc(roomRef);
    if (!roomSnap.exists()) {
      await setDoc(roomRef, {
        members: [user.email, chatPartnerEmail],
        createdAt: serverTimestamp(),
      });
    }
  };

  useEffect(() => {
    if (!roomId) return;
    const q = query(collection(chatDB, 'privateRooms', roomId, 'messages'), orderBy('createdAt'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const decryptedMessages = snapshot.docs.map((doc) => {
        const data = doc.data();
        const bytes = CryptoJS.AES.decrypt(data.text, SECRET_KEY);
        const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
        return {
          ...data,
          text: decryptedText,
        };
      });
      setMessages(decryptedMessages);
    });
    return () => unsubscribe();
  }, [roomId]);



const handleSendMessage = async () => {
    console.log("handleSendMessage triggered ✅");
  if (!message.trim() || !roomId || !user?.email) {
    console.log("Message not sent - missing data");
    return;
  }

  console.log("Sending to Firestore room:", roomId);
  console.log("Message:", message);

  const encryptedText = CryptoJS.AES.encrypt(message, SECRET_KEY).toString();

  try {
    await addDoc(collection(chatDB, `privateRooms/${roomId}/messages`), {
      sender: user.email,
      senderName: user.displayName || user.email,
      text: encryptedText,
      createdAt: serverTimestamp(),
    });
    console.log("Message sent successfully!");
    setMessage('');
  } catch (error) {
    console.error("Error sending message:", error);
  }
};



  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4 text-center">Private Chat Room with partner email????????????</h2>

      <input
        type="email"
        placeholder="Enter partner email"
        className="border px-2 py-1 mb-3 w-full"
        value={chatPartnerEmail}
        onChange={(e) => setChatPartnerEmail(e.target.value)}
      />

      <div className="border p-2 h-64 overflow-y-scroll mb-3 bg-gray-100">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-1 ${msg.sender === user?.email ? 'text-right' : 'text-left'}`}>
            <span className="inline-block bg-blue-100 rounded px-2 py-1 text-sm max-w-xs break-words">
              <strong>{msg.sender === user?.email ? 'You' : msg.senderName || msg.sender}</strong>: {msg.text}
              <br />
              <small className="text-xs text-gray-500">
                {msg.createdAt?.seconds
                  ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : ''}
              </small>
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 border px-2 py-1"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
      
          onClick={handleSendMessage}
          
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          Send

        </button>
        
      </div>
    </div>
  );
};

export default PrivateChat;
