import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../../../services/api";
import { FaArrowRight, FaStar } from "react-icons/fa";
import { addCompareItem, getCompareItems } from "../../../components/business/CompareBar";
import { BarChart3, Check } from "lucide-react";

const ProductListing = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const data = await api("/listings");
      // Filter only approved listings and ensure each has a valid ID
      const approved = (Array.isArray(data) ? data : []).filter(l => l && l.id && (l.status === "approved" || !l.status));
      setListings(approved);
    } catch (err) {
      setError(err.message);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  const [compareItems, setCompareItems] = useState([]);

  useEffect(() => {
    setCompareItems(getCompareItems());
    const handler = () => setCompareItems(getCompareItems());
    window.addEventListener("compareUpdate", handler);
    return () => window.removeEventListener("compareUpdate", handler);
  }, []);

  // Map listing to display card format
  const mapListing = (listing) => {
    // Generate a stable unique ID if listing.id is missing
    const id = listing.id || `listing-${Math.random().toString(36).slice(2, 9)}`;
    return {
      id: id,
      title: listing.title,
      price: listing.priceLabel || `₹${Number(listing.price || 0).toLocaleString()}`,
      image: listing.image || "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200",
      description: listing.description || listing.title,
      businessId: listing.businessId || id,
      rating: listing.rating || 4.5,
    };
  };

  const handleCompare = (listing) => {
    if (!listing || !listing.id) return;
    const item = mapListing(listing);
    addCompareItem(item);
    setCompareItems(getCompareItems());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-12 px-4 md:px-8">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
            <p className="mt-4 text-gray-500">Loading services...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-12 px-4 md:px-8">
        <div className="text-center py-20">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-12 px-4 md:px-8">

      {/* Heading */}
      <div className="text-center mb-12">
        <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
          PROFESSIONAL SERVICES
        </span>

        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-4">
          Explore Our Services
        </h1>

        <p className="text-gray-500 mt-3 text-lg">
          Find trusted professionals for every requirement
        </p>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

        {listings.map((listing) => {
          const item = mapListing(listing);
          const isInCompare = compareItems.find(i => i.id === listing.id);
          return (
            <div
              key={item.id}
              className="
                bg-white
                rounded-3xl
                overflow-hidden
                shadow-md
                hover:shadow-2xl
                hover:-translate-y-2
                transition-all
                duration-500
                group
                border
                border-gray-100
              "
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="
                    w-full
                    h-60
                    object-cover
                    group-hover:scale-110
                    transition-transform
                    duration-700
                  "
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

                {/* Rating */}
                <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-white px-3 py-1 rounded-full shadow">
                  <FaStar className="text-yellow-500" />
                  <span className="font-medium text-sm">{item.rating}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                  {item.title}
                </h2>

                {/* Price */}
                <p className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold mb-4">
                  {item.price}
                </p>

                {/* Description */}
                <p className="text-gray-600 mb-6 line-clamp-3">
                  {item.description}
                </p>

                {/* Compare Button */}
                <button
                  onClick={() => handleCompare(listing)}
                  disabled={!listing || !listing.id}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all duration-300 mb-2 ${
                    isInCompare
                      ? "bg-green-100 text-green-700 border border-green-300 cursor-default"
                      : "bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600 border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  }`}
                >
                  <BarChart3 size={16} />
                  {isInCompare ? "Added to Compare" : "Add to Compare"}
                </button>

                {/* Button - Link to the business details page */}
                <Link
                  to={`/product-details/${item.businessId || item.id}`}
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    bg-gray-900
                    hover:bg-green-600
                    text-white
                    py-3
                    rounded-xl
                    font-semibold
                    transition-all
                    duration-300
                  "
                >
                  View Details
                  <FaArrowRight />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductListing;