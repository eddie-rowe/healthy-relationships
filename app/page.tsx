"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateRoomCode } from "@/lib/room-code";
import Button from "@/components/ui/Button";

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
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Healthy Relationships</h1>
        <p className="text-gray-500 max-w-xs mx-auto">
          A guided space for two people to communicate better, together.
        </p>
      </div>

      <div className="w-full max-w-xs space-y-4">
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
              className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 text-center text-lg font-mono tracking-wider text-gray-900 placeholder:text-gray-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200"
              autoFocus
              maxLength={8}
            />
            <Button size="lg" disabled={!joinCode.trim()} onClick={handleJoin}>
              Join
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
