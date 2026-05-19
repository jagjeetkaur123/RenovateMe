"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "@/lib/auth";
import { getMyBookings } from "@/lib/bookings";
import { formatDistanceToNow } from "date-fns";

const businessActions = [
  { label: "Bookings", icon: "📅", href: "/dashboard/business/bookings", desc: "Manage client bookings" },
  { label: "Services", icon: "🛎️", href: "/dashboard/business/services", desc: "Update your offerings" },
  { label: "Staff", icon: "👥", href: "/dashboard/business/staff", desc: "Manage your team" },
  { label: "Analytics", icon: "📊", href: "/dashboard/business/analytics", desc: "View business growth" },
];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
  no_show: "bg-gray-100 text-gray-500",
};

export default function BusinessDashboard() {
  const router = useRouter();

  const { data: user, isError: userError } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
  });

  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: () => getMyBookings(),
    enabled: !!user,
  });

  useEffect(() => {
    if (userError) router.replace("/login");
  }, [userError, router]);

  const allBookings = bookings ?? [];
  const upcoming = allBookings.filter(
    (b) => (b.status === "pending" || b.status === "confirmed") && new Date(b.slot_datetime) > new Date()
  );
  const todayBookings = allBookings.filter((b) => {
    const d = new Date(b.slot_datetime);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-brand-600">SilverBricks Connect</Link>
          <div className="flex items-center gap-3">
            <span className="badge-green">Business</span>
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
          {user ? `${user.name}'s Dashboard` : "Business Dashboard"}
        </h1>
        <p className="mb-8 text-gray-500">Manage bookings, services, and your business profile.</p>

        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Management Tools</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {businessActions.map((n) => (
              <Link key={n.label} href={n.href}
                className="card hover:shadow-md transition-shadow cursor-pointer text-left">
                <div className="text-3xl mb-3">{n.icon}</div>
                <div className="font-semibold text-gray-900">{n.label}</div>
                <div className="text-sm text-gray-500">{n.desc}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="mb-10 grid grid-cols-3 gap-4">
          <div className="card text-center">
            <div className="text-3xl font-bold text-brand-600">{todayBookings.length}</div>
            <div className="text-sm text-gray-500 mt-1">Today</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-brand-600">{upcoming.length}</div>
            <div className="text-sm text-gray-500 mt-1">Upcoming</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-brand-600">{allBookings.length}</div>
            <div className="text-sm text-gray-500 mt-1">Total</div>
          </div>
        </section>

        {/* Recent bookings */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Recent Bookings</h2>
            <Link href="/dashboard/business/bookings" className="text-sm text-brand-600 hover:underline">View all</Link>
          </div>

          {bookingsLoading ? (
            <div className="card py-8 text-center text-gray-400">Loading bookings…</div>
          ) : allBookings.length === 0 ? (
            <div className="card text-center py-12 text-gray-400">
              <div className="text-4xl mb-3">✨</div>
              <p className="font-medium">No bookings yet</p>
              <p className="text-sm mt-1">Add your services so customers can book you.</p>
              <Link href="/dashboard/business/services" className="btn-primary mt-6 inline-flex">
                Add Services
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {allBookings.slice(0, 6).map((b) => (
                <div key={b.id} className="card flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900">Booking #{b.id}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(b.slot_datetime).toLocaleString("en-AU", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                      {b.price ? ` · $${b.price}` : ""}
                      {" · "}
                      {formatDistanceToNow(new Date(b.created_at), { addSuffix: true })}
                    </div>
                  </div>
                  <span className={`shrink-0 rounded-full px-3 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[b.status] ?? "bg-gray-100 text-gray-600"}`}>
                    {b.status.replace("_", " ")}
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
