"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import NavBar from "@/components/NavBar";

type Job = {
  id: number;
  title: string;
  description: string;
  category: string;
  suburb: string;
  state: string;
  postcode: string;
  budget_min: number | null;
  budget_max: number | null;
  urgency: string;
  status: string;
  customer_id: number;
  created_at: string;
};

type Quote = {
  id: number;
  price: number;
  description: string;
  estimated_days: number | null;
  status: string;
  tradesperson_id: number;
  created_at: string;
};

const STATUS_BADGE: Record<string, string> = {
  open: "badge-green",
  quoted: "badge-yellow",
  hired: "badge-blue",
  completed: "badge-green",
  cancelled: "badge-red",
};

const URGENCY_LABEL: Record<string, string> = {
  standard: "Standard",
  urgent: "Urgent (within 48 hrs)",
  emergency: "Emergency (ASAP)",
};

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [quoteForm, setQuoteForm] = useState({ price: "", description: "", estimated_days: "" });
  const [quoteError, setQuoteError] = useState("");
  const [showQuoteForm, setShowQuoteForm] = useState(false);

  const currentUserId =
    typeof window !== "undefined"
      ? (() => {
          try {
            const u = localStorage.getItem("user");
            return u ? JSON.parse(u).id : null;
          } catch {
            return null;
          }
        })()
      : null;

  const currentUserRole =
    typeof window !== "undefined"
      ? (() => {
          try {
            const u = localStorage.getItem("user");
            return u ? JSON.parse(u).role : null;
          } catch {
            return null;
          }
        })()
      : null;

  const { data: job, isLoading } = useQuery<Job>({
    queryKey: ["job", id],
    queryFn: () => api.get(`/jobs/${id}`).then((r) => r.data),
  });

  const { data: quotes } = useQuery<Quote[]>({
    queryKey: ["job-quotes", id],
    queryFn: () => api.get(`/quotes/job/${id}`).then((r) => r.data),
    enabled: !!job && (job.customer_id === currentUserId || currentUserRole === "admin"),
  });

  const submitQuote = useMutation({
    mutationFn: (payload: object) => api.post("/quotes", payload),
    onSuccess: () => {
      setShowQuoteForm(false);
      setQuoteForm({ price: "", description: "", estimated_days: "" });
      queryClient.invalidateQueries({ queryKey: ["job", id] });
    },
    onError: (e: any) => setQuoteError(e.response?.data?.detail ?? "Failed to submit quote"),
  });

  const respondQuote = useMutation({
    mutationFn: ({ quoteId, status }: { quoteId: number; status: string }) =>
      api.patch(`/quotes/${quoteId}/respond`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job", id] });
      queryClient.invalidateQueries({ queryKey: ["job-quotes", id] });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading job details...</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-900 mb-2">Job not found</p>
          <Link href="/jobs/browse" className="btn-primary">Browse Jobs</Link>
        </div>
      </div>
    );
  }

  const isOwner = job.customer_id === currentUserId;
  const isTradesperson = currentUserRole === "tradesperson";
  const canQuote = isTradesperson && job.status === "open";

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar rightExtra={<button onClick={() => router.back()} className="btn-ghost text-sm">Back</button>} />

      <main className="mx-auto max-w-4xl px-4 py-10 space-y-6">
        {/* Job header */}
        <div className="card">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {job.category.replace(/_/g, " ")}
                </span>
                <span className={`badge ${STATUS_BADGE[job.status] ?? "badge-blue"}`}>
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            </div>
            {job.budget_min || job.budget_max ? (
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">Budget</p>
                <p className="text-lg font-semibold text-gray-900">
                  {job.budget_min && job.budget_max
                    ? `$${job.budget_min} – $${job.budget_max}`
                    : job.budget_min
                    ? `From $${job.budget_min}`
                    : `Up to $${job.budget_max}`}
                </p>
              </div>
            ) : null}
          </div>

          <p className="text-gray-700 whitespace-pre-wrap mb-6">{job.description}</p>

          <div className="grid gap-4 sm:grid-cols-3 border-t border-gray-100 pt-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Location</p>
              <p className="text-sm font-medium text-gray-900">
                {[job.suburb, job.state, job.postcode].filter(Boolean).join(", ")}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Urgency</p>
              <p className="text-sm font-medium text-gray-900">{URGENCY_LABEL[job.urgency] ?? job.urgency}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Posted</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date(job.created_at).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
          </div>
        </div>

        {/* Submit a quote (tradesperson) */}
        {canQuote && (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Submit a Quote</h2>
            {!showQuoteForm ? (
              <button onClick={() => setShowQuoteForm(true)} className="btn-primary">
                Submit Quote
              </button>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setQuoteError("");
                  submitQuote.mutate({
                    job_id: Number(id),
                    price: parseFloat(quoteForm.price),
                    description: quoteForm.description,
                    estimated_days: quoteForm.estimated_days ? parseInt(quoteForm.estimated_days) : null,
                  });
                }}
                className="space-y-4"
              >
                {quoteError && (
                  <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{quoteError}</div>
                )}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label">Your price (AUD) *</label>
                    <input
                      className="input"
                      type="number"
                      min="1"
                      placeholder="e.g. 850"
                      value={quoteForm.price}
                      onChange={(e) => setQuoteForm((f) => ({ ...f, price: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Estimated days to complete</label>
                    <input
                      className="input"
                      type="number"
                      min="1"
                      placeholder="e.g. 3"
                      value={quoteForm.estimated_days}
                      onChange={(e) => setQuoteForm((f) => ({ ...f, estimated_days: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Your message to the customer *</label>
                  <textarea
                    className="input min-h-24"
                    placeholder="Describe your approach, experience, and why you're the right person for the job..."
                    value={quoteForm.description}
                    onChange={(e) => setQuoteForm((f) => ({ ...f, description: e.target.value }))}
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="btn-primary" disabled={submitQuote.isPending}>
                    {submitQuote.isPending ? "Submitting..." : "Submit Quote"}
                  </button>
                  <button type="button" onClick={() => setShowQuoteForm(false)} className="btn-outline">
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Quotes received (job owner) */}
        {isOwner && quotes && quotes.length > 0 && (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Quotes Received ({quotes.length})
            </h2>
            <div className="space-y-4">
              {quotes.map((q) => (
                <div key={q.id} className="rounded-lg border border-gray-200 p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">${q.price.toLocaleString()}</p>
                      {q.estimated_days && (
                        <p className="text-sm text-gray-500">{q.estimated_days} day{q.estimated_days !== 1 ? "s" : ""} estimated</p>
                      )}
                    </div>
                    <span
                      className={`badge ${
                        q.status === "accepted" ? "badge-green" :
                        q.status === "declined" ? "badge-red" :
                        "badge-yellow"
                      }`}
                    >
                      {q.status.charAt(0).toUpperCase() + q.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm mb-4">{q.description}</p>
                  {q.status === "pending" && job.status !== "hired" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => respondQuote.mutate({ quoteId: q.id, status: "accepted" })}
                        className="btn-primary text-sm"
                        disabled={respondQuote.isPending}
                      >
                        Accept Quote
                      </button>
                      <button
                        onClick={() => respondQuote.mutate({ quoteId: q.id, status: "declined" })}
                        className="btn-outline text-sm"
                        disabled={respondQuote.isPending}
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {isOwner && quotes && quotes.length === 0 && (
          <div className="card text-center py-8">
            <p className="text-gray-500 mb-2">No quotes received yet</p>
            <p className="text-sm text-gray-400">Tradies will see your job and submit quotes soon.</p>
          </div>
        )}
      </main>
    </div>
  );
}
