"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

type Service = { id: number; name: string; description: string | null; price: number | null; duration_minutes: number };
type Business = { id: number };

export default function BusinessServicesPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", price: "", duration_minutes: "60" });
  const [error, setError] = useState("");

  const { data: profile } = useQuery<Business>({
    queryKey: ["my-business"],
    queryFn: () => api.get("/businesses/my").then((r) => r.data),
  });

  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ["business-services", profile?.id],
    queryFn: () => api.get(`/businesses/${profile!.id}/services`).then((r) => r.data),
    enabled: !!profile?.id,
  });

  const addService = useMutation({
    mutationFn: (payload: object) => api.post(`/businesses/${profile!.id}/services`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-services"] });
      setShowForm(false);
      setForm({ name: "", description: "", price: "", duration_minutes: "60" });
    },
    onError: (e: any) => setError(e.response?.data?.detail ?? "Failed to add service"),
  });

  const deleteService = useMutation({
    mutationFn: (serviceId: number) => api.delete(`/businesses/${profile!.id}/services/${serviceId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["business-services"] }),
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-brand-600">SilverBricks Connect</Link>
          <Link href="/dashboard/business" className="btn-ghost text-sm">Dashboard</Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <button onClick={() => setShowForm(true)} className="btn-primary text-sm">+ Add Service</button>
        </div>

        {showForm && (
          <div className="card mb-6">
            <h2 className="font-semibold text-gray-900 mb-4">New Service</h2>
            {error && <div className="mb-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addService.mutate({
                  name: form.name,
                  description: form.description || null,
                  price: form.price ? parseFloat(form.price) : null,
                  duration_minutes: parseInt(form.duration_minutes),
                });
              }}
              className="space-y-4"
            >
              <div>
                <label className="label">Service name *</label>
                <input className="input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required placeholder="e.g. Full bathroom renovation" />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea className="input" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Brief description of the service..." />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">Price (AUD)</label>
                  <input className="input" type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} placeholder="e.g. 350" />
                </div>
                <div>
                  <label className="label">Duration (minutes) *</label>
                  <input className="input" type="number" min="15" value={form.duration_minutes} onChange={(e) => setForm((f) => ({ ...f, duration_minutes: e.target.value }))} required />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary" disabled={addService.isPending}>
                  {addService.isPending ? "Adding..." : "Add Service"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {isLoading ? (
          <div className="card text-center py-12 text-gray-500">Loading services...</div>
        ) : services.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 mb-4">No services added yet. Add your first service to start accepting bookings.</p>
            <button onClick={() => setShowForm(true)} className="btn-primary">Add Service</button>
          </div>
        ) : (
          <div className="space-y-3">
            {services.map((s) => (
              <div key={s.id} className="card flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{s.name}</p>
                  {s.description && <p className="text-sm text-gray-500 mt-0.5">{s.description}</p>}
                  <p className="text-sm text-gray-500 mt-1">{s.duration_minutes} min</p>
                </div>
                <div className="flex items-center gap-4">
                  {s.price && <p className="font-semibold text-gray-900">${s.price}</p>}
                  <button
                    onClick={() => { if (confirm("Remove this service?")) deleteService.mutate(s.id); }}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
