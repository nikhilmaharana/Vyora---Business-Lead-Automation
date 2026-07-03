import { useState, useEffect } from "react";
import { api, getUser, isAuthenticated } from "../../services/api";
import Icon from "../../components/common/Icon";
import { Save, Camera, RefreshCw } from "lucide-react";

const VendorSettings = () => {
  const [business, setBusiness] = useState(null);
  const [form, setForm] = useState({
    name: "", category: "", subCategory: "", city: "", state: "",
    address: "", pincode: "", budgetMin: "", budgetMax: "",
    usp: "", workingHours: "", responseTimeMins: "",
    phone: "", website: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = "/login";
      return;
    }
    fetchBusiness();
  }, []);

  const fetchBusiness = async () => {
    try {
      const data = await api("/vendor/dashboard");
      const biz = data.business;
      setBusiness(biz);
      if (biz) {
        setForm({
          name: biz.name || "",
          category: biz.category || "",
          subCategory: biz.subCategory || "",
          city: biz.city || "",
          state: biz.state || "",
          address: biz.address || "",
          pincode: biz.pincode || "",
          budgetMin: biz.budgetMin || "",
          budgetMax: biz.budgetMax || "",
          usp: biz.usp || "",
          workingHours: biz.workingHours || "",
          responseTimeMins: biz.responseTimeMins || "",
          phone: biz.phone || "",
          website: biz.website?.slug || ""
        });
      }
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!business) return;
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const updated = await api(`/businesses/${business.id}`, {
        method: "PATCH",
        body: {
          ...form,
          budgetMin: Number(form.budgetMin) || 0,
          budgetMax: Number(form.budgetMax) || 0,
          responseTimeMins: Number(form.responseTimeMins) || 0,
          website: { slug: form.website, customDomain: "", theme: "clean", published: true }
        }
      });
      setBusiness(updated.business);
      setMessage({ type: "success", text: "Business settings updated successfully!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F9FAFB] px-6 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1F2937]">Business Settings</h1>
          <p className="mt-2 text-gray-500">Update your business profile information</p>
        </div>

        {message.text && (
          <div className={`mb-6 rounded-lg px-4 py-3 text-sm ${
            message.type === "success" 
              ? "bg-green-50 border border-green-200 text-green-700" 
              : "bg-red-50 border border-red-200 text-red-700"
          }`}>
            {message.text}
          </div>
        )}

        {!business ? (
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-12 text-center">
            <Icon name="store" size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-500">No business profile yet</h3>
            <p className="text-sm text-gray-400 mt-2">Create your business profile to manage settings</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#1F2937] mb-6">Basic Information</h2>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                  <input name="name" value={form.name} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input name="category" value={form.category} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category</label>
                  <input name="subCategory" value={form.subCategory} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">USP (Unique Selling Point)</label>
                  <input name="usp" value={form.usp} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500" />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#1F2937] mb-6">Location</h2>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input name="city" value={form.city} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input name="state" value={form.state} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input name="address" value={form.address} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                  <input name="pincode" value={form.pincode} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website Slug</label>
                  <input name="website" value={form.website} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500" placeholder="your-business-name" />
                </div>
              </div>
            </div>

            {/* Pricing & Hours */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#1F2937] mb-6">Pricing & Hours</h2>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Budget (₹)</label>
                  <input name="budgetMin" type="number" value={form.budgetMin} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Budget (₹)</label>
                  <input name="budgetMax" type="number" value={form.budgetMax} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Working Hours</label>
                  <input name="workingHours" value={form.workingHours} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500" placeholder="Mon-Sat, 10 AM - 7 PM" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Response Time (minutes)</label>
                  <input name="responseTimeMins" type="number" value={form.responseTimeMins} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500" />
                </div>
              </div>
            </div>

            {/* Save */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-4 rounded-2xl hover:from-green-600 hover:to-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
            >
              {saving ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default VendorSettings;