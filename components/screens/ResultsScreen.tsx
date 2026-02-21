"use client";

import { useRoom } from "@/components/RoomProvider";
import { MODE_CONFIG } from "@/lib/constants";
import Button from "@/components/ui/Button";

function RatingBadge({ rating }: { rating: string | null }) {
  const colors: Record<string, string> = {
    yes: "bg-green-100 text-green-700",
    somewhat: "bg-yellow-100 text-yellow-700",
    no: "bg-red-100 text-red-700",
  };
  if (!rating) return null;
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${colors[rating] || "bg-gray-100"}`}>
      {rating.charAt(0).toUpperCase() + rating.slice(1)}
    </span>
  );
}

export default function ResultsScreen() {
  const { state } = useRoom();
  if (!state?.mode) return null;

  const config = MODE_CONFIG[state.mode];
  const { data, ratings } = state;

  return (
    <div className="flex flex-col min-h-screen px-6 py-10">
      <div className="text-center mb-8">
        <span className="text-4xl mb-3 block">{config.icon}</span>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Session Complete</h1>
        <p className="text-gray-500">{config.name}</p>
      </div>

      <div className="max-w-md mx-auto w-full space-y-4">
        {/* Mode-specific summary */}
        {state.mode === "raise-concern" && (
          <>
            <SummaryCard label="The concern" text={`I feel ${data.emotion} when ${data.situation}. What I need is ${data.need}.`} />
            <SummaryCard label="Paraphrase" text={data.paraphrase as string} />
          </>
        )}

        {state.mode === "check-in" && (
          <>
            {data.shareA && <SummaryCard label="Person A shared" text={data.shareA as string} />}
            {data.validateA && <SummaryCard label="Person B responded" text={data.validateA as string} />}
            {data.shareB && <SummaryCard label="Person B shared" text={data.shareB as string} />}
            {data.validateB && <SummaryCard label="Person A responded" text={data.validateB as string} />}
          </>
        )}

        {state.mode === "appreciate" && (
          <>
            {data.appreciateA && (
              <SummaryCard
                label="Person A appreciated"
                text={`I noticed when you ${(data.appreciateA as Record<string, string>).action} and it made me feel ${(data.appreciateA as Record<string, string>).feeling}`}
              />
            )}
            {data.appreciateB && (
              <SummaryCard
                label="Person B appreciated"
                text={`I noticed when you ${(data.appreciateB as Record<string, string>).action} and it made me feel ${(data.appreciateB as Record<string, string>).feeling}`}
              />
            )}
          </>
        )}

        {state.mode === "work-through-it" && (
          <>
            {data.speakA && <SummaryCard label="Person A shared" text={data.speakA as string} />}
            {data.mirrorA && <SummaryCard label="Person B mirrored" text={data.mirrorA as string} />}
            {data.speakB && <SummaryCard label="Person B shared" text={data.speakB as string} />}
            {data.mirrorB && <SummaryCard label="Person A mirrored" text={data.mirrorB as string} />}
          </>
        )}

        {state.mode === "repair" && (
          <>
            {data.responsibilityA && <SummaryCard label="Person A takes responsibility" text={data.responsibilityA as string} />}
            {data.responsibilityB && <SummaryCard label="Person B takes responsibility" text={data.responsibilityB as string} />}
            {data.planSpeaker && <SummaryCard label="Person A will" text={data.planSpeaker as string} />}
            {data.planListener && <SummaryCard label="Person B will" text={data.planListener as string} />}
          </>
        )}

        {/* Ratings */}
        {(ratings.speaker || ratings.listener) && (
          <div className="bg-white border border-violet-100 rounded-2xl p-5">
            <h3 className="text-sm font-medium text-gray-500 mb-3">How we feel</h3>
            <div className="flex gap-4">
              <div>
                <span className="text-xs text-gray-400 block mb-1">Person A</span>
                <RatingBadge rating={ratings.speaker} />
              </div>
              <div>
                <span className="text-xs text-gray-400 block mb-1">Person B</span>
                <RatingBadge rating={ratings.listener} />
              </div>
            </div>
          </div>
        )}

        <div className="pt-4">
          <Button
            variant="primary"
            size="lg"
            onClick={() => window.location.href = "/"}
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, text }: { label: string; text: string }) {
  return (
    <div className="bg-white border border-violet-100 rounded-2xl p-5">
      <h3 className="text-sm font-medium text-gray-500 mb-1">{label}</h3>
      <p className="text-gray-900">{text}</p>
    </div>
  );
}
