"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { register } from "@/lib/auth";

type Role = "customer" | "tradesperson" | "business_owner";

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
      <div className="w-full max-w-xl">
        <div className="mb-8 text-center">
          <Link href="/" className="text-2xl font-bold text-brand-600">
            SilverBricks Connect
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Create your account</h1>
        </div>

        <div className="card space-y-8">
          <div>
            <p className="label mb-4 text-center">I want to...</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setRole("customer")}
                className={`flex flex-col items-center rounded-xl border-2 p-6 text-center transition ${
                  role === "customer"
                    ? "border-brand-500 bg-blue-50 ring-2 ring-brand-500/20"
                    : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <span className="text-4xl mb-3">🏡</span>
                <div className="font-bold text-gray-900">Get a Service</div>
                <div className="mt-1 text-xs text-gray-500">I want to find and book tradies</div>
              </button>

              <button
                type="button"
                onClick={() => setRole("tradesperson")} 
                className={`flex flex-col items-center rounded-xl border-2 p-6 text-center transition ${
                  role !== "customer"
                    ? "border-brand-500 bg-blue-50 ring-2 ring-brand-500/20"
                    : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <span className="text-4xl mb-3">🛠️</span>
                <div className="font-bold text-gray-900">Become a Partner</div>
                <div className="mt-1 text-xs text-gray-500">I want to grow my business</div>
              </button>
            </div>

            {/* Sub-role selector (Only if Partner is selected) */}
            {role !== "customer" && (
              <div className="mt-6 flex justify-center gap-6 rounded-lg bg-gray-50 p-3">
                <label className="flex items-center gap-2 text-sm font-medium cursor-pointer text-gray-700">
                  <input 
                    type="radio" 
                    checked={role === "tradesperson"} 
                    onChange={() => setRole("tradesperson")}
                    className="h-4 w-4 text-brand-600 focus:ring-brand-500"
                  />
                  Individual Tradie
                </label>
                <label className="flex items-center gap-2 text-sm font-medium cursor-pointer text-gray-700">
                  <input 
                    type="radio" 
                    checked={role === "business_owner"} 
                    onChange={() => setRole("business_owner")}
                    className="h-4 w-4 text-brand-600 focus:ring-brand-500"
                  />
                  Agency / Business
                </label>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-gray-100">
            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
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
                <label className="label">Phone number</label>
                <input
                  type="tel"
                  className="input"
                  placeholder="04xx xxx xxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
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

            <button type="submit" className="btn-primary w-full py-3 mt-4" disabled={loading}>
              {loading ? "Creating account..." : `Create ${role === "customer" ? "Customer" : role === "tradesperson" ? "Tradesperson" : "Business"} Account`}
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