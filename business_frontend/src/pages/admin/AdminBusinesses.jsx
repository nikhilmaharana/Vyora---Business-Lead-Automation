import { useState, useEffect } from "react";
import { api } from "../../services/api";
import AdminLayout from "../../layout/AdminLayout";
import { Search, CheckCircle, XCircle, Star, Shield, Trash2 } from "lucide-react";

const AdminBusinesses = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const data = await api(`/admin/businesses?status=${filter}&search=${search}`);
      setBusinesses(data.businesses || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading) fetchBusinesses();
  }, [filter, search]);

  const handleUpdate = async (id, updates) => {
    setActionLoading(id);
    try {
      await api(`/admin/businesses/${id}`, { method: "PATCH", body: updates });
      fetchBusinesses();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this business? This cannot be undone.")) return;
    setActionLoading(id);
    try {
      await api(`/admin/businesses/${id}`, { method: "DELETE" });
      fetchBusinesses();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Businesses">
        <div className="flex items-center justify-center py-20">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Business Management">
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">{error}</div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search businesses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1E293B] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="flex gap-2">
          {["all", "approved", "pending", "featured", "verified"].map((f) => (
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

      <div className="bg-[#1E293B] rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-[#0F172A]/50">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Business</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Owner</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Category</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">City</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Status</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Rating</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Revenue</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {businesses.map((b) => (
                <tr key={b.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4">
                    <span className="text-white font-medium">{b.name}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-300">{b.ownerName || "—"}</td>
                  <td className="py-3 px-4 text-gray-300">{b.category || "—"}</td>
                  <td className="py-3 px-4 text-gray-300">{b.city || "—"}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {b.approved ? (
                        <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full">Approved</span>
                      ) : (
                        <span className="text-xs bg-amber-500/10 text-amber-400 px-2 py-1 rounded-full">Pending</span>
                      )}
                      {b.verifiedBadge && <Shield size={12} className="text-blue-400" />}
                      {b.featured && <Star size={12} className="text-yellow-400" />}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right text-yellow-400">{b.rating || "—"}</td>
                  <td className="py-3 px-4 text-right text-emerald-400">₹{(b.revenue || 0).toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-2">
                      {!b.approved && (
                        <button
                          onClick={() => handleUpdate(b.id, { approved: true })}
                          disabled={actionLoading === b.id}
                          className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                          title="Approve"
                        >
                          <CheckCircle size={14} />
                        </button>
                      )}
                      {b.approved && (
                        <button
                          onClick={() => handleUpdate(b.id, { approved: false })}
                          disabled={actionLoading === b.id}
                          className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                          title="Unapprove"
                        >
                          <XCircle size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => handleUpdate(b.id, { featured: !b.featured })}
                        disabled={actionLoading === b.id}
                        className={`p-1.5 rounded-lg ${b.featured ? 'bg-yellow-500/10 text-yellow-400' : 'bg-gray-500/10 text-gray-400'} hover:bg-yellow-500/20`}
                        title={b.featured ? "Unfeature" : "Feature"}
                      >
                        <Star size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(b.id)}
                        disabled={actionLoading === b.id}
                        className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {businesses.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">No businesses found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBusinesses;