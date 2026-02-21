"use client";

import { useState } from "react";
import { useRoom } from "@/components/RoomProvider";
import Button from "@/components/ui/Button";
import TextArea from "@/components/ui/TextArea";

export default function ShareScreen() {
  const { send } = useRoom();
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;
    send({ type: "submit-step", payload: { text: text.trim() } });
  };

  return (
    <div className="flex flex-col min-h-screen px-6 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">What&apos;s on your mind?</h1>
        <p className="text-gray-500">Share something from your day — external stress, not about your relationship</p>
      </div>

      <div className="flex-1">
        <TextArea
          placeholder="What's been on your mind today..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
        />
      </div>

      <div className="pt-6">
        <Button size="lg" disabled={!text.trim()} onClick={handleSubmit}>
          Share
        </Button>
      </div>
    </div>
  );
}
