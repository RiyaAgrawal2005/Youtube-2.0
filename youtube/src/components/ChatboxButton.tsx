
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";

const ChatboxButton = () => {
  const router = useRouter();

  return (
    <div className="flex  mt-10 mb-16">
    <button
      onClick={() => router.push("/createroom")}
      
      className="fixed left-6 bottom-24 bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-2xl shadow-lg hover:bg-blue-700 dark:hover:bg-blue-600 flex items-center gap-2 z-50 transition-colors duration-300"
    
    >
      <MessageCircle size={20} />
      Chatroom
    </button>
    </div>
  );
};

export default ChatboxButton;
