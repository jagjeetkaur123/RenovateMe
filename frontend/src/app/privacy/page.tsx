import Link from "next/link";

export default function PrivacyPage() {
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

      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-500 mb-8">Last updated: May 2026</p>

        <div className="card space-y-6 text-sm text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Information We Collect</h2>
            <p>We collect information you provide when registering (name, email, phone), information about how you use the Platform (jobs posted, quotes submitted, bookings made), and technical information such as IP address and device type.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">2. How We Use Your Information</h2>
            <p>We use your information to: operate and improve the Platform; connect customers with tradespeople; process payments; send transactional notifications (booking confirmations, quote alerts); and comply with legal obligations under Australian law.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">3. Information Sharing</h2>
            <p>We do not sell your personal information. We share information with tradespeople or customers only as necessary to facilitate a connection or job. We may share information with service providers (e.g. payment processors) under appropriate data processing agreements.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Data Security</h2>
            <p>We implement industry-standard security measures including encryption in transit (TLS) and at rest, access controls, and regular security reviews. No method of transmission over the internet is 100% secure.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">5. Your Rights</h2>
            <p>Under the Australian Privacy Act 1988, you have the right to access, correct, or request deletion of your personal information. Contact us at <a href="mailto:privacy@silverbricksconnect.com.au" className="text-brand-600 hover:underline">privacy@silverbricksconnect.com.au</a> to exercise these rights.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">6. Cookies</h2>
            <p>We use cookies and similar technologies to maintain your session and improve your experience. You can control cookies through your browser settings, though some Platform features may not work without them.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">7. Changes to This Policy</h2>
            <p>We may update this policy from time to time. We will notify you of significant changes via email or a prominent notice on the Platform.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">8. Contact</h2>
            <p>Privacy questions? <Link href="/contact" className="text-brand-600 hover:underline">Contact us</Link> or email <a href="mailto:privacy@silverbricksconnect.com.au" className="text-brand-600 hover:underline">privacy@silverbricksconnect.com.au</a>.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
