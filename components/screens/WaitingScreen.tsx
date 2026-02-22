"use client";

import { useState } from "react";
import { useRoom } from "@/components/RoomProvider";

export default function WaitingScreen({ code }: { code: string }) {
  const { state, send } = useRoom();
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState("");

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code.toUpperCase());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: do nothing
    }
  };

  const savedName = state?.names?.speaker;

  const handleSaveName = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    send({ type: "set-name", name: trimmed });
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

      <p className="text-sm text-gray-400 dark:text-gray-500 mb-10">
        {copied ? "Copied!" : "Tap to copy"}
      </p>

      <div className="w-full max-w-xs text-left">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
          Your name <span className="text-gray-400 dark:text-gray-500 font-normal">(optional)</span>
        </label>
        {savedName ? (
          <p className="text-sm text-violet-600 dark:text-violet-400 font-medium">✓ {savedName}</p>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
              placeholder="e.g. Alex"
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
        )}
      </div>
    </div>
  );
}
