"use client";

import { useRouter } from "next/router";

export default function VideoCallButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/videocall")}
      className="mb-[-30px] px-4 py-2 bg-red-600 text-white rounded-2xl shadow-lg hover:bg-red-700 transition"
    >
      🎥 Video Call
    </button>
  );
}
