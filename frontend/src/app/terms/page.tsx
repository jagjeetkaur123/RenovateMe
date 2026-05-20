import Link from "next/link";

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-gray-500 mb-8">Last updated: May 2026</p>

        <div className="card prose prose-gray max-w-none space-y-6 text-sm text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Acceptance of Terms</h2>
            <p>By accessing or using SilverBricks Connect (&ldquo;Platform&rdquo;), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Platform.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">2. Services</h2>
            <p>SilverBricks Connect provides an online marketplace connecting homeowners and businesses with tradespeople and renovation professionals in Australia. We facilitate connections but are not a party to any agreement between users.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">3. User Accounts</h2>
            <p>You must provide accurate information when registering. You are responsible for maintaining the security of your account and all activities under it. Notify us immediately of any unauthorised access.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Tradespeople and Service Providers</h2>
            <p>Tradespeople using the Platform represent that they hold all required licences, insurances, and qualifications to perform the services they offer. SilverBricks Connect may verify these credentials but does not guarantee their accuracy.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">5. Fees and Payments</h2>
            <p>Posting a job is free for customers. Tradespeople may be subject to subscription or per-lead fees as outlined in our pricing schedule. All prices are in Australian Dollars (AUD) inclusive of GST where applicable.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">6. Prohibited Conduct</h2>
            <p>Users must not: post false or misleading information; use the Platform for any unlawful purpose; circumvent any security or access controls; or engage in harassment or discriminatory behaviour toward other users.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">7. Limitation of Liability</h2>
            <p>To the extent permitted by law, SilverBricks Connect is not liable for any indirect, incidental, or consequential damages arising from your use of the Platform or any services arranged through it.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">8. Governing Law</h2>
            <p>These Terms are governed by the laws of Victoria, Australia. Any disputes shall be subject to the exclusive jurisdiction of the courts of Victoria.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">9. Contact</h2>
            <p>Questions about these Terms? <Link href="/contact" className="text-brand-600 hover:underline">Contact us</Link>.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
