"use client";

import Link from "next/link";

const navItems = [
  { label: "Job Leads", href: "/dashboard/provider/leads", icon: "📥" },
  { label: "My Quotes", href: "/dashboard/provider/quotes", icon: "💬" },
  { label: "Schedule", href: "/dashboard/provider/schedule", icon: "🗓️" },
  { label: "Profile", href: "/dashboard/provider/profile", icon: "👤" },
];

export default function ProviderDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-brand-600">SilverBricks Connect</Link>
          <span className="badge-blue">Tradesperson</span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="mb-2 text-2xl font-bold">Provider Dashboard</h1>
        <p className="mb-8 text-gray-500">Manage your leads, quotes, and schedule.</p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          {navItems.map((n) => (
            <Link key={n.label} href={n.href}
              className="card hover:shadow-md transition-shadow cursor-pointer">
              <div className="text-3xl mb-3">{n.icon}</div>
              <div className="font-semibold">{n.label}</div>
            </Link>
          ))}
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3 mb-10">
          {[
            { label: "Active Leads", value: "0", color: "text-blue-600" },
            { label: "Quotes Sent", value: "0", color: "text-green-600" },
            { label: "Jobs Completed", value: "0", color: "text-gold-500" },
          ].map((s) => (
            <div key={s.label} className="card text-center">
              <div className={`text-4xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="card text-center py-12 text-gray-400">
          <div className="text-4xl mb-3">📋</div>
          <p className="font-medium">No job leads yet</p>
          <p className="text-sm mt-1">
            Complete your profile to start receiving job requests.
          </p>
          <Link href="/dashboard/provider/profile" className="btn-primary mt-6 inline-flex">
            Set up your profile
          </Link>
        </div>
      </main>
    </div>
  );
}
