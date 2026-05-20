"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

type Booking = {
  id: number;
  customer_id: number;
  slot_datetime: string;
  duration_minutes: number;
  status: string;
  price: number | null;
  customer_notes: string | null;
};

const TABS = ["all", "pending", "confirmed", "completed", "cancelled"];

const STATUS_BADGE: Record<string, string> = {
  pending: "badge-yellow",
  confirmed: "badge-blue",
  completed: "badge-green",
  cancelled: "badge-red",
};

export default function BusinessBookingsPage() {
  const [activeTab, setActiveTab] = useState("all");

  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ["business-bookings"],
    queryFn: () => api.get("/bookings/my").then((r) => r.data),
  });

  const filtered = activeTab === "all" ? bookings : bookings.filter((b) => b.status === activeTab);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-brand-600">SilverBricks Connect</Link>
          <Link href="/dashboard/business" className="btn-ghost text-sm">Dashboard</Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Bookings</h1>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-gray-200">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-brand-600 text-brand-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab !== "all" && (
                <span className="ml-1 text-xs text-gray-400">
                  ({bookings.filter((b) => b.status === tab).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="card text-center py-12 text-gray-500">Loading bookings...</div>
        ) : filtered.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500">No {activeTab === "all" ? "" : activeTab} bookings found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((b) => (
              <div key={b.id} className="card flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`badge ${STATUS_BADGE[b.status] ?? "badge-blue"}`}>
                      {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500">Booking #{b.id}</span>
                  </div>
                  <p className="font-medium text-gray-900">
                    {new Date(b.slot_datetime).toLocaleDateString("en-AU", {
                      weekday: "short", day: "numeric", month: "short", year: "numeric",
                    })}
                    {" "}at{" "}
                    {new Date(b.slot_datetime).toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                  <p className="text-sm text-gray-500">{b.duration_minutes} min session</p>
                  {b.customer_notes && <p className="text-sm text-gray-500 mt-1 italic">&ldquo;{b.customer_notes}&rdquo;</p>}
                </div>
                <div className="text-right">
                  {b.price && <p className="font-semibold text-gray-900">${b.price}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
