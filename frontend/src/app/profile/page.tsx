"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

type UserOut = { id: number; name: string; email: string; role: string; phone: string | null; is_verified: boolean; created_at: string };

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: "", phone: "" });
  const [pwForm, setPwForm] = useState({ current_password: "", new_password: "", confirm: "" });
  const [saved, setSaved] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);

  const { data: user, isLoading } = useQuery<UserOut>({
    queryKey: ["me"],
    queryFn: () => api.get("/auth/me").then((r) => r.data),
  });

  useEffect(() => {
    if (user) setForm({ name: user.name, phone: user.phone ?? "" });
  }, [user]);

  const updateProfile = useMutation({
    mutationFn: (payload: object) => api.patch("/auth/me", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  const changePassword = useMutation({
    mutationFn: (payload: object) => api.post("/auth/me/change-password", payload),
    onSuccess: () => {
      setPwForm({ current_password: "", new_password: "", confirm: "" });
      setPwError("");
      setPwSuccess(true);
      setTimeout(() => setPwSuccess(false), 3000);
    },
    onError: (e: any) => setPwError(e.response?.data?.detail ?? "Failed to change password"),
  });

  if (isLoading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-500">Loading profile...</p>
    </div>
  );

  if (!user) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-700 mb-4">You need to be logged in to view your profile.</p>
        <Link href="/login" className="btn-primary">Log in</Link>
      </div>
    </div>
  );

  const dashboardHref =
    user.role === "tradesperson" ? "/dashboard/provider"
    : user.role === "business_owner" ? "/dashboard/business"
    : "/dashboard/customer";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-brand-600">SilverBricks Connect</Link>
          <Link href={dashboardHref} className="btn-ghost text-sm">Dashboard</Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-10 space-y-6">
        {/* Account info */}
        <div className="card">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-full bg-brand-100 flex items-center justify-center text-2xl font-bold text-brand-700">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-sm text-gray-500">{user.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="badge badge-blue">{user.role.replace("_", " ")}</span>
                {user.is_verified && <span className="badge badge-green">Verified</span>}
              </div>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateProfile.mutate({ name: form.name, phone: form.phone || null });
            }}
            className="space-y-4"
          >
            <h2 className="font-semibold text-gray-900 border-t border-gray-100 pt-4">Edit Profile</h2>
            {saved && <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">Profile updated successfully.</div>}
            <div>
              <label className="label">Full name</label>
              <input className="input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
            </div>
            <div>
              <label className="label">Phone number</label>
              <input className="input" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="04xx xxx xxx" />
            </div>
            <div>
              <label className="label">Email address</label>
              <input className="input bg-gray-50" value={user.email} disabled />
              <p className="mt-1 text-xs text-gray-400">Email cannot be changed.</p>
            </div>
            <button type="submit" className="btn-primary" disabled={updateProfile.isPending}>
              {updateProfile.isPending ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Change password */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Change Password</h2>
          {pwError && <div className="mb-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{pwError}</div>}
          {pwSuccess && <div className="mb-3 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">Password changed successfully.</div>}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setPwError("");
              if (pwForm.new_password !== pwForm.confirm) {
                setPwError("New passwords do not match");
                return;
              }
              if (pwForm.new_password.length < 8) {
                setPwError("Password must be at least 8 characters");
                return;
              }
              changePassword.mutate({ current_password: pwForm.current_password, new_password: pwForm.new_password });
            }}
            className="space-y-4"
          >
            <div>
              <label className="label">Current password</label>
              <input className="input" type="password" value={pwForm.current_password} onChange={(e) => setPwForm((f) => ({ ...f, current_password: e.target.value }))} required />
            </div>
            <div>
              <label className="label">New password</label>
              <input className="input" type="password" value={pwForm.new_password} onChange={(e) => setPwForm((f) => ({ ...f, new_password: e.target.value }))} required minLength={8} />
            </div>
            <div>
              <label className="label">Confirm new password</label>
              <input className="input" type="password" value={pwForm.confirm} onChange={(e) => setPwForm((f) => ({ ...f, confirm: e.target.value }))} required minLength={8} />
            </div>
            <button type="submit" className="btn-primary" disabled={changePassword.isPending}>
              {changePassword.isPending ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>

        {/* Account details */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-3">Account Details</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Member since</dt>
              <dd className="text-gray-900">{new Date(user.created_at).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Account type</dt>
              <dd className="text-gray-900 capitalize">{user.role.replace("_", " ")}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Verification</dt>
              <dd className={user.is_verified ? "text-green-600" : "text-yellow-600"}>
                {user.is_verified ? "Verified" : "Pending verification"}
              </dd>
            </div>
          </dl>
        </div>
      </main>
    </div>
  );
}
