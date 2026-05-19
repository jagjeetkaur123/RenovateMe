"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getMyQuotes } from "@/lib/quotes";
import { formatDistanceToNow } from "date-fns";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  accepted: "bg-green-100 text-green-700",
  declined: "bg-red-100 text-red-600",
  expired: "bg-gray-100 text-gray-500",
};

const STATUS_ICONS: Record<string, string> = {
  pending: "⏳",
  accepted: "✅",
  declined: "❌",
  expired: "🕒",
};

export default function ProviderBidsPage() {
  const { data: quotes, isLoading } = useQuery({
    queryKey: ["my-quotes"],
    queryFn: getMyQuotes,
  });

  const all = quotes ?? [];
  const pending = all.filter((q) => q.status === "pending").length;
  const accepted = all.filter((q) => q.status === "accepted").length;
  const totalValue = all
    .filter((q) => q.status === "accepted")
    .reduce((sum, q) => sum + q.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-brand-600">SilverBricks Connect</Link>
          <Link href="/dashboard/provider" className="btn-ghost text-sm">Dashboard</Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">My Bids</h1>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          <div className="card text-center">
            <div className="text-3xl font-bold text-brand-600">{pending}</div>
            <div className="text-sm text-gray-500 mt-1">Awaiting Response</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-brand-600">{accepted}</div>
            <div className="text-sm text-gray-500 mt-1">Accepted</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-brand-600">
              {totalValue > 0 ? `$${totalValue.toLocaleString()}` : "—"}
            </div>
            <div className="text-sm text-gray-500 mt-1">Won Value</div>
          </div>
        </div>

        {isLoading ? (
          <div className="card py-12 text-center text-gray-400">Loading bids…</div>
        ) : all.length === 0 ? (
          <div className="card py-16 text-center text-gray-400">
            <div className="text-4xl mb-3">📄</div>
            <p className="font-medium">No bids submitted yet</p>
            <p className="text-sm mt-1">Find a job and submit your first quote to get started.</p>
            <Link href="/jobs/browse" className="btn-primary mt-6 inline-flex">Browse Jobs</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {all.map((q) => (
              <div key={q.id} className="card">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900">
                        {STATUS_ICONS[q.status]} Job #{q.job_id}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[q.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {q.status}
                      </span>
                    </div>

                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <div>💰 Quote: <span className="font-medium">${q.amount.toLocaleString()}</span></div>
                      {q.timeline_days && <div>⏱ Timeline: {q.timeline_days} days</div>}
                      {q.scope_notes && <div className="text-gray-500 line-clamp-2">{q.scope_notes}</div>}
                      {q.customer_message && (
                        <div className="mt-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600 italic">
                          Customer: "{q.customer_message}"
                        </div>
                      )}
                    </div>

                    <div className="mt-2 text-xs text-gray-400">
                      Submitted {formatDistanceToNow(new Date(q.created_at), { addSuffix: true })}
                    </div>
                  </div>

                  <Link
                    href={`/jobs/${q.job_id}`}
                    className="btn-outline shrink-0 text-sm"
                  >
                    View Job
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
