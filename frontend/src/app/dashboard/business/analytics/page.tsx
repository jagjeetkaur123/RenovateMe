"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

type Booking = { id: number; status: string; price: number | null; slot_datetime: string };

export default function BusinessAnalyticsPage() {
  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ["business-analytics-bookings"],
    queryFn: () => api.get("/bookings/my").then((r) => r.data),
  });

  const total = bookings.length;
  const completed = bookings.filter((b) => b.status === "completed").length;
  const pending = bookings.filter((b) => b.status === "pending").length;
  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
  const cancelled = bookings.filter((b) => b.status === "cancelled").length;
  const revenue = bookings
    .filter((b) => b.status === "completed" && b.price)
    .reduce((sum, b) => sum + (b.price ?? 0), 0);

  const conversionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const now = new Date();
  const thisMonthBookings = bookings.filter((b) => {
    const d = new Date(b.slot_datetime);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const monthRevenue = thisMonthBookings
    .filter((b) => b.status === "completed" && b.price)
    .reduce((sum, b) => sum + (b.price ?? 0), 0);

  const stats = [
    { label: "Total Bookings", value: total, color: "bg-blue-50 text-blue-700" },
    { label: "Completed", value: completed, color: "bg-green-50 text-green-700" },
    { label: "Pending", value: pending, color: "bg-yellow-50 text-yellow-700" },
    { label: "Cancelled", value: cancelled, color: "bg-red-50 text-red-700" },
    { label: "Total Revenue", value: `$${revenue.toLocaleString()}`, color: "bg-purple-50 text-purple-700" },
    { label: "This Month Revenue", value: `$${monthRevenue.toLocaleString()}`, color: "bg-indigo-50 text-indigo-700" },
    { label: "Completion Rate", value: `${conversionRate}%`, color: "bg-teal-50 text-teal-700" },
    { label: "Confirmed (upcoming)", value: confirmed, color: "bg-cyan-50 text-cyan-700" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-brand-600">SilverBricks Connect</Link>
          <Link href="/dashboard/business" className="btn-ghost text-sm">Dashboard</Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h1>

        {isLoading ? (
          <div className="card text-center py-12 text-gray-500">Loading analytics...</div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
              {stats.map((s) => (
                <div key={s.label} className="card text-center">
                  <p className={`text-2xl font-bold rounded-lg px-3 py-1 inline-block mb-2 ${s.color}`}>{s.value}</p>
                  <p className="text-sm text-gray-500">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="card">
              <h2 className="font-semibold text-gray-900 mb-4">Recent Bookings</h2>
              {bookings.length === 0 ? (
                <p className="text-gray-500 text-sm">No bookings yet.</p>
              ) : (
                <div className="space-y-2">
                  {bookings.slice(0, 10).map((b) => (
                    <div key={b.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(b.slot_datetime).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                        <span className={`badge mt-1 ${
                          b.status === "completed" ? "badge-green" :
                          b.status === "confirmed" ? "badge-blue" :
                          b.status === "pending" ? "badge-yellow" : "badge-red"
                        }`}>
                          {b.status}
                        </span>
                      </div>
                      {b.price && <p className="font-medium text-gray-900">${b.price}</p>}
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
