"use client";

import { useRoom } from "@/components/RoomProvider";
import { MODE_CONFIG } from "@/lib/constants";
import type { Rating } from "@/lib/types";
import Button from "@/components/ui/Button";

const RATING_OPTIONS: { value: Rating; label: string }[] = [
  { value: "yes", label: "Yes" },
  { value: "somewhat", label: "Somewhat" },
  { value: "no", label: "No" },
];

export default function RatingScreen() {
  const { state, yourRole, send } = useRoom();

  const config = state?.mode ? MODE_CONFIG[state.mode] : null;
  const question = config ? config.ratingQuestion : "How do you feel?";

  // Check if we already submitted
  const myRating = yourRole === "speaker" ? state?.ratings.speaker : state?.ratings.listener;
  const submitted = myRating !== null && myRating !== undefined;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      {config && (
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-3">{config.icon} {config.name}</p>
      )}
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">{question}</h1>

      {submitted ? (
        <div>
          <p className="text-gray-500 dark:text-gray-400 mb-2">Waiting for your partner to respond...</p>
          <div className="w-3 h-3 rounded-full bg-violet-400 animate-pulse mx-auto" />
        </div>
      ) : (
        <div className="flex flex-col gap-3 w-full max-w-xs">
          {RATING_OPTIONS.map((opt) => (
            <Button
              key={opt.value}
              variant="secondary"
              size="lg"
              onClick={() => send({ type: "submit-rating", rating: opt.value })}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
