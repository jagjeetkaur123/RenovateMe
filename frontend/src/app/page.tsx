import Link from "next/link";
import NavBar from "@/components/NavBar";

const stats = [
  { value: "14+", label: "Trade Categories" },
  { value: "100%", label: "Verified Providers" },
  { value: "3", label: "Platforms in One" },
  { value: "Free", label: "To Get Started" },
];

const modules = [
  {
    title: "TradeConnect",
    desc: "Find verified tradespeople for any job — plumbing, electrical, carpentry, renovation and more.",
    href: "/trades",
    icon: "🔧",
    cta: "Find a Tradie",
    color: "bg-blue-50 border-blue-100",
  },
  {
    title: "Hire-A-Me",
    desc: "Need it done now? Instantly hire an available tradesperson near you with one tap.",
    href: "/hire",
    icon: "⚡",
    cta: "Hire Now",
    color: "bg-amber-50 border-amber-100",
  },
  {
    title: "BookEasy Hub",
    desc: "Book salons, healthcare providers, event venues and local businesses with real-time availability.",
    href: "/book",
    icon: "📅",
    cta: "Book Now",
    color: "bg-green-50 border-green-100",
  },
];

const steps = [
  { step: "1", title: "Post a Job", desc: "Describe what you need done — it takes less than 2 minutes.", icon: "📋" },
  { step: "2", title: "Receive Quotes", desc: "Verified tradespeople in your area send you competitive quotes.", icon: "💬" },
  { step: "3", title: "Hire the Best", desc: "Compare profiles, reviews and prices — then hire with confidence.", icon: "✅" },
];

const categories = [
  { label: "Home Services", icon: "🏡", href: "/trades?group=home" },
  { label: "Building & Reno", icon: "🏗️", href: "/trades?group=building" },
  { label: "Outdoor & Garden", icon: "🌿", href: "/trades?group=outdoor" },
  { label: "Safety & Security", icon: "🔐", href: "/trades?group=security" },
  { label: "Beauty & Salon", icon: "💅", href: "/book?cat=salon" },
  { label: "Healthcare", icon: "🏥", href: "/book?cat=healthcare" },
  { label: "Event Venues", icon: "🎉", href: "/book?cat=venue" },
  { label: "Moving & Transport", icon: "🚛", href: "/trades?group=moving" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <NavBar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-blue-500 px-4 py-28 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="mb-4 inline-block rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
            Australia&apos;s All-in-One Services Marketplace
          </span>
          <h1 className="mb-5 text-5xl font-bold leading-tight tracking-tight md:text-6xl">
            Find Trusted Tradies &amp;<br className="hidden sm:block" /> Services Near You
          </h1>
          <p className="mb-10 text-xl text-blue-100">
            Connect with verified tradespeople, book appointments, and manage jobs — all in one place.
          </p>

          {/* Search bar */}
          <div className="mx-auto flex max-w-2xl flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="What do you need? (e.g. plumber, electrician...)"
              className="flex-1 rounded-xl border-0 bg-white px-5 py-3.5 text-gray-900 placeholder-gray-400 shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <Link
              href="/trades"
              className="btn rounded-xl bg-gold-400 px-8 py-3.5 font-semibold text-white shadow-lg hover:bg-gold-500"
            >
              Search
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm text-blue-200">
            <span>Popular:</span>
            {["Plumbing", "Electrical", "Painting", "Cleaning", "Renovation"].map((t) => (
              <Link key={t} href={`/trades/search?category=${t.toLowerCase()}`}
                className="rounded-full border border-white/20 bg-white/10 px-3 py-1 hover:bg-white/20 transition">
                {t}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-gray-100 bg-white px-4 py-8">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-bold text-brand-600">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-2 text-center text-3xl font-bold text-gray-900">How it works</h2>
          <p className="mb-12 text-center text-gray-500">Get your job done in three simple steps.</p>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.step} className="relative text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-3xl">
                  {s.icon}
                </div>
                <div className="absolute left-1/2 top-5 hidden h-0.5 w-full -translate-y-1/2 bg-gray-100 md:block" style={{ left: "calc(50% + 40px)", width: "calc(100% - 80px)" }} />
                <span className="mb-2 inline-block rounded-full bg-brand-600 px-2.5 py-0.5 text-xs font-bold text-white">
                  Step {s.step}
                </span>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/jobs/new" className="btn-primary px-8 py-3 text-base">
              Post a Job — It&apos;s Free
            </Link>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="bg-gray-50 px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-2 text-center text-3xl font-bold text-gray-900">Three platforms. One account.</h2>
          <p className="mb-12 text-center text-gray-500">Everything you need to find, book, and manage services across Australia.</p>
          <div className="grid gap-6 md:grid-cols-3">
            {modules.map((m) => (
              <div key={m.title} className={`card border-2 ${m.color} hover:shadow-md transition-shadow`}>
                <div className="mb-4 text-4xl">{m.icon}</div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">{m.title}</h3>
                <p className="mb-6 text-gray-500">{m.desc}</p>
                <Link href={m.href} className="btn-primary w-full text-center">{m.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">Browse by Category</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            {categories.map((cat) => (
              <Link key={cat.label} href={cat.href}
                className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 text-center text-sm font-medium text-gray-700 transition hover:border-brand-300 hover:shadow-sm">
                <span className="text-3xl">{cat.icon}</span>
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-brand-700 to-brand-600 px-4 py-16 text-center text-white">
        <h2 className="mb-3 text-3xl font-bold">Are you a tradesperson or business?</h2>
        <p className="mb-8 text-blue-100">Join thousands of providers growing their business on SilverBricks Connect.</p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/register?role=tradesperson" className="btn bg-white text-brand-700 hover:bg-blue-50 px-8 py-3 font-semibold">
            Join as a Tradie
          </Link>
          <Link href="/register?role=business_owner" className="btn border border-white/50 text-white hover:bg-white/10 px-8 py-3">
            List Your Business
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="text-lg font-bold text-gray-900">
              SilverBricks <span className="text-brand-600">Connect</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-500">
              <Link href="/privacy" className="hover:text-gray-900">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-gray-900">Terms of Service</Link>
              <Link href="/contact" className="hover:text-gray-900">Contact</Link>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-gray-400">© 2026 SilverBricks Connect Pty Ltd. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
