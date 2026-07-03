import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Icon from "../common/Icon";

const BusinessCard = ({ business, viewMode = "list" }) => {
  const navigate = useNavigate();
  const [showPhone, setShowPhone] = useState(false);
  
  const isVerified = business.verified || business.verifiedBadge;
  const displayArea = business.area || (business.address ? business.address.split(",")[0] : "");
  const displayCity = business.city || "";
  const displayRating = business.rating || 0;
  const displayReviews = business.reviews || Math.round((business.rating || 0) * 20);
  const displayPrice = business.priceRange || `₹${Number(business.budgetMin || 0).toLocaleString()} – ₹${Number(business.budgetMax || 0).toLocaleString()}`;
  const displayExp = business.experience || `${business.responseTimeMins || 30} min response time`;
  const displayDesc = business.description || business.usp || "Trusted local service provider.";
  const displayServices = business.services || [business.subCategory || business.category].filter(Boolean);
  const matchReasons = business.matchReasons || [];
  const responseTime = business.responseTimeMins || 30;
  
  const getInitials = (name) => {
    return (name || "B").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  };

  const handleGetQuote = () => {
    navigate("/instant-hire", { state: { business } });
  };

  const handleViewProfile = () => {
    const businessId = business.id || business._id;
    if (!businessId) {
      navigate("/search");
      return;
    }
    navigate(`/product-details/${businessId}`, { state: { business } });
  };

  if (viewMode === "grid") {
    return (
      <div className="group rounded-xl border border-[#E5E7EB] bg-white shadow-sm hover:shadow-md hover:border-[#22C55E]/30 transition-all duration-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {/* Avatar */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 ${
                isVerified ? "bg-gradient-to-br from-[#22C55E] to-emerald-600" : "bg-gradient-to-br from-gray-400 to-gray-500"
              }`}>
                {getInitials(business.name)}
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-[#1F2937] text-sm leading-tight truncate">{business.name}</h3>
                <p className="text-xs text-[#6B7280] truncate mt-0.5">{business.category}</p>
              </div>
            </div>
            {isVerified && (
              <span className="shrink-0 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700 border border-green-200">
                ✓ Verified
              </span>
            )}
          </div>
        </div>

        {/* Rating & Price */}
        <div className="px-4 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-yellow-500 text-xs">★</span>
              <span className="text-sm font-bold text-[#1F2937]">{displayRating}</span>
              <span className="text-xs text-[#9CA3AF]">({displayReviews})</span>
            </div>
            <span className="text-xs font-semibold text-[#22C55E]">{displayPrice}</span>
          </div>
        </div>

        {/* Description */}
        <p className="px-4 text-xs text-[#6B7280] leading-relaxed line-clamp-2">{displayDesc}</p>

        {/* Tags */}
        <div className="px-4 py-2 flex flex-wrap gap-1">
          {displayServices.slice(0, 3).map((service, index) => (
            <span key={index} className="rounded-md bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-700">
              {service}
            </span>
          ))}
          {displayServices.length > 3 && (
            <span className="text-[10px] text-gray-400">+{displayServices.length - 3}</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="px-4 pb-4 pt-1 flex gap-2">
          <button onClick={handleGetQuote} className="flex-1 rounded-lg bg-[#22C55E] py-2 text-xs font-semibold text-white hover:bg-green-600 transition">
            Get Quote
          </button>
          <button onClick={handleViewProfile} className="flex-1 rounded-lg border border-[#22C55E] py-2 text-xs font-semibold text-[#22C55E] hover:bg-green-50 transition">
            View Details
          </button>
        </div>
      </div>
    );
  }

  // LIST VIEW - IndiaMart Style
  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm hover:shadow-md hover:border-[#22C55E]/20 transition-all duration-200 overflow-hidden">
      <div className="p-4 sm:p-5">
        {/* Top Section: Avatar + Name + Verified + Rating */}
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Avatar/Logo */}
          <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0 ${
            isVerified ? "bg-gradient-to-br from-[#22C55E] to-emerald-600" : "bg-gradient-to-br from-gray-400 to-gray-500"
          }`}>
            {getInitials(business.name)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Row 1: Name + Verified + Location */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg sm:text-xl font-bold text-[#1F2937] truncate">{business.name}</h3>
                  {isVerified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-[11px] font-semibold text-green-700 border border-green-200">
                      <Icon name="verified" size={13} /> Verified
                    </span>
                  )}
                  {business.emergencyAvailable && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-semibold text-red-600 border border-red-200">
                      🚨 Emergency
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#6B7280] mt-0.5">{business.category}{business.subCategory ? ` • ${business.subCategory}` : ""}</p>
              </div>
            </div>

            {/* Row 2: Rating + Location + Price */}
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-[#4B5563]">
              <span className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                <span className="font-semibold text-[#1F2937]">{displayRating}</span>
                <span className="text-[#9CA3AF]">({displayReviews})</span>
              </span>
              <span className="flex items-center gap-1">
                <Icon name="location_on" size={15} className="text-gray-400" />
                {displayArea}{displayArea && displayCity ? ", " : ""}{displayCity}
              </span>
              <span className="flex items-center gap-1 font-semibold text-[#22C55E]">
                {displayPrice}
              </span>
              <span className="flex items-center gap-1 text-gray-500">
                <Icon name="schedule" size={15} className="text-gray-400" />
                {responseTime <= 15 ? "⚡ " : ""}{displayExp}
              </span>
            </div>

            {/* Row 3: Description */}
            <p className="mt-2 text-sm text-[#6B7280] leading-relaxed line-clamp-2">{displayDesc}</p>

            {/* Row 4: Service Tags */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {displayServices.slice(0, 5).map((service, index) => (
                <span key={index} className="rounded-md bg-green-50 px-2.5 py-1 text-[11px] font-medium text-green-700 border border-green-100">
                  {service}
                </span>
              ))}
              {displayServices.length > 5 && (
                <span className="text-[11px] text-gray-400 self-center">+{displayServices.length - 5} more</span>
              )}
            </div>

            {/* Row 5: Match Reasons (AI-powered) */}
            {matchReasons.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {matchReasons.map((reason, i) => (
                  <span key={i} className="rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-medium text-purple-600 border border-purple-100">
                    {reason}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section: Divider + Actions */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          {/* Working Hours / Additional Info */}
          <div className="flex items-center gap-3 text-xs text-[#6B7280]">
            {business.workingHours && (
              <span className="flex items-center gap-1">
                <Icon name="access_time" size={14} className="text-gray-400" />
                {business.workingHours}
              </span>
            )}
            {business.listings && business.listings.length > 0 && (
              <span className="flex items-center gap-1 text-[#22C55E]">
                <Icon name="inventory_2" size={14} />
                {business.listings.length} listing{business.listings.length > 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPhone(!showPhone)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition"
            >
              <Icon name="call" size={15} />
              {showPhone ? "9876543210" : "Show Phone"}
            </button>
            <button
              onClick={handleGetQuote}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#22C55E] px-4 py-2 text-xs font-semibold text-white hover:bg-green-600 transition shadow-sm shadow-green-200"
            >
              <Icon name="message" size={15} />
              Get Quote
            </button>
            <button
              onClick={handleViewProfile}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#22C55E] px-4 py-2 text-xs font-semibold text-[#22C55E] hover:bg-green-50 transition"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;