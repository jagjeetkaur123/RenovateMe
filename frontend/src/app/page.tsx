"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import NavBar from "@/components/NavBar";

/* ── Animated counter hook ── */
function useCounter(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

/* ── Intersection-observer scroll-reveal hook ── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
}

/* ── Stats section ── */
function StatsSection() {
  const { ref, visible } = useReveal();
  const jobs   = useCounter(12400, 1800, visible);
  const trades = useCounter(3200,  1600, visible);
  const rating = useCounter(98,    1400, visible);
  const cities = useCounter(140,   1500, visible);

  const stats = [
    { value: jobs,   suffix: "+", label: "Jobs Completed",       icon: "✅" },
    { value: trades, suffix: "+", label: "Verified Tradies",     icon: "🛠️" },
    { value: rating, suffix: "%", label: "Customer Satisfaction",icon: "⭐" },
    { value: cities, suffix: "+", label: "Cities Covered",       icon: "📍" },
  ];

  return (
    <section className="border-b border-gray-100 bg-white px-4 py-14">
      <div ref={ref} className="mx-auto grid max-w-5xl grid-cols-2 gap-8 sm:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`reveal text-center ${visible ? "visible" : ""}`}
            style={{ transitionDelay: `${i * 120}ms` }}
          >
            <div className="mb-2 text-3xl">{s.icon}</div>
            <div className="text-4xl font-bold text-brand-600">
              {s.value.toLocaleString()}{s.suffix}
            </div>
            <div className="mt-1 text-sm text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Data ── */
const CATEGORIES = [
  { id: "handyman",        label: "General Handyman",        icon: "🔧" },
  { id: "plumbing",        label: "Plumbing",                icon: "🚿" },
  { id: "electrical",      label: "Electrical",              icon: "⚡" },
  { id: "renovation",      label: "Renovation",              icon: "🏗️" },
  { id: "carpentry",       label: "Carpentry",               icon: "🪚" },
  { id: "cabinet_making",  label: "Cabinet Making",          icon: "🪑" },
  { id: "cleaning",        label: "Cleaning",                icon: "🧹" },
  { id: "painting",        label: "Painting",                icon: "🎨" },
  { id: "landscaping",     label: "Landscaping",             icon: "🌿" },
  { id: "tiling_flooring", label: "Tiling & Flooring",       icon: "🪟" },
  { id: "security",        label: "Security",                icon: "🔐" },
  { id: "moving_transport",label: "Moving & Transport",      icon: "🚛" },
  { id: "heating_cooling", label: "Heating & Cooling",       icon: "❄️" },
  { id: "specialist",      label: "Specialist Trades",       icon: "🧰" },
];

const STEPS = [
  { step: "1", title: "Post Your Job",    desc: "Describe what you need done in under 2 minutes — it's completely free.",  icon: "📋", color: "bg-blue-50" },
  { step: "2", title: "Receive Quotes",   desc: "Verified tradies in your area send you competitive quotes fast.",           icon: "💬", color: "bg-amber-50" },
  { step: "3", title: "Hire with Confidence", desc: "Compare profiles, reviews, and prices — then hire the best fit.",     icon: "✅", color: "bg-green-50" },
];

const MODULES = [
  {
    title: "TradeConnect",
    desc:  "Find verified tradespeople for plumbing, electrical, carpentry, renovation and 10+ more categories.",
    href:  "/trades",
    icon:  "🔧",
    cta:   "Find a Tradie",
    gradient: "from-blue-600 to-indigo-600",
    light: "bg-blue-50",
  },
  {
    title: "Hire-A-Me",
    desc:  "Need it done right now? Instantly hire an available tradesperson near you with one tap.",
    href:  "/hire",
    icon:  "⚡",
    cta:   "Hire Now",
    gradient: "from-amber-500 to-orange-500",
    light: "bg-amber-50",
  },
  {
    title: "BookEasy Hub",
    desc:  "Book salons, healthcare providers, event venues and local businesses with real-time availability.",
    href:  "/book",
    icon:  "📅",
    cta:   "Book Now",
    gradient: "from-emerald-500 to-teal-500",
    light: "bg-emerald-50",
  },
];

const TESTIMONIALS = [
  {
    name: "Sarah M.",
    role: "Homeowner, Sydney",
    avatar: "SM",
    quote: "Found an amazing plumber within 20 minutes. The whole process was so smooth — I'll never go back to searching Google.",
    rating: 5,
  },
  {
    name: "James K.",
    role: "Property Manager, Melbourne",
    avatar: "JK",
    quote: "SilverBricks Connect is a game changer. I manage 12 properties and getting quotes is now effortless.",
    rating: 5,
  },
  {
    name: "Priya D.",
    role: "Renovation Project, Brisbane",
    avatar: "PD",
    quote: "Three tradespeople showed up for quotes within 2 hours of posting. The verification badge gave me real peace of mind.",
    rating: 5,
  },
];

/* ── Main Page ── */
export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuburb, setSearchSuburb] = useState("");

  /* Stagger the hero text animations on mount */
  const [heroVisible, setHeroVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const categoriesReveal = useReveal();
  const howReveal        = useReveal();
  const modulesReveal    = useReveal();
  const testimonialsReveal = useReveal();

  return (
    <main className="min-h-screen bg-white">
      <NavBar />

      {/* ══ HERO ══ */}
      <section className="hero-gradient relative overflow-hidden px-4 pb-24 pt-20 text-white">
        {/* background decoration blobs */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 top-10 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-64 w-full -translate-x-1/2 bg-gradient-to-t from-black/10 to-transparent" />

        <div className="relative mx-auto max-w-5xl text-center">
          {/* Badge */}
          <div className={`reveal ${heroVisible ? "visible" : ""}`}>
            <span className="mb-6 inline-block rounded-full border border-white/30 bg-white/10 px-5 py-1.5 text-sm font-medium backdrop-blur-sm">
              🇦🇺 Australia&apos;s #1 All-in-One Services Marketplace
            </span>
          </div>

          {/* Headline */}
          <h1
            className={`reveal mb-6 text-5xl font-extrabold leading-tight tracking-tight md:text-7xl ${heroVisible ? "visible" : ""}`}
            style={{ transitionDelay: "120ms" }}
          >
            Find Trusted Tradies &amp;<br className="hidden sm:block" />
            <span className="text-amber-300"> Services Near You</span>
          </h1>

          <p
            className={`reveal mb-10 text-lg text-blue-100 md:text-xl ${heroVisible ? "visible" : ""}`}
            style={{ transitionDelay: "220ms" }}
          >
            Connect with verified tradespeople, book appointments, and manage jobs<br className="hidden md:block" /> — all from one simple platform.
          </p>

          {/* Search bar */}
          <div
            className={`reveal mx-auto mb-8 flex max-w-2xl flex-col gap-3 sm:flex-row ${heroVisible ? "visible" : ""}`}
            style={{ transitionDelay: "320ms" }}
          >
            <input
              type="text"
              placeholder="What do you need? (e.g. plumber, electrician...)"
              className="flex-1 rounded-xl border-0 bg-white/95 px-5 py-4 text-gray-900 placeholder-gray-400 shadow-xl focus:outline-none focus:ring-2 focus:ring-white/60 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <input
              type="text"
              placeholder="Suburb or postcode"
              className="rounded-xl border-0 bg-white/95 px-5 py-4 text-gray-900 placeholder-gray-400 shadow-xl focus:outline-none focus:ring-2 focus:ring-white/60 text-sm sm:w-44"
              value={searchSuburb}
              onChange={(e) => setSearchSuburb(e.target.value)}
            />
            <Link
              href={`/trades/search?q=${encodeURIComponent(searchQuery)}&suburb=${encodeURIComponent(searchSuburb)}`}
              className="rounded-xl bg-amber-400 px-8 py-4 font-semibold text-white shadow-xl transition hover:bg-amber-500 hover:shadow-2xl active:scale-95 whitespace-nowrap"
            >
              Search
            </Link>
          </div>

          {/* Popular tags */}
          <div
            className={`reveal flex flex-wrap items-center justify-center gap-2 text-sm text-blue-200 ${heroVisible ? "visible" : ""}`}
            style={{ transitionDelay: "420ms" }}
          >
            <span className="font-medium">Popular:</span>
            {["Plumbing", "Electrical", "Painting", "Cleaning", "Renovation", "Carpentry"].map((t) => (
              <Link
                key={t}
                href={`/trades/search?category=${t.toLowerCase()}`}
                className="rounded-full border border-white/25 bg-white/10 px-3 py-1 transition hover:bg-white/20 hover:border-white/40"
              >
                {t}
              </Link>
            ))}
          </div>
        </div>

        {/* Floating social-proof cards */}
        <div className="pointer-events-none hidden xl:block">
          <div className="animate-float absolute left-[5%] top-1/2 -translate-y-1/2 rounded-2xl bg-white/95 p-4 shadow-2xl backdrop-blur-sm" style={{ animationDelay: "0s" }}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-lg">✅</div>
              <div>
                <p className="text-xs font-semibold text-gray-900">Job Completed</p>
                <p className="text-xs text-gray-500">Bathroom renovation · 2 min ago</p>
              </div>
            </div>
          </div>

          <div className="animate-float absolute right-[5%] top-1/3 rounded-2xl bg-white/95 p-4 shadow-2xl backdrop-blur-sm" style={{ animationDelay: "1s" }}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-lg">⭐</div>
              <div>
                <p className="text-xs font-semibold text-gray-900">5-Star Review</p>
                <p className="text-xs text-gray-500">"Excellent service!"</p>
              </div>
            </div>
          </div>

          <div className="animate-float absolute right-[6%] bottom-1/4 rounded-2xl bg-white/95 p-4 shadow-2xl backdrop-blur-sm" style={{ animationDelay: "1.8s" }}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-lg">⚡</div>
              <div>
                <p className="text-xs font-semibold text-gray-900">Instant Hire</p>
                <p className="text-xs text-gray-500">Available now near you</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ STATS ══ */}
      <StatsSection />

      {/* ══ HOW IT WORKS ══ */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div ref={howReveal.ref} className={`reveal mb-14 text-center ${howReveal.visible ? "visible" : ""}`}>
            <span className="mb-3 inline-block rounded-full bg-brand-50 px-4 py-1.5 text-sm font-semibold text-brand-600">
              Simple Process
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
              Get your job done in <span className="gradient-text">3 easy steps</span>
            </h2>
            <p className="mt-3 text-gray-500">No fuss, no long waits — just quality tradespeople at your door.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <div
                key={s.step}
                className={`reveal relative rounded-2xl border border-gray-100 p-8 text-center shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${s.color} ${howReveal.visible ? "visible" : ""}`}
                style={{ transitionDelay: `${i * 130}ms` }}
              >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-md text-3xl">
                  {s.icon}
                </div>
                <span className="mb-3 inline-block rounded-full bg-brand-600 px-3 py-0.5 text-xs font-bold text-white">
                  Step {s.step}
                </span>
                <h3 className="mb-2 text-lg font-bold text-gray-900">{s.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{s.desc}</p>
                {i < STEPS.length - 1 && (
                  <div className="absolute -right-4 top-1/2 hidden -translate-y-1/2 text-2xl text-gray-300 md:block">→</div>
                )}
              </div>
            ))}
          </div>

          <div className={`reveal mt-12 text-center ${howReveal.visible ? "visible" : ""}`} style={{ transitionDelay: "420ms" }}>
            <Link href="/jobs/new" className="btn-primary px-10 py-3.5 text-base shadow-md hover:shadow-lg">
              Post a Job — It&apos;s Free
            </Link>
          </div>
        </div>
      </section>

      {/* ══ CATEGORIES ══ */}
      <section className="bg-gray-50 px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div
            ref={categoriesReveal.ref}
            className={`reveal mb-12 text-center ${categoriesReveal.visible ? "visible" : ""}`}
          >
            <span className="mb-3 inline-block rounded-full bg-brand-50 px-4 py-1.5 text-sm font-semibold text-brand-600">
              14+ Trade Categories
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
              Browse by Category
            </h2>
            <p className="mt-3 text-gray-500">Find the right expert for any job around the home or business.</p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {CATEGORIES.map((cat, i) => (
              <Link
                key={cat.id}
                href={`/trades/search?category=${cat.id}`}
                className={`reveal group flex flex-col items-center gap-2 rounded-2xl border border-gray-200 bg-white p-5 text-center text-sm font-medium text-gray-700 transition-all duration-300 hover:border-brand-300 hover:shadow-md hover:-translate-y-1 hover:text-brand-600 ${categoriesReveal.visible ? "visible" : ""}`}
                style={{ transitionDelay: `${i * 45}ms` }}
              >
                <span className="text-3xl transition-transform duration-300 group-hover:scale-110">{cat.icon}</span>
                <span className="leading-tight">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PLATFORM MODULES ══ */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div
            ref={modulesReveal.ref}
            className={`reveal mb-14 text-center ${modulesReveal.visible ? "visible" : ""}`}
          >
            <span className="mb-3 inline-block rounded-full bg-brand-50 px-4 py-1.5 text-sm font-semibold text-brand-600">
              One Platform
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
              Three powerful tools. <span className="gradient-text">One account.</span>
            </h2>
            <p className="mt-3 text-gray-500">Everything you need to find, book, and manage services across Australia.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {MODULES.map((m, i) => (
              <div
                key={m.title}
                className={`reveal group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${modulesReveal.visible ? "visible" : ""}`}
                style={{ transitionDelay: `${i * 130}ms` }}
              >
                {/* gradient accent bar */}
                <div className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${m.gradient}`} />

                <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${m.light} text-3xl transition-transform duration-300 group-hover:scale-110`}>
                  {m.icon}
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">{m.title}</h3>
                <p className="mb-7 text-sm leading-relaxed text-gray-500">{m.desc}</p>
                <Link
                  href={m.href}
                  className={`inline-flex items-center gap-2 rounded-lg bg-gradient-to-r ${m.gradient} px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:opacity-90`}
                >
                  {m.cta}
                  <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section className="bg-gray-50 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div
            ref={testimonialsReveal.ref}
            className={`reveal mb-14 text-center ${testimonialsReveal.visible ? "visible" : ""}`}
          >
            <span className="mb-3 inline-block rounded-full bg-brand-50 px-4 py-1.5 text-sm font-semibold text-brand-600">
              Real Reviews
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
              Loved by Australians
            </h2>
            <p className="mt-3 text-gray-500">Join thousands of happy customers across the country.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.name}
                className={`reveal relative rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${testimonialsReveal.visible ? "visible" : ""}`}
                style={{ transitionDelay: `${i * 130}ms` }}
              >
                <div className="mb-4 flex text-amber-400 text-lg">
                  {"★".repeat(t.rating)}
                </div>
                <blockquote className="mb-6 text-sm leading-relaxed text-gray-600 italic">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TRADIE CTA ══ */}
      <section className="relative overflow-hidden px-4 py-20">
        <div className="hero-gradient absolute inset-0" />
        <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -right-10 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        <div className="relative mx-auto max-w-4xl text-center text-white">
          <h2 className="mb-4 text-3xl font-extrabold md:text-4xl">
            Are you a tradesperson or business?
          </h2>
          <p className="mb-10 text-blue-100 md:text-lg">
            Join thousands of providers growing their business on SilverBricks Connect.<br className="hidden sm:block" />
            Free to join — start getting leads today.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/register?role=tradesperson"
              className="rounded-xl bg-white px-8 py-4 font-semibold text-brand-700 shadow-xl transition hover:bg-blue-50 hover:shadow-2xl active:scale-95"
            >
              🛠️ Join as a Tradie
            </Link>
            <Link
              href="/register?role=business_owner"
              className="rounded-xl border-2 border-white/50 px-8 py-4 font-semibold text-white transition hover:bg-white/10 active:scale-95"
            >
              🏢 List Your Business
            </Link>
          </div>

          {/* mini trust indicators */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-blue-200">
            <span className="flex items-center gap-1.5"><span>✅</span> Free to join</span>
            <span className="flex items-center gap-1.5"><span>⚡</span> Get leads instantly</span>
            <span className="flex items-center gap-1.5"><span>🔒</span> Verified profiles</span>
            <span className="flex items-center gap-1.5"><span>💳</span> No subscription required</span>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="border-t border-gray-200 bg-white px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 grid gap-8 sm:grid-cols-4">
            <div>
              <div className="mb-3 text-xl font-extrabold text-gray-900">
                SilverBricks <span className="text-brand-600">Connect</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Australia&apos;s all-in-one marketplace for trusted tradespeople and local services.
              </p>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold text-gray-900">Services</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/trades" className="hover:text-gray-900">Find a Tradie</Link></li>
                <li><Link href="/hire" className="hover:text-gray-900">Hire Now</Link></li>
                <li><Link href="/book" className="hover:text-gray-900">Book a Service</Link></li>
                <li><Link href="/jobs/new" className="hover:text-gray-900">Post a Job</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold text-gray-900">For Providers</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/register?role=tradesperson" className="hover:text-gray-900">Join as a Tradie</Link></li>
                <li><Link href="/register?role=business_owner" className="hover:text-gray-900">List Your Business</Link></li>
                <li><Link href="/dashboard/provider" className="hover:text-gray-900">Provider Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold text-gray-900">Company</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/privacy" className="hover:text-gray-900">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-gray-900">Terms of Service</Link></li>
                <li><Link href="/contact" className="hover:text-gray-900">Contact Us</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
            © 2026 SilverBricks Connect Pty Ltd. All rights reserved. ABN 00 000 000 000
          </div>
        </div>
      </footer>
    </main>
  );
}
