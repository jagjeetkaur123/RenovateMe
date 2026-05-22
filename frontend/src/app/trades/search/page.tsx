"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import NavBar from "@/components/NavBar";

const CATEGORY_LABELS: Record<string, string> = {
  handyman: "General Trades / Handyman",
  plumbing: "Plumbing Services",
  electrical: "Electrical Services",
  renovation: "Renovation & Construction",
  carpentry: "Carpentry Services",
  cabinet_making: "Cabinet Making & Joinery",
  cleaning: "Cleaning Services",
  painting: "Painting & Decorating",
  landscaping: "Landscaping & Gardening",
  tiling_flooring: "Tiling & Flooring",
  security: "Security Services",
  moving_transport: "Moving & Transport",
  heating_cooling: "Heating, Cooling & Appliances",
  specialist: "Specialist Trades",
};

interface TradespersonProfile {
  id: number;
  user_id: number;
  bio: string | null;
  categories: string[];
  specialties: string[];
  suburb: string | null;
  state: string | null;
  rating: number;
  trust_score: number;
  total_jobs: number;
  is_available: boolean;
  hire_now_enabled: boolean;
  verification_status: string;
}

async function fetchTradespeople(category: string, suburb: string) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (suburb) params.set("suburb", suburb);
  const { data } = await api.get<TradespersonProfile[]>(`/tradespeople?${params}`);
  return data;
}

import { Suspense } from "react";

function TradesSearchContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "";
  const initialSuburb = searchParams.get("suburb") ?? "";

  const [suburb, setSuburb] = useState(initialSuburb);
  const [suburbInput, setSuburbInput] = useState(initialSuburb);

  const { data: results, isLoading } = useQuery({
    queryKey: ["tradespeople", initialCategory, suburb],
    queryFn: () => fetchTradespeople(initialCategory, suburb),
  });

  const categoryLabel = CATEGORY_LABELS[initialCategory] ?? "All Trades";

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/trades" className="hover:underline">Trades</Link>
          <span>/</span>
          <span>{categoryLabel}</span>
        </div>

        <h1 className="mb-6 text-3xl font-bold text-gray-900">{categoryLabel}</h1>

        {/* Search bar */}
        <div className="mb-8 flex gap-3">
          <input
            type="text"
            className="input w-56"
            placeholder="Suburb or postcode"
            value={suburbInput}
            onChange={(e) => setSuburbInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setSuburb(suburbInput)}
          />
          <button
            className="btn-primary px-6"
            onClick={() => setSuburb(suburbInput)}
          >
            Search
          </button>
          <Link href="/jobs/new" className="btn-outline px-6">
            Post a Job Instead
          </Link>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="mb-3 h-5 w-2/3 rounded bg-gray-200" />
                <div className="mb-2 h-4 w-full rounded bg-gray-100" />
                <div className="h-4 w-1/2 rounded bg-gray-100" />
              </div>
            ))}
          </div>
        ) : results && results.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((t) => (
              <div key={t.id} className="card flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">
                      Tradesperson #{t.user_id}
                    </div>
                    <div className="text-sm text-gray-500">
                      {t.suburb ?? t.state ?? "Location not set"}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {t.hire_now_enabled && t.is_available && (
                      <span className="badge bg-green-100 text-green-700">Available Now</span>
                    )}
                    {t.verification_status === "approved" && (
                      <span className="badge bg-blue-100 text-blue-700">Verified</span>
                    )}
                  </div>
                </div>

                {t.bio && (
                  <p className="text-sm text-gray-600 line-clamp-2">{t.bio}</p>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>⭐ {t.rating.toFixed(1)}</span>
                  <span>{t.total_jobs} jobs completed</span>
                </div>

                {t.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {t.specialties.slice(0, 3).map((s) => (
                      <span key={s} className="badge bg-gray-100 text-gray-600">{s}</span>
                    ))}
                  </div>
                )}

                <Link
                  href={`/trades/${t.id}`}
                  className="btn-primary mt-auto text-center"
                >
                  View Profile
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="card py-16 text-center text-gray-400">
            <div className="mb-4 text-5xl">🔍</div>
            <p className="mb-1 text-lg font-medium text-gray-700">No tradespeople found</p>
            <p className="mb-6 text-sm">
              No verified {categoryLabel.toLowerCase()} are listed yet
              {suburb ? ` in "${suburb}"` : ""}.
            </p>
            <Link href="/jobs/new" className="btn-primary inline-flex">
              Post a Job &amp; Get Quotes
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

export default function TradesSearchPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <TradesSearchContent />
    </Suspense>
  );
}
