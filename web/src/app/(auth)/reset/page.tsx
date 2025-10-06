"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";

export const dynamic = "force-dynamic";

function ResetContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = params.get("token");
    const email = params.get("email");
    if (!token || !email) {
      setMessage("Invalid link");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/auth-local/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token, password }),
    });
    setLoading(false);
    if (res.ok) {
      setMessage("Password updated. You can log in now.");
      setTimeout(() => router.push("/login"), 1200);
    } else {
      setMessage("Invalid or expired reset link.");
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="mb-1 text-2xl font-semibold">Reset password</h1>
        <p className="mb-6 text-sm text-zinc-600">Enter your new password.</p>
        {message && <p className="mb-2 text-sm text-zinc-600">{message}</p>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">New password</label>
            <input
              type="password"
              required
              className="w-full rounded-md border border-zinc-300 p-2 focus:outline-none focus:ring-2 focus:ring-zinc-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-black p-2 text-white hover:bg-zinc-800 disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading…</div>}>
      <ResetContent />
    </Suspense>
  );
}
