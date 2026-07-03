import { Link } from "react-router-dom";
import Icon from "../components/common/Icon";

const TermsConditions = () => {
  return (
    <main className="min-h-screen bg-[#F9FAFB] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-[#22C55E] transition">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Terms & Conditions</span>
        </nav>

        {/* Header */}
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-[#111827] to-[#1a2332] p-8 text-white border border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#22C55E]">
              <Icon name="gavel" size={20} />
            </span>
            <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-[#22C55E]">
              Terms & Conditions
            </span>
          </div>
          <h1 className="text-3xl font-bold">Terms & Conditions</h1>
          <p className="mt-2 text-gray-300">Last updated: June 2026</p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-[#374151] leading-relaxed">
          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-[#1F2937] mb-4">1. Acceptance of Terms</h2>
            <p>By accessing and using Vyora ("the Platform"), you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, you should not use our services.</p>
          </section>

          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-[#1F2937] mb-4">2. Description of Services</h2>
            <p>Vyora is a business discovery and lead generation platform that connects users with verified service providers and vendors. We facilitate connections between buyers and sellers but are not a party to any transaction between users.</p>
          </section>

          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-[#1F2937] mb-4">3. User Responsibilities</h2>
            <p>Users agree to:</p>
            <ul className="mt-3 list-disc pl-6 space-y-2">
              <li>Provide accurate and truthful information when creating accounts or submitting requirements</li>
              <li>Not misuse the platform for fraudulent activities or spam</li>
              <li>Respect the intellectual property rights of others</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Not attempt to harm, disrupt, or gain unauthorized access to the platform</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-[#1F2937] mb-4">4. Vendor Listings</h2>
            <p>Vendors who list their services on Vyora are responsible for the accuracy of their listings. Vyora reserves the right to verify, approve, or remove listings at its discretion. Vendor accounts may be suspended for policy violations.</p>
          </section>

          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-[#1F2937] mb-4">5. Limitation of Liability</h2>
            <p>Vyora acts as an intermediary platform and is not responsible for:</p>
            <ul className="mt-3 list-disc pl-6 space-y-2">
              <li>The quality, safety, or legality of services offered by vendors</li>
              <li>Transactions or agreements between users and vendors</li>
              <li>Any damages or losses arising from use of the platform</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-[#1F2937] mb-4">6. Modifications</h2>
            <p>We reserve the right to modify these terms at any time. Users will be notified of significant changes via email or platform notification. Continued use after changes constitutes acceptance of the new terms.</p>
          </section>

          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-[#1F2937] mb-4">7. Contact</h2>
            <p>For questions regarding these terms, please contact us:</p>
            <div className="mt-3 space-y-1 text-[#22C55E]">
              <p>Email: support@vyora.in</p>
              <p>Phone: +91 98765 43210</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default TermsConditions;