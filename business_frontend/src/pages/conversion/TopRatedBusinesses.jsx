import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import BusinessCard from "../../components/business/BusinessCard";
import Icon from "../../components/common/Icon";

const TopRatedBusinesses = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await api("/businesses");
        const items = Array.isArray(data) ? data : data.results || [];
        setBusinesses(items.filter(b => b && b.id && b.rating));
      } catch (err) {
        setError(err.message || "Failed to load businesses.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories = [...new Set(businesses.map(b => b.category).filter(Boolean))];

  const filteredBusinesses = businesses
    .filter(b => !selectedCategory || b.category === selectedCategory)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0));

  const verifiedCount = businesses.filter(b => b.verifiedBadge).length;
  const highestRating = businesses.length > 0 ? Math.max(...businesses.map(b => b.rating || 0)) : 0;
  const topCities = [...new Set(businesses.map(b => b.city).filter(Boolean))].slice(0, 3);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F9FAFB] px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
              <p className="mt-4 text-gray-500">Loading top rated businesses...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F9FAFB] px-6 py-10">
      <section className="mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:text-[#22C55E] transition">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Top Rated Businesses</span>
        </nav>

        {/* Hero Section */}
        <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-[#111827] via-[#1a2332] to-[#111827] border border-white/10">
          <div className="relative p-6 sm:p-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-20 w-48 h-48 bg-green-500/5 rounded-full blur-3xl" />
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1.5 text-xs font-semibold text-[#22C55E]">
                <Icon name="workspace_premium" size={15} />
                Top Rated
              </span>
              <h1 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                Top rated businesses on Vyora
              </h1>
              <p className="mt-2 max-w-2xl text-sm sm:text-base text-gray-300">
                Discover highly rated and trusted businesses based on customer reviews and ratings. 
                {businesses.length > 0 && `${businesses.length} businesses listed.`}
              </p>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <Icon name="info" size={20} className="text-red-500" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#6B7280]">Total Businesses</p>
            <h3 className="mt-2 text-2xl font-bold text-[#1F2937]">
              {businesses.length}
            </h3>
          </div>
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#6B7280]">Verified Businesses</p>
            <h3 className="mt-2 text-2xl font-bold text-[#1F2937]">
              {verifiedCount}
            </h3>
          </div>
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#6B7280]">Highest Rating</p>
            <h3 className="mt-2 text-2xl font-bold text-[#1F2937]">
              {highestRating.toFixed(1)} ★
            </h3>
          </div>
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#6B7280]">Top Cities</p>
            <h3 className="mt-2 text-2xl font-bold text-[#1F2937]">
              {topCities.join(", ") || "N/A"}
            </h3>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="mb-5 flex flex-col justify-between gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-[#1F2937]">
              Ranked businesses
            </h2>
            <p className="mt-1 text-sm text-[#6B7280]">
              Sorted by highest rating first
              {selectedCategory && ` • ${selectedCategory}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory("")}
                className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
              >
                Clear Filter
              </button>
            )}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2 text-sm text-[#1F2937] outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-green-100"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredBusinesses.length > 0 ? (
          <div className="space-y-4">
            {filteredBusinesses.map((business, index) => (
              <div key={business.id} className="relative">
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#22C55E] text-xs font-bold text-white shadow-lg shadow-green-200">
                  #{index + 1}
                </div>
                <div className="pl-6">
                  <BusinessCard business={business} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
            <Icon name="workspace_premium" size={48} className="mx-auto text-gray-300" />
            <h3 className="mt-4 text-xl font-bold text-[#1F2937]">No businesses found</h3>
            <p className="mt-2 text-gray-500">No rated businesses match your criteria.</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-10 rounded-2xl bg-gradient-to-r from-[#111827] to-[#1a2332] p-8 text-center border border-white/10">
          <h2 className="text-2xl font-bold text-white">Want to see your business here?</h2>
          <p className="mt-2 text-gray-300 max-w-xl mx-auto">
            Register your business on Vyora, get verified, and start receiving quality leads.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              to="/signup"
              className="rounded-xl bg-[#22C55E] px-6 py-3 text-sm font-bold text-white hover:bg-green-600 transition shadow-lg shadow-green-500/20"
            >
              Register Your Business
            </Link>
            <Link
              to="/search"
              className="rounded-xl border border-white/20 px-6 py-3 text-sm font-bold text-white hover:bg-white/10 transition"
            >
              Browse All Services
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default TopRatedBusinesses;