"use client";

import { useState } from "react";
import { useRoom } from "@/components/RoomProvider";
import Button from "@/components/ui/Button";
import TextArea from "@/components/ui/TextArea";

export default function ResponsibilityScreen() {
  const { send } = useRoom();
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;
    send({ type: "submit-step", payload: { text: text.trim() } });
  };

  return (
    <div className="flex flex-col min-h-screen px-6 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Take responsibility</h1>
        <p className="text-gray-500 dark:text-gray-400">Name what you contributed to the conflict</p>
      </div>

      <div className="flex-1">
        <TextArea
          label="One thing I regret is..."
          placeholder="What's something you could have done differently?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          maxLength={300}
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
