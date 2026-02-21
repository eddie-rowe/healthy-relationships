"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function JoinPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const router = useRouter();

  useEffect(() => {
    router.replace(`/room/${code.toUpperCase()}?role=listener`);
  }, [code, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 rounded-full border-2 border-violet-200 border-t-violet-600 animate-spin" />
    </div>
  );
}
