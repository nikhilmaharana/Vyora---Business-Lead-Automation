import { useParams } from "react-router-dom";
import {
  FaStar,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";

const CategoryPage = () => {
  const { category } = useParams();

  const vendors = [
    {
      id: 1,
      name: "AutoFlow Solutions",
      category: "crm-automation",
      rating: 4.8,
      location: "Bhubaneswar, Odisha",
      experience: "5+ Years",
      image:
        "https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=1200&auto=format&fit=crop",
      description:
        "CRM workflow automation, sales pipeline setup, and lead management solutions.",
    },
    {
      id: 2,
      name: "LeadBoost AI",
      category: "crm-automation",
      rating: 4.7,
      location: "Bangalore, India",
      experience: "6+ Years",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop",
      description:
        "AI-powered CRM automation for growing businesses and enterprises.",
    },
    {
      id: 3,
      name: "WhatsFlow Tech",
      category: "whatsapp-automation",
      rating: 4.9,
      location: "Hyderabad, India",
      experience: "4+ Years",
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
      description:
        "WhatsApp lead automation and customer communication workflows.",
    },
  ];

  const categoryBenefits = {
    "crm-automation": [
      "Automated lead tracking",
      "Sales pipeline management",
      "Customer follow-up automation",
      "Real-time analytics",
    ],

    "whatsapp-automation": [
      "Instant customer replies",
      "Automated WhatsApp campaigns",
      "Lead nurturing",
      "Bulk messaging workflows",
    ],
  };

  const filteredVendors = vendors.filter(
    (vendor) => vendor.category === category
  );

  const formattedTitle = category
    ?.split("-")
    .map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      {/* ================= HERO SECTION ================= */}
      <section className="border-b border-white/10 bg-[#111827]">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-3xl">
            <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-sm text-cyan-300">
              Business Automation Services
            </span>

            <h1 className="mt-6 text-5xl font-bold leading-tight">
              Best {formattedTitle} Services
            </h1>

            <p className="mt-6 text-lg text-gray-400">
              Connect with verified {formattedTitle} experts
              and automation companies for smarter workflows,
              better customer management, and business growth.
            </p>

            <div className="mt-8 flex gap-4">
              <button className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black transition hover:bg-cyan-400">
                Get Free Quotes
              </button>

              <button className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 transition hover:bg-white/10">
                Talk to Experts
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BENEFITS SECTION ================= */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-12">
          <h2 className="text-4xl font-bold">
            Why Choose {formattedTitle}?
          </h2>

          <p className="mt-4 max-w-2xl text-gray-400">
            Improve efficiency and automate repetitive tasks
            with modern business automation solutions.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {categoryBenefits[category]?.map((benefit, index) => (
            <div
              key={index}
              className="rounded-3xl border border-white/10 bg-[#111827] p-6 transition hover:border-cyan-400"
            >
              <FaCheckCircle
                size={28}
                className="mb-4 text-cyan-400"
              />

              <h3 className="text-lg font-semibold">
                {benefit}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* ================= VENDORS SECTION ================= */}
      <section className="bg-[#111827] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold">
                Top {formattedTitle} Vendors
              </h2>

              <p className="mt-4 text-gray-400">
                Explore trusted service providers and automation
                agencies.
              </p>
            </div>

            <button className="hidden items-center gap-2 text-cyan-400 md:flex">
              View All <FaArrowRight />
            </button>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredVendors.map((vendor) => (
              <div
                key={vendor.id}
                className="overflow-hidden rounded-3xl border border-white/10 bg-[#0F172A] transition hover:-translate-y-1 hover:border-cyan-400"
              >
                {/* IMAGE */}
                <img
                  src={vendor.image}
                  alt={vendor.name}
                  className="h-56 w-full object-cover"
                />

                {/* CONTENT */}
                <div className="p-6">
                  <span className="rounded-full bg-cyan-500/10 px-4 py-1 text-sm text-cyan-400">
                    {formattedTitle}
                  </span>

                  <h3 className="mt-4 text-2xl font-bold">
                    {vendor.name}
                  </h3>

                  {/* RATING */}
                  <div className="mt-3 flex items-center gap-2">
                    <FaStar className="text-yellow-400" />

                    <span>{vendor.rating}</span>

                    <span className="text-gray-400">
                      ({vendor.experience})
                    </span>
                  </div>

                  {/* LOCATION */}
                  <div className="mt-3 flex items-center gap-2 text-gray-400">
                    <FaMapMarkerAlt />

                    <span>{vendor.location}</span>
                  </div>

                  {/* DESCRIPTION */}
                  <p className="mt-5 text-gray-400">
                    {vendor.description}
                  </p>

                  {/* BUTTONS */}
                  <div className="mt-6 flex gap-4">
                    <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-black transition hover:bg-cyan-400">
                      View Details
                      <FaArrowRight />
                    </button>

                    <button className="rounded-xl border border-green-500 bg-green-500/10 px-5 py-3 text-green-400 transition hover:bg-green-500 hover:text-white">
                      <FaWhatsapp size={22} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold">
            Frequently Asked Questions
          </h2>

          <p className="mt-4 text-gray-400">
            Common questions about {formattedTitle} services.
          </p>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-[#111827] p-6">
            <h3 className="text-xl font-semibold">
              What is {formattedTitle}?
            </h3>

            <p className="mt-3 text-gray-400">
              {formattedTitle} helps businesses automate
              repetitive tasks, improve workflow efficiency,
              and streamline customer management processes.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111827] p-6">
            <h3 className="text-xl font-semibold">
              How much does {formattedTitle} cost?
            </h3>

            <p className="mt-3 text-gray-400">
              Pricing depends on features, integrations,
              workflow complexity, and business requirements.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111827] p-6">
            <h3 className="text-xl font-semibold">
              Can small businesses use automation services?
            </h3>

            <p className="mt-3 text-gray-400">
              Yes, automation solutions are suitable for
              startups, small businesses, and enterprises.
            </p>
          </div>
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="bg-cyan-500 py-16 text-black">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
          <div>
            <h2 className="text-4xl font-bold">
              Ready to Automate Your Business?
            </h2>

            <p className="mt-2 text-lg">
              Connect with trusted automation vendors today.
            </p>
          </div>

          <button className="rounded-2xl bg-black px-8 py-4 text-lg font-semibold text-white transition hover:bg-gray-900">
            Get Free Consultation
          </button>
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;
