import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api, getUser, isAuthenticated } from "../../services/api";
import { Shield, Search, CheckCircle, XCircle, Clock, UserCheck, UserX, Building2, Mail, Phone, MapPin, FileText } from "lucide-react";

const AdminVendorRegistrations = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState(null);
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
      const data = await api("/admin/vendor-registrations");
      setVendors(data.vendors || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (vendorId, approved) => {
    setActionLoading(vendorId);
    setError("");
    try {
      await api(`/admin/vendor-registrations/${vendorId}/approve`, {
        method: "PATCH",
        body: { approved }
      });
      setVendors(prev => prev.map(v => 
        v.id === vendorId ? { ...v, vendorStatus: approved ? 'approved' : 'rejected' } : v
      ));
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredVendors = vendors.filter(v => {
    const matchesSearch = 
      v.name?.toLowerCase().includes(search.toLowerCase()) ||
      v.email?.toLowerCase().includes(search.toLowerCase()) ||
      v.businessName?.toLowerCase().includes(search.toLowerCase()) ||
      v.category?.toLowerCase().includes(search.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    if (filter === "pending") return matchesSearch && v.vendorStatus === "pending_approval";
    if (filter === "approved") return matchesSearch && v.vendorStatus === "approved";
    if (filter === "rejected") return matchesSearch && v.vendorStatus === "rejected";
    return matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="flex items-center gap-1 text-xs bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full"><CheckCircle size={12} /> Approved</span>;
      case 'rejected':
        return <span className="flex items-center gap-1 text-xs bg-red-500/10 text-red-400 px-2.5 py-1 rounded-full"><XCircle size={12} /> Rejected</span>;
      default:
        return <span className="flex items-center gap-1 text-xs bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-full"><Clock size={12} /> Pending</span>;
    }
  };

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
            <h1 className="text-xl font-bold text-white">Vendor Registrations</h1>
          </div>
          <button onClick={() => navigate("/admin/dashboard")} className="text-sm text-indigo-400 hover:text-indigo-300">← Back to Dashboard</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">{error}</div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-[#1E293B] rounded-xl border border-white/5 p-4">
            <p className="text-2xl font-bold text-white">{vendors.length}</p>
            <p className="text-sm text-gray-400">Total Registrations</p>
          </div>
          <div className="bg-[#1E293B] rounded-xl border border-white/5 p-4">
            <p className="text-2xl font-bold text-amber-400">{vendors.filter(v => v.vendorStatus === 'pending_approval').length}</p>
            <p className="text-sm text-gray-400">Pending</p>
          </div>
          <div className="bg-[#1E293B] rounded-xl border border-white/5 p-4">
            <p className="text-2xl font-bold text-emerald-400">{vendors.filter(v => v.vendorStatus === 'approved').length}</p>
            <p className="text-sm text-gray-400">Approved</p>
          </div>
          <div className="bg-[#1E293B] rounded-xl border border-white/5 p-4">
            <p className="text-2xl font-bold text-red-400">{vendors.filter(v => v.vendorStatus === 'rejected').length}</p>
            <p className="text-sm text-gray-400">Rejected</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search by name, email, business or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#1E293B] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex gap-2">
            {["all", "pending", "approved", "rejected"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === f 
                    ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" 
                    : "bg-[#1E293B] text-gray-400 border border-white/5 hover:border-white/10"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Vendor List */}
        <div className="grid gap-4">
          {filteredVendors.map((vendor) => (
            <div key={vendor.id} className="bg-[#1E293B] rounded-2xl border border-white/5 p-6 hover:border-white/10 transition">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                    {vendor.name?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-white">{vendor.name}</h3>
                      {getStatusBadge(vendor.vendorStatus)}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                      <span className="flex items-center gap-1.5"><Mail size={14} /> {vendor.email}</span>
                      <span className="flex items-center gap-1.5"><Phone size={14} /> {vendor.phone}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      {vendor.businessName && (
                        <span className="flex items-center gap-1.5"><Building2 size={14} /> {vendor.businessName}</span>
                      )}
                      {vendor.category && (
                        <span className="flex items-center gap-1.5"><FileText size={14} /> {vendor.category}</span>
                      )}
                      {vendor.city && (
                        <span className="flex items-center gap-1.5"><MapPin size={14} /> {vendor.city}</span>
                      )}
                    </div>
                    {vendor.gstin && (
                      <p className="mt-2 text-xs text-gray-500">GSTIN: {vendor.gstin}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-600">
                      Registered: {new Date(vendor.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                
                {vendor.vendorStatus === 'pending_approval' && (
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleApproval(vendor.id, true)}
                      disabled={actionLoading === vendor.id}
                      className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg font-medium bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition disabled:opacity-50"
                    >
                      {actionLoading === vendor.id ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
                      ) : (
                        <CheckCircle size={14} />
                      )}
                      Approve
                    </button>
                    <button
                      onClick={() => handleApproval(vendor.id, false)}
                      disabled={actionLoading === vendor.id}
                      className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition disabled:opacity-50"
                    >
                      <XCircle size={14} />
                      Reject
                    </button>
                  </div>
                )}
                
                {vendor.vendorStatus === 'approved' && (
                  <div className="ml-4">
                    <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                      <UserCheck size={16} /> Approved
                    </span>
                  </div>
                )}
                
                {vendor.vendorStatus === 'rejected' && (
                  <div className="ml-4">
                    <span className="flex items-center gap-1.5 text-xs text-red-400">
                      <UserX size={16} /> Rejected
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {filteredVendors.length === 0 && (
            <div className="text-center py-16 bg-[#1E293B] rounded-2xl border border-white/5">
              <UserCheck className="mx-auto text-gray-500 mb-3" size={48} />
              <p className="text-gray-400 text-lg font-medium">No vendor registrations found</p>
              <p className="text-gray-500 text-sm mt-1">
                {search ? "Try a different search term" : "No vendors have registered yet"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminVendorRegistrations;