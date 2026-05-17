"use client";

import Link from "next/link";

const quickActions = [
  { label: "Post a Job", icon: "📋", href: "/jobs/new", desc: "Get quotes from tradespeople" },
  { label: "Hire Now", icon: "⚡", href: "/hire", desc: "Book instantly" },
  { label: "Book Appointment", icon: "📅", href: "/book", desc: "Salons, doctors & more" },
  { label: "My Bookings", icon: "🗓️", href: "/dashboard/customer/bookings", desc: "View all bookings" },
];

export default function CustomerDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-brand-600">SilverBricks Connect</Link>
          <div className="flex items-center gap-3">
            <Link href="/profile" className="btn-ghost text-sm">Profile</Link>
            <button onClick={() => { localStorage.clear(); window.location.href = "/login"; }}
              className="btn-outline text-sm">Sign out</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Good day! 👋</h1>
        <p className="mb-8 text-gray-500">What can we help you with today?</p>

        {/* Quick actions */}
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

        {/* Recent activity placeholder */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Recent Activity</h2>
          <div className="card text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">📭</div>
            <p className="font-medium">No activity yet</p>
            <p className="text-sm mt-1">Post a job or make a booking to get started.</p>
            <Link href="/jobs/new" className="btn-primary mt-6 inline-flex">Post your first job</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
