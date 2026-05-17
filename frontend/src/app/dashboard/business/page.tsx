"use client";

import Link from "next/link";

export default function BusinessDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-brand-600">SilverBricks Connect</Link>
          <span className="badge-green">Business</span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="mb-2 text-2xl font-bold">Business Dashboard</h1>
        <p className="mb-8 text-gray-500">Manage bookings, services, and your business profile.</p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          {[
            { label: "Bookings", icon: "📅", href: "/dashboard/business/bookings" },
            { label: "Services", icon: "🛎️", href: "/dashboard/business/services" },
            { label: "Staff", icon: "👥", href: "/dashboard/business/staff" },
            { label: "Analytics", icon: "📊", href: "/dashboard/business/analytics" },
          ].map((n) => (
            <Link key={n.label} href={n.href} className="card hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">{n.icon}</div>
              <div className="font-semibold">{n.label}</div>
            </Link>
          ))}
        </div>

        <div className="card text-center py-12 text-gray-400">
          <div className="text-4xl mb-3">🏪</div>
          <p className="font-medium">Set up your business profile</p>
          <p className="text-sm mt-1">Add your services and availability to start receiving bookings.</p>
          <Link href="/dashboard/business/profile/setup" className="btn-primary mt-6 inline-flex">
            Set up business
          </Link>
        </div>
      </main>
    </div>
  );
}
