import { useState } from "react";
import Icon from "../common/Icon";

const FilterSidebar = ({
  selectedCategory,
  setSelectedCategory,
  selectedCity,
  setSelectedCity,
  selectedArea,
  setSelectedArea,
  categories = [],
  categoryData = [],
  cities = [],
  areas = [],
  budgetRange = { min: "", max: "" },
  setBudgetRange,
  showVerified = false,
  setShowVerified,
  onApplyFilters,
  onClearFilters,
  hasActiveFilters = false,
}) => {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllCities, setShowAllCities] = useState(false);

  const displayCategories = showAllCategories ? categories : categories.slice(0, 10);
  const displayCities = showAllCities ? cities : cities.slice(0, 8);

  // Get category business count from categoryData
  const getCategoryCount = (catName) => {
    const found = categoryData.find(c => c.name === catName);
    return found?.businessCount || 0;
  };

  const quickPriceRanges = [
    { label: "Under ₹10,000", min: 0, max: 10000 },
    { label: "₹10K - ₹50K", min: 10000, max: 50000 },
    { label: "₹50K - ₹1L", min: 50000, max: 100000 },
    { label: "₹1L - ₹5L", min: 100000, max: 500000 },
    { label: "₹5L+", min: 500000, max: "" },
  ];

  return (
    <aside className="h-fit rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h3 className="font-bold text-[#1F2937] flex items-center gap-2">
          <Icon name="filter_list" size={18} />
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-xs font-semibold text-red-500 hover:text-red-600"
          >
            Reset All
          </button>
        )}
      </div>

      <div className="p-4 space-y-5">
        {/* Verified Filter */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              onClick={() => setShowVerified(!showVerified)}
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition ${
                showVerified
                  ? "bg-[#22C55E] border-[#22C55E]"
                  : "border-gray-300 group-hover:border-[#22C55E]"
              }`}
            >
              {showVerified && <Icon name="check" size={14} className="text-white" />}
            </div>
            <span className="text-sm font-medium text-[#1F2937]">Verified Sellers Only</span>
            <span className="text-xs text-[#22C55E] font-semibold">★</span>
          </label>
        </div>

        <div className="border-t border-gray-100" />

        {/* Category Filter */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-bold text-[#1F2937]">Category</label>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory("")}
                className="text-xs text-red-500 hover:text-red-600"
              >
                Clear
              </button>
            )}
          </div>
          <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
            <button
              onClick={() => setSelectedCategory("")}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                !selectedCategory
                  ? "bg-green-50 text-[#22C55E] font-semibold"
                  : "text-[#6B7280] hover:bg-gray-50"
              }`}
            >
              All Categories
            </button>
            {displayCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center justify-between ${
                  selectedCategory === cat
                    ? "bg-green-50 text-[#22C55E] font-semibold"
                    : "text-[#6B7280] hover:bg-gray-50"
                }`}
              >
                <span className="truncate">{cat}</span>
                {getCategoryCount(cat) > 0 && (
                  <span className="text-[10px] text-gray-400 ml-2 shrink-0">({getCategoryCount(cat)})</span>
                )}
              </button>
            ))}
          </div>
          {categories.length > 10 && (
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="mt-2 text-xs font-semibold text-[#22C55E] hover:underline"
            >
              {showAllCategories ? "Show Less ↑" : `Show All (${categories.length}) ↓`}
            </button>
          )}
        </div>

        <div className="border-t border-gray-100" />

        {/* City Filter */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-bold text-[#1F2937]">City</label>
            {selectedCity && (
              <button
                onClick={() => setSelectedCity("")}
                className="text-xs text-red-500 hover:text-red-600"
              >
                Clear
              </button>
            )}
          </div>
          <div className="space-y-1 max-h-52 overflow-y-auto custom-scrollbar">
            <button
              onClick={() => setSelectedCity("")}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                !selectedCity
                  ? "bg-green-50 text-[#22C55E] font-semibold"
                  : "text-[#6B7280] hover:bg-gray-50"
              }`}
            >
              All Cities
            </button>
            {displayCities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                  selectedCity === city
                    ? "bg-green-50 text-[#22C55E] font-semibold"
                    : "text-[#6B7280] hover:bg-gray-50"
                }`}
              >
                {city}
              </button>
            ))}
          </div>
          {cities.length > 8 && (
            <button
              onClick={() => setShowAllCities(!showAllCities)}
              className="mt-2 text-xs font-semibold text-[#22C55E] hover:underline"
            >
              {showAllCities ? "Show Less ↑" : `Show All (${cities.length}) ↓`}
            </button>
          )}
        </div>

        <div className="border-t border-gray-100" />

        {/* Budget/Price Range Filter */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-bold text-[#1F2937]">Budget Range</label>
            {(budgetRange.min || budgetRange.max) && (
              <button
                onClick={() => setBudgetRange({ min: "", max: "" })}
                className="text-xs text-red-500 hover:text-red-600"
              >
                Clear
              </button>
            )}
          </div>
          
          {/* Quick Price Ranges */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {quickPriceRanges.map((range, i) => (
              <button
                key={i}
                onClick={() => setBudgetRange({ min: String(range.min), max: String(range.max) })}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition ${
                  budgetRange.min === String(range.min)
                    ? "bg-green-50 border-green-300 text-green-700"
                    : "border-gray-200 text-gray-600 hover:border-green-300 hover:text-green-600"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>

          {/* Custom Range */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] text-gray-500 mb-1">Min</label>
              <input
                type="number"
                value={budgetRange.min}
                onChange={(e) => setBudgetRange(prev => ({ ...prev, min: e.target.value }))}
                placeholder="₹ Min"
                className="w-full rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2 text-sm outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-green-100"
              />
            </div>
            <div>
              <label className="block text-[10px] text-gray-500 mb-1">Max</label>
              <input
                type="number"
                value={budgetRange.max}
                onChange={(e) => setBudgetRange(prev => ({ ...prev, max: e.target.value }))}
                placeholder="₹ Max"
                className="w-full rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2 text-sm outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-green-100"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100" />

        {/* Sort Options */}
        <div>
          <label className="text-sm font-bold text-[#1F2937] mb-2 block">Sort By</label>
          <div className="space-y-1">
            {[
              { value: "relevance", label: "AI Smart Sort", icon: "auto_awesome" },
              { value: "rating", label: "Highest Rated", icon: "star" },
              { value: "reviews", label: "Most Reviews", icon: "rate_review" },
              { value: "verified", label: "Verified First", icon: "verified" },
            ].map((option) => (
              <div
                key={option.value}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-[#6B7280] flex items-center gap-2"
              >
                <Icon name={option.icon} size={16} className="text-gray-400" />
                {option.label}
              </div>
            ))}
            <p className="text-[10px] text-gray-400 mt-1">Use the sort dropdown in results header</p>
          </div>
        </div>
      </div>

      {/* Apply Filters Button (Mobile) */}
      <div className="p-4 border-t border-gray-100 lg:hidden">
        <button
          onClick={onApplyFilters}
          className="w-full rounded-xl bg-[#22C55E] py-3 text-sm font-bold text-white hover:bg-green-600 transition"
        >
          Apply Filters
        </button>
      </div>
    </aside>
  );
};

export default FilterSidebar;