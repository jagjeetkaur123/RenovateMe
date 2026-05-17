"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

const CATEGORIES = [
  "handyman", "plumbing", "electrical", "renovation", "carpentry",
  "cabinet_making", "cleaning", "painting", "landscaping",
  "tiling_flooring", "security", "moving_transport", "heating_cooling", "specialist",
];

const URGENCY = [
  { value: "standard", label: "Standard" },
  { value: "urgent", label: "Urgent (within 48 hrs)" },
  { value: "emergency", label: "Emergency (ASAP)" },
];

export default function NewJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    budget_min: "",
    budget_max: "",
    suburb: "",
    state: "",
    postcode: "",
    urgency: "standard",
  });

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        ...form,
        budget_min: form.budget_min ? parseFloat(form.budget_min) : null,
        budget_max: form.budget_max ? parseFloat(form.budget_max) : null,
      };
      await api.post("/jobs", payload);
      router.push("/dashboard/customer?posted=1");
    } catch {
      setError("Failed to post job. Please make sure you are logged in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-brand-600">SilverBricks Connect</Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Post a Job</h1>
        <p className="mb-8 text-gray-500">Describe your job and receive quotes from verified tradies.</p>

        <div className="card">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Job title *</label>
              <input className="input" placeholder="e.g. Fix leaking bathroom tap" value={form.title}
                onChange={(e) => set("title", e.target.value)} required />
            </div>

            <div>
              <label className="label">Trade category *</label>
              <select className="input" value={form.category}
                onChange={(e) => set("category", e.target.value)} required>
                <option value="">Select a category...</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Describe the job *</label>
              <textarea className="input min-h-28" placeholder="Describe what needs to be done, any relevant details..."
                value={form.description} onChange={(e) => set("description", e.target.value)} required />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Budget min (AUD)</label>
                <input className="input" type="number" placeholder="500"
                  value={form.budget_min} onChange={(e) => set("budget_min", e.target.value)} />
              </div>
              <div>
                <label className="label">Budget max (AUD)</label>
                <input className="input" type="number" placeholder="2000"
                  value={form.budget_max} onChange={(e) => set("budget_max", e.target.value)} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="label">Suburb *</label>
                <input className="input" placeholder="Fitzroy" value={form.suburb}
                  onChange={(e) => set("suburb", e.target.value)} required />
              </div>
              <div>
                <label className="label">State</label>
                <select className="input" value={form.state} onChange={(e) => set("state", e.target.value)}>
                  <option value="">Select...</option>
                  {["VIC", "NSW", "QLD", "WA", "SA", "TAS", "ACT", "NT"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Postcode</label>
                <input className="input" placeholder="3065" value={form.postcode}
                  onChange={(e) => set("postcode", e.target.value)} />
              </div>
            </div>

            <div>
              <label className="label">Urgency</label>
              <div className="flex gap-3">
                {URGENCY.map((u) => (
                  <label key={u.value}
                    className={`flex-1 cursor-pointer rounded-lg border p-3 text-sm text-center transition ${
                      form.urgency === u.value
                        ? "border-brand-500 bg-blue-50 text-brand-700 font-medium"
                        : "border-gray-200 hover:border-gray-300"
                    }`}>
                    <input type="radio" className="sr-only" value={u.value}
                      checked={form.urgency === u.value}
                      onChange={() => set("urgency", u.value)} />
                    {u.label}
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="btn-primary w-full py-3" disabled={loading}>
              {loading ? "Posting..." : "Post Job"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
