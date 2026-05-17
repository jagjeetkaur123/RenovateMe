import Link from "next/link";

const modules = [
  {
    title: "TradeConnect",
    desc: "Find verified tradespeople for any job — plumbing, electrical, carpentry, renovation and more.",
    href: "/trades",
    icon: "🔧",
    cta: "Find a Tradie",
  },
  {
    title: "Hire-A-Me",
    desc: "Need it done now? Instantly hire an available tradesperson near you with one tap.",
    href: "/hire",
    icon: "⚡",
    cta: "Hire Now",
  },
  {
    title: "BookEasy Hub",
    desc: "Book salons, healthcare providers, event venues and local businesses with real-time availability.",
    href: "/book",
    icon: "📅",
    cta: "Book Now",
  },
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
      {/* Nav */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-xl font-bold text-brand-600">
            SilverBricks Connect
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-ghost text-sm">Log in</Link>
            <Link href="/register" className="btn-primary text-sm">Sign up</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-700 to-brand-900 px-4 py-24 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-5xl font-bold leading-tight">
            Australia&apos;s All-in-One Services Marketplace
          </h1>
          <p className="mb-10 text-xl text-blue-100">
            Connect with verified tradespeople, book appointments, and manage jobs — all in one place.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/register" className="btn bg-gold-400 text-white hover:bg-gold-500 px-8 py-3 text-base">
              Get Started Free
            </Link>
            <Link href="/trades" className="btn border border-white text-white hover:bg-white/10 px-8 py-3 text-base">
              Browse Tradies
            </Link>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="bg-gray-50 px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-gray-900">
            Three platforms. One account.
          </h2>
          <p className="mb-12 text-center text-gray-500">
            Everything you need to find, book, and manage services across Australia.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {modules.map((m) => (
              <div key={m.title} className="card hover:shadow-md transition-shadow">
                <div className="mb-4 text-4xl">{m.icon}</div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">{m.title}</h3>
                <p className="mb-6 text-gray-500">{m.desc}</p>
                <Link href={m.href} className="btn-primary w-full text-center">
                  {m.cta}
                </Link>
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
              <Link
                key={cat.label}
                href={cat.href}
                className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 text-center text-sm font-medium text-gray-700 transition hover:border-brand-300 hover:shadow-sm"
              >
                <span className="text-3xl">{cat.icon}</span>
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-700 px-4 py-16 text-center text-white">
        <h2 className="mb-4 text-3xl font-bold">Are you a tradesperson or business?</h2>
        <p className="mb-8 text-blue-100">Join thousands of providers growing their business on SilverBricks Connect.</p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/register?role=tradesperson" className="btn bg-white text-brand-700 hover:bg-blue-50 px-8 py-3">
            Join as a Tradie
          </Link>
          <Link href="/register?role=business_owner" className="btn border border-white text-white hover:bg-white/10 px-8 py-3">
            List Your Business
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white px-4 py-8 text-center text-sm text-gray-500">
        <p>© 2026 SilverBricks Connect Pty Ltd. All rights reserved.</p>
        <p className="mt-1">
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          {" · "}
          <Link href="/terms" className="hover:underline">Terms of Service</Link>
          {" · "}
          <Link href="/contact" className="hover:underline">Contact</Link>
        </p>
      </footer>
    </main>
  );
}
