// pages/test-firestore.tsx
"use client";

import { useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { videoCallDb } from "@/lib/videoCallFirebase";

export default function TestFirestorePage() {
  useEffect(() => {
    const testWrite = async () => {
      console.log("🚀 Starting Firestore write test...");

      try {
        const testCollection = collection(videoCallDb, "testRooms");
        console.log("📁 Collection reference:", testCollection);

        const docRef = await addDoc(testCollection, {
          name: "test",
          timestamp: new Date(),
        });

        console.log("✅ Document written with ID:", docRef.id);
      } catch (err: any) {
        console.error("❌ Firestore write error:", err);
        if (err.code) console.error("Error code:", err.code);
        if (err.message) console.error("Error message:", err.message);
        if (err.stack) console.error("Stack trace:", err.stack);
      }
    };

    testWrite();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Testing Firestore Write</h1>
      <p>Check your console for detailed logs.</p>
    </div>
  );
}
