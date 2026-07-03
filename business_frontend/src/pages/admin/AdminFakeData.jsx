import { useState, useEffect } from "react";
import { api } from "../../services/api";
import AdminLayout from "../../layout/AdminLayout";
import { AlertTriangle, Users, Building2, Package, Trash2, RefreshCw } from "lucide-react";

const AdminFakeData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchFakeData();
  }, []);

  const fetchFakeData = async () => {
    try {
      const result = await api("/admin/fake-data");
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async (type) => {
    if (!confirm(`Delete all fake ${type}? This cannot be undone.`)) return;
    setActionLoading(true);
    try {
      await api("/admin/fake-data/bulk-delete", {
        method: "POST",
        body: { type }
      });
      fetchFakeData();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Fake Data Management">
        <div className="flex items-center justify-center py-20">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      </AdminLayout>
    );
  }

  const { fakeUsers, fakeBusinesses, flaggedListings, stats } = data || {};

  return (
    <AdminLayout title="Fake Data Management">
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">{error}</div>
      )}

      {/* Warning Banner */}
      <div className="mb-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <AlertTriangle className="text-amber-400" size={28} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-amber-300">Flagged Content Monitor</h3>
            <p className="mt-1 text-sm text-amber-400/80">
              Review and manage flagged accounts, businesses, and listings. Use bulk delete to clean up fake data.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-red-500/10">
              <Users className="text-red-400" size={20} />
            </div>
            <span className="text-2xl font-bold text-white">{stats?.totalFakeUsers || 0}</span>
          </div>
          <p className="text-gray-400 text-sm">Fake Users</p>
        </div>
        <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-orange-500/10">
              <Building2 className="text-orange-400" size={20} />
            </div>
            <span className="text-2xl font-bold text-white">{stats?.totalFakeBusinesses || 0}</span>
          </div>
          <p className="text-gray-400 text-sm">Fake Businesses</p>
        </div>
        <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-amber-500/10">
              <Package className="text-amber-400" size={20} />
            </div>
            <span className="text-2xl font-bold text-white">{stats?.totalFlaggedListings || 0}</span>
          </div>
          <p className="text-gray-400 text-sm">Flagged Listings</p>
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="text-red-400" size={24} />
            <h3 className="text-lg font-bold text-white">Fake Users ({fakeUsers?.length || 0})</h3>
          </div>
          <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
            {(fakeUsers || []).map((u) => (
              <div key={u.id || u.email} className="bg-[#0F172A] rounded-xl px-3 py-2 text-sm">
                <span className="text-gray-300">{u.name}</span>
                <span className="text-gray-500 ml-2">{u.email}</span>
              </div>
            ))}
            {(!fakeUsers || fakeUsers.length === 0) && (
              <p className="text-gray-500 text-sm text-center py-4">No fake users detected</p>
            )}
          </div>
          <button
            onClick={() => handleBulkDelete("users")}
            disabled={actionLoading || !fakeUsers?.length}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl text-sm font-medium transition disabled:opacity-50"
          >
            <Trash2 size={16} />
            Delete All Fake Users
          </button>
        </div>

        <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="text-orange-400" size={24} />
            <h3 className="text-lg font-bold text-white">Fake Businesses ({fakeBusinesses?.length || 0})</h3>
          </div>
          <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
            {(fakeBusinesses || []).map((b) => (
              <div key={b.id || b.name} className="bg-[#0F172A] rounded-xl px-3 py-2 text-sm">
                <span className="text-gray-300">{b.name}</span>
                <span className="text-gray-500 ml-2">{b.category}</span>
              </div>
            ))}
            {(!fakeBusinesses || fakeBusinesses.length === 0) && (
              <p className="text-gray-500 text-sm text-center py-4">No fake businesses detected</p>
            )}
          </div>
          <button
            onClick={() => handleBulkDelete("businesses")}
            disabled={actionLoading || !fakeBusinesses?.length}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 rounded-xl text-sm font-medium transition disabled:opacity-50"
          >
            <Trash2 size={16} />
            Delete All Fake Businesses
          </button>
        </div>

        <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Package className="text-amber-400" size={24} />
            <h3 className="text-lg font-bold text-white">Flagged Listings ({flaggedListings?.length || 0})</h3>
          </div>
          <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
            {(flaggedListings || []).map((l) => (
              <div key={l.id || l.title} className="bg-[#0F172A] rounded-xl px-3 py-2 text-sm">
                <span className="text-gray-300">{l.title}</span>
                <span className="text-gray-500 ml-2">₹{l.price}</span>
              </div>
            ))}
            {(!flaggedListings || flaggedListings.length === 0) && (
              <p className="text-gray-500 text-sm text-center py-4">No flagged listings detected</p>
            )}
          </div>
          <button
            onClick={() => handleBulkDelete("listings")}
            disabled={actionLoading || !flaggedListings?.length}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 rounded-xl text-sm font-medium transition disabled:opacity-50"
          >
            <Trash2 size={16} />
            Remove All Flagged
          </button>
        </div>
      </div>

      {/* Delete All */}
      <div className="bg-[#1E293B] rounded-2xl border border-red-500/20 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-red-400">Danger Zone</h3>
            <p className="text-sm text-gray-400 mt-1">Delete all flagged content at once</p>
          </div>
          <button
            onClick={() => handleBulkDelete("all")}
            disabled={actionLoading}
            className="flex items-center gap-2 px-6 py-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl text-sm font-medium transition disabled:opacity-50"
          >
            <Trash2 size={18} />
            Delete All Flagged Data
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminFakeData;