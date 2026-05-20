"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

type StaffMember = { id: number; name: string; role: string | null; email: string | null; phone: string | null };
type Business = { id: number };

export default function BusinessStaffPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", email: "", phone: "" });
  const [error, setError] = useState("");

  const { data: profile } = useQuery<Business>({
    queryKey: ["my-business"],
    queryFn: () => api.get("/businesses/my").then((r) => r.data),
  });

  const { data: staff = [], isLoading } = useQuery<StaffMember[]>({
    queryKey: ["business-staff", profile?.id],
    queryFn: () => api.get(`/businesses/${profile!.id}/staff`).then((r) => r.data),
    enabled: !!profile?.id,
  });

  const addStaff = useMutation({
    mutationFn: (payload: object) => api.post(`/businesses/${profile!.id}/staff`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-staff"] });
      setShowForm(false);
      setForm({ name: "", role: "", email: "", phone: "" });
    },
    onError: (e: any) => setError(e.response?.data?.detail ?? "Failed to add staff member"),
  });

  const removeStaff = useMutation({
    mutationFn: (staffId: number) => api.delete(`/businesses/${profile!.id}/staff/${staffId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["business-staff"] }),
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
          <h1 className="text-2xl font-bold text-gray-900">Staff Members</h1>
          <button onClick={() => setShowForm(true)} className="btn-primary text-sm">+ Add Staff</button>
        </div>

        {showForm && (
          <div className="card mb-6">
            <h2 className="font-semibold text-gray-900 mb-4">New Staff Member</h2>
            {error && <div className="mb-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addStaff.mutate({
                  name: form.name,
                  role: form.role || null,
                  email: form.email || null,
                  phone: form.phone || null,
                });
              }}
              className="space-y-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">Name *</label>
                  <input className="input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required placeholder="e.g. John Smith" />
                </div>
                <div>
                  <label className="label">Role / Title</label>
                  <input className="input" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} placeholder="e.g. Senior Plumber" />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input className="input" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="john@example.com" />
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input className="input" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="04xx xxx xxx" />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary" disabled={addStaff.isPending}>
                  {addStaff.isPending ? "Adding..." : "Add Staff Member"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {isLoading ? (
          <div className="card text-center py-12 text-gray-500">Loading staff...</div>
        ) : staff.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 mb-4">No staff added. Add team members to assign them to bookings.</p>
            <button onClick={() => setShowForm(true)} className="btn-primary">Add Staff Member</button>
          </div>
        ) : (
          <div className="space-y-3">
            {staff.map((s) => (
              <div key={s.id} className="card flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold text-sm">
                    {s.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{s.name}</p>
                    {s.role && <p className="text-sm text-gray-500">{s.role}</p>}
                    {s.email && <p className="text-xs text-gray-400">{s.email}</p>}
                  </div>
                </div>
                <button
                  onClick={() => { if (confirm(`Remove ${s.name}?`)) removeStaff.mutate(s.id); }}
                  className="text-sm text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
