"use client";

import { useState } from "react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const res = await fetch("/api/auth-local/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    setLoading(false);
    if (res.ok) {
      setMessage("Account created. Check your email to verify.");
    } else {
      const data = await res.json().catch(() => ({}));
      setMessage(data.error || "Something went wrong");
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="mb-1 text-2xl font-semibold">Create account</h1>
        <p className="mb-6 text-sm text-zinc-600">Sign up to get started.</p>
        {message && <p className="mb-2 text-sm text-zinc-600">{message}</p>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Name</label>
            <input
              type="text"
              required
              className="w-full rounded-md border border-zinc-300 p-2 focus:outline-none focus:ring-2 focus:ring-zinc-900"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
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
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>
        <div className="mt-4 text-sm text-zinc-600">
          Already have an account? <a href="/login" className="font-medium hover:underline">Log in</a>
        </div>
      </div>
    </div>
  );
}
