"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateRoomCode } from "@/lib/room-code";
import { MODE_CONFIG } from "@/lib/constants";
import Button from "@/components/ui/Button";
import type { Mode } from "@/lib/types";

export default function Home() {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState("");
  const [showJoin, setShowJoin] = useState(false);

  const handleCreate = () => {
    const code = generateRoomCode();
    router.push(`/room/${code}?role=speaker`);
  };

  const handleJoin = () => {
    if (!joinCode.trim()) return;
    router.push(`/room/${joinCode.trim().toUpperCase()}?role=listener`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 pt-16 pb-12 text-center">
        <div className="text-5xl mb-5">💜</div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">
          Communicate better,<br />together.
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-10 text-lg">
          A guided space for two people to have structured, evidence-based conversations — no accounts needed.
        </p>

        <div className="w-full max-w-xs space-y-3">
          <Button size="lg" onClick={handleCreate}>
            Start a Session
          </Button>

          {!showJoin ? (
            <Button variant="secondary" size="lg" onClick={() => setShowJoin(true)}>
              Join a Session
            </Button>
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Enter room code (e.g. BEAR42)"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                className="w-full rounded-2xl border border-violet-200 dark:border-violet-800 bg-white dark:bg-gray-900 px-4 py-3 text-center text-lg font-mono tracking-wider text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200 dark:focus:ring-violet-900"
                autoFocus
                maxLength={8}
              />
              <Button size="lg" disabled={!joinCode.trim()} onClick={handleJoin}>
                Join
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-12 bg-white dark:bg-gray-900">
        <div className="max-w-sm mx-auto">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">How it works</h2>
          <div className="space-y-6">
            {[
              { step: "1", title: "One person starts a session", desc: "They get a short room code to share." },
              { step: "2", title: "Partner joins on their phone", desc: "Enter the code — no sign-up needed." },
              { step: "3", title: "Follow the guided prompts", desc: "The app structures the conversation for you." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-violet-600 text-white text-sm font-bold flex items-center justify-center">
                  {step}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{title}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mode cards */}
      <section className="px-6 py-12">
        <div className="max-w-sm mx-auto">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 text-center">Choose your approach</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-8">Five evidence-based methods for different situations</p>
          <div className="space-y-3">
            {(Object.entries(MODE_CONFIG) as [Mode, typeof MODE_CONFIG[Mode]][]).map(([key, mode]) => (
              <ModeCard key={key} mode={mode} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust section */}
      <section className="px-6 py-12 bg-white dark:bg-gray-900">
        <div className="max-w-sm mx-auto text-center space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Built on research</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Every conversation flow is grounded in evidence-based methods — primarily the{" "}
            <span className="font-medium text-gray-700 dark:text-gray-300">Gottman Institute</span> research and{" "}
            <span className="font-medium text-gray-700 dark:text-gray-300">Nonviolent Communication (NVC)</span>.
          </p>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <TrustBadge icon="🔒" text="No accounts required" />
            <TrustBadge icon="📵" text="No data stored" />
            <TrustBadge icon="⚡" text="Works on any phone" />
            <TrustBadge icon="💜" text="Free to use" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center">
        <p className="text-xs text-gray-400 dark:text-gray-600">
          Healthy Relationships &mdash; A guided space for better conversations
        </p>
      </footer>
    </div>
  );
}

function ModeCard({ mode }: { mode: { name: string; description: string; icon: string; basedOn: string; whenToUse: string } }) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-violet-100 dark:border-gray-800 rounded-2xl p-4 flex items-start gap-4">
      <span className="text-2xl flex-shrink-0 mt-0.5">{mode.icon}</span>
      <div>
        <p className="font-semibold text-gray-900 dark:text-gray-100">{mode.name}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{mode.whenToUse}</p>
        <p className="text-xs text-violet-500 dark:text-violet-400 mt-1">Based on {mode.basedOn}</p>
      </div>
    </div>
  );
}

function TrustBadge({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="bg-violet-50 dark:bg-violet-950 rounded-xl p-3 text-center">
      <div className="text-lg mb-1">{icon}</div>
      <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">{text}</p>
    </div>
  );
}
