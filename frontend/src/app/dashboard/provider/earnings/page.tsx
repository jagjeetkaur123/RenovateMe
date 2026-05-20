"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

type Quote = { id: number; price: number; status: string; job_id: number; created_at: string };

export default function ProviderEarningsPage() {
  const { data: quotes = [], isLoading } = useQuery<Quote[]>({
    queryKey: ["my-quotes"],
    queryFn: () => api.get("/quotes/my").then((r) => r.data),
  });

  const accepted = quotes.filter((q) => q.status === "accepted");
  const pending = quotes.filter((q) => q.status === "pending");
  const declined = quotes.filter((q) => q.status === "declined");

  const totalEarned = accepted.reduce((sum, q) => sum + q.price, 0);
  const avgQuote = quotes.length > 0 ? Math.round(quotes.reduce((s, q) => s + q.price, 0) / quotes.length) : 0;
  const winRate = quotes.length > 0 ? Math.round((accepted.length / quotes.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-brand-600">SilverBricks Connect</Link>
          <Link href="/dashboard/provider" className="btn-ghost text-sm">Dashboard</Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Earnings & Quotes</h1>

        {isLoading ? (
          <div className="card text-center py-12 text-gray-500">Loading earnings data...</div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              {[
                { label: "Total Quotes", value: quotes.length, sub: "all time", color: "text-gray-900" },
                { label: "Jobs Won", value: accepted.length, sub: `${winRate}% win rate`, color: "text-green-700" },
                { label: "Avg Quote Value", value: `$${avgQuote.toLocaleString()}`, sub: "per quote", color: "text-blue-700" },
                { label: "Total Revenue", value: `$${totalEarned.toLocaleString()}`, sub: "from accepted quotes", color: "text-purple-700" },
              ].map((s) => (
                <div key={s.label} className="card text-center">
                  <p className={`text-2xl font-bold mb-1 ${s.color}`}>{s.value}</p>
                  <p className="text-sm font-medium text-gray-700">{s.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Quote history */}
            <div className="card">
              <h2 className="font-semibold text-gray-900 mb-4">Quote History</h2>
              {quotes.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-2">No quotes submitted yet.</p>
                  <Link href="/jobs/browse" className="btn-primary text-sm">Browse Available Jobs</Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {quotes.map((q) => (
                    <div key={q.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div>
                        <Link href={`/jobs/${q.job_id}`} className="text-sm font-medium text-brand-600 hover:underline">
                          Job #{q.job_id}
                        </Link>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(q.created_at).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-semibold text-gray-900">${q.price.toLocaleString()}</p>
                        <span className={`badge ${
                          q.status === "accepted" ? "badge-green" :
                          q.status === "declined" ? "badge-red" : "badge-yellow"
                        }`}>
                          {q.status.charAt(0).toUpperCase() + q.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
