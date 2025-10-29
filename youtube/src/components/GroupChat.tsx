import React, { useEffect, useState, useRef } from 'react';
import { auth, db } from '../lib/firebase';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/router';
import CryptoJS from 'crypto-js';
import { chatDB } from "../lib/chatFirebase";
const secretKey = 'your-secret-key'; // 🔒 Store securely in production

type Message = {
  id: string;
  sender: string;
  text: string;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
};

const GroupChat = () => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [userEmail, setUserEmail] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Check auth and set user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setUserEmail(user.email || '');
      } else {
        alert('Please log in to use the group chat.');
        router.push('/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  // Fetch messages
  useEffect(() => {
    const q = query(
      collection(db, 'groupChats', 'global-group-chat', 'messages'),
      orderBy('timestamp')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = snapshot.docs.map((doc) => {
        const data = doc.data() as Omit<Message, 'id'>;
        const decryptedText = CryptoJS.AES.decrypt(data.text, secretKey).toString(CryptoJS.enc.Utf8);

        return {
          id: doc.id,
          sender: data.sender,
          text: decryptedText,
          timestamp: data.timestamp,
        };
      });

      setMessages(msgs);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser) return;

    const encryptedText = CryptoJS.AES.encrypt(newMessage, secretKey).toString();

    await addDoc(
      collection(db, 'groupChats', 'global-group-chat', 'messages'),
      {
        text: encryptedText,
        timestamp: serverTimestamp(),
        sender: currentUser.email || currentUser.displayName || 'Anonymous',
      }
    );

    setNewMessage('');
  };

  if (loading) return <p>Loading chat...</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', height: '700px',  margin: 'auto'}}>
      <h2 className="text-2xl font-semibold mb-4 text-center">🌐 Common Group Chat Room</h2>

      <div
        style={{
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '10px',
          height: '540px',
          overflowY: 'auto',
          // backgroundColor: 'grey',
          // marginTop: '2px',
          marginBottom: '15px',
        }}
      >
        {messages.map((msg) => {
          const isCurrentUser = msg.sender === userEmail;
          const time = msg.timestamp
            ? new Date(msg.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : '';

          return (
            <div key={msg.id} style={{ marginBottom: '10px' , margin: '3px', padding: '3px', height: '40px'}}>
              <strong className='text-xl '>{isCurrentUser ? 'You' : msg.sender}</strong>: <span className="text-xl font-medium text-yellow-500">{msg.text}</span>
              {msg.timestamp && (
                <span style={{ fontSize: '0.8em', color: 'blue', marginLeft: '26px', padding: '2px', border: '1px solid gray' }}>{time}</span>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ display: 'flex' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        />
        <button
          onClick={handleSendMessage}
          style={{
            padding: '10px 15px',
            marginLeft: '10px',
            borderRadius: '4px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default GroupChat;
