"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // In production this would POST to a contact/email endpoint
    setSent(true);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-brand-600">SilverBricks Connect</Link>
          <div className="flex gap-3">
            <Link href="/login" className="btn-ghost text-sm">Log in</Link>
            <Link href="/register" className="btn-primary text-sm">Sign up</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
        <p className="text-gray-500 mb-10">We&apos;d love to hear from you. Send us a message and we&apos;ll respond within 1–2 business days.</p>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Contact info */}
          <div className="space-y-6">
            {[
              { icon: "📧", title: "Email", detail: "support@silverbricksconnect.com.au" },
              { icon: "📞", title: "Phone", detail: "1300 SILVER (1300 745 837)" },
              { icon: "🕒", title: "Hours", detail: "Mon–Fri, 9am–5pm AEST" },
              { icon: "📍", title: "Address", detail: "Melbourne, Victoria, Australia" },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="font-medium text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-500">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-2 card">
            {sent ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">✅</div>
                <h2 className="font-semibold text-gray-900 mb-2">Message sent!</h2>
                <p className="text-sm text-gray-500 mb-6">Thanks for reaching out. We&apos;ll get back to you within 1–2 business days.</p>
                <button onClick={() => setSent(false)} className="btn-outline text-sm">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label">Your name</label>
                    <input className="input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="label">Email address</label>
                    <input className="input" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
                  </div>
                </div>
                <div>
                  <label className="label">Subject</label>
                  <select className="input" value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} required>
                    <option value="">Select a topic...</option>
                    <option value="general">General enquiry</option>
                    <option value="billing">Billing & payments</option>
                    <option value="account">Account issues</option>
                    <option value="tradesperson">Tradesperson verification</option>
                    <option value="dispute">Dispute resolution</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="label">Message</label>
                  <textarea className="input min-h-32" value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} required placeholder="Tell us how we can help..." />
                </div>
                <button type="submit" className="btn-primary w-full">Send Message</button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
