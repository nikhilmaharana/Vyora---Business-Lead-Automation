import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import Icon from "../../components/common/Icon";

const TrendingServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api("/categories");
        const cats = data.results || [];
        // Transform categories into trending services
        const trending = cats.map((cat, index) => ({
          id: cat.id || index,
          title: cat.name,
          description: `Find trusted ${cat.name.toLowerCase()} service providers near you. Compare ratings, pricing, and connect with verified vendors.`,
          businessCount: cat.businessCount || Math.floor(Math.random() * 50) + 10,
          demand: cat.businessCount > 50 ? "High" : cat.businessCount > 20 ? "Popular" : "Growing",
          category: cat.subCategories?.[0] || cat.name,
          subCategories: cat.subCategories || [],
        }));
        setServices(trending);
      } catch {
        // Use static fallback if API fails
        setServices([
          { id: 1, title: "Interior Design", description: "Modern interior solutions for homes and offices.", businessCount: 45, demand: "High", category: "Home & Lifestyle", subCategories: [] },
          { id: 2, title: "AC Repair", description: "Professional AC repair and maintenance services.", businessCount: 60, demand: "High", category: "Home Services", subCategories: [] },
          { id: 3, title: "Home Cleaning", description: "Deep cleaning services for apartments and houses.", businessCount: 55, demand: "Popular", category: "Home Services", subCategories: [] },
          { id: 4, title: "Web Development", description: "Custom websites, web apps, and e-commerce solutions.", businessCount: 80, demand: "High", category: "Technology", subCategories: [] },
          { id: 5, title: "Digital Marketing", description: "SEO, social media, and paid ads management.", businessCount: 70, demand: "Popular", category: "Marketing", subCategories: [] },
          { id: 6, title: "Event Management", description: "Wedding, corporate, and social event planning.", businessCount: 35, demand: "High", category: "Events", subCategories: [] },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const demandColors = {
    High: "bg-green-50 text-green-700 border-green-200",
    Popular: "bg-blue-50 text-blue-700 border-blue-200",
    Growing: "bg-purple-50 text-purple-700 border-purple-200",
  };

  return (
    <main className="min-h-screen bg-[#F9FAFB] px-6 py-10">
      <section className="mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:text-[#22C55E] transition">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Trending Services</span>
        </nav>

        {/* Hero Section */}
        <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-[#111827] via-[#1a2332] to-[#111827] border border-white/10">
          <div className="relative p-6 sm:p-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-20 w-48 h-48 bg-red-500/5 rounded-full blur-3xl" />
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1.5 text-xs font-semibold text-[#22C55E]">
                <Icon name="local_fire_department" size={15} />
                Trending Services
              </span>
              <h1 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                Services people are searching for
              </h1>
              <p className="mt-2 max-w-2xl text-sm sm:text-base text-gray-300">
                Explore popular services with high customer demand and quickly find vendors for your needs.
                {services.length > 0 && ` ${services.length} services trending.`}
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.id}
                className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${demandColors[service.demand] || demandColors.Growing}`}>
                    <Icon name="trending_up" size={13} />
                    {service.demand} Demand
                  </span>
                  <span className="text-xs font-medium text-[#6B7280] bg-gray-100 px-2.5 py-1 rounded-full">
                    {service.category}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-[#1F2937]">
                  {service.title}
                </h2>

                <p className="mt-3 leading-7 text-[#6B7280] text-sm">
                  {service.description}
                </p>

                {/* Subcategories */}
                {service.subCategories && service.subCategories.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {service.subCategories.slice(0, 3).map((sub, i) => (
                      <span key={i} className="rounded-md bg-gray-50 px-2 py-0.5 text-[10px] font-medium text-gray-500 border border-gray-100">
                        {sub}
                      </span>
                    ))}
                  </div>
                )}

                {/* Business count */}
                <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                  <Icon name="storefront" size={14} />
                  <span>{service.businessCount}+ businesses available</span>
                </div>

                <div className="mt-5 flex gap-3">
                  <Link
                    to={`/search?query=${encodeURIComponent(service.title)}`}
                    className="flex-1 rounded-lg bg-[#22C55E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-600 transition text-center"
                  >
                    Find Vendors
                  </Link>
                  <Link
                    to={`/search?query=${encodeURIComponent(service.title)}`}
                    className="flex-1 rounded-lg border border-[#22C55E] px-4 py-2.5 text-sm font-semibold text-[#22C55E] hover:bg-green-50 transition text-center"
                  >
                    Explore
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-10 rounded-2xl bg-gradient-to-r from-[#111827] to-[#1a2332] p-8 text-center border border-white/10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#22C55E]">
              <Icon name="bolt" size={24} className="text-white" />
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white">Need a service quickly?</h2>
          <p className="mt-2 text-gray-300 max-w-xl mx-auto">
            Use Instant Hire to submit your requirement and connect with suitable vendors faster.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              to="/instant-hire"
              className="rounded-xl bg-[#22C55E] px-6 py-3 text-sm font-bold text-white hover:bg-green-600 transition shadow-lg shadow-green-500/20"
            >
              <span className="flex items-center gap-2">
                <Icon name="bolt" size={16} />
                Go to Instant Hire
              </span>
            </Link>
            <Link
              to="/categories"
              className="rounded-xl border border-white/20 px-6 py-3 text-sm font-bold text-white hover:bg-white/10 transition"
            >
              Browse Categories
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default TrendingServices;