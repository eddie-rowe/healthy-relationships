"use client";

import { useState } from "react";
import { useRoom } from "@/components/RoomProvider";
import { VALIDATION_PROMPTS } from "@/lib/constants";
import Button from "@/components/ui/Button";
import TextArea from "@/components/ui/TextArea";

export default function ValidateScreen({ partnerText }: { partnerText: string }) {
  const { send } = useRoom();
  const [selected, setSelected] = useState<string | null>(null);
  const [custom, setCustom] = useState("");

  const responseText = selected === "__custom" ? custom.trim() : selected;
  const canSubmit = responseText && responseText.length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    send({ type: "submit-step", payload: { text: responseText } });
  };

  return (
    <div className="flex flex-col min-h-screen px-6 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Listen and validate</h1>
        <p className="text-gray-500 dark:text-gray-400">Your partner shared what&apos;s on their mind</p>
      </div>

      <div className="bg-violet-50 dark:bg-violet-950 border border-violet-100 dark:border-violet-900 rounded-2xl p-5 mb-6">
        <p className="text-gray-900 dark:text-gray-100">&quot;{partnerText}&quot;</p>
      </div>

      <div className="space-y-2 mb-4">
        {VALIDATION_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => { setSelected(prompt); setCustom(""); }}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              selected === prompt
                ? "bg-violet-600 text-white"
                : "bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900"
            }`}
          >
            {prompt}
          </button>
        ))}
        <button
          onClick={() => setSelected("__custom")}
          className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
            selected === "__custom"
              ? "bg-violet-600 text-white"
              : "bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900"
          }`}
        >
          Write my own response...
        </button>
      </div>

      {selected === "__custom" && (
        <TextArea
          placeholder="Your response..."
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          rows={3}
          maxLength={300}
        />
      )}

      <div className="pt-6 mt-auto">
        <Button size="lg" disabled={!canSubmit} onClick={handleSubmit}>
          Send Response
        </Button>
      </div>
    </div>
  );
}
