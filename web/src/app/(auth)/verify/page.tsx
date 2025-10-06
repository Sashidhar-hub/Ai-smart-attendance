"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

export const dynamic = "force-dynamic";

function VerifyContent() {
  const search = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<string>("Verifying...");

  useEffect(() => {
    const token = search.get("token");
    const email = search.get("email");
    if (!token || !email) return;
    fetch("/api/auth-local/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, email }),
    })
      .then(async (res) => {
        if (res.ok) {
          setStatus("Email verified. You can log in now.");
          setTimeout(() => router.push("/login"), 1200);
        } else {
          setStatus("Invalid or expired verification link.");
        }
      })
      .catch(() => setStatus("Something went wrong."));
  }, [search, router]);

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 text-center shadow-sm">
        <h1 className="mb-2 text-xl font-semibold">Email verification</h1>
        <p className="text-sm text-zinc-600">{status}</p>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading…</div>}>
      <VerifyContent />
    </Suspense>
  );
}
