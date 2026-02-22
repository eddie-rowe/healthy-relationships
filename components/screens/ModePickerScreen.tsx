"use client";

import { useRoom } from "@/components/RoomProvider";
import { MODE_CONFIG } from "@/lib/constants";
import type { Mode } from "@/lib/types";

const MODES = Object.entries(MODE_CONFIG) as [Mode, (typeof MODE_CONFIG)[Mode]][];

export default function ModePickerScreen() {
  const { send } = useRoom();

  return (
    <div className="flex flex-col min-h-screen px-6 py-10">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Choose a Mode</h1>
        <p className="text-gray-500 dark:text-gray-400">What would you like to work on together?</p>
      </div>

      <div className="flex flex-col gap-3 max-w-md mx-auto w-full">
        {MODES.map(([key, config]) => (
          <button
            key={key}
            onClick={() => send({ type: "set-mode", mode: key })}
            className="flex items-start gap-4 bg-white dark:bg-gray-900 border border-violet-100 dark:border-violet-900 rounded-2xl p-5 text-left transition-all hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-md active:scale-[0.98]"
          >
            <span className="text-3xl mt-0.5">{config.icon}</span>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">{config.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{config.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
