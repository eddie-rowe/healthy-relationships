"use client";

import { useState } from "react";
import { useRoom } from "@/components/RoomProvider";
import Button from "@/components/ui/Button";
import TextArea from "@/components/ui/TextArea";

export default function EmpathizeScreen({ empathy, confirmed }: {
  empathy: string | null;
  confirmed: boolean | null;
}) {
  const { yourRole, send } = useRoom();
  const [text, setText] = useState("");

  // If empathy was submitted, original speaker confirms
  if (empathy && confirmed === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Does this resonate?</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Your partner imagines how you feel:</p>
        <div className="bg-violet-50 dark:bg-violet-950 border border-violet-100 dark:border-violet-900 rounded-2xl p-5 mb-8 max-w-sm w-full">
          <p className="text-gray-900 dark:text-gray-100 italic">&quot;I imagine you might be feeling {empathy}&quot;</p>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Button size="lg" onClick={() => send({ type: "submit-step", payload: { accurate: true } })}>
            Yes, that resonates
          </Button>
          <Button variant="secondary" size="lg" onClick={() => send({ type: "submit-step", payload: { accurate: false } })}>
            Not quite
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen px-6 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Empathize</h1>
        <p className="text-gray-500 dark:text-gray-400">Imagine what your partner might be feeling</p>
        {confirmed === false && (
          <p className="text-amber-600 dark:text-amber-400 text-sm mt-2">That didn&apos;t quite resonate. Try again.</p>
        )}
      </div>

      <div className="flex-1">
        <TextArea
          label="I imagine you might be feeling..."
          placeholder="Try to name what emotions they might be experiencing"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={500}
        />
      </div>

      <div className="pt-6">
        <Button size="lg" disabled={!text.trim()} onClick={() => {
          send({ type: "submit-step", payload: { text: text.trim() } });
        }}>
          Send
        </Button>
      </div>
    </div>
  );
}
