"use client";

import { useState } from "react";
import { useRoom } from "@/components/RoomProvider";
import Button from "@/components/ui/Button";
import TextArea from "@/components/ui/TextArea";

export default function ValidateScreen({ partnerText }: { partnerText: string }) {
  const { send } = useRoom();
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;
    send({ type: "submit-step", payload: { text: text.trim() } });
  };

  return (
    <div className="flex flex-col min-h-screen px-6 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Validate their perspective</h1>
        <p className="text-gray-500 dark:text-gray-400">You don&apos;t have to agree — just show you understand why they feel this way</p>
      </div>

      <div className="bg-violet-50 dark:bg-violet-950 border border-violet-100 dark:border-violet-900 rounded-2xl p-5 mb-6">
        <p className="text-sm text-violet-600 dark:text-violet-400 font-medium mb-1">Your partner shared:</p>
        <p className="text-gray-900 dark:text-gray-100">&quot;{partnerText}&quot;</p>
      </div>

      <div className="flex-1">
        <TextArea
          label="That makes sense to me because..."
          placeholder="Explain why their perspective makes sense"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={500}
        />
      </div>

      <div className="pt-6">
        <Button size="lg" disabled={!text.trim()} onClick={handleSubmit}>
          Send Validation
        </Button>
      </div>
    </div>
  );
}
