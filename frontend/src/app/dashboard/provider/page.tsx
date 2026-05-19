"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "@/lib/auth";
import { getOpenJobs } from "@/lib/jobs";
import { getMyQuotes } from "@/lib/quotes";
import { formatDistanceToNow } from "date-fns";

const providerActions = [
  { label: "Find Jobs", icon: "🔍", href: "/jobs/browse", desc: "View leads in your area" },
  { label: "Active Bids", icon: "📄", href: "/dashboard/provider/bids", desc: "Check your proposals" },
  { label: "My Calendar", icon: "📅", href: "/dashboard/provider/calendar", desc: "Manage appointments" },
  { label: "Earnings", icon: "💰", href: "/dashboard/provider/earnings", desc: "Payments & payouts" },
];

const URGENCY_COLORS: Record<string, string> = {
  urgent: "bg-red-100 text-red-700",
  standard: "bg-blue-100 text-blue-700",
  flexible: "bg-gray-100 text-gray-600",
};

const QUOTE_STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  accepted: "bg-green-100 text-green-700",
  declined: "bg-red-100 text-red-600",
  expired: "bg-gray-100 text-gray-500",
};

export default function ProviderDashboard() {
  const router = useRouter();

  const { data: user, isError: userError } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
  });

  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ["open-jobs"],
    queryFn: () => getOpenJobs({ size: 5 }),
    enabled: !!user,
  });

  const { data: quotes, isLoading: quotesLoading } = useQuery({
    queryKey: ["my-quotes"],
    queryFn: getMyQuotes,
    enabled: !!user,
  });

  useEffect(() => {
    if (userError) router.replace("/login");
  }, [userError, router]);

  const openJobs = jobsData?.items ?? [];
  const activeQuotes = (quotes ?? []).filter((q) => q.status === "pending");
  const acceptedQuotes = (quotes ?? []).filter((q) => q.status === "accepted");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-brand-600">SilverBricks Connect</Link>
          <div className="flex items-center gap-3">
            <span className="badge-blue">Provider</span>
            <button
              onClick={() => { localStorage.clear(); router.replace("/login"); }}
              className="btn-outline text-sm"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          {user ? `Welcome back, ${user.name.split(" ")[0]}!` : "Partner Portal"}
        </h1>
        <p className="mb-8 text-gray-500">Manage your work and grow your professional profile.</p>

        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Work Tools</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {providerActions.map((a) => (
              <Link key={a.label} href={a.href}
                className="card hover:shadow-md transition-shadow cursor-pointer text-left">
                <div className="mb-3 text-3xl">{a.icon}</div>
                <div className="font-semibold text-gray-900">{a.label}</div>
                <div className="text-sm text-gray-500">{a.desc}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="mb-10 grid grid-cols-3 gap-4">
          <div className="card text-center">
            <div className="text-3xl font-bold text-brand-600">{jobsData?.total ?? "—"}</div>
            <div className="text-sm text-gray-500 mt-1">Open Jobs</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-brand-600">{activeQuotes.length}</div>
            <div className="text-sm text-gray-500 mt-1">Active Bids</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-brand-600">{acceptedQuotes.length}</div>
            <div className="text-sm text-gray-500 mt-1">Won Jobs</div>
          </div>
        </section>

        {/* Available jobs */}
        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Available Opportunities</h2>
            <Link href="/jobs/browse" className="text-sm text-brand-600 hover:underline">Browse all</Link>
          </div>

          {jobsLoading ? (
            <div className="card py-8 text-center text-gray-400">Loading jobs…</div>
          ) : openJobs.length === 0 ? (
            <div className="card text-center py-12 text-gray-400">
              <div className="text-4xl mb-3">📡</div>
              <p className="font-medium">No open jobs right now</p>
              <p className="text-sm mt-1">Make sure your skills are updated to see relevant jobs.</p>
              <Link href="/dashboard/provider/skills" className="btn-primary mt-6 inline-flex">Update Skills</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {openJobs.map((job) => (
                <div key={job.id} className="card flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-900">{job.title}</div>
                    <div className="text-sm text-gray-500 mt-0.5 line-clamp-1">{job.description}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {job.suburb ?? job.state ?? "Remote"} &middot;{" "}
                      {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                      {job.budget_max ? ` · Up to $${job.budget_max}` : ""}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`rounded-full px-3 py-0.5 text-xs font-medium capitalize ${URGENCY_COLORS[job.urgency] ?? "bg-gray-100 text-gray-600"}`}>
                      {job.urgency}
                    </span>
                    <Link href={`/jobs/${job.id}`} className="text-xs text-brand-600 hover:underline">
                      View &amp; Quote
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recent bids */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Recent Bids</h2>
            <Link href="/dashboard/provider/bids" className="text-sm text-brand-600 hover:underline">View all</Link>
          </div>

          {quotesLoading ? (
            <div className="card py-8 text-center text-gray-400">Loading bids…</div>
          ) : (quotes ?? []).length === 0 ? (
            <div className="card text-center py-10 text-gray-400">
              <p className="font-medium">No bids submitted yet</p>
              <p className="text-sm mt-1">Find a job above and submit your first quote.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {(quotes ?? []).slice(0, 5).map((q) => (
                <div key={q.id} className="card flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900">Job #{q.job_id}</div>
                    <div className="text-sm text-gray-500">${q.amount.toLocaleString()}{q.timeline_days ? ` · ${q.timeline_days} days` : ""}</div>
                  </div>
                  <span className={`shrink-0 rounded-full px-3 py-0.5 text-xs font-medium capitalize ${QUOTE_STATUS_COLORS[q.status] ?? "bg-gray-100 text-gray-600"}`}>
                    {q.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
