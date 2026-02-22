"use client";

import { useState } from "react";

export default function WaitingScreen({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code.toUpperCase());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: do nothing
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <div className="mb-8">
        <div className="w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center mx-auto mb-4">
          <div className="w-3 h-3 rounded-full bg-violet-500 animate-pulse" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Waiting for your partner</h1>
        <p className="text-gray-500 dark:text-gray-400">Share this code so they can join</p>
      </div>

      <button
        onClick={copyCode}
        className="bg-violet-50 dark:bg-violet-950 border-2 border-dashed border-violet-300 dark:border-violet-700 rounded-2xl px-8 py-5 mb-4 transition-all hover:bg-violet-100 dark:hover:bg-violet-900 active:scale-95"
      >
        <span className="text-4xl font-mono font-bold tracking-wider text-violet-700 dark:text-violet-300">
          {code.toUpperCase()}
        </span>
      </button>

      <p className="text-sm text-gray-400 dark:text-gray-500">
        {copied ? "Copied!" : "Tap to copy"}
      </p>
    </div>
  );
}
