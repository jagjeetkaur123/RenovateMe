"use client";

import Link from "next/link";

const providerActions = [
  { label: "Find Jobs", icon: "🔍", href: "/jobs/browse", desc: "View leads in your area" },
  { label: "Active Bids", icon: "📄", href: "/dashboard/provider/bids", desc: "Check your proposals" },
  { label: "My Calendar", icon: "📅", href: "/dashboard/provider/calendar", desc: "Manage appointments" },
  { label: "Earnings", icon: "💰", href: "/dashboard/provider/earnings", desc: "Payments & payouts" },
];

export default function ProviderDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-brand-600">SilverBricks Connect</Link>
          <div className="flex items-center gap-3">
            <span className="badge-blue">Provider</span>
            <button onClick={() => { localStorage.clear(); window.location.href = "/login"; }}
              className="btn-outline text-sm">Sign out</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Partner Portal ⚒️</h1>
        <p className="mb-8 text-gray-500">Manage your work and grow your professional profile.</p>

        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Work Tools</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {providerActions.map((a) => (
              <Link key={a.label} href={a.href}
                className="card hover:shadow-md transition-shadow cursor-pointer text-left">
                <div className="mb-3 text-3xl">{a.icon}</div>
                <div className="font-semibold text-gray-900">{a.label}</div>
                <div className="text-sm text-gray-500">{a.desc}</div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Available Opportunities</h2>
          <div className="card text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">📡</div>
            <p className="font-medium">Searching for new leads...</p>
            <p className="text-sm mt-1">Make sure your skills are updated to see relevant jobs.</p>
            <Link href="/dashboard/provider/skills" className="btn-primary mt-6 inline-flex">Update Skills</Link>
          </div>
        </section>
      </main>
    </div>
  );
}