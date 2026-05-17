"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { register } from "@/lib/auth";

type Role = "customer" | "tradesperson" | "business_owner";

const roles: { value: Role; label: string; desc: string }[] = [
  { value: "customer", label: "Customer / Homeowner", desc: "I want to find and book services" },
  { value: "tradesperson", label: "Tradesperson", desc: "I offer trade services" },
  { value: "business_owner", label: "Business Owner", desc: "I run a salon, clinic or local business" },
];

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = (searchParams.get("role") as Role) ?? "customer";

  const [role, setRole] = useState<Role>(defaultRole);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await register({ name, email, password, phone: phone || undefined, role });
      const roleRedirects: Record<string, string> = {
        customer: "/dashboard/customer",
        tradesperson: "/dashboard/provider",
        business_owner: "/dashboard/business",
      };
      router.push(roleRedirects[data.user.role] ?? "/");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(msg ?? "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <Link href="/" className="text-2xl font-bold text-brand-600">
            SilverBricks Connect
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Create your account</h1>
        </div>

        <div className="card space-y-6">
          {/* Role selector */}
          <div>
            <p className="label">I am a...</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {roles.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={`rounded-lg border p-3 text-left text-sm transition ${
                    role === r.value
                      ? "border-brand-500 bg-blue-50 text-brand-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-medium">{r.label}</div>
                  <div className="mt-0.5 text-xs text-gray-500">{r.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            )}

            <div>
              <label className="label">Full name</label>
              <input
                type="text"
                className="input"
                placeholder="Jane Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="label">Email address</label>
              <input
                type="email"
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="label">Phone number (optional)</label>
              <input
                type="tel"
                className="input"
                placeholder="04xx xxx xxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div>
              <label className="label">Password</label>
              <input
                type="password"
                className="input"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>

            <button type="submit" className="btn-primary w-full py-3" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </button>

            <p className="text-center text-xs text-gray-500">
              By signing up you agree to our{" "}
              <Link href="/terms" className="underline">Terms of Service</Link> and{" "}
              <Link href="/privacy" className="underline">Privacy Policy</Link>.
            </p>
          </form>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-brand-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
