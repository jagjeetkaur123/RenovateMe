"use client";

import { useState } from "react";
import Link from "next/link";
import NavBar from "@/components/NavBar";

const CATEGORIES = [
  { id: "handyman", label: "General Trades / Handyman", icon: "🔧" },
  { id: "plumbing", label: "Plumbing Services", icon: "🚿" },
  { id: "electrical", label: "Electrical Services", icon: "🔌" },
  { id: "renovation", label: "Renovation & Construction", icon: "🧱" },
  { id: "carpentry", label: "Carpentry Services", icon: "🪚" },
  { id: "cabinet_making", label: "Cabinet Making & Joinery", icon: "🪑" },
  { id: "cleaning", label: "Cleaning Services", icon: "🧼" },
  { id: "painting", label: "Painting & Decorating", icon: "🎨" },
  { id: "landscaping", label: "Landscaping & Gardening", icon: "🌿" },
  { id: "tiling_flooring", label: "Tiling & Flooring", icon: "🧱" },
  { id: "security", label: "Security Services", icon: "🔐" },
  { id: "moving_transport", label: "Moving & Transport", icon: "🚛" },
  { id: "heating_cooling", label: "Heating, Cooling & Appliances", icon: "❄️" },
  { id: "specialist", label: "Specialist Trades", icon: "🧰" },
];

export default function TradesPage() {
  const [search, setSearch] = useState("");
  const [suburb, setSuburb] = useState("");

  const filtered = CATEGORIES.filter((c) =>
    c.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <main className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Find a Tradesperson</h1>
        <p className="mb-8 text-gray-500">Browse 14+ trade categories and connect with verified tradespeople.</p>

        {/* Search */}
        <div className="mb-8 flex gap-3">
          <input
            type="text"
            className="input flex-1"
            placeholder="Search trade type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input
            type="text"
            className="input w-48"
            placeholder="Suburb or postcode"
            value={suburb}
            onChange={(e) => setSuburb(e.target.value)}
          />
          <Link
            href={`/trades/search?q=${search}&suburb=${suburb}`}
            className="btn-primary px-6"
          >
            Search
          </Link>
        </div>

        {/* Categories grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((cat) => (
            <Link
              key={cat.id}
              href={`/trades/search?category=${cat.id}`}
              className="card hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{cat.icon}</span>
                <span className="font-medium text-gray-900">{cat.label}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Post job CTA */}
        <div className="mt-12 rounded-xl bg-brand-700 p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Can&apos;t find what you need?</h2>
          <p className="text-blue-100 mb-6">Post a job and let qualified tradies come to you with quotes.</p>
          <Link href="/jobs/new" className="btn bg-white text-brand-700 hover:bg-blue-50 px-8 py-3">
            Post a Job
          </Link>
        </div>
      </main>
    </div>
  );
}
