import {
  FaSearch,
  FaQuestionCircle,
  FaHeadset,
  FaWhatsapp,
  FaEnvelope,
  FaArrowRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const HelpCenterPage = () => {

  const navigate = useNavigate()
  const helpCategories = [
    {
      title: "Account Support",
      description:
        "Manage your account, profile settings, and login issues.",
      icon: <FaQuestionCircle size={28} />,
    },

    {
      title: "Vendor Assistance",
      description:
        "Get help with vendor onboarding, listings, and inquiries.",
      icon: <FaHeadset size={28} />,
    },

    {
      title: "Automation Services",
      description:
        "Learn more about CRM, AI, ERP, and workflow automation.",
      icon: <FaWhatsapp size={28} />,
    },

    {
      title: "Billing & Payments",
      description:
        "Resolve payment issues, invoices, subscriptions, and plans.",
      icon: <FaEnvelope size={28} />,
    },
  ];

  const faqs = [
    {
      question: "How do I contact a vendor?",
      answer:
        "You can contact vendors directly using inquiry forms, WhatsApp buttons, or contact details available on their profile page.",
    },

    {
      question: "Is Vyora free to use?",
      answer:
        "Yes, users can browse vendors and services for free. Vendors may subscribe to premium plans for featured listings.",
    },

    {
      question: "How do I submit my business?",
      answer:
        "You can register your business through the vendor onboarding page and submit your service details for verification.",
    },

    {
      question: "Can I request custom automation solutions?",
      answer:
        "Yes, businesses can submit custom requirements and connect with automation experts for tailored solutions.",
    },
  ];

  return (
  <div className="min-h-screen bg-[#F9FAFB] text-[#0F172A]">
      {/* ================= HERO SECTION ================= */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-4xl border border-white/10 bg-[#111827]">

          {/* Background */}
          <div className="absolute inset-0">
            <img
              src="/src/assets/banners.jpg"
              alt="Help Center"
              className="h-full w-full object-cover opacity-20"
            />
            <div className="absolute inset-0 " />
          </div>

          {/* Glow */}
          <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-[#22C55E]/10 blur-3xl" />

          {/* Content */}
          <div className="relative z-10 px-6 py-20 text-center sm:px-12 lg:px-20">

            <span className="inline-flex items-center gap-2 rounded-full border border-[#22C55E]/20 bg-[#22C55E]/10 px-5 py-2 text-sm font-medium text-[#22C55E]">
              <FaQuestionCircle />
              Vyora Help Center
            </span>

            <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl text-white">
              How Can We Help You Today?
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-300">
              Find support articles, vendor guidance, automation help,
              billing information, and answers to common questions.
            </p>

            {/* Search */}
            <div className="mx-auto mt-10 max-w-2xl">
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white px-6 py-4 backdrop-blur-xl">

                <FaSearch className="text-[#22C55E]" />

                <input
                  type="text"
                  placeholder="Search help articles..."
                  className="w-full bg-transparent text-white outline-none placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HELP CATEGORIES ================= */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">

        <div className="mb-14 text-center">
          <span className="rounded-full bg-[#22C55E]/10 px-4 py-2 text-sm font-medium text-[#22C55E]">
            Support Categories
          </span>

          <h2 className="mt-5 text-4xl font-bold">
            Explore Help Categories
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-400">
            Browse support topics and find the assistance you need.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {helpCategories.map((item, index) => (
            <div
              key={index}
              className="group rounded-3xl border border-black/20 bg-white p-8 transition duration-300 hover:-translate-y-2 hover:border-[#22C55E]/40"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#22C55E]/10 text-[#22C55E] transition group-hover:bg-[#22C55E] group-hover:text-white">
                {item.icon}
              </div>

              <h3 className="mt-6 text-2xl font-semibold">
                {item.title}
              </h3>

              <p className="mt-4 leading-7 text-gray-400">
                {item.description}
              </p>

              <button className="mt-6 flex items-center gap-2 font-medium text-[#22C55E] transition hover:gap-3">
                Learn More
                <FaArrowRight />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section className="border-y border-white/10  bg-[#F9FAFB]  py-20">

        <div className="mx-auto max-w-5xl px-4 sm:px-6">

          <div className="mb-14 text-center">

            <span className="rounded-full bg-[#22C55E]/10 px-4 py-2 text-sm font-medium text-[#22C55E]">
              Frequently Asked Questions
            </span>

            <h2 className="mt-5 text-4xl font-bold">
              Common Questions & Answers
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-gray-400">
              Everything you need to know about Vyora
              and our automation marketplace platform.
            </p>
          </div>

          <div className="space-y-6">

            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-3xl border border-white/10 bg-[#0F172A] p-8 transition hover:border-[#22C55E]/30"
              >
                <h3 className="text-2xl font-semibold text-white">
                  {faq.question}
                </h3>

                <p className="mt-4 leading-8 text-gray-400">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CONTACT SECTION ================= */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">

        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-4xl border border-white/10 bg-[#111827]">

          {/* Background */}
          <div className="absolute inset-0">
            <img
              src="/src/assets/banners.jpg"
              alt="Support Banner"
              className="h-full w-full object-cover opacity-20"
            />
            <div className="absolute inset-0 " />
          </div>

          {/* Glow */}
          <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-[#22C55E]/10 blur-3xl" />

          {/* Content */}
          <div className="relative z-10 px-8 py-20 text-center sm:px-16">

            <h2 className="mx-auto max-w-4xl text-4xl font-bold sm:text-5xl text-white">
              Still Need Help?
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-300">
              Our support team is ready to help you with automation
              services, vendor support, platform issues, and more.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">

              <button className="rounded-2xl bg-[#22C55E] px-8 py-3 font-semibold text-white transition hover:bg-green-600"
              onClick={()=>navigate('/contact')}>
                Contact Support
              </button>

              <button className="rounded-2xl border border-white/10 bg-white/5 px-8 py-3 font-semibold text-white backdrop-blur-md transition hover:bg-white/10">
                Live Chat
              </button>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HelpCenterPage;
