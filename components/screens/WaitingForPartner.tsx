"use client";

import { useState } from "react";
import { useRoom } from "@/components/RoomProvider";

const MESSAGES = [
  "Take a slow breath while you wait...",
  "This is a moment for patience and grace.",
  "Your partner is taking their time — that's a good thing.",
  "Being here shows you care.",
];

export default function WaitingForPartner({
  message,
  tip,
  showNameEntry,
}: {
  message?: string;
  tip?: string;
  showNameEntry?: boolean;
}) {
  const { state, yourRole, send } = useRoom();
  const [randomMessage] = useState(() => MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
  const [name, setName] = useState("");

  const displayMessage = message || randomMessage;

  const partnerName =
    yourRole === "speaker" ? state?.names?.listener : state?.names?.speaker;
  const myName =
    yourRole === "speaker" ? state?.names?.speaker : state?.names?.listener;

  const heading = partnerName
    ? `${partnerName} is working on their response`
    : "Your partner is working on their response";

  const handleSaveName = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    send({ type: "set-name", name: trimmed });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center mx-auto mb-6">
        <div className="w-3 h-3 rounded-full bg-violet-400 animate-pulse" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">{heading}</h2>
      <p className="text-gray-500 dark:text-gray-400 max-w-xs">{displayMessage}</p>
      {tip && (
        <div className="mt-6 bg-violet-50 dark:bg-violet-950 border border-violet-100 dark:border-violet-900 rounded-2xl p-4 max-w-xs">
          <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 mb-1">💡 While you wait</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{tip}</p>
        </div>
      )}

      {showNameEntry && !myName && (
        <div className="mt-8 w-full max-w-xs text-left">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
            Your name <span className="text-gray-400 dark:text-gray-500 font-normal">(optional)</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
              placeholder="e.g. Jordan"
              maxLength={50}
              className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <button
              onClick={handleSaveName}
              disabled={!name.trim()}
              className="px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-medium disabled:opacity-40 transition-opacity"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
