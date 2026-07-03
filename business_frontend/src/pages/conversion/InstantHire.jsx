import { useState } from "react";
import { businesses } from "../../data/businesses";
import BusinessCard from "../../components/business/BusinessCard";
import { api } from "../../services/api";

const InstantHire = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ category: "", location: "", budget: "", timeline: "", name: "", mobile: "" });
  const [recommended, setRecommended] = useState([]);
  const [error, setError] = useState("");

  const recommendedBusinesses = businesses
    .filter((business) => business.verified)
    .slice(0, 3);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category || !form.location || !form.name || form.mobile.replace(/\D/g, "").length < 10) return setError("Please complete the service, location, name, and a valid mobile number.");
    try {
      const data = await api("/leads", { method: "POST", body: { ...form, budget: Number(form.budget) || 0, requirement: form.category, source: "Instant Hire" } });
      setRecommended(data.matches.map((item) => ({ ...item, verified: item.verifiedBadge, description: item.usp, area: item.address?.split(",")[0] || "Local area", reviews: Math.round(item.rating * 20), priceRange: `₹${item.budgetMin?.toLocaleString()} – ₹${item.budgetMax?.toLocaleString()}`, experience: `${item.responseTimeMins} min response time`, services: item.listings?.flatMap((listing) => listing.tags || []) || [item.subCategory] })));
      setSubmitted(true); setError("");
    } catch (err) { setError(err.message); }
  };

  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  return (
    <main className="min-h-screen bg-[#F9FAFB] px-6 py-10">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl bg-[#111827] p-8 text-white">
          <span className="rounded-full bg-green-500/10 px-4 py-2 text-sm font-semibold text-[#22C55E]">
            Instant Hire
          </span>

          <h1 className="mt-5 text-3xl font-bold md:text-4xl">
            Hire a trusted service provider quickly
          </h1>

          <p className="mt-3 max-w-2xl text-gray-300">
            Submit your requirement and get connected with suitable verified
            vendors faster.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
          <div>
            {!submitted ? (
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm"
              >
                <h2 className="text-2xl font-bold text-[#1F2937]">
                  Quick requirement form
                </h2>

                <p className="mt-2 text-sm text-[#6B7280]">
                  Fill this form and we will show recommended vendors.
                </p>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#1F2937]">
                      Service Needed
                    </label>
                    <input
                      type="text"
                      value={form.category}
                      onChange={update("category")}
                      placeholder="Example: Website Development"
                      className="w-full rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-sm text-[#1F2937] placeholder:text-[#6B7280] outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-green-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#1F2937]">
                      Location
                    </label>
                    <input
                      type="text"
                      value={form.location}
                      onChange={update("location")}
                      placeholder="Example: Bhubaneswar"
                      className="w-full rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-sm text-[#1F2937] placeholder:text-[#6B7280] outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-green-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#1F2937]">
                      Budget
                    </label>
                    <select value={form.budget} onChange={update("budget")} className="w-full rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-sm text-[#1F2937] outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-green-100">
                      <option value="">Select Budget</option>
                      <option value="5000">Below ₹5,000</option>
                      <option value="15000">₹5,000 - ₹15,000</option>
                      <option value="50000">₹15,000 - ₹50,000</option>
                      <option value="100000">Above ₹50,000</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#1F2937]">
                      Urgency
                    </label>
                    <select value={form.timeline} onChange={update("timeline")} className="w-full rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-sm text-[#1F2937] outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-green-100">
                      <option value="">Select Urgency</option>
                      <option>Today</option>
                      <option>Within 2-3 Days</option>
                      <option>This Week</option>
                      <option>Flexible</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#1F2937]">
                      Name
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={update("name")}
                      placeholder="Enter your name"
                      className="w-full rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-sm text-[#1F2937] placeholder:text-[#6B7280] outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-green-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#1F2937]">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={form.mobile}
                      onChange={update("mobile")}
                      placeholder="Enter mobile number"
                      className="w-full rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-sm text-[#1F2937] placeholder:text-[#6B7280] outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-green-100"
                    />
                  </div>
                </div>
                {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

                <button
                  type="submit"
                  className="mt-6 rounded-lg bg-[#22C55E] px-5 py-3 text-sm font-semibold text-white hover:bg-green-600"
                >
                  Find Vendors Now
                </button>
              </form>
            ) : (
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-3xl">
                  ✅
                </div>

                <h2 className="mt-5 text-2xl font-bold text-[#1F2937]">
                  Requirement submitted
                </h2>

                <p className="mx-auto mt-2 max-w-md text-[#6B7280]">
                  We found some recommended verified businesses for your
                  requirement.
                </p>

                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 rounded-lg border border-[#22C55E] px-5 py-3 text-sm font-semibold text-[#22C55E] hover:bg-green-50"
                >
                  Submit Another Requirement
                </button>
              </div>
            )}

            {submitted && (
              <div className="mt-8">
                <h2 className="mb-4 text-2xl font-bold text-[#1F2937]">
                  Recommended vendors
                </h2>

                {(recommended.length ? recommended : recommendedBusinesses).map((business) => (
                  <BusinessCard key={business.id} business={business} />
                ))}
              </div>
            )}
          </div>

          <aside className="h-fit rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <h3 className="text-xl font-bold text-[#1F2937]">
              Why use Instant Hire?
            </h3>

            <div className="mt-5 space-y-4">
              <div className="rounded-2xl bg-[#F9FAFB] p-4">
                <h4 className="font-semibold text-[#1F2937]">
                  Faster matching
                </h4>
                <p className="mt-1 text-sm text-[#6B7280]">
                  Quickly find suitable vendors based on your requirement.
                </p>
              </div>

              <div className="rounded-2xl bg-[#F9FAFB] p-4">
                <h4 className="font-semibold text-[#1F2937]">
                  Verified vendors
                </h4>
                <p className="mt-1 text-sm text-[#6B7280]">
                  Get connected with businesses that are already verified.
                </p>
              </div>

              <div className="rounded-2xl bg-[#F9FAFB] p-4">
                <h4 className="font-semibold text-[#1F2937]">
                  Better conversion
                </h4>
                <p className="mt-1 text-sm text-[#6B7280]">
                  Simple form flow helps users take action quickly.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default InstantHire;
