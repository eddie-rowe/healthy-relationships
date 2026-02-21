"use client";

import { useRoom } from "@/components/RoomProvider";
import { MODE_CONFIG, MODE_EXPLAINERS } from "@/lib/constants";
import Button from "@/components/ui/Button";

interface ModeExplainerScreenProps {
  isLeader: boolean;
}

export default function ModeExplainerScreen({ isLeader }: ModeExplainerScreenProps) {
  const { state, send } = useRoom();
  if (!state?.mode) return null;

  const config = MODE_CONFIG[state.mode];
  const explainer = MODE_EXPLAINERS[state.mode];

  return (
    <div className="flex flex-col min-h-screen px-6 py-10">
      <div className="text-center mb-8">
        <span className="text-5xl mb-4 block">{config.icon}</span>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{config.name}</h1>
        <p className="text-sm text-violet-600 dark:text-violet-400 font-medium">Based on {config.basedOn}</p>
      </div>

      <div className="max-w-sm mx-auto w-full mb-8">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">How it works</h2>
        <ol className="space-y-3">
          {explainer.bullets.map((bullet, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 text-sm font-semibold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{bullet}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-auto max-w-sm mx-auto w-full">
        {isLeader ? (
          <Button
            size="lg"
            onClick={() => send({ type: "start-session" })}
          >
            Start Session
          </Button>
        ) : (
          <div className="text-center py-4">
            <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">Waiting for your partner to start...</p>
          </div>
        )}
      </div>
    </div>
  );
}
