"use client";

import { useState } from "react";
import { useRoom } from "@/components/RoomProvider";
import { MODE_CONFIG, getNextModeSuggestion } from "@/lib/constants";
import Button from "@/components/ui/Button";

function RatingBadge({ rating }: { rating: string | null }) {
  const colors: Record<string, string> = {
    yes: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    somewhat: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    no: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  };
  if (!rating) return null;
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${colors[rating] || "bg-gray-100"}`}>
      {rating.charAt(0).toUpperCase() + rating.slice(1)}
    </span>
  );
}

function buildSummaryText(mode: string, data: Record<string, unknown>): string {
  const lines: string[] = [];
  if (mode === "raise-concern") {
    lines.push(`Concern: I feel ${data.emotion} when ${data.situation}. What I need is ${data.need}.`);
    if (data.paraphrase) lines.push(`Paraphrase: ${data.paraphrase}`);
  } else if (mode === "check-in") {
    if (data.shareA) lines.push(`Person A shared: ${data.shareA}`);
    if (data.validateA) lines.push(`Person B responded: ${data.validateA}`);
    if (data.shareB) lines.push(`Person B shared: ${data.shareB}`);
    if (data.validateB) lines.push(`Person A responded: ${data.validateB}`);
  } else if (mode === "appreciate") {
    const a = data.appreciateA as Record<string, string> | undefined;
    const b = data.appreciateB as Record<string, string> | undefined;
    if (a) lines.push(`Person A appreciated: I noticed when you ${a.action} and it made me feel ${a.feeling}.`);
    if (b) lines.push(`Person B appreciated: I noticed when you ${b.action} and it made me feel ${b.feeling}.`);
  } else if (mode === "work-through-it") {
    if (data.speakA) lines.push(`Person A shared: ${data.speakA}`);
    if (data.mirrorA) lines.push(`Person B mirrored: ${data.mirrorA}`);
    if (data.speakB) lines.push(`Person B shared: ${data.speakB}`);
    if (data.mirrorB) lines.push(`Person A mirrored: ${data.mirrorB}`);
  } else if (mode === "repair") {
    if (data.responsibilityA) lines.push(`Person A: ${data.responsibilityA}`);
    if (data.responsibilityB) lines.push(`Person B: ${data.responsibilityB}`);
    if (data.planSpeaker) lines.push(`Person A will: ${data.planSpeaker}`);
    if (data.planListener) lines.push(`Person B will: ${data.planListener}`);
  }
  return lines.join("\n");
}

export default function ResultsScreen() {
  const { state, yourRole, send } = useRoom();
  const [copied, setCopied] = useState(false);
  if (!state?.mode) return null;

  const config = MODE_CONFIG[state.mode];
  const { data, ratings } = state;

  const suggestion = getNextModeSuggestion(state.mode, ratings);

  const handleCopy = async () => {
    const text = buildSummaryText(state.mode!, data);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTryAnother = () => {
    send({ type: "reset-room" });
  };

  return (
    <div className="flex flex-col min-h-screen px-6 py-10">
      <div className="text-center mb-8">
        <span className="text-4xl mb-3 block">{config.icon}</span>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Session Complete</h1>
        <p className="text-gray-500 dark:text-gray-400">{config.name}</p>
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
          <div className="bg-white dark:bg-gray-900 border border-violet-100 dark:border-gray-800 rounded-2xl p-5">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">How we feel</h3>
            <div className="flex gap-4">
              <div>
                <span className="text-xs text-gray-400 dark:text-gray-500 block mb-1">{yourRole === "speaker" ? "You" : "Your partner"}</span>
                <RatingBadge rating={ratings.speaker} />
              </div>
              <div>
                <span className="text-xs text-gray-400 dark:text-gray-500 block mb-1">{yourRole === "listener" ? "You" : "Your partner"}</span>
                <RatingBadge rating={ratings.listener} />
              </div>
            </div>
          </div>
        )}

        {/* Smart suggestion */}
        {suggestion && (
          <div className="bg-violet-50 dark:bg-violet-950 border border-violet-200 dark:border-violet-800 rounded-2xl p-5">
            <p className="text-sm text-violet-700 dark:text-violet-300 mb-2">{suggestion.reason}</p>
            <button
              onClick={handleTryAnother}
              className="text-sm font-semibold text-violet-600 dark:text-violet-400 underline underline-offset-2"
            >
              Try &ldquo;{MODE_CONFIG[suggestion.mode].name}&rdquo; {MODE_CONFIG[suggestion.mode].icon}
            </button>
          </div>
        )}

        <div className="pt-4 space-y-3">
          <Button variant="primary" size="lg" onClick={() => window.location.href = "/"}>
            Done
          </Button>
          <Button variant="secondary" size="lg" onClick={handleTryAnother}>
            Try Another Mode
          </Button>
          <Button variant="ghost" size="lg" onClick={handleCopy}>
            {copied ? "Copied!" : "Copy Summary"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, text }: { label: string; text: string }) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-violet-100 dark:border-gray-800 rounded-2xl p-5">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</h3>
      <p className="text-gray-900 dark:text-gray-100">{text}</p>
    </div>
  );
}
