"use client";

import { useRoom } from "@/components/RoomProvider";
import Button from "@/components/ui/Button";

export default function AcknowledgeScreen({ appreciation }: { appreciation: { action: string; feeling: string } }) {
  const { send, state, yourRole } = useRoom();
  const partnerName =
    yourRole === "speaker" ? state?.names?.listener : state?.names?.speaker;
  const heading = partnerName ? `${partnerName} appreciates you` : "Your partner appreciates you";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <div className="mb-8">
        <span className="text-4xl block mb-4">💛</span>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{heading}</h1>
      </div>

      <div className="bg-violet-50 dark:bg-violet-950 border border-violet-100 dark:border-violet-900 rounded-2xl p-6 mb-8 max-w-sm w-full">
        <p className="text-gray-900 dark:text-gray-100 text-lg">
          &quot;I noticed when you <strong>{appreciation.action}</strong> and it made me feel <strong>{appreciation.feeling}</strong>.&quot;
        </p>
      </div>

      <Button
        size="lg"
        onClick={() => send({ type: "submit-step", payload: { acknowledged: true } })}
        className="max-w-xs"
      >
        Thank You
      </Button>
    </div>
  );
}
