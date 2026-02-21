"use client";

import { useState } from "react";
import { useRoom } from "@/components/RoomProvider";
import { EMOTIONS } from "@/lib/constants";
import Button from "@/components/ui/Button";
import TextArea from "@/components/ui/TextArea";

const INITIAL_EMOTION_COUNT = 8;

export default function StatementScreen() {
  const { send } = useRoom();
  const [emotion, setEmotion] = useState("");
  const [situation, setSituation] = useState("");
  const [need, setNeed] = useState("");
  const [showAllEmotions, setShowAllEmotions] = useState(false);

  const visibleEmotions = showAllEmotions ? EMOTIONS : EMOTIONS.slice(0, INITIAL_EMOTION_COUNT);
  const canSubmit = emotion && situation.trim() && need.trim();

  const handleSubmit = () => {
    if (!canSubmit) return;
    send({ type: "submit-step", payload: { emotion, situation: situation.trim(), need: need.trim() } });
  };

  return (
    <div className="flex flex-col min-h-screen px-6 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Share your concern</h1>
        <p className="text-gray-500 dark:text-gray-400">Use &quot;I&quot; statements to express how you feel</p>
      </div>

      <div className="space-y-5 flex-1">
        <div>
          <label className="block text-sm font-medium text-violet-800 dark:text-violet-300 mb-2">I feel...</label>
          <div className="flex flex-wrap gap-2">
            {visibleEmotions.map((e) => (
              <button
                key={e}
                onClick={() => setEmotion(e.toLowerCase())}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  emotion === e.toLowerCase()
                    ? "bg-violet-600 text-white"
                    : "bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900"
                }`}
              >
                {e}
              </button>
            ))}
            {!showAllEmotions && EMOTIONS.length > INITIAL_EMOTION_COUNT && (
              <button
                onClick={() => setShowAllEmotions(true)}
                className="px-4 py-2 rounded-full text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
              >
                +{EMOTIONS.length - INITIAL_EMOTION_COUNT} more
              </button>
            )}
          </div>
        </div>

        <TextArea
          label="When..."
          placeholder="Describe the specific situation"
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
          maxLength={500}
        />

        <TextArea
          label="What I need is..."
          placeholder="Make a positive request"
          value={need}
          onChange={(e) => setNeed(e.target.value)}
          maxLength={500}
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
