"use client";

import { useState } from "react";
import { useRoom } from "@/components/RoomProvider";
import Button from "@/components/ui/Button";
import TextArea from "@/components/ui/TextArea";

export default function ParaphraseScreen() {
  const { state, send } = useRoom();
  const [text, setText] = useState("");

  const emotion = state?.data.emotion as string;
  const situation = state?.data.situation as string;
  const need = state?.data.need as string;

  const handleSubmit = () => {
    if (!text.trim()) return;
    send({ type: "submit-step", payload: { text: text.trim() } });
  };

  return (
    <div className="flex flex-col min-h-screen px-6 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Reflect what you heard</h1>
        <p className="text-gray-500 dark:text-gray-400">Paraphrase your partner&apos;s concern in your own words</p>
      </div>

      <div className="bg-violet-50 dark:bg-violet-950 border border-violet-100 dark:border-violet-900 rounded-2xl p-5 mb-6">
        <p className="text-sm text-violet-600 dark:text-violet-400 font-medium mb-1">Your partner said:</p>
        <p className="text-gray-900 dark:text-gray-100">
          &quot;I feel <strong>{emotion}</strong> when <strong>{situation}</strong>. What I need is <strong>{need}</strong>.&quot;
        </p>
      </div>

      <div className="flex-1">
        <TextArea
          label="What I hear you saying is..."
          placeholder="Put their concern in your own words"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={500}
        />
      </div>

      <div className="pt-6">
        <Button size="lg" disabled={!text.trim()} onClick={handleSubmit}>
          Send Paraphrase
        </Button>
      </div>
    </div>
  );
}
