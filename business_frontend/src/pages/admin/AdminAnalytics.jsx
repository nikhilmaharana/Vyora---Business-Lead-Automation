import { useState, useEffect } from "react";
import { api, getToken } from "../../services/api";
import AdminLayout from "../../layout/AdminLayout";
import { Users, Building2, Target, DollarSign, TrendingUp, Star, Package, CheckCircle, Clock, XCircle, Activity } from "lucide-react";

const AdminAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const result = await api("/admin/analytics");
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Analytics">
        <div className="flex items-center justify-center py-20">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      </AdminLayout>
    );
  }

  const { overview, vendors, leads, listings, categories, topVendors, monthlyRegistrations } = data || {};

  const statCards = [
    { label: "Total Users", value: overview?.totalUsers || 0, icon: Users, color: "from-blue-500 to-cyan-500", bg: "bg-blue-500/10" },
    { label: "Total Vendors", value: overview?.totalVendors || 0, icon: Building2, color: "from-emerald-500 to-green-500", bg: "bg-emerald-500/10" },
    { label: "Total Businesses", value: overview?.totalBusinesses || 0, icon: Package, color: "from-purple-500 to-pink-500", bg: "bg-purple-500/10" },
    { label: "Total Leads", value: overview?.totalLeads || 0, icon: Target, color: "from-orange-500 to-amber-500", bg: "bg-orange-500/10" },
    { label: "Total Revenue", value: `₹${(overview?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: "from-green-500 to-teal-500", bg: "bg-green-500/10" },
    { label: "Avg Rating", value: overview?.avgRating || 0, icon: Star, color: "from-yellow-500 to-orange-500", bg: "bg-yellow-500/10" },
    { label: "Lead Conversion", value: `${overview?.leadConversionRate || 0}%`, icon: TrendingUp, color: "from-indigo-500 to-purple-500", bg: "bg-indigo-500/10" },
    { label: "Total Reviews", value: overview?.totalReviews || 0, icon: Activity, color: "from-red-500 to-pink-500", bg: "bg-red-500/10" },
  ];

  return (
    <AdminLayout title="Analytics Dashboard">
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">{error}</div>
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-[#1E293B] rounded-2xl border border-white/5 p-5 hover:border-white/10 transition">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className="text-white" size={20} />
              </div>
              <span className="text-2xl font-bold text-white">{stat.value}</span>
            </div>
            <p className="text-gray-400 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Vendor Status */}
        <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-6">
          <h2 className="text-lg font-bold text-white mb-4">Vendor Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-[#0F172A] rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="text-sm text-gray-300">Pending Approval</span>
              </div>
              <span className="text-lg font-bold text-amber-400">{vendors?.pending || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#0F172A] rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-sm text-gray-300">Approved</span>
              </div>
              <span className="text-lg font-bold text-emerald-400">{vendors?.approved || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#0F172A] rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <span className="text-sm text-gray-300">Rejected</span>
              </div>
              <span className="text-lg font-bold text-red-400">{vendors?.rejected || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#0F172A] rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-400" />
                <span className="text-sm text-gray-300">Total Vendors</span>
              </div>
              <span className="text-lg font-bold text-blue-400">{vendors?.total || 0}</span>
            </div>
          </div>
        </div>

        {/* Lead Status */}
        <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-6">
          <h2 className="text-lg font-bold text-white mb-4">Lead Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-[#0F172A] rounded-xl">
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-amber-400" />
                <span className="text-sm text-gray-300">New</span>
              </div>
              <span className="text-lg font-bold text-amber-400">{leads?.new || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#0F172A] rounded-xl">
              <div className="flex items-center gap-3">
                <Activity size={16} className="text-blue-400" />
                <span className="text-sm text-gray-300">Contacted</span>
              </div>
              <span className="text-lg font-bold text-blue-400">{leads?.contacted || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#0F172A] rounded-xl">
              <div className="flex items-center gap-3">
                <CheckCircle size={16} className="text-emerald-400" />
                <span className="text-sm text-gray-300">Converted</span>
              </div>
              <span className="text-lg font-bold text-emerald-400">{leads?.converted || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#0F172A] rounded-xl">
              <div className="flex items-center gap-3">
                <TrendingUp size={16} className="text-purple-400" />
                <span className="text-sm text-gray-300">Conversion Rate</span>
              </div>
              <span className="text-lg font-bold text-purple-400">{leads?.conversionRate || 0}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Performance */}
      <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-6 mb-8">
        <h2 className="text-lg font-bold text-white mb-4">Category Performance</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Category</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Businesses</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Leads</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Revenue</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Avg Rating</th>
              </tr>
            </thead>
            <tbody>
              {(categories || []).map((cat) => (
                <tr key={cat.name} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4 text-white font-medium">{cat.name}</td>
                  <td className="py-3 px-4 text-right text-gray-300">{cat.businessCount}</td>
                  <td className="py-3 px-4 text-right text-gray-300">{cat.leadCount}</td>
                  <td className="py-3 px-4 text-right text-gray-300">₹{(cat.totalRevenue || 0).toLocaleString()}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-yellow-400">{cat.avgRating}</span>
                  </td>
                </tr>
              ))}
              {(!categories || categories.length === 0) && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">No categories found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Vendors */}
      <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-6 mb-8">
        <h2 className="text-lg font-bold text-white mb-4">Top Performing Vendors</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Vendor</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Category</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Revenue</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Rating</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Conversion</th>
              </tr>
            </thead>
            <tbody>
              {(topVendors || []).map((v) => (
                <tr key={v.id || v.name} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-white font-medium">{v.name}</p>
                      <p className="text-xs text-gray-500">{v.ownerName}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-300">{v.category}</td>
                  <td className="py-3 px-4 text-right text-emerald-400">₹{(v.revenue || 0).toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-yellow-400">{v.rating}</td>
                  <td className="py-3 px-4 text-right text-blue-400">{v.conversionRate}%</td>
                </tr>
              ))}
              {(!topVendors || topVendors.length === 0) && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">No vendors found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Registrations */}
      {monthlyRegistrations && monthlyRegistrations.length > 0 && (
        <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-6">
          <h2 className="text-lg font-bold text-white mb-4">Monthly Registrations</h2>
          <div className="flex items-end gap-2 h-32 overflow-x-auto pb-2">
            {monthlyRegistrations.map((m, i) => {
              const maxCount = Math.max(...monthlyRegistrations.map(r => r.count));
              const height = maxCount > 0 ? (m.count / maxCount) * 100 : 0;
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-gray-500">{m.count}</span>
                  <div
                    className="w-full bg-indigo-500/50 rounded-t hover:bg-indigo-500 transition cursor-pointer"
                    style={{ height: `${Math.max(height, 4)}%` }}
                    title={`${m.month}: ${m.count} registrations`}
                  />
                  <span className="text-xs text-gray-500">{m.month.slice(5)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminAnalytics;