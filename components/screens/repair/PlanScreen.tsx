"use client";

import { useState } from "react";
import { useRoom } from "@/components/RoomProvider";
import Button from "@/components/ui/Button";
import TextArea from "@/components/ui/TextArea";

export default function PlanScreen() {
  const { state, yourRole, send } = useRoom();
  const [text, setText] = useState("");

  const myKey = yourRole === "speaker" ? "planSpeaker" : "planListener";
  const submitted = !!state?.data[myKey];

  const handleSubmit = () => {
    if (!text.trim()) return;
    send({ type: "submit-step", payload: { text: text.trim() } });
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div className="w-3 h-3 rounded-full bg-violet-400 animate-pulse mb-4" />
        <p className="text-gray-500">Waiting for your partner to share their plan...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen px-6 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Make a plan</h1>
        <p className="text-gray-500">What&apos;s one thing you&apos;ll do differently next time?</p>
      </div>

      <div className="flex-1">
        <TextArea
          label="Next time, I will..."
          placeholder="One specific, actionable commitment"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
        />
      </div>

      <div className="pt-6">
        <Button size="lg" disabled={!text.trim()} onClick={handleSubmit}>
          Commit
        </Button>
      </div>
    </div>
  );
}
