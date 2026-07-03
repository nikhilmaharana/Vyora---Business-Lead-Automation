import { useMemo, useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useNavigate, Link, useLocation } from "react-router-dom";
import BusinessCard from "../../components/business/BusinessCard.jsx";
import SearchBar from "../../components/common/SearchBar.jsx";
import FilterSidebar from "../../components/filters/FilterSidebar.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import ActionButton from "../../components/common/ActionButton.jsx";
import Icon from "../../components/common/Icon.jsx";
import { api } from "../../services/api";
import { addCompareItem, removeCompareItem, getCompareItems } from "../../components/business/CompareBar";

const ITEMS_PER_PAGE = 10;

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

// AI-powered search suggestions
const useAISuggestions = (searchTerm) => {
  const [suggestions, setSuggestions] = useState([]);
  const debounceTimer = useRef(null);

  useEffect(() => {
    if (!searchTerm || searchTerm.length < 2) {
      setSuggestions([]);
      return;
    }
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(async () => {
      try {
        const data = await api(`/categories?q=${encodeURIComponent(searchTerm)}`);
        if (data?.results) {
          const cats = data.results.slice(0, 5).map(c => c.name);
          const subs = data.results.flatMap(c => c.subCategories || []).slice(0, 3);
          setSuggestions([...new Set([...cats, ...subs])].slice(0, 6));
        }
      } catch {
        // Silent fail
      }
    }, 300);
    return () => clearTimeout(debounceTimer.current);
  }, [searchTerm]);

  return suggestions;
};

const SearchResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get("query") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [selectedCity, setSelectedCity] = useState(searchParams.get("city") || "");
  const [selectedArea, setSelectedArea] = useState("");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "relevance");
  const [budgetRange, setBudgetRange] = useState({ min: searchParams.get("budgetMin") || "", max: searchParams.get("budgetMax") || "" });
  const [showVerified, setShowVerified] = useState(searchParams.get("verified") === "true");
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
  const [remoteBusinesses, setRemoteBusinesses] = useState(null);
  const [searchError, setSearchError] = useState("");
  const [allBusinesses, setAllBusinesses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState({ cities: [], areas: [] });
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [compareList, setCompareList] = useState(() => getCompareItems().map(i => i.id));
  const [viewMode, setViewMode] = useState("list");

  const aiSuggestions = useAISuggestions(searchTerm);

  useEffect(() => {
    const handler = () => setCompareList(getCompareItems().map(i => i.id));
    window.addEventListener("compareUpdate", handler);
    return () => window.removeEventListener("compareUpdate", handler);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [bizData, catData, locData] = await Promise.allSettled([
          api("/businesses"),
          api("/categories"),
          api("/locations")
        ]);
        
        if (bizData.status === "fulfilled") setAllBusinesses(bizData.value || []);
        if (catData.status === "fulfilled") setCategories(catData.value?.results || []);
        if (locData.status === "fulfilled") setLocations(locData.value || { cities: [], areas: [] });
        
        if (bizData.status === "rejected") {
          setSearchError("Server unavailable. Showing demo data.");
        }
      } catch (err) {
        setSearchError("Could not load data from server.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const runSmartSearch = useCallback(async (query) => {
    const searchQuery = query || searchTerm;
    if (!searchQuery && !selectedCategory && !selectedCity) return;
    
    try {
      setLoading(true);
      const params = new URLSearchParams({
        q: searchQuery,
        location: selectedCity,
        category: selectedCategory,
        sort: sortBy === "rating" ? "top-rated" : sortBy === "reviews" ? "most-reviewed" : "best"
      });
      if (budgetRange.min) params.set("budget", budgetRange.min);
      const data = await api(`/search/smart?${params}`);
      const results = data.results || [];
      setRemoteBusinesses(results);
      setRecommendations(data.recommendations || []);
      setSearchError("");
    } catch {
      setSearchError("Using local search. AI search unavailable.");
      setRemoteBusinesses(null);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory, selectedCity, sortBy, budgetRange]);

  const debounceRef = useRef(null);
  const triggerSmartSearch = useCallback(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSmartSearch(searchTerm), 500);
  }, [runSmartSearch, searchTerm]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("query", searchTerm);
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedCity) params.set("city", selectedCity);
    if (sortBy !== "relevance") params.set("sort", sortBy);
    if (budgetRange.min) params.set("budgetMin", budgetRange.min);
    if (budgetRange.max) params.set("budgetMax", budgetRange.max);
    if (showVerified) params.set("verified", "true");
    if (currentPage > 1) params.set("page", String(currentPage));
    setSearchParams(params, { replace: true });
  }, [searchTerm, selectedCategory, selectedCity, sortBy, budgetRange, showVerified, currentPage, setSearchParams]);

  const mapBusiness = useCallback((item) => ({
    id: item.id,
    name: item.name,
    category: item.category,
    subCategory: item.subCategory || "",
    city: item.city || "",
    area: item.area || "",
    rating: item.rating || 0,
    reviews: item.reviews || Math.round((item.rating || 0) * 20),
    verified: item.verifiedBadge || false,
    verifiedBadge: item.verifiedBadge || false,
    priceRange: item.priceRange || `₹${Number(item.budgetMin || 0).toLocaleString()} – ₹${Number(item.budgetMax || 0).toLocaleString()}`,
    budgetMin: item.budgetMin,
    budgetMax: item.budgetMax,
    experience: item.experience || `${item.responseTimeMins || 30} min response time`,
    responseTimeMins: item.responseTimeMins || 30,
    description: item.usp || "Trusted local service provider.",
    services: item.services || [item.subCategory || item.category].filter(Boolean),
    matchReasons: item.matchReasons || [],
    smartScore: item.smartScore,
    listing: item.listings?.[0],
    listings: item.listings || [],
    workingHours: item.workingHours,
    emergencyAvailable: item.emergencyAvailable,
  }), []);

  const filteredBusinesses = useMemo(() => {
    if (remoteBusinesses) return remoteBusinesses.map(mapBusiness);
    
    const searchText = searchTerm.trim().toLowerCase();
    let filtered = allBusinesses.filter((business) => {
      const name = (business.name || "").toLowerCase();
      const cat = (business.category || "").toLowerCase();
      const sub = (business.subCategory || "").toLowerCase();
      const city = (business.city || "").toLowerCase();
      const area = (business.area || "").toLowerCase();
      const usp = (business.usp || "").toLowerCase();
      const services = (business.services || []).map(s => (s || "").toLowerCase());

      const searchable = [name, cat, sub, city, area, usp, ...services].join(" ");
      const matchesSearch = !searchText || searchable.includes(searchText);

      const matchesCategory = selectedCategory
        ? cat === selectedCategory.toLowerCase() || sub === selectedCategory.toLowerCase()
        : true;

      const matchesCity = selectedCity 
        ? city === selectedCity.toLowerCase() || area === selectedCity.toLowerCase() || 
          (business.serviceAreas || []).some(sa => sa.toLowerCase().includes(selectedCity.toLowerCase()))
        : true;

      const matchesBudget = (!budgetRange.min || (business.budgetMax || Infinity) >= Number(budgetRange.min)) &&
        (!budgetRange.max || (business.budgetMin || 0) <= Number(budgetRange.max));

      const matchesVerified = !showVerified || business.verifiedBadge;

      return matchesSearch && matchesCategory && matchesCity && matchesBudget && matchesVerified;
    });

    if (sortBy === "rating") {
      filtered.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    } else if (sortBy === "reviews") {
      filtered.sort((a, b) => Number(b.reviews || 0) - Number(a.reviews || 0));
    } else if (sortBy === "verified") {
      filtered.sort((a, b) => Number(b.verifiedBadge || false) - Number(a.verifiedBadge || false));
    } else {
      filtered.sort((a, b) => {
        const scoreA = (a.rating || 0) * 10 + (a.verifiedBadge ? 20 : 0) + Math.max(0, 15 - (a.responseTimeMins || 30));
        const scoreB = (b.rating || 0) * 10 + (b.verifiedBadge ? 20 : 0) + Math.max(0, 15 - (b.responseTimeMins || 30));
        return scoreB - scoreA;
      });
    }
    return filtered.map(mapBusiness);
  }, [searchTerm, selectedCategory, selectedCity, sortBy, budgetRange, showVerified, remoteBusinesses, allBusinesses, mapBusiness]);

  const totalPages = Math.ceil(filteredBusinesses.length / ITEMS_PER_PAGE);
  const paginatedBusinesses = filteredBusinesses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const hasActiveFilters = searchTerm || selectedCategory || selectedCity || budgetRange.min || budgetRange.max || showVerified;

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedCity("");
    setSelectedArea("");
    setSortBy("relevance");
    setBudgetRange({ min: "", max: "" });
    setShowVerified(false);
    setCurrentPage(1);
    setRemoteBusinesses(null);
    setRecommendations([]);
  };

  const handleCategoryClick = (catName) => {
    setSelectedCategory(catName);
    setCurrentPage(1);
    if (searchTerm) runSmartSearch(searchTerm);
  };

  const toggleCompare = (business) => {
    if (!business || !business.id) return;
    const businessId = business.id;
    const isSelected = compareList.includes(businessId);
    
    if (isSelected) {
      removeCompareItem(businessId);
      setCompareList(prev => prev.filter(id => id !== businessId));
    } else if (compareList.length < 3) {
      addCompareItem({
        id: businessId,
        title: business.name || business.title || "Business",
        price: business.priceRange || `₹${Number(business.budgetMin || 0).toLocaleString()}`,
        image: business.image || ""
      });
      setCompareList(prev => [...prev, businessId]);
    } else {
      alert("You can compare maximum 3 items at a time.");
    }
  };

  const breadcrumbs = [];
  breadcrumbs.push({ label: "Home", path: "/" });
  breadcrumbs.push({ label: "Search" });
  if (selectedCategory) breadcrumbs.push({ label: selectedCategory });

  if (loading && !allBusinesses.length) {
    return (
      <main className="min-h-screen bg-[#F9FAFB]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
              <p className="mt-4 text-gray-500">Loading businesses...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F9FAFB]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          {breadcrumbs.map((crumb, i) => (
            <span key={`crumb-${i}`} className="flex items-center gap-2">
              {i > 0 && <span>/</span>}
              {crumb.path ? (
                <Link to={crumb.path} className="hover:text-[#22C55E]">{crumb.label}</Link>
              ) : (
                <span className="text-gray-900 font-medium">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>

        {/* Hero Section */}
        <div className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-[#111827] via-[#1a2332] to-[#111827] border border-white/10">
          <div className="relative p-6 sm:p-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#22C55E]/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-20 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl" />
            
            <div className="relative">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-[#22C55E]">
                      <Icon name="travel_explore" size={15} />
                      India's Trusted Marketplace
                    </span>
                    {selectedCategory && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
                        {selectedCategory}
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                    {selectedCategory ? `${selectedCategory} Services` : "Find Trusted Businesses Near You"}
                  </h1>
                  <p className="mt-2 text-sm text-gray-300 max-w-2xl">
                    Search services, compare verified vendors, and get the best quotes. 
                    {allBusinesses.length > 0 && ` ${allBusinesses.length}+ businesses listed.`}
                  </p>
                </div>
                
                <div className="grid grid-cols-3 gap-2 rounded-xl border border-white/10 bg-white/5 p-3 min-w-[200px]">
                  <div className="text-center">
                    <p className="text-lg font-bold text-white">{allBusinesses.length || 6}+</p>
                    <p className="text-[10px] text-gray-400">Vendors</p>
                  </div>
                  <div className="text-center border-x border-white/10">
                    <p className="text-lg font-bold text-white">{categories.length || 10}</p>
                    <p className="text-[10px] text-gray-400">Categories</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-white">{locations.cities.length || 8}</p>
                    <p className="text-[10px] text-gray-400">Cities</p>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <div className="relative">
                  <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onSearch={() => runSmartSearch(searchTerm)}
                    placeholder="Search for services, products, or brands..."
                  />
                  {aiSuggestions.length > 0 && searchTerm && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                      <div className="p-2 border-b border-gray-100">
                        <p className="text-xs font-semibold text-purple-600 flex items-center gap-1">
                          <Icon name="auto_awesome" size={14} /> AI Suggestions
                        </p>
                      </div>
                      {aiSuggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => {
                            setSearchTerm(suggestion);
                            handleCategoryClick(suggestion);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-[#22C55E] flex items-center gap-2 transition"
                        >
                          <Icon name="search" size={16} className="text-gray-400" />
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        {categories.length > 0 && !selectedCategory && !searchTerm && (
          <div className="mb-6 rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#1F2937]">Popular Categories</h2>
              <Link to="/categories" className="text-sm font-semibold text-[#22C55E] hover:underline">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {categories.slice(0, 12).map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => handleCategoryClick(cat.name)}
                  className="flex flex-col items-center gap-2 rounded-xl border border-gray-100 p-4 hover:border-[#22C55E] hover:bg-green-50 transition group"
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform">
                    {iconMap[cat.name] || "📋"}
                  </span>
                  <span className="text-xs font-medium text-gray-700 text-center leading-tight">
                    {cat.name}
                  </span>
                  <span className="text-[10px] text-gray-400">{cat.businessCount}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Trending Searches */}
        {recommendations.length > 0 && (
          <div className="mb-4 rounded-xl border border-purple-100 bg-purple-50 p-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-purple-700 flex items-center gap-1">
                <Icon name="auto_awesome" size={14} /> AI Recommended:
              </span>
              {recommendations.map((rec) => (
                <button
                  key={rec}
                  onClick={() => handleCategoryClick(rec)}
                  className="rounded-full bg-white px-3 py-1 text-xs font-medium text-purple-700 hover:bg-purple-100 border border-purple-200"
                >
                  {rec}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid gap-5 lg:grid-cols-[280px_1fr] lg:gap-6">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm font-semibold text-[#1F2937] lg:hidden"
          >
            <Icon name="filter_list" size={18} />
            {showMobileFilters ? "Hide Filters" : "Show Filters"}
            {hasActiveFilters && (
              <span className="ml-1 rounded-full bg-[#22C55E] px-2 py-0.5 text-xs text-white">
                Active
              </span>
            )}
          </button>

          <aside className={`min-w-0 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
            <FilterSidebar
              selectedCategory={selectedCategory}
              setSelectedCategory={(cat) => { setSelectedCategory(cat); setCurrentPage(1); }}
              selectedCity={selectedCity}
              setSelectedCity={(city) => { setSelectedCity(city); setCurrentPage(1); }}
              selectedArea={selectedArea}
              setSelectedArea={(area) => { setSelectedArea(area); setCurrentPage(1); }}
              categories={[...new Set(allBusinesses.map(b => b.category).filter(Boolean))]}
              categoryData={categories}
              cities={locations.cities}
              areas={locations.areas}
              budgetRange={budgetRange}
              setBudgetRange={setBudgetRange}
              showVerified={showVerified}
              setShowVerified={setShowVerified}
              onApplyFilters={() => triggerSmartSearch()}
              onClearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </aside>

          <section className="min-w-0">
            <div className="mb-4 rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
              {searchError && (
                <div className="mb-3 flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-4 py-2">
                  <Icon name="info" size={16} className="text-amber-600" />
                  <p className="text-sm text-amber-700">{searchError}</p>
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-[#1F2937]">
                      {selectedCategory || searchTerm ? "Search Results" : "All Businesses"}
                    </h2>
                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                      {filteredBusinesses.length}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-[#6B7280]">
                    {hasActiveFilters 
                      ? "Filtered by your preferences. Showing best matches first."
                      : "Browse all verified businesses and service providers."}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 ${viewMode === "list" ? "bg-green-50 text-[#22C55E]" : "text-gray-400 hover:bg-gray-50"}`}
                    >
                      <Icon name="view_list" size={18} />
                    </button>
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 ${viewMode === "grid" ? "bg-green-50 text-[#22C55E]" : "text-gray-400 hover:bg-gray-50"}`}
                    >
                      <Icon name="grid_view" size={18} />
                    </button>
                  </div>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="h-9 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-3 text-xs text-[#1F2937] outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-green-100"
                  >
                    <option value="relevance">AI Smart Sort</option>
                    <option value="rating">Highest Rated</option>
                    <option value="reviews">Most Reviews</option>
                    <option value="verified">Verified First</option>
                  </select>
                </div>
              </div>

              {hasActiveFilters && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {searchTerm && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#F9FAFB] border border-gray-200 px-3 py-1 text-xs font-medium text-[#6B7280]">
                      <Icon name="search" size={14} />
                      {searchTerm}
                      <button onClick={() => { setSearchTerm(""); setCurrentPage(1); }} className="ml-1 text-gray-400 hover:text-gray-600">×</button>
                    </span>
                  )}
                  {selectedCategory && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#F9FAFB] border border-gray-200 px-3 py-1 text-xs font-medium text-[#6B7280]">
                      <Icon name="category_search" size={14} />
                      {selectedCategory}
                      <button onClick={() => { setSelectedCategory(""); setCurrentPage(1); }} className="ml-1 text-gray-400 hover:text-gray-600">×</button>
                    </span>
                  )}
                  {selectedCity && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#F9FAFB] border border-gray-200 px-3 py-1 text-xs font-medium text-[#6B7280]">
                      <Icon name="location_city" size={14} />
                      {selectedCity}
                      <button onClick={() => { setSelectedCity(""); setCurrentPage(1); }} className="ml-1 text-gray-400 hover:text-gray-600">×</button>
                    </span>
                  )}
                  {budgetRange.min && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#F9FAFB] border border-gray-200 px-3 py-1 text-xs font-medium text-[#6B7280]">
                      ₹{Number(budgetRange.min).toLocaleString()}+
                      <button onClick={() => setBudgetRange(prev => ({ ...prev, min: "" }))} className="ml-1 text-gray-400 hover:text-gray-600">×</button>
                    </span>
                  )}
                  {showVerified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 border border-green-200 px-3 py-1 text-xs font-medium text-green-700">
                      ✓ Verified Only
                      <button onClick={() => setShowVerified(false)} className="ml-1 text-green-400 hover:text-green-600">×</button>
                    </span>
                  )}
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-200 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-100"
                  >
                    <Icon name="filter_alt_off" size={14} />
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {compareList.length > 0 && (
              <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 p-3 flex items-center justify-between">
                <p className="text-sm font-medium text-blue-700">
                  {compareList.length} business{compareList.length > 1 ? 'es' : ''} selected for comparison
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/compare-businesses?ids=${compareList.join(",")}`)}
                    className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Compare Now
                  </button>
                  <button
                    onClick={() => {
                      compareList.forEach(id => removeCompareItem(id));
                      setCompareList([]);
                    }}
                    className="rounded-lg border border-blue-200 px-4 py-1.5 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}

            {paginatedBusinesses.length > 0 ? (
              <>
                <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4" : "space-y-4"}>
                  {paginatedBusinesses.map((business) => (
                    <div key={business.id} className="relative">
                      {compareList.includes(business.id) ? (
                        <button
                          onClick={() => toggleCompare(business)}
                          className="absolute top-2 right-2 z-10 rounded-lg px-2 py-1 text-xs font-medium border border-blue-300 bg-blue-100 text-blue-700"
                        >
                          Selected
                        </button>
                      ) : compareList.length < 3 ? (
                        <button
                          onClick={() => toggleCompare(business)}
                          className="absolute top-2 right-2 z-10 rounded-lg px-2 py-1 text-xs font-medium border bg-white border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-600 transition"
                        >
                          Compare
                        </button>
                      ) : null}
                      <BusinessCard business={business} viewMode={viewMode} />
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="rounded-lg border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-medium text-[#1F2937] hover:bg-[#F9FAFB] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Previous
                    </button>
                    
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 7) {
                        pageNum = i + 1;
                      } else if (currentPage <= 4) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 3) {
                        pageNum = totalPages - 6 + i;
                      } else {
                        pageNum = currentPage - 3 + i;
                      }
                      return (
                        <button
                          key={`page-${pageNum}`}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`min-w-[36px] rounded-lg border px-3 py-2 text-sm font-medium transition ${
                            currentPage === pageNum
                              ? "border-[#22C55E] bg-[#22C55E] text-white"
                              : "border-[#E5E7EB] bg-white text-[#1F2937] hover:bg-[#F9FAFB]"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="rounded-lg border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-medium text-[#1F2937] hover:bg-[#F9FAFB] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>
                )}

                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-400">
                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredBusinesses.length)} of {filteredBusinesses.length} results
                  </p>
                </div>
              </>
            ) : (
              <EmptyState
                icon="manage_search"
                title="No businesses found"
                description={
                  searchTerm 
                    ? `We couldn't find any businesses matching "${searchTerm}". Try different keywords or browse categories.`
                    : "No businesses match your current filters. Try adjusting or clearing them."
                }
                action={
                  <ActionButton onClick={clearFilters} icon="filter_alt_off">
                    Clear All Filters
                  </ActionButton>
                }
              />
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default SearchResults;