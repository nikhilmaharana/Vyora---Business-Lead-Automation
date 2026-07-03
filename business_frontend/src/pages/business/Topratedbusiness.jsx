import {
  Star,
  ShieldCheck,
  MapPin,
  Phone,
  MessageCircle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Eye,
  Clock3,
  BadgeCheck,
} from "lucide-react";

import Navbar from "../../layout/Navbar";
import Footer from "../../layout/Footer";

const TopRatedBusinesses = () => {
  const businesses = [
    {
      id: 1,
      name: "Urban Brew Cafe",
      category: "Restaurant",
      rating: 4.9,
      reviews: 1240,
      location: "Bhubaneswar",
      response: "5 mins",
      verified: true,
      featured: true,
      visitors: "18k+",
      image:
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop",
      color: "from-orange-500 to-red-500",
    },
    {
      id: 2,
      name: "SmileCare Clinic",
      category: "Healthcare",
      rating: 4.8,
      reviews: 860,
      location: "Cuttack",
      response: "10 mins",
      verified: true,
      featured: false,
      visitors: "9k+",
      image:
        "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=1200&auto=format&fit=crop",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: 3,
      name: "SparkClean Services",
      category: "Home Services",
      rating: 4.9,
      reviews: 970,
      location: "Puri",
      response: "15 mins",
      verified: true,
      featured: true,
      visitors: "11k+",
      image:
        "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1200&auto=format&fit=crop",
      color: "from-emerald-500 to-green-600",
    },
    {
      id: 4,
      name: "Luxury Glow Salon",
      category: "Beauty & Salon",
      rating: 4.7,
      reviews: 760,
      location: "Bhubaneswar",
      response: "8 mins",
      verified: true,
      featured: false,
      visitors: "7k+",
      image:
        "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=1200&auto=format&fit=crop",
      color: "from-pink-500 to-rose-500",
    },
    {
      id: 5,
      name: "DriveX Automobile",
      category: "Automobile",
      rating: 4.8,
      reviews: 680,
      location: "Cuttack",
      response: "12 mins",
      verified: true,
      featured: false,
      visitors: "6k+",
      image:
        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop",
      color: "from-violet-500 to-purple-600",
    },
    {
      id: 6,
      name: "Bright Future Academy",
      category: "Education",
      rating: 4.9,
      reviews: 920,
      location: "Bhubaneswar",
      response: "20 mins",
      verified: true,
      featured: true,
      visitors: "15k+",
      image:
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
      color: "from-yellow-500 to-orange-500",
    },
  ];

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#f5f7fb] overflow-hidden">
        {/* Hero Section */}
        <section className="relative py-24 px-4">
          <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-200 rounded-full blur-3xl opacity-40" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-200 rounded-full blur-3xl opacity-40" />

          <div className="max-w-7xl mx-auto relative z-10 text-center">
            <div className="inline-flex items-center gap-2 bg-white shadow-md border border-gray-200 px-5 py-2 rounded-full text-sm font-medium text-gray-700 mb-6">
              <TrendingUp size={16} className="text-emerald-600" />
              Top Rated Businesses Near You
            </div>

            <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight max-w-5xl mx-auto">
              Discover The
              <span className="bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">
                {" "}
                Highest Rated Businesses
              </span>
            </h1>

            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Explore trusted restaurants, clinics, salons, home services,
              educational institutes, and local businesses with the best ratings
              and customer reviews.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <button className="bg-gradient-to-r from-emerald-500 to-green-600 hover:scale-105 transition-all duration-300 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl flex items-center gap-2">
                Explore Top Businesses
                <ArrowRight size={18} />
              </button>

              <button className="bg-white border border-gray-200 hover:bg-gray-50 px-8 py-4 rounded-2xl font-semibold text-gray-700 shadow-sm transition-all duration-300">
                View Categories
              </button>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="px-4 pb-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-4">
              {[
                "Restaurants",
                "Healthcare",
                "Home Services",
                "Salons",
                "Education",
                "Automobile",
              ].map((category, index) => (
                <button
                  key={index}
                  className="bg-white border border-gray-200 hover:bg-emerald-50 hover:border-emerald-300 px-5 py-3 rounded-2xl font-medium text-gray-700 transition-all duration-300"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Business Cards */}
        <section className="px-4 pb-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
              {businesses.map((business) => (
                <div
                  key={business.id}
                  className="group bg-white border border-gray-200 rounded-[32px] overflow-hidden shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-500"
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={business.image}
                      alt={business.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {business.featured && (
                      <div className="absolute top-5 left-5 bg-gradient-to-r from-orange-400 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                        Featured
                      </div>
                    )}

                    <div className="absolute bottom-5 left-5">
                      <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-white text-sm">
                        <Eye size={16} />
                        {business.visitors} Monthly Visitors
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <div className="flex items-center justify-between">
                      <div className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">
                        {business.category}
                      </div>

                      <div className="flex items-center gap-2">
                        <Star
                          className="fill-yellow-400 text-yellow-400"
                          size={18}
                        />
                        <span className="font-bold text-gray-900">
                          {business.rating}
                        </span>
                      </div>
                    </div>

                    <h2 className="mt-5 text-3xl font-black text-gray-900 leading-tight">
                      {business.name}
                    </h2>

                    <div className="flex items-center gap-2 mt-4 text-gray-600">
                      <MapPin size={18} />
                      {business.location}
                    </div>

                    <div className="flex items-center gap-2 mt-3 text-gray-600">
                      <Clock3 size={18} />
                      Responds in {business.response}
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                      <ShieldCheck
                        size={18}
                        className="text-emerald-600"
                      />

                      <span className="text-emerald-700 font-medium">
                        Verified Business
                      </span>
                    </div>

                    <div className="mt-6 flex items-center gap-2">
                      <BadgeCheck
                        size={18}
                        className="text-yellow-500"
                      />

                      <span className="text-gray-700 font-medium">
                        {business.reviews}+ Verified Reviews
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-8">
                      <button className="bg-gradient-to-r from-emerald-500 to-green-600 hover:scale-[1.03] transition-all duration-300 text-white py-4 rounded-2xl font-semibold shadow-lg flex items-center justify-center gap-2">
                        <MessageCircle size={18} />
                        Chat
                      </button>

                      <button className="border border-gray-200 hover:bg-gray-100 transition-all duration-300 py-4 rounded-2xl font-semibold text-gray-700 flex items-center justify-center gap-2">
                        <Phone size={18} />
                        Call
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="px-4 pb-24">
          <div className="max-w-7xl mx-auto">
            <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-[40px] p-14 text-center shadow-2xl">
              <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-500 rounded-full blur-3xl opacity-20" />
              <div className="absolute bottom-0 right-0 w-72 h-72 bg-violet-500 rounded-full blur-3xl opacity-20" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-5 py-2 rounded-full text-white text-sm mb-6 backdrop-blur-md">
                  <Sparkles
                    size={16}
                    className="text-yellow-400"
                  />
                  Trusted Local Marketplace
                </div>

                <h2 className="text-5xl font-black text-white leading-tight max-w-4xl mx-auto">
                  Find Trusted Businesses Faster
                </h2>

                <p className="mt-6 text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                  Discover highly rated local businesses with verified
                  reviews, trusted services, and smart recommendations.
                </p>

                <div className="flex flex-wrap justify-center gap-4 mt-10">
                  <button className="bg-gradient-to-r from-emerald-500 to-green-600 hover:scale-105 transition-all duration-300 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl flex items-center gap-2">
                    Explore Businesses
                    <ArrowRight size={18} />
                  </button>

                  <button className="bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300">
                    Browse Categories
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default TopRatedBusinesses;
