import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api, getUser, isAuthenticated } from "../../services/api";
import { Building2, Search, Shield, CheckCircle, XCircle, Star, MapPin, DollarSign } from "lucide-react";

const AdminVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = getUser();
    if (!isAuthenticated() || !user || (user.role !== "admin" && user.role !== "super_admin")) {
      navigate("/admin/login");
      return;
    }
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const data = await api("/admin");
      setVendors(data.vendors || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleApproval = async (vendorId, approved) => {
    try {
      await api(`/admin/vendors/${vendorId}/approval`, {
        method: "PATCH",
        body: { approved: !approved }
      });
      setVendors(prev => prev.map(v => v.id === vendorId ? { ...v, approved: !approved, verifiedBadge: !approved && v.kycStatus === 'verified' } : v));
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredVendors = vendors.filter(v => 
    v.name?.toLowerCase().includes(search.toLowerCase()) ||
    v.category?.toLowerCase().includes(search.toLowerCase()) ||
    v.city?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <div className="border-b border-white/5 bg-[#1E293B]/50 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="text-indigo-400" size={24} />
            <h1 className="text-xl font-bold text-white">Manage Vendors</h1>
          </div>
          <button onClick={() => navigate("/admin/dashboard")} className="text-sm text-indigo-400 hover:text-indigo-300">← Back</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">{error}</div>
        )}

        <div className="mb-6 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search vendors by name, category or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1E293B] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="grid gap-4">
          {filteredVendors.map((vendor) => (
            <div key={vendor.id} className="bg-[#1E293B] rounded-2xl border border-white/5 p-6 hover:border-white/10 transition">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white font-bold text-xl">
                    {vendor.name?.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-white">{vendor.name}</h3>
                      {vendor.verifiedBadge && (
                        <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">✓ Verified</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">{vendor.category}{vendor.subCategory ? ` • ${vendor.subCategory}` : ""}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><MapPin size={12} /> {vendor.city}, {vendor.state}</span>
                      <span className="flex items-center gap-1"><Star size={12} className="text-yellow-400" /> {vendor.rating}</span>
                      <span className="flex items-center gap-1"><DollarSign size={12} /> ₹{vendor.budgetMin?.toLocaleString()} - ₹{vendor.budgetMax?.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        vendor.approved 
                          ? "bg-emerald-500/10 text-emerald-400" 
                          : "bg-amber-500/10 text-amber-400"
                      }`}>
                        {vendor.approved ? "Approved" : "Pending"}
                      </span>
                      <span className="text-xs text-gray-500">Plan: {vendor.plan}</span>
                      <span className="text-xs text-gray-500">KYC: {vendor.kycStatus}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toggleApproval(vendor.id, vendor.approved)}
                  className={`text-xs px-4 py-2 rounded-lg font-medium transition flex items-center gap-1.5 ${
                    vendor.approved 
                      ? "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20" 
                      : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                  }`}
                >
                  {vendor.approved ? <XCircle size={14} /> : <CheckCircle size={14} />}
                  {vendor.approved ? "Revoke" : "Approve"}
                </button>
              </div>
            </div>
          ))}
          {filteredVendors.length === 0 && (
            <div className="text-center py-12 bg-[#1E293B] rounded-2xl border border-white/5">
              <Building2 className="mx-auto text-gray-500 mb-3" size={36} />
              <p className="text-gray-400">No vendors found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminVendors;