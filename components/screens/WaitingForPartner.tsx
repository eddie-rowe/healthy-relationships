"use client";

import { useState } from "react";

const MESSAGES = [
  "Take a slow breath while you wait...",
  "This is a moment for patience and grace.",
  "Your partner is taking their time — that's a good thing.",
  "Being here shows you care.",
];

export default function WaitingForPartner({ message, tip }: { message?: string; tip?: string }) {
  const [randomMessage] = useState(() => MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
  const displayMessage = message || randomMessage;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center mx-auto mb-6">
        <div className="w-3 h-3 rounded-full bg-violet-400 animate-pulse" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Your partner is working on their response</h2>
      <p className="text-gray-500 dark:text-gray-400 max-w-xs">{displayMessage}</p>
      {tip && (
        <div className="mt-6 bg-violet-50 dark:bg-violet-950 border border-violet-100 dark:border-violet-900 rounded-2xl p-4 max-w-xs">
          <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 mb-1">💡 While you wait</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{tip}</p>
        </div>
      )}
    </div>
  );
}
