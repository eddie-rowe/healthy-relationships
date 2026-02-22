"use client";

import { useState } from "react";
import { useRoom } from "@/components/RoomProvider";
import Button from "@/components/ui/Button";
import TextArea from "@/components/ui/TextArea";

export default function MirrorScreen({ partnerText, mirror, confirmed }: {
  partnerText: string;
  mirror: string | null;
  confirmed: boolean | null;
}) {
  const { yourRole, send } = useRoom();
  const [text, setText] = useState("");

  // Determine who mirrors: the person who DIDN'T speak
  // On mirror-a step: listener mirrors speaker's words
  // On mirror-b step: speaker mirrors listener's words
  const isMirrorer = (yourRole === "listener" && !mirror) || (yourRole === "speaker" && !mirror);

  // If mirror was submitted but not yet confirmed by the speaker
  if (mirror && confirmed === null) {
    // The original speaker confirms
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Does this capture what you said?</h1>
        <div className="bg-violet-50 dark:bg-violet-950 border border-violet-100 dark:border-violet-900 rounded-2xl p-5 mb-8 max-w-sm w-full">
          <p className="text-gray-900 dark:text-gray-100 italic">&quot;{mirror}&quot;</p>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Button size="lg" onClick={() => send({ type: "submit-step", payload: { accurate: true } })}>
            Yes, that&apos;s right
          </Button>
          <Button variant="secondary" size="lg" onClick={() => send({ type: "submit-step", payload: { accurate: false } })}>
            Not quite — try again
          </Button>
        </div>
      </div>
    );
  }

  // If confirmed is false, the mirrorer needs to retry
  if (confirmed === false || !mirror) {
    return (
      <div className="flex flex-col min-h-screen px-6 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Mirror what you heard</h1>
          <p className="text-gray-500 dark:text-gray-400">Reflect your partner&apos;s words back to them</p>
          {confirmed === false && (
            <p className="text-amber-600 dark:text-amber-400 text-sm mt-2">Your partner felt that wasn&apos;t quite right. Try again.</p>
          )}
        </div>

        <div className="bg-violet-50 dark:bg-violet-950 border border-violet-100 dark:border-violet-900 rounded-2xl p-5 mb-6">
          <p className="text-sm text-violet-600 dark:text-violet-400 font-medium mb-1">Your partner said:</p>
          <p className="text-gray-900 dark:text-gray-100">&quot;{partnerText}&quot;</p>
        </div>

        <div className="flex-1">
          <TextArea
            label="What I hear you saying is..."
            placeholder="Reflect their words in your own way"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={500}
          />
        </div>

        <div className="pt-6">
          <Button size="lg" disabled={!text.trim()} onClick={() => {
            send({ type: "submit-step", payload: { type: "mirror", text: text.trim() } });
          }}>
            Send Mirror
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
