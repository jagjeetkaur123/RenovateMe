"use client";

import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

type Job = {
  id: number;
  title: string;
  category: string;
  suburb: string;
  status: string;
  urgency: string;
  created_at: string;
  budget_min: number | null;
  budget_max: number | null;
};

const STATUS_BADGE: Record<string, string> = {
  open: "badge-green",
  quoted: "badge-yellow",
  hired: "badge-blue",
  completed: "badge-green",
  cancelled: "badge-red",
};

export default function CustomerJobsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<{ items: Job[]; total: number }>({
    queryKey: ["my-jobs"],
    queryFn: () => api.get("/jobs/my").then((r) => r.data),
  });

  const cancelJob = useMutation({
    mutationFn: (jobId: number) => api.delete(`/jobs/${jobId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-jobs"] }),
  });

  const jobs = data?.items ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-brand-600">SilverBricks Connect</Link>
          <div className="flex gap-3">
            <Link href="/dashboard/customer" className="btn-ghost text-sm">Dashboard</Link>
            <Link href="/jobs/new" className="btn-primary text-sm">Post a Job</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Jobs</h1>
          <Link href="/jobs/new" className="btn-primary text-sm">+ Post New Job</Link>
        </div>

        {isLoading ? (
          <div className="card text-center py-12 text-gray-500">Loading your jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 mb-4">You haven&apos;t posted any jobs yet.</p>
            <Link href="/jobs/new" className="btn-primary">Post Your First Job</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="card">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-500 uppercase tracking-wide">
                        {job.category.replace(/_/g, " ")}
                      </span>
                      <span className={`badge ${STATUS_BADGE[job.status] ?? "badge-blue"}`}>
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </span>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">{job.title}</h2>
                    <p className="text-sm text-gray-500 mt-1">{job.suburb}</p>
                  </div>
                  <div className="text-right">
                    {(job.budget_min || job.budget_max) && (
                      <p className="text-sm font-medium text-gray-900">
                        {job.budget_min && job.budget_max
                          ? `$${job.budget_min} – $${job.budget_max}`
                          : `$${job.budget_min ?? job.budget_max}`}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(job.created_at).toLocaleDateString("en-AU", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 border-t border-gray-100 pt-4">
                  <Link href={`/jobs/${job.id}`} className="btn-outline text-sm">
                    View Details & Quotes
                  </Link>
                  {job.status === "open" && (
                    <button
                      onClick={() => {
                        if (confirm("Cancel this job?")) cancelJob.mutate(job.id);
                      }}
                      className="btn-ghost text-sm text-red-600 hover:bg-red-50"
                    >
                      Cancel Job
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
