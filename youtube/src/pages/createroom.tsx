

import { chatDB } from "@/lib/chatFirebase"; // Firebase chat project
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/router";
import { useState } from "react";
import { getAuth } from "firebase/auth";

const CreateRoom = () => {
  const router = useRouter();
  const auth = getAuth(); // Get auth from chat Firebase project

  const createRoom = async () => {
    console.log("🟢 Create Room button clicked");

    const id = uuidv4(); // auto-generate room ID
    console.log("🆔 Generated Room ID:", id);

    const currentUser = auth.currentUser;

    if (!currentUser) {
      console.error("❌ No user is logged in");
      return;
    }

    try {
      const roomRef = doc(chatDB, "privateChats", id);
      console.log("📄 Room Document Reference:", roomRef.path);

      await setDoc(roomRef, {
        id,
        name: "Private Room", // default name, not from input
        createdBy: currentUser.email,
        members: [currentUser.email],
        createdAt: serverTimestamp(),
      });

      console.log("✅ Room created successfully.");
      router.push(`/privatechat/${id}`);
    } catch (error) {
      console.error("❌ Error creating room:", error);
    }
  };

  return (
    // <div className="p-4 text-center">
    //   <h2 className="text-lg font-semibold mb-4">Create a Private Chat Room</h2>
    //  <div className="p-4 text-center h-54 ml-170 mt-80 bg-white dark:bg-gray-800 rounded-lg shadow-md">
    //   <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
    //     Create a Private Chat Room
    //   </h2>
    //   <button
    //     onClick={createRoom}
    //     className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
    //   >
    //     Create Room
    //   </button>
    // </div>
    <div className="p-4 text-center bg-amber-100 dark:bg-gray-800 rounded-lg shadow-md
                mx-auto mt-20 sm:mt-24 md:mt-32 lg:mt-40
                w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3
                h-40">
  <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
    Create a Private Chat Room
  </h2>
  <button
    onClick={createRoom}
    className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded hover:bg-blue-700 transition-colors duration-200"
  >
    Create Room
  </button>
</div>

  );
};

export default CreateRoom;


















