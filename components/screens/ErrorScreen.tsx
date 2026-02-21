"use client";

import Button from "@/components/ui/Button";

export default function ErrorScreen({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
        <span className="text-2xl">!</span>
      </div>
      <h1 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h1>
      <p className="text-gray-500 mb-8 max-w-xs">{message}</p>
      <Button variant="primary" onClick={() => window.location.href = "/"}>
        Back to Home
      </Button>
    </div>
  );
}
