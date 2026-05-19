"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/lib/auth";
import { getMyJobs } from "@/lib/jobs";
import { getMyBookings } from "@/lib/bookings";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

const quickActions = [
  { label: "Post a Job", icon: "📋", href: "/jobs/new", desc: "Get quotes from tradespeople" },
  { label: "Browse Trades", icon: "⚡", href: "/trades", desc: "Find skilled professionals" },
  { label: "My Bookings", icon: "📅", href: "/dashboard/customer/bookings", desc: "View all bookings" },
  { label: "My Jobs", icon: "🗓️", href: "/dashboard/customer/jobs", desc: "Track your job posts" },
];

const STATUS_COLORS: Record<string, string> = {
  open: "bg-green-100 text-green-700",
  quoted: "bg-blue-100 text-blue-700",
  hired: "bg-purple-100 text-purple-700",
  completed: "bg-gray-100 text-gray-600",
  cancelled: "bg-red-100 text-red-600",
};

export default function CustomerDashboard() {
  const router = useRouter();

  const { data: user, isError: userError } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
  });

  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ["my-jobs"],
    queryFn: () => getMyJobs(1, 5),
    enabled: !!user,
  });

  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: () => getMyBookings(),
    enabled: !!user,
  });

  useEffect(() => {
    if (userError) router.replace("/login");
  }, [userError, router]);

  const recentJobs = jobsData?.items ?? [];
  const upcomingBookings = (bookings ?? []).filter(
    (b) => b.status === "pending" || b.status === "confirmed"
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-brand-600">SilverBricks Connect</Link>
          <div className="flex items-center gap-3">
            <Link href="/profile" className="btn-ghost text-sm">Profile</Link>
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
          {user ? `Good day, ${user.name.split(" ")[0]}!` : "Good day!"}
        </h1>
        <p className="mb-8 text-gray-500">What can we help you with today?</p>

        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Quick Actions</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((a) => (
              <Link key={a.label} href={a.href}
                className="card hover:shadow-md transition-shadow cursor-pointer text-left">
                <div className="mb-3 text-3xl">{a.icon}</div>
                <div className="font-semibold text-gray-900">{a.label}</div>
                <div className="text-sm text-gray-500">{a.desc}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* Stats row */}
        <section className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="card text-center">
            <div className="text-3xl font-bold text-brand-600">{jobsData?.total ?? "—"}</div>
            <div className="text-sm text-gray-500 mt-1">Jobs Posted</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-brand-600">{upcomingBookings.length}</div>
            <div className="text-sm text-gray-500 mt-1">Upcoming Bookings</div>
          </div>
          <div className="card text-center col-span-2 sm:col-span-1">
            <div className="text-3xl font-bold text-brand-600">
              {recentJobs.filter((j) => j.status === "quoted").length}
            </div>
            <div className="text-sm text-gray-500 mt-1">Awaiting Quotes</div>
          </div>
        </section>

        {/* Recent jobs */}
        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Recent Jobs</h2>
            <Link href="/jobs/new" className="text-sm text-brand-600 hover:underline">+ Post new</Link>
          </div>

          {jobsLoading ? (
            <div className="card py-8 text-center text-gray-400">Loading jobs…</div>
          ) : recentJobs.length === 0 ? (
            <div className="card text-center py-12 text-gray-400">
              <div className="text-4xl mb-3">📭</div>
              <p className="font-medium">No jobs yet</p>
              <p className="text-sm mt-1">Post a job to start getting quotes.</p>
              <Link href="/jobs/new" className="btn-primary mt-6 inline-flex">Post your first job</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentJobs.map((job) => (
                <div key={job.id} className="card flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 truncate">{job.title}</div>
                    <div className="text-sm text-gray-500">
                      {job.suburb ?? job.state ?? "Remote"} &middot;{" "}
                      {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                    </div>
                  </div>
                  <span className={`shrink-0 rounded-full px-3 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[job.status] ?? "bg-gray-100 text-gray-600"}`}>
                    {job.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Upcoming bookings */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Upcoming Bookings</h2>
            <Link href="/dashboard/customer/bookings" className="text-sm text-brand-600 hover:underline">View all</Link>
          </div>

          {bookingsLoading ? (
            <div className="card py-8 text-center text-gray-400">Loading bookings…</div>
          ) : upcomingBookings.length === 0 ? (
            <div className="card text-center py-10 text-gray-400">
              <p className="font-medium">No upcoming bookings</p>
              <p className="text-sm mt-1">Book a service to see it here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingBookings.map((b) => (
                <div key={b.id} className="card flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900">
                      Booking #{b.id}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(b.slot_datetime).toLocaleString("en-AU", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                      {b.price ? ` · $${b.price}` : ""}
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-blue-100 px-3 py-0.5 text-xs font-medium capitalize text-blue-700">
                    {b.status}
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
