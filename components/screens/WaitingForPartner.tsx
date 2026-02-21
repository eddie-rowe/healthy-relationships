"use client";

const MESSAGES = [
  "Take a slow breath while you wait...",
  "This is a moment for patience and grace.",
  "Your partner is taking their time — that's a good thing.",
  "Being here shows you care.",
];

export default function WaitingForPartner({ message }: { message?: string }) {
  const displayMessage = message || MESSAGES[Math.floor(Math.random() * MESSAGES.length)];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center mx-auto mb-6">
        <div className="w-3 h-3 rounded-full bg-violet-400 animate-pulse" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-3">Your partner is working on their response</h2>
      <p className="text-gray-500 max-w-xs">{displayMessage}</p>
    </div>
  );
}
