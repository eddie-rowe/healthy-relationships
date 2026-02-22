"use client";

import { useState } from "react";
import { useRoom } from "@/components/RoomProvider";
import Button from "@/components/ui/Button";
import TextArea from "@/components/ui/TextArea";

export default function TriggersScreen() {
  const { send } = useRoom();
  const [trigger, setTrigger] = useState("");
  const [story, setStory] = useState("");

  const canSubmit = trigger.trim() && story.trim();

  const handleSubmit = () => {
    if (!canSubmit) return;
    send({ type: "submit-step", payload: { text: trigger.trim(), story: story.trim() } });
  };

  return (
    <div className="flex flex-col min-h-screen px-6 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">What triggered you?</h1>
        <p className="text-gray-500 dark:text-gray-400">Understanding triggers helps prevent future escalation</p>
      </div>

      <div className="space-y-5 flex-1">
        <TextArea
          label="What set me off was..."
          placeholder="What specifically triggered your reaction?"
          value={trigger}
          onChange={(e) => setTrigger(e.target.value)}
          rows={3}
          maxLength={300}
        />

        <TextArea
          label="The story behind that is..."
          placeholder="Why does this trigger feel so strong? (past experiences, sensitivities...)"
          value={story}
          onChange={(e) => setStory(e.target.value)}
          rows={3}
          maxLength={300}
        />
      </div>

      <div className="pt-6">
        <Button size="lg" disabled={!canSubmit} onClick={handleSubmit}>
          Share
        </Button>
      </div>
    </div>
  );
}
