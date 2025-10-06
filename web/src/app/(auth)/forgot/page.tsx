"use client";

import { useState } from "react";

export default function ForgotPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const res = await fetch("/api/auth-local/forgot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    if (res.ok) setMessage("If an account exists, we sent a reset link.");
    else setMessage("Something went wrong.");
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="mb-1 text-2xl font-semibold">Forgot password</h1>
        <p className="mb-6 text-sm text-zinc-600">We&#39;ll email you a reset link.</p>
        {message && <p className="mb-2 text-sm text-zinc-600">{message}</p>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              required
              className="w-full rounded-md border border-zinc-300 p-2 focus:outline-none focus:ring-2 focus:ring-zinc-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-black p-2 text-white hover:bg-zinc-800 disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>
      </div>
    </div>
  );
}
