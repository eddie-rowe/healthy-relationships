"use client";

import { useState } from "react";
import { useRoom } from "@/components/RoomProvider";
import { EMOTIONS } from "@/lib/constants";
import Button from "@/components/ui/Button";

export default function FeelingsScreen() {
  const { state, yourRole, send } = useRoom();
  const [selected, setSelected] = useState<string[]>([]);

  const myKey = yourRole === "speaker" ? "feelingsSpeaker" : "feelingsListener";
  const submitted = !!state?.data[myKey];

  const toggleEmotion = (emotion: string) => {
    setSelected((prev) =>
      prev.includes(emotion) ? prev.filter((e) => e !== emotion) : [...prev, emotion]
    );
  };

  const handleSubmit = () => {
    if (selected.length === 0) return;
    send({ type: "submit-step", payload: { feelings: selected } });
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div className="w-3 h-3 rounded-full bg-violet-400 animate-pulse mb-4" />
        <p className="text-gray-500 dark:text-gray-400">Waiting for your partner to select their feelings...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen px-6 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">How did you feel?</h1>
        <p className="text-gray-500 dark:text-gray-400">Select the emotions you felt during the incident. No need to explain why.</p>
      </div>

      <div className="flex flex-wrap gap-2 flex-1">
        {EMOTIONS.map((emotion) => (
          <button
            key={emotion}
            onClick={() => toggleEmotion(emotion)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selected.includes(emotion)
                ? "bg-violet-600 text-white"
                : "bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900"
            }`}
          >
            {emotion}
          </button>
        ))}
      </div>

      <div className="pt-6">
        <Button size="lg" disabled={selected.length === 0} onClick={handleSubmit}>
          Submit ({selected.length} selected)
        </Button>
      </div>
    </div>
  );
}
