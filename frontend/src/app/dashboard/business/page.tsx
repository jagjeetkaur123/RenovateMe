"use client";

import Link from "next/link";

const businessActions = [
  { label: "Bookings", icon: "📅", href: "/dashboard/business/bookings", desc: "Manage client bookings" },
  { label: "Services", icon: "🛎️", href: "/dashboard/business/services", desc: "Update your offerings" },
  { label: "Staff", icon: "👥", href: "/dashboard/business/staff", desc: "Manage your team" },
  { label: "Analytics", icon: "📊", href: "/dashboard/business/analytics", desc: "View business growth" },
];

export default function BusinessDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-brand-600">SilverBricks Connect</Link>
          <div className="flex items-center gap-3">
            <span className="badge-green">Business</span>
            <button onClick={() => { localStorage.clear(); window.location.href = "/login"; }}
              className="btn-outline text-sm">Sign out</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Business Dashboard 🏪</h1>
        <p className="mb-8 text-gray-500">Manage bookings, services, and your business profile.</p>

        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Management Tools</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {businessActions.map((n) => (
              <Link key={n.label} href={n.href} className="card hover:shadow-md transition-shadow cursor-pointer text-left">
                <div className="text-3xl mb-3">{n.icon}</div>
                <div className="font-semibold text-gray-900">{n.label}</div>
                <div className="text-sm text-gray-500">{n.desc}</div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="card text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">✨</div>
            <p className="font-medium">Complete Business Setup</p>
            <p className="text-sm mt-1">Add your operating hours to start receiving appointments.</p>
            <Link href="/dashboard/business/profile/setup" className="btn-primary mt-6 inline-flex">
              Set up business
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}