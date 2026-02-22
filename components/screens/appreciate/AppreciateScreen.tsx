"use client";

import { useState } from "react";
import { useRoom } from "@/components/RoomProvider";
import Button from "@/components/ui/Button";
import TextArea from "@/components/ui/TextArea";

export default function AppreciateScreen() {
  const { send } = useRoom();
  const [action, setAction] = useState("");
  const [feeling, setFeeling] = useState("");

  const canSubmit = action.trim() && feeling.trim();

  const handleSubmit = () => {
    if (!canSubmit) return;
    send({ type: "submit-step", payload: { action: action.trim(), feeling: feeling.trim() } });
  };

  return (
    <div className="flex flex-col min-h-screen px-6 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Share an appreciation</h1>
        <p className="text-gray-500 dark:text-gray-400">Notice something specific your partner did</p>
      </div>

      <div className="space-y-5 flex-1">
        <TextArea
          label="I noticed when you..."
          placeholder="Describe something specific they did"
          value={action}
          onChange={(e) => setAction(e.target.value)}
          rows={3}
          maxLength={300}
        />

        <TextArea
          label="And it made me feel..."
          placeholder="How did it make you feel?"
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          rows={3}
          maxLength={300}
        />
      </div>

      <div className="pt-6">
        <Button size="lg" disabled={!canSubmit} onClick={handleSubmit}>
          Share Appreciation
        </Button>
      </div>
    </div>
  );
}
