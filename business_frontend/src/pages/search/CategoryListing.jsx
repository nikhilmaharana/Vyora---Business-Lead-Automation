import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../../services/api";
import Icon from "../../components/common/Icon";

const iconMap = {
  "Interior Design": "🏠",
  "Home Services": "🔧",
  "Digital Marketing": "📈",
  "Industrial Machinery": "⚙️",
  "Food & Grocery": "🛒",
  "Medical Equipment": "🏥",
  "Web Development": "💻",
  "Event Management": "🎉",
  "Education": "📚",
  "Design & Branding": "🎨",
};

const CategoryListing = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const data = await api("/categories");
        setCategories(data.results || []);
      } catch (err) {
        setError("Could not load categories.");
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  const filteredCategories = categories.filter((cat) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      cat.name.toLowerCase().includes(q) ||
      cat.subCategories.some((s) => s.toLowerCase().includes(q)) ||
      cat.services.some((s) => s.toLowerCase().includes(q))
    );
  });

  // Group categories by industry/type for better display
  const industryGroups = [
    { name: "Technology & Digital", color: "blue", cats: ["Web Development", "Digital Marketing", "Design & Branding"] },
    { name: "Home & Living", color: "green", cats: ["Interior Design", "Home Services"] },
    { name: "Business & Industry", color: "purple", cats: ["Industrial Machinery", "Medical Equipment"] },
    { name: "Lifestyle & Events", color: "orange", cats: ["Event Management", "Education", "Food & Grocery"] },
  ];

  const getCategoryColor = (catName) => {
    for (const group of industryGroups) {
      if (group.cats.includes(catName)) return group.color;
    }
    return "green";
  };

  const handleCategoryClick = (catName) => {
    navigate(`/search?category=${encodeURIComponent(catName)}`);
  };

  return (
    <main className="min-h-screen bg-[#F9FAFB]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:text-[#22C55E]">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Categories</span>
        </nav>

        {/* Hero Section */}
        <div className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-[#111827] via-[#1a2332] to-[#111827] border border-white/10">
          <div className="relative p-6 sm:p-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-20 w-48 h-48 bg-green-500/5 rounded-full blur-3xl" />
            
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-[#22C55E]">
                  <Icon name="category_search" size={15} />
                  Browse Categories
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                Explore All Business Categories
              </h1>
              <p className="mt-2 text-sm text-gray-300 max-w-2xl">
                Find trusted service providers, products, and vendors across multiple categories. 
                {categories.length > 0 && ` ${categories.length} categories available.`}
              </p>
              
              {/* Search */}
              <div className="mt-5 max-w-md">
                <div className="relative">
                  <Icon name="search" size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search categories, services, or subcategories..."
                    className="w-full rounded-xl border border-white/10 bg-white/10 pl-10 pr-4 py-3 text-sm text-white placeholder-gray-400 outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-green-500/20 transition"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 text-center">
            <p className="text-2xl font-bold text-[#1F2937]">{categories.length || 10}+</p>
            <p className="text-xs text-gray-500">Categories</p>
          </div>
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 text-center">
            <p className="text-2xl font-bold text-[#1F2937]">500+</p>
            <p className="text-xs text-gray-500">Service Providers</p>
          </div>
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 text-center">
            <p className="text-2xl font-bold text-[#1F2937]">50+</p>
            <p className="text-xs text-gray-500">Cities Covered</p>
          </div>
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 text-center">
            <p className="text-2xl font-bold text-[#1F2937]">50K+</p>
            <p className="text-xs text-gray-500">Leads Generated</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-dashed border-red-200 bg-red-50 p-10 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        ) : filteredCategories.length > 0 ? (
          <>
            {/* If not searching, show categories grouped by industry */}
            {!searchQuery ? (
              industryGroups.map((group) => {
                const groupCats = filteredCategories.filter(cat => group.cats.includes(cat.name));
                if (groupCats.length === 0) return null;
                return (
                  <div key={group.name} className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-[#1F2937]">{group.name}</h2>
                      <Link to={`/search?category=${encodeURIComponent(groupCats[0]?.name || "")}`} className="text-sm font-semibold text-[#22C55E] hover:underline">
                        View All →
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {groupCats.map((item, index) => (
                        <div
                          key={index}
                          onClick={() => handleCategoryClick(item.name)}
                          className="group cursor-pointer relative overflow-hidden bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-green-100 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                          
                          <div className="relative z-10 flex items-start gap-4">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#22C55E] to-emerald-600 flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shrink-0">
                              {iconMap[item.name] || "📋"}
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-bold text-gray-800 text-base">{item.name}</h3>
                              <p className="text-xs text-gray-400 mt-1">
                                {item.businessCount} businesses · ⭐ {item.avgRating || "N/A"}
                              </p>
                              <div className="mt-2 flex flex-wrap gap-1">
                                {item.subCategories.slice(0, 2).map((sub, i) => (
                                  <span key={i} className="text-[10px] text-gray-500 bg-gray-100 rounded-md px-2 py-0.5">
                                    {sub}
                                  </span>
                                ))}
                                {item.subCategories.length > 2 && (
                                  <span className="text-[10px] text-gray-400">+{item.subCategories.length - 2}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-green-100 opacity-0 group-hover:opacity-30 transition-all duration-300" />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              /* Search results: show all matching categories in grid */
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-[#1F2937]">
                    Search Results ({filteredCategories.length})
                  </h2>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-sm font-semibold text-red-500 hover:text-red-600"
                  >
                    Clear Search
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredCategories.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => handleCategoryClick(item.name)}
                      className="group cursor-pointer relative overflow-hidden bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-green-100 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      
                      <div className="relative z-10 flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#22C55E] to-emerald-600 flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shrink-0">
                          {iconMap[item.name] || "📋"}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-gray-800 text-base">{item.name}</h3>
                          <p className="text-xs text-gray-400 mt-1">
                            {item.businessCount} businesses · ⭐ {item.avgRating || "N/A"}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {item.subCategories.slice(0, 3).map((sub, i) => (
                              <span key={i} className="text-[10px] text-gray-500 bg-gray-100 rounded-md px-2 py-0.5">
                                {sub}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center mt-8">
            <h3 className="text-xl font-bold text-gray-900">No categories found</h3>
            <p className="mt-2 text-gray-500">Try a different search term.</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-10 rounded-2xl bg-gradient-to-r from-[#111827] to-[#1a2332] p-8 text-center border border-white/10">
          <h2 className="text-2xl font-bold text-white">Can't find what you're looking for?</h2>
          <p className="mt-2 text-gray-300 max-w-xl mx-auto">
            Post your requirement and let vendors reach out to you with customized quotes.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => navigate("/instant-hire")}
              className="rounded-xl bg-[#22C55E] px-6 py-3 text-sm font-bold text-white hover:bg-green-600 transition shadow-lg shadow-green-500/20"
            >
              Post Requirement
            </button>
            <button
              onClick={() => navigate("/search")}
              className="rounded-xl border border-white/20 px-6 py-3 text-sm font-bold text-white hover:bg-white/10 transition"
            >
              Browse All Services
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CategoryListing;