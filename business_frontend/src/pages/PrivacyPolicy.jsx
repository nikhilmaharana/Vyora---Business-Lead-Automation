import { Link } from "react-router-dom";
import Icon from "../components/common/Icon";

const PrivacyPolicy = () => {
  return (
    <main className="min-h-screen bg-[#F9FAFB] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-[#22C55E] transition">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Privacy Policy</span>
        </nav>

        {/* Header */}
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-[#111827] to-[#1a2332] p-8 text-white border border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#22C55E]">
              <Icon name="verified_user" size={20} />
            </span>
            <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-[#22C55E]">
              Privacy Policy
            </span>
          </div>
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="mt-2 text-gray-300">Last updated: June 2026</p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-[#374151] leading-relaxed">
          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-[#1F2937] mb-4">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account, submit a requirement, or contact support. This includes:</p>
            <ul className="mt-3 list-disc pl-6 space-y-2">
              <li>Name, email address, phone number, and business details</li>
              <li>Service requirements and preferences</li>
              <li>Communications you send to us or through our platform</li>
              <li>Business listings and service information provided by vendors</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-[#1F2937] mb-4">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="mt-3 list-disc pl-6 space-y-2">
              <li>Connect you with relevant service providers and vendors</li>
              <li>Improve and personalize your experience on Vyora</li>
              <li>Send service-related communications and updates</li>
              <li>Prevent fraud and ensure platform security</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-[#1F2937] mb-4">3. Information Sharing</h2>
            <p>We do not sell your personal information. We may share your information with:</p>
            <ul className="mt-3 list-disc pl-6 space-y-2">
              <li>Service providers you choose to contact through our platform</li>
              <li>Trusted third-party service providers who assist in platform operations</li>
              <li>Law enforcement or regulatory authorities when required by law</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-[#1F2937] mb-4">4. Data Security</h2>
            <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
          </section>

          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-[#1F2937] mb-4">5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="mt-3 list-disc pl-6 space-y-2">
              <li>Access your personal data held by us</li>
              <li>Request correction or deletion of your data</li>
              <li>Opt out of marketing communications</li>
              <li>Withdraw consent where processing is based on consent</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-[#1F2937] mb-4">6. Contact Us</h2>
            <p>If you have questions about this Privacy Policy, please contact us:</p>
            <div className="mt-3 space-y-1 text-[#22C55E]">
              <p>Email: support@vyora.in</p>
              <p>Phone: +91 98765 43210</p>
              <p>Address: Odisha, India</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicy;