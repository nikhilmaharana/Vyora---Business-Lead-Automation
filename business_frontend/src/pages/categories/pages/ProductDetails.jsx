import { Link, useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../../../services/api";
import {
  FaStar,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaWhatsapp,
  FaCheckCircle,
  FaPhotoVideo,
  FaPlayCircle,
} from "react-icons/fa";

const ProductDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const [business, setBusiness] = useState(location.state?.business || null);
  const [listing, setListing] = useState(location.state?.listing || null);
  const [loading, setLoading] = useState(!business);
  const [error, setError] = useState("");
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    if (id && id !== "undefined") {
      if (!business) fetchBusiness();
    } else if (location.state?.business) {
      setBusiness(location.state.business);
      setLoading(false);
    } else {
      setError("No business ID provided");
      setLoading(false);
    }
  }, [id]);

  const fetchBusiness = async () => {
    setLoading(true);
    try {
      const data = await api(`/businesses/${id}`);
      setBusiness(data.business);
    } catch (err) {
      try {
        const allData = await api("/businesses");
        if (Array.isArray(allData)) {
          const found = allData.find(b => b.id === id || b._id === id);
          if (found) {
            setBusiness(found);
            return;
          }
        }
        const listingsData = await api("/listings");
        if (Array.isArray(listingsData)) {
          const foundListing = listingsData.find(l => l.id === id || l.businessId === id);
          if (foundListing) {
            setListing(foundListing);
            if (foundListing.businessId) {
              try {
                const bizData = await api(`/businesses/${foundListing.businessId}`);
                setBusiness(bizData.business);
              } catch {
                setBusiness({
                  id: foundListing.businessId || id,
                  name: foundListing.title,
                  category: foundListing.category,
                  description: foundListing.description,
                  verifiedBadge: false,
                  rating: 4.5,
                });
              }
            }
          }
        }
      } catch {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const serviceImages = [
    business?.image || listing?.image || "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200",
    "https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=1200",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200",
  ].filter(Boolean);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => prev === serviceImages.length - 1 ? 0 : prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, [serviceImages.length]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#22C55E] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading business details...</p>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-6xl">🔍</div>
        <h2 className="text-2xl font-bold text-gray-800">Business Not Found</h2>
        <p className="text-gray-500">{error || "The business you're looking for doesn't exist."}</p>
        <Link to="/search" className="bg-[#22C55E] text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition">
          Browse Businesses
        </Link>
      </div>
    );
  }

  const isVerified = business.verified || business.verifiedBadge;
  const displayRating = business.rating || 4.0;
  const displayReviews = business.reviews || Math.round((business.rating || 4) * 20);
  const displayCity = business.city || "Service Area";
  const displayPrice = listing?.price 
    ? `₹${Number(listing.price).toLocaleString()}`
    : business.priceRange 
    ? business.priceRange
    : business.budgetMin || business.budgetMax
    ? `₹${Number(business.budgetMin || 0).toLocaleString()} – ₹${Number(business.budgetMax || 0).toLocaleString()}`
    : "Contact for Price";
  const displayServices = business.services || [listing?.title || business.subCategory || business.category].filter(Boolean);

  const reviewMedia = [
    { id: 1, type: "image", url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600" },
    { id: 2, type: "image", url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600" },
    { id: 3, type: "image", url: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=600" },
    { id: 4, type: "video", thumbnail: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600" },
    { id: 5, type: "image", url: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600" },
    { id: 6, type: "video", thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-8xl mx-auto">
        {/* ================= TOP CARD ================= */}
        <div className="bg-white rounded-2xl shadow-md border overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-6 p-6">
            {/* Image */}
            <div className="lg:w-135 w-full shrink-0">
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src={serviceImages[currentImage]}
                  alt={business.name}
                  className="w-full h-95 object-cover rounded-xl transition-all duration-700"
                />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {serviceImages.map((_, index) => (
                    <div
                      key={index}
                      className={`h-3 w-3 rounded-full ${
                        currentImage === index ? "bg-green-500" : "bg-white/70"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              {/* Title */}
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {business.name}
              </h1>

              {/* Rating */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="bg-green-600 text-white px-3 py-1 rounded-md flex items-center gap-1 font-semibold">
                  {displayRating}
                  <FaStar size={14} />
                </div>
                <span className="text-gray-600 text-lg">{displayReviews} Ratings</span>
                {isVerified && (
                  <span className="text-blue-600 font-semibold flex items-center gap-1">
                    <FaCheckCircle /> Verified
                  </span>
                )}
                <span className="bg-gray-100 px-3 py-1 rounded-md text-sm">🔍 Top Search</span>
              </div>

              {/* Address */}
              <div className="flex flex-wrap items-center gap-2 text-gray-700 mb-4">
                <FaMapMarkerAlt className="text-gray-500" />
                <span>{business.address || displayCity}</span>
                <span className="text-gray-400">•</span>
                <span className="font-medium">{business.category}</span>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-3 mb-5">
                <span className="bg-gray-100 px-4 py-2 rounded-lg text-sm">
                  {business.type || "Professional Service"}
                </span>
                <span className="bg-gray-100 px-4 py-2 rounded-lg text-sm">
                  {isVerified ? "Trusted Provider" : "New Provider"}
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed mb-5">
                {listing?.description || business.description || business.usp || "Trusted service provider offering quality solutions."}
              </p>

              {/* Price */}
              <div className="mb-6">
                <p className="text-gray-500 text-sm mb-1">Price Range</p>
                <h2 className="text-3xl font-bold text-green-600">{displayPrice}</h2>
              </div>

              {/* Service Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {displayServices.slice(0, 5).map((service, index) => (
                  <span key={index} className="bg-green-50 text-green-700 px-3 py-1 rounded-lg text-sm font-medium border border-green-100">
                    {service}
                  </span>
                ))}
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="bg-gray-700 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition">
                  <FaPhoneAlt />
                  Call Now
                </button>
                <button className="border border-gray-300 hover:bg-gray-200 px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition">
                  <FaWhatsapp className="text-green-600" />
                  WhatsApp
                </button>
                <Link
                  to="/instant-hire"
                  state={{ business }}
                  className="bg-green-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition text-center"
                >
                  Send Enquiry
                </Link>
                <Link
                  to="/book-service"
                  state={{ packageName: business.name, packagePrice: displayPrice }}
                  className="bg-gray-100 hover:bg-gray-800 hover:text-white text-black px-8 py-3 rounded-lg border font-semibold transition text-center"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ================= CUSTOMER PHOTOS & VIDEOS ================= */}
        <div className="bg-white rounded-2xl shadow-md mt-8 p-6">
          <div className="flex items-center gap-3 mb-5">
            <FaPhotoVideo className="text-green-600 text-2xl" />
            <h2 className="text-2xl md:text-3xl font-bold">Customer Photos & Videos</h2>
          </div>
          <p className="text-gray-500 mb-5">Photos and videos shared by customers</p>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {reviewMedia.map((item) => (
              <div key={item.id} className="min-w-45 sm:min-w-55 h-45 sm:h-55 rounded-xl overflow-hidden border relative shrink-0">
                {item.type === "image" ? (
                  <img src={item.url} alt="review" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <img src={item.thumbnail} alt="video" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <FaPlayCircle className="text-white text-5xl" />
                    </div>
                    <span className="absolute bottom-2 right-2 bg-black text-white text-xs px-2 py-1 rounded">Video</span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ================= REVIEW SECTION ================= */}
        <div className="bg-white rounded-2xl shadow-md mt-8 p-8">
          <h2 className="text-3xl font-bold mb-6">Reviews & Ratings</h2>
          <div className="flex items-center gap-6 mb-8">
            <div className="bg-green-600 text-white w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-bold">
              {displayRating}
            </div>
            <div>
              <h3 className="text-4xl font-bold text-gray-900">{displayReviews} Ratings</h3>
              <p className="text-gray-500 mt-2">Rating based on customer feedback</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-purple-500 text-white flex items-center justify-center text-xl font-bold">P</div>
                <div>
                  <h4 className="font-semibold text-lg">Paradise</h4>
                  <p className="text-sm text-gray-500">25 Nov 2024</p>
                </div>
              </div>
              <div className="flex gap-1 text-orange-500 mb-3">★★★★★</div>
              <p className="text-gray-600 leading-relaxed">Excellent service with professional staff, hygienic environment and affordable pricing. Highly recommended.</p>
            </div>
            <div className="border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-green-500 text-white flex items-center justify-center text-xl font-bold">R</div>
                <div>
                  <h4 className="font-semibold text-lg">Raghunath</h4>
                  <p className="text-sm text-gray-500">16 Dec 2024</p>
                </div>
              </div>
              <div className="flex gap-1 text-orange-500 mb-3">★★★★★</div>
              <p className="text-gray-600 leading-relaxed">Great experience. Professional service, excellent quality and friendly support team.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;