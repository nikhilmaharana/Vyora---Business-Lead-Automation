import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { api } from "../../services/api";
import { getCompareItems, removeCompareItem } from "../../components/business/CompareBar";
import { Star, MapPin, Check, X, Shield, BarChart3, Trash2, AlertCircle, ArrowLeft } from "lucide-react";

const CompareBusinesses = () => {
  const [businesses, setBusinesses] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();

  // Read pre-selected IDs from URL params (from SearchResults page)
  // OR from localStorage CompareBar items
  useEffect(() => {
    // First priority: URL params
    const idsFromUrl = searchParams.get("ids");
    if (idsFromUrl) {
      const ids = idsFromUrl.split(",").filter(Boolean);
      if (ids.length > 0) {
        setSelectedIds(ids);
        return;
      }
    }
    // Second priority: CompareBar localStorage items
    const barItems = getCompareItems();
    if (barItems.length > 0) {
      const barIds = barItems.map(item => item.id).filter(Boolean);
      setSelectedIds(barIds);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const data = await api("/businesses");
      const items = Array.isArray(data) ? data : data.results || [];
      // Filter out items without valid IDs
      setBusinesses(items.filter(b => b && b.id));
    } catch (err) {
      setError(err.message || "Failed to load businesses.");
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (id) => {
    if (!id) return;
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(sid => sid !== id);
      } else if (prev.length < 3) {
        return [...prev, id];
      } else {
        alert("You can compare maximum 3 businesses at a time.");
        return prev;
      }
    });
  };

  const handleRemoveFromBar = (id) => {
    removeCompareItem(id);
    setSelectedIds(prev => prev.filter(sid => sid !== id));
  };

  const selectedBusinesses = businesses.filter(b => b && b.id && selectedIds.includes(b.id));

  const featureRows = [
    { key: "verifiedBadge", label: "Verified Badge" },
    { key: "emergencyAvailable", label: "Emergency Service" },
    { key: "kycStatus", label: "KYC Verified" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
          <p className="mt-4 text-gray-500">Loading businesses for comparison...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F9FAFB] px-4 py-6 sm:px-6 sm:py-10">
      <section className="mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:text-[#22C55E] transition">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Compare Businesses</span>
        </nav>

        {/* Hero Section */}
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-[#111827] via-[#1a2332] to-[#111827] p-6 sm:p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-20 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1.5 text-xs font-semibold text-[#22C55E]">
              <BarChart3 size={14} />
              Compare Businesses
            </span>
            <h1 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-bold">
              Compare businesses side by side
            </h1>
            <p className="mt-2 max-w-2xl text-sm sm:text-base text-gray-300">
              Select up to 3 businesses and compare ratings, services, location, price range, and verification status to find the best option.
            </p>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <AlertCircle className="text-red-500 shrink-0" size={20} />
            <p className="text-sm text-red-700">{error}</p>
            <button onClick={fetchBusinesses} className="ml-auto rounded-lg bg-red-100 px-4 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200 transition">
              Retry
            </button>
          </div>
        )}

        {/* Business Selection */}
        <div className="mb-8 rounded-2xl border border-[#E5E7EB] bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#1F2937]">Select businesses to compare</h2>
              <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
                Selected {selectedBusinesses.length} of 3 businesses
              </p>
            </div>
            {selectedBusinesses.length > 0 && (
              <button
                onClick={() => setSelectedIds([])}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
              >
                <Trash2 size={14} />
                Clear Selection
              </button>
            )}
          </div>

          {businesses.length === 0 ? (
            <div className="mt-6 text-center py-12">
              <BarChart3 className="mx-auto text-gray-300" size={48} />
              <p className="mt-3 text-gray-500 font-medium">No businesses available</p>
              <p className="text-sm text-gray-400 mt-1">Businesses will appear here once registered on the platform.</p>
            </div>
          ) : (
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {businesses.map((business) => {
                const isSelected = selectedIds.includes(business.id);
                return (
                  <button
                    key={business.id}
                    onClick={() => handleSelect(business.id)}
                    className={`rounded-2xl border-2 p-4 sm:p-5 text-left transition-all duration-200 ${
                      isSelected
                        ? "border-[#22C55E] bg-green-50 shadow-md shadow-green-100"
                        : "border-[#E5E7EB] bg-[#F9FAFB] hover:border-[#22C55E] hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-bold text-[#1F2937] truncate">{business.name}</h3>
                        <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5 truncate">{business.category}</p>
                      </div>
                      {isSelected && (
                        <span className="shrink-0 rounded-full bg-[#22C55E] px-2.5 py-0.5 text-[11px] font-bold text-white flex items-center gap-1">
                          <Check size={12} />
                          Selected
                        </span>
                      )}
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs sm:text-sm text-[#6B7280] flex-wrap">
                      <span className="flex items-center gap-1">
                        <Star className="fill-yellow-400 text-yellow-400" size={14} />
                        {business.rating || "N/A"}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="flex items-center gap-1">
                        <MapPin size={14} className="text-gray-400" />
                        {business.city || business.area || "N/A"}
                      </span>
                    </div>
                    <p className="mt-2 text-xs font-semibold text-[#22C55E]">
                      ₹{Number(business.budgetMin || 0).toLocaleString()} - ₹{Number(business.budgetMax || 0).toLocaleString()}
                    </p>
                    {business.verifiedBadge && (
                      <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-green-700 bg-green-50 rounded-full px-2.5 py-0.5 inline-flex border border-green-200">
                        <Shield size={12} />
                        Verified
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Comparison Table */}
        {selectedBusinesses.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
            <table className="w-full min-w-[650px] border-collapse text-left">
              <thead className="bg-[#111827] text-white">
                <tr>
                  <th className="p-3 sm:p-4 text-xs sm:text-sm font-semibold sticky left-0 bg-[#111827] z-10">Feature</th>
                  {selectedBusinesses.map((business) => (
                    <th key={business.id} className="p-3 sm:p-4 text-xs sm:text-sm font-semibold text-center">
                      <div className="flex items-center justify-center gap-2">
                        {business.name}
                        <button
                          onClick={() => handleRemoveFromBar(business.id)}
                          className="text-white/60 hover:text-red-300 transition"
                          title="Remove from comparison"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#E5E7EB]">
                  <td className="p-3 sm:p-4 font-semibold text-[#1F2937] text-sm">Category</td>
                  {selectedBusinesses.map((business) => (
                    <td key={business.id} className="p-3 sm:p-4 text-center text-sm text-[#6B7280]">{business.category || "N/A"}</td>
                  ))}
                </tr>
                <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                  <td className="p-3 sm:p-4 font-semibold text-[#1F2937] text-sm">Rating</td>
                  {selectedBusinesses.map((business) => (
                    <td key={business.id} className="p-3 sm:p-4 text-center text-sm text-[#6B7280]">
                      <span className="flex items-center justify-center gap-1">
                        <Star className="fill-yellow-400 text-yellow-400" size={16} />
                        {business.rating || "N/A"}
                        <span className="text-gray-400">({business.reviews || 0} reviews)</span>
                      </span>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-[#E5E7EB]">
                  <td className="p-3 sm:p-4 font-semibold text-[#1F2937] text-sm">Location</td>
                  {selectedBusinesses.map((business) => (
                    <td key={business.id} className="p-3 sm:p-4 text-center text-sm text-[#6B7280]">
                      <span className="flex items-center justify-center gap-1">
                        <MapPin size={14} className="text-gray-400" />
                        {business.city || "N/A"}, {business.state || ""}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                  <td className="p-3 sm:p-4 font-semibold text-[#1F2937] text-sm">Price Range</td>
                  {selectedBusinesses.map((business) => (
                    <td key={business.id} className="p-3 sm:p-4 text-center text-sm font-medium text-[#22C55E]">
                      ₹{Number(business.budgetMin || 0).toLocaleString()} - ₹{Number(business.budgetMax || 0).toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-[#E5E7EB]">
                  <td className="p-3 sm:p-4 font-semibold text-[#1F2937] text-sm">Response Time</td>
                  {selectedBusinesses.map((business) => (
                    <td key={business.id} className="p-3 sm:p-4 text-center text-sm text-[#6B7280]">{business.responseTimeMins || "N/A"} mins</td>
                  ))}
                </tr>
                {featureRows.map((feature, index) => (
                  <tr key={feature.key} className={`${index % 2 === 0 ? "bg-[#F9FAFB]" : ""} border-b border-[#E5E7EB]`}>
                    <td className="p-3 sm:p-4 font-semibold text-[#1F2937] text-sm">{feature.label}</td>
                    {selectedBusinesses.map((business) => (
                      <td key={business.id} className="p-3 sm:p-4 text-center">
                        {business[feature.key] || business[feature.key] === true ? (
                          <span className="inline-flex items-center gap-1.5 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-medium">
                            <Check size={14} />
                            Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-red-500 bg-red-50 px-3 py-1 rounded-full text-xs font-medium">
                            <X size={14} />
                            No
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="bg-[#F9FAFB]">
                  <td className="p-3 sm:p-4 font-semibold text-[#1F2937] text-sm">Action</td>
                  {selectedBusinesses.map((business) => (
                    <td key={business.id} className="p-3 sm:p-4 text-center">
                      <Link
                        to={`/product-details/${business.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#22C55E] px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-green-600 transition shadow-sm"
                      >
                        Get Quote
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#E5E7EB] bg-white p-8 sm:p-16 text-center">
            <BarChart3 className="mx-auto text-gray-300" size={56} />
            <h3 className="mt-4 text-xl font-bold text-[#1F2937]">No businesses selected</h3>
            <p className="mt-2 text-[#6B7280] max-w-md mx-auto">
              Select up to 3 businesses from the list above to compare their features, pricing, and ratings side by side.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {businesses.slice(0, 3).map((b) => (
                <button
                  key={b.id}
                  onClick={() => handleSelect(b.id)}
                  className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] hover:border-[#22C55E] hover:bg-green-50 px-4 py-2.5 text-sm font-medium text-[#1F2937] transition"
                >
                  + {b.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default CompareBusinesses;