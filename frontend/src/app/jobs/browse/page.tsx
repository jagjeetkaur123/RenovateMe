"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getOpenJobs } from "@/lib/jobs";
import { formatDistanceToNow } from "date-fns";

const CATEGORIES = [
  "All", "Plumbing", "Electrical", "Carpentry", "Painting", "Tiling",
  "Landscaping", "Cleaning", "HVAC", "Roofing", "Concreting", "Other",
];

const URGENCY_COLORS: Record<string, string> = {
  urgent: "bg-red-100 text-red-700",
  standard: "bg-blue-100 text-blue-700",
  flexible: "bg-gray-100 text-gray-600",
};

export default function BrowseJobsPage() {
  const [category, setCategory] = useState("All");
  const [suburb, setSuburb] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["open-jobs", category, suburb, page],
    queryFn: () =>
      getOpenJobs({
        category: category === "All" ? undefined : category,
        suburb: suburb || undefined,
        page,
        size: 10,
      }),
  });

  const jobs = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / 10);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-brand-600">SilverBricks Connect</Link>
          <Link href="/dashboard/provider" className="btn-ghost text-sm">Dashboard</Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Browse Jobs</h1>
        <p className="mb-8 text-gray-500">{total} open {total === 1 ? "job" : "jobs"} available</p>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Filter by suburb..."
            value={suburb}
            onChange={(e) => { setSuburb(e.target.value); setPage(1); }}
            className="input w-48"
          />
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => { setCategory(c); setPage(1); }}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  category === c
                    ? "bg-brand-600 text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-brand-400"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Job list */}
        {isLoading ? (
          <div className="card py-12 text-center text-gray-400">Loading jobs…</div>
        ) : jobs.length === 0 ? (
          <div className="card py-16 text-center text-gray-400">
            <div className="text-4xl mb-3">🔍</div>
            <p className="font-medium">No jobs found</p>
            <p className="text-sm mt-1">Try a different category or suburb.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="card hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{job.title}</h3>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${URGENCY_COLORS[job.urgency] ?? ""}`}>
                        {job.urgency}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{job.description}</p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
                      <span>📍 {job.suburb ?? job.state ?? "Remote"}</span>
                      <span>🏷️ {job.category}</span>
                      {job.budget_max && <span>💰 Up to ${job.budget_max.toLocaleString()}</span>}
                      {job.preferred_date && (
                        <span>📅 Needed by {new Date(job.preferred_date).toLocaleDateString("en-AU")}</span>
                      )}
                      <span>🕒 {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}</span>
                    </div>
                  </div>
                  <Link
                    href={`/jobs/${job.id}`}
                    className="btn-primary shrink-0 text-sm"
                  >
                    View &amp; Quote
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-outline text-sm disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="btn-outline text-sm disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
