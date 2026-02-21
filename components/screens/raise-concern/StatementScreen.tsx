"use client";

import { useState } from "react";
import { useRoom } from "@/components/RoomProvider";
import { EMOTIONS } from "@/lib/constants";
import Button from "@/components/ui/Button";
import TextArea from "@/components/ui/TextArea";

export default function StatementScreen() {
  const { send } = useRoom();
  const [emotion, setEmotion] = useState("");
  const [situation, setSituation] = useState("");
  const [need, setNeed] = useState("");

  const canSubmit = emotion && situation.trim() && need.trim();

  const handleSubmit = () => {
    if (!canSubmit) return;
    send({ type: "submit-step", payload: { emotion, situation: situation.trim(), need: need.trim() } });
  };

  return (
    <div className="flex flex-col min-h-screen px-6 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Share your concern</h1>
        <p className="text-gray-500">Use &quot;I&quot; statements to express how you feel</p>
      </div>

      <div className="space-y-5 flex-1">
        <div>
          <label className="block text-sm font-medium text-violet-800 mb-2">I feel...</label>
          <div className="flex flex-wrap gap-2">
            {EMOTIONS.slice(0, 12).map((e) => (
              <button
                key={e}
                onClick={() => setEmotion(e.toLowerCase())}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  emotion === e.toLowerCase()
                    ? "bg-violet-600 text-white"
                    : "bg-violet-50 text-violet-700 hover:bg-violet-100"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <TextArea
          label="When..."
          placeholder="Describe the specific situation"
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
        />

        <TextArea
          label="What I need is..."
          placeholder="Make a positive request"
          value={need}
          onChange={(e) => setNeed(e.target.value)}
        />
      </div>

      <div className="pt-6">
        <Button size="lg" disabled={!canSubmit} onClick={handleSubmit}>
          Share with Partner
        </Button>
      </div>
    </div>
  );
}
