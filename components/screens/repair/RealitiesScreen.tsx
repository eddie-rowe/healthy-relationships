"use client";

import { useState } from "react";
import { useRoom } from "@/components/RoomProvider";
import Button from "@/components/ui/Button";
import TextArea from "@/components/ui/TextArea";

export default function RealitiesScreen({ isPersonA }: { isPersonA: boolean }) {
  const { send } = useRoom();
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;
    send({ type: "submit-step", payload: { text: text.trim() } });
  };

  return (
    <div className="flex flex-col min-h-screen px-6 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Share your reality</h1>
        <p className="text-gray-500">
          {isPersonA
            ? 'Share your perspective using "I" statements'
            : "Summarize what you understood from your partner's perspective"}
        </p>
      </div>

      <div className="flex-1">
        <TextArea
          label={isPersonA ? "From my perspective..." : "I can understand how you felt that way because..."}
          placeholder={isPersonA ? "Share what happened from your point of view..." : "Summarize your partner's perspective..."}
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
