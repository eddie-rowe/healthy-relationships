"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function JoinClient() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code") || "";
  const router = useRouter();

  useEffect(() => {
    if (code) router.replace(`/room?code=${code.toUpperCase()}&role=listener`);
  }, [code, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 rounded-full border-2 border-violet-200 border-t-violet-600 animate-spin" />
    </div>
  );
}
