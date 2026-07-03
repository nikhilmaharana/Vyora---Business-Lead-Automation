import {
  Flame,
  ArrowRight,
  Clock3,
  BadgeCheck,
  Sparkles,
  Ticket,
  Star,
  Gift,
  Zap,
  MapPin,
} from "lucide-react";
import Navbar from "../../layout/Navbar";
import Footer from "../../layout/Footer";

const OffersPage = () => {
  const offers = [
    {
      title: "40% Off Home Cleaning Services",
      business: "SparkClean Services",
      category: "Home Services",
      location: "Bhubaneswar",
      offer: "40% OFF",
      validity: "Ends Tonight",
      gradient: "from-emerald-500 to-green-600",
    },
    {
      title: "Buy 1 Get 1 Coffee",
      business: "Urban Brew Cafe",
      category: "Restaurants",
      location: "Cuttack",
      offer: "BOGO",
      validity: "Today Only",
      gradient: "from-orange-500 to-yellow-500",
    },
    {
      title: "Free Dental Consultation",
      business: "SmileCare Clinic",
      category: "Healthcare",
      location: "Bhubaneswar",
      offer: "FREE CONSULT",
      validity: "Limited Slots",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "50% Off Salon Packages",
      business: "Luxury Glow Salon",
      category: "Beauty & Salon",
      location: "Puri",
      offer: "50% OFF",
      validity: "Weekend Offer",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      title: "25% Off AC Repair",
      business: "CoolAir Solutions",
      category: "Home Services",
      location: "Bhubaneswar",
      offer: "25% OFF",
      validity: "Summer Deal",
      gradient: "from-sky-500 to-blue-600",
    },
    {
      title: "Save ₹15,000 On CRM Automation",
      business: "GrowthX CRM",
      category: "Business Automation",
      location: "Remote Service",
      offer: "₹15K SAVE",
      validity: "Limited Offer",
      gradient: "from-violet-500 to-purple-600",
    },
  ];

  const categories = [
    {
      title: "Restaurants",
      icon: "🍔",
      deals: "120+ Deals",
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Home Services",
      icon: "🏠",
      deals: "80+ Deals",
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      title: "Healthcare",
      icon: "🏥",
      deals: "50+ Deals",
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Beauty & Salon",
      icon: "💄",
      deals: "70+ Deals",
      color: "bg-pink-100 text-pink-600",
    },
    {
      title: "Education",
      icon: "📚",
      deals: "40+ Deals",
      color: "bg-violet-100 text-violet-600",
    },
    {
      title: "Automobile",
      icon: "🚗",
      deals: "65+ Deals",
      color: "bg-yellow-100 text-yellow-600",
    },
  ];

  return (
    <>
    <Navbar/>
   
    <div className="min-h-screen bg-[#f5f7fb] overflow-hidden">
      {/* Hero */}
      <section className="relative py-24 px-4">
        <div className="absolute top-0 left-0 w-80 h-80 bg-orange-200 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200 rounded-full blur-3xl opacity-40" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 shadow-md px-5 py-2 rounded-full text-sm font-medium text-gray-700 mb-6">
            <Flame size={16} className="text-orange-500" />
            Daily Local Business Deals
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight max-w-5xl mx-auto">
            Discover Amazing
            <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              {" "}Offers Near You
            </span>
          </h1>

          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Find discounts, exclusive deals, and premium offers from restaurants, salons, clinics, home services, and local businesses.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:scale-105 transition-all duration-300 text-white px-8 py-4 rounded-2xl font-semibold shadow-2xl flex items-center gap-2">
              Explore Deals
              <ArrowRight size={18} />
            </button>

            <button className="bg-white border border-gray-200 hover:bg-gray-50 px-8 py-4 rounded-2xl font-semibold text-gray-700 shadow-sm transition-all duration-300">
              Browse Categories
            </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-4xl font-black text-gray-900">
                Popular Categories
              </h2>
              <p className="text-gray-600 mt-2 text-lg">
                Explore trending local service offers
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <div
                key={index}
                className="group bg-white border border-gray-200 rounded-[32px] p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl text-3xl ${category.color}`}>
                  {category.icon}
                </div>

                <h3 className="mt-6 text-2xl font-bold text-gray-900">
                  {category.title}
                </h3>

                <p className="mt-3 text-gray-600 text-lg">
                  {category.deals}
                </p>

                <div className="mt-6 flex items-center gap-2 text-orange-500 font-semibold group-hover:gap-3 transition-all">
                  Explore Deals
                  <ArrowRight size={18} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offers Grid */}
      <section className="px-4 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-5 py-2 rounded-full text-sm font-semibold mb-5">
              <Sparkles size={16} />
              Featured Local Deals
            </div>

            <h2 className="text-5xl font-black text-gray-900">
              Trending Offers Near You
            </h2>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {offers.map((offer, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-[32px] border border-gray-200 overflow-hidden shadow-xl hover:-translate-y-2 transition-all duration-500"
              >
                <div className={`h-3 bg-gradient-to-r ${offer.gradient}`} />

                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`bg-gradient-to-r ${offer.gradient} text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg`}>
                      {offer.offer}
                    </div>

                    <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-semibold">
                      {offer.category}
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-gray-900 leading-snug">
                    {offer.title}
                  </h3>

                  <div className="flex items-center gap-2 mt-4 text-gray-700 font-medium">
                    <BadgeCheck size={18} className="text-emerald-500" />
                    {offer.business}
                  </div>

                  <div className="flex items-center gap-2 mt-3 text-gray-500">
                    <MapPin size={16} />
                    {offer.location}
                  </div>

                  <div className="mt-6 flex items-center gap-2 text-orange-500 font-semibold">
                    <Clock3 size={18} />
                    {offer.validity}
                  </div>

                  <div className="mt-8 flex gap-3">
                    <button className={`flex-1 bg-gradient-to-r ${offer.gradient} hover:opacity-90 text-white py-4 rounded-2xl font-semibold shadow-lg transition-all duration-300 flex items-center justify-center gap-2`}>
                      Claim Deal
                      <ArrowRight size={18} />
                    </button>

                    <button className="w-14 h-14 rounded-2xl border border-gray-200 hover:bg-gray-100 flex items-center justify-center transition-all duration-300">
                      <Ticket size={20} className="text-gray-700" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-4 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-r from-black via-gray-900 to-black rounded-[40px] p-14 text-center shadow-2xl">
            <div className="absolute top-0 left-0 w-72 h-72 bg-orange-500 rounded-full blur-3xl opacity-20" />
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-500 rounded-full blur-3xl opacity-20" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 backdrop-blur-md px-5 py-2 rounded-full text-white text-sm mb-6">
                <Gift size={16} className="text-yellow-400" />
                Premium Local Marketplace
              </div>

              <h2 className="text-5xl font-black text-white leading-tight max-w-4xl mx-auto">
                Save More With Trusted Local Businesses
              </h2>

              <p className="mt-6 text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Discover verified businesses, compare services, and unlock exclusive deals across restaurants, healthcare, salons, home services, and more.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mt-14">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
                  <Star className="text-yellow-400 mx-auto" size={32} />
                  <h3 className="mt-4 text-3xl font-black text-white">
                    500+
                  </h3>
                  <p className="mt-2 text-gray-300">
                    Verified Businesses
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
                  <Flame className="text-orange-400 mx-auto" size={32} />
                  <h3 className="mt-4 text-3xl font-black text-white">
                    200+
                  </h3>
                  <p className="mt-2 text-gray-300">
                    Active Daily Deals
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
                  <Zap className="text-emerald-400 mx-auto" size={32} />
                  <h3 className="mt-4 text-3xl font-black text-white">
                    24/7
                  </h3>
                  <p className="mt-2 text-gray-300">
                    Smart Recommendations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
     <Footer/>
    </>
  );
};

export default OffersPage;
