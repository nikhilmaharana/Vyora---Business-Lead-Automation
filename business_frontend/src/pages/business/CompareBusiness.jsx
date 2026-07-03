import {
  Star,
  Check,
  X,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Zap,
  Users,
  Clock3,
  MapPin,
} from "lucide-react";

import Navbar from "../../layout/Navbar";
import Footer from "../../layout/Footer";

const CompareBusinessesPage = () => {
  const businesses = [
    {
      id: 1,
      name: "Urban Brew Cafe",
      category: "Restaurant",
      rating: 4.9,
      reviews: 540,
      price: "₹500",
      response: "5 mins",
      verified: true,
      clients: "12k+",
      aiMatch: "96%",
      popular: true,
      color: "from-emerald-500 to-green-600",
      features: {
        delivery: true,
        parking: true,
        onlineBooking: true,
        wifi: true,
        offers: true,
      },
    },
    {
      id: 2,
      name: "SmileCare Clinic",
      category: "Healthcare",
      rating: 4.8,
      reviews: 320,
      price: "₹800",
      response: "15 mins",
      verified: true,
      clients: "8k+",
      aiMatch: "92%",
      popular: false,
      color: "from-blue-500 to-cyan-500",
      features: {
        delivery: false,
        parking: true,
        onlineBooking: true,
        wifi: false,
        offers: true,
      },
    },
    {
      id: 3,
      name: "SparkClean Services",
      category: "Home Services",
      rating: 4.7,
      reviews: 280,
      price: "₹1,200",
      response: "10 mins",
      verified: true,
      clients: "5k+",
      aiMatch: "90%",
      popular: false,
      color: "from-violet-500 to-purple-600",
      features: {
        delivery: false,
        parking: false,
        onlineBooking: true,
        wifi: false,
        offers: true,
      },
    },
  ];

  const featureRows = [
    { key: "delivery", label: "Home Delivery" },
    { key: "parking", label: "Parking Available" },
    { key: "onlineBooking", label: "Online Booking" },
    { key: "wifi", label: "Free WiFi" },
    { key: "offers", label: "Special Offers" },
  ];

  const FeatureIcon = ({ value }) => {
    return value ? (
      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
        <Check className="text-emerald-600" size={18} />
      </div>
    ) : (
      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mx-auto">
        <X className="text-red-500" size={18} />
      </div>
    );
  };

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
              <Sparkles size={16} className="text-emerald-600" />
              AI Powered Local Business Comparison
            </div>

            <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight max-w-5xl mx-auto">
              Compare The Best
              <span className="bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">
                {" "}
                Local Businesses
              </span>
            </h1>

            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Compare restaurants, salons, clinics, home services,
              agencies, and local businesses side-by-side to find the
              best option near you.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <button className="bg-gradient-to-r from-emerald-500 to-green-600 hover:scale-105 transition-all duration-300 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl flex items-center gap-2">
                Compare Businesses
                <ArrowRight size={18} />
              </button>

              <button className="bg-white border border-gray-200 hover:bg-gray-50 px-8 py-4 rounded-2xl font-semibold text-gray-700 shadow-sm transition-all duration-300">
                View Categories
              </button>
            </div>
          </div>
        </section>

        {/* Compare Table */}
        <section className="px-4 pb-24">
          <div className="max-w-7xl mx-auto">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-8">
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

            <div className="bg-white border border-gray-200 shadow-2xl overflow-hidden rounded-[32px]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="p-8 text-left text-lg font-bold text-gray-800 w-[250px]">
                        Comparison Details
                      </th>

                      {businesses.map((business) => (
                        <th
                          key={business.id}
                          className="p-8 border-l border-gray-200 relative"
                        >
                          {business.popular && (
                            <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-400 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg">
                              Most Popular
                            </div>
                          )}

                          <div className="flex flex-col items-center">
                            <div
                              className={`w-24 h-24 rounded-3xl bg-gradient-to-r ${business.color} flex items-center justify-center text-white text-3xl font-black shadow-xl`}
                            >
                              {business.name.charAt(0)}
                            </div>

                            <h2 className="mt-5 text-2xl font-bold text-gray-900">
                              {business.name}
                            </h2>

                            <div className="mt-2 inline-flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                              {business.category}
                            </div>

                            <div className="flex items-center gap-2 mt-3">
                              <Star
                                className="fill-yellow-400 text-yellow-400"
                                size={18}
                              />

                              <span className="font-bold text-gray-900">
                                {business.rating}
                              </span>

                              <span className="text-gray-500 text-sm">
                                ({business.reviews} Reviews)
                              </span>
                            </div>

                            {business.verified && (
                              <div className="flex items-center gap-2 mt-3 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                                <ShieldCheck size={16} />
                                Verified Business
                              </div>
                            )}

                            <div className="mt-5 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-lg">
                              AI Match Score {business.aiMatch}
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-6 w-full">
                              <button className="bg-emerald-500 hover:bg-emerald-600 transition-all text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg">
                                <MessageCircle size={16} />
                                Chat
                              </button>

                              <button className="border border-gray-200 hover:bg-gray-100 transition-all py-3 rounded-xl font-medium flex items-center justify-center gap-2 text-gray-700">
                                <Phone size={16} />
                                Call
                              </button>
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {/* Price */}
                    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-all">
                      <td className="p-6 font-semibold text-gray-700">
                        Starting Price
                      </td>

                      {businesses.map((business) => (
                        <td
                          key={business.id}
                          className="text-center p-6 border-l border-gray-100"
                        >
                          <div className="text-2xl font-black text-emerald-600">
                            {business.price}
                          </div>

                          <div className="text-sm text-gray-500 mt-1">
                            Starting Package
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Response */}
                    <tr className="border-b border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-all">
                      <td className="p-6 font-semibold text-gray-700 flex items-center gap-2">
                        <Clock3 size={18} />
                        Response Time
                      </td>

                      {businesses.map((business) => (
                        <td
                          key={business.id}
                          className="text-center p-6 border-l border-gray-100 font-semibold text-gray-800"
                        >
                          {business.response}
                        </td>
                      ))}
                    </tr>

                    {/* Clients */}
                    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-all">
                      <td className="p-6 font-semibold text-gray-700 flex items-center gap-2">
                        <Users size={18} />
                        Total Customers
                      </td>

                      {businesses.map((business) => (
                        <td
                          key={business.id}
                          className="text-center p-6 border-l border-gray-100 font-bold text-gray-800"
                        >
                          {business.clients}
                        </td>
                      ))}
                    </tr>

                    {/* Availability */}
                    <tr className="border-b border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-all">
                      <td className="p-6 font-semibold text-gray-700">
                        Availability
                      </td>

                      {businesses.map((business) => (
                        <td
                          key={business.id}
                          className="text-center p-6 border-l border-gray-100"
                        >
                          <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">
                            Open Now
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Location */}
                    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-all">
                      <td className="p-6 font-semibold text-gray-700 flex items-center gap-2">
                        <MapPin size={18} />
                        Location
                      </td>

                      {businesses.map((business) => (
                        <td
                          key={business.id}
                          className="text-center p-6 border-l border-gray-100 font-medium text-gray-700"
                        >
                          Bhubaneswar
                        </td>
                      ))}
                    </tr>

                    {/* Features */}
                    {featureRows.map((feature, index) => (
                      <tr
                        key={feature.key}
                        className={`${
                          index % 2 === 0
                            ? "bg-gray-50/50"
                            : "bg-white"
                        } border-b border-gray-100 hover:bg-gray-50 transition-all`}
                      >
                        <td className="p-6 font-semibold text-gray-700">
                          {feature.label}
                        </td>

                        {businesses.map((business) => (
                          <td
                            key={business.id}
                            className="text-center p-6 border-l border-gray-100"
                          >
                            <FeatureIcon
                              value={
                                business.features[feature.key]
                              }
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
                  <Zap
                    size={16}
                    className="text-yellow-400"
                  />
                  Smart Recommendation Engine
                </div>

                <h2 className="text-5xl font-black text-white leading-tight max-w-4xl mx-auto">
                  Find The Perfect Local Business Near You
                </h2>

                <p className="mt-6 text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                  Compare verified businesses, reviews,
                  pricing, offers, and services to make
                  smarter decisions faster.
                </p>

                <div className="flex flex-wrap justify-center gap-4 mt-10">
                  <button className="bg-gradient-to-r from-emerald-500 to-green-600 hover:scale-105 transition-all duration-300 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl flex items-center gap-2">
                    Explore Businesses
                    <ArrowRight size={18} />
                  </button>

                  <button className="bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300">
                    Talk To Expert
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

export default CompareBusinessesPage;
