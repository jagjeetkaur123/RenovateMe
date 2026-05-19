"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyBookings, cancelBooking, type BookingStatus } from "@/lib/bookings";

const STATUS_TABS: { label: string; value: BookingStatus | undefined }[] = [
  { label: "All", value: undefined },
  { label: "Upcoming", value: "confirmed" },
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
  no_show: "bg-gray-100 text-gray-500",
};

export default function CustomerBookingsPage() {
  const [activeStatus, setActiveStatus] = useState<BookingStatus | undefined>(undefined);
  const queryClient = useQueryClient();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["my-bookings", activeStatus],
    queryFn: () => getMyBookings(activeStatus),
  });

  const { mutate: cancel, isPending: cancelling } = useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-bookings"] }),
  });

  const items = bookings ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-brand-600">SilverBricks Connect</Link>
          <Link href="/dashboard/customer" className="btn-ghost text-sm">Dashboard</Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">My Bookings</h1>

        {/* Status tabs */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveStatus(tab.value)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeStatus === tab.value
                  ? "bg-brand-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-brand-400"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="card py-12 text-center text-gray-400">Loading bookings…</div>
        ) : items.length === 0 ? (
          <div className="card py-16 text-center text-gray-400">
            <div className="text-4xl mb-3">📭</div>
            <p className="font-medium">No bookings found</p>
            <p className="text-sm mt-1">Your bookings will appear here once you make one.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((b) => {
              const isPast = new Date(b.slot_datetime) < new Date();
              const canCancel = !isPast && b.status !== "cancelled" && b.status !== "completed";
              return (
                <div key={b.id} className="card">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-900">Booking #{b.id}</span>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[b.status] ?? "bg-gray-100 text-gray-600"}`}>
                          {b.status.replace("_", " ")}
                        </span>
                      </div>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <div>
                          📅 {new Date(b.slot_datetime).toLocaleString("en-AU", {
                            weekday: "short",
                            dateStyle: "long",
                            timeStyle: "short",
                          })}
                        </div>
                        <div>⏱ {b.duration_minutes} minutes</div>
                        {b.price && <div>💰 ${b.price.toLocaleString()}</div>}
                        {b.customer_notes && <div className="text-gray-500 italic">"{b.customer_notes}"</div>}
                      </div>
                    </div>
                    {canCancel && (
                      <button
                        onClick={() => cancel(b.id)}
                        disabled={cancelling}
                        className="btn-outline text-sm text-red-600 border-red-200 hover:bg-red-50 shrink-0 disabled:opacity-40"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
