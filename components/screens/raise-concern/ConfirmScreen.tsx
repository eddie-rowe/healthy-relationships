"use client";

import { useRoom } from "@/components/RoomProvider";
import Button from "@/components/ui/Button";

export default function ConfirmScreen() {
  const { state, send } = useRoom();

  const paraphrase = state?.data.paraphrase as string;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Does this feel accurate?</h1>
        <p className="text-gray-500">Your partner reflected back:</p>
      </div>

      <div className="bg-violet-50 border border-violet-100 rounded-2xl p-5 mb-8 max-w-sm w-full">
        <p className="text-gray-900 italic">&quot;{paraphrase}&quot;</p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button
          size="lg"
          onClick={() => send({ type: "submit-step", payload: { accurate: true } })}
        >
          Yes, that feels right
        </Button>
        <Button
          variant="secondary"
          size="lg"
          onClick={() => send({ type: "submit-step", payload: { accurate: false } })}
        >
          Not quite — let me try again
        </Button>
      </div>
    </div>
  );
}
