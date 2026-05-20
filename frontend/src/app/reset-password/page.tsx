"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/api";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";
  const [form, setForm] = useState({ new_password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.new_password !== form.confirm) { setError("Passwords do not match"); return; }
    if (form.new_password.length < 8) { setError("Password must be at least 8 characters"); return; }
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { token, new_password: form.new_password });
      router.push("/login?reset=1");
    } catch (err: any) {
      setError(err.response?.data?.detail ?? "Invalid or expired reset link. Please request a new one.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) return (
    <div className="text-center">
      <p className="text-gray-700 mb-4">Invalid reset link.</p>
      <Link href="/forgot-password" className="btn-primary">Request New Link</Link>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <div>
        <label className="label">New password</label>
        <input className="input" type="password" value={form.new_password} onChange={(e) => setForm((f) => ({ ...f, new_password: e.target.value }))} required minLength={8} placeholder="At least 8 characters" />
      </div>
      <div>
        <label className="label">Confirm new password</label>
        <input className="input" type="password" value={form.confirm} onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))} required minLength={8} />
      </div>
      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading ? "Resetting..." : "Reset Password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="text-2xl font-bold text-brand-600">SilverBricks Connect</Link>
          <h1 className="mt-6 text-2xl font-bold text-gray-900">Reset your password</h1>
        </div>
        <div className="card">
          <Suspense fallback={<p className="text-gray-500 text-center">Loading...</p>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
