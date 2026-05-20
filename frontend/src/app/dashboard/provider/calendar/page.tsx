"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

type Quote = { id: number; price: number; status: string; job_id: number; created_at: string };

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export default function ProviderCalendarPage() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const { data: quotes = [] } = useQuery<Quote[]>({
    queryKey: ["my-quotes"],
    queryFn: () => api.get("/quotes/my").then((r) => r.data),
  });

  const activeJobs = quotes.filter((q) => q.status === "accepted");

  const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-brand-600">SilverBricks Connect</Link>
          <Link href="/dashboard/provider" className="btn-ghost text-sm">Dashboard</Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Calendar</h1>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Calendar widget */}
          <div className="lg:col-span-2 card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">{MONTH_NAMES[month]} {year}</h2>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAY_NAMES.map((d) => (
                <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isToday = day === now.getDate();
                return (
                  <div
                    key={day}
                    className={`aspect-square flex items-center justify-center text-sm rounded-lg ${
                      isToday
                        ? "bg-brand-600 text-white font-semibold"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active jobs sidebar */}
          <div className="card">
            <h2 className="font-semibold text-gray-900 mb-4">Active Jobs ({activeJobs.length})</h2>
            {activeJobs.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-gray-500 mb-3">No active jobs yet.</p>
                <Link href="/jobs/browse" className="btn-primary text-sm">Find Jobs</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {activeJobs.map((q) => (
                  <div key={q.id} className="rounded-lg border border-green-200 bg-green-50 p-3">
                    <Link href={`/jobs/${q.job_id}`} className="text-sm font-medium text-green-800 hover:underline">
                      Job #{q.job_id}
                    </Link>
                    <p className="text-xs text-green-600 mt-1">Quote accepted · ${q.price}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card mt-6">
          <p className="text-sm text-gray-500 text-center">
            Full calendar scheduling with time slots will be available in the next update.
            Currently showing your accepted jobs above.
          </p>
        </div>
      </main>
    </div>
  );
}
