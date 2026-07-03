import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import AdminLayout from "../../layout/AdminLayout";
import { 
  Users, Building2, Target, DollarSign, 
  Activity, Shield, TrendingUp, 
  BarChart3, CheckCircle, XCircle, Clock, UserPlus,
  LineChart, LayoutGrid, Store, Star, AlertTriangle, FileText
} from "lucide-react";

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [adminData, analyticsData] = await Promise.all([
        api("/admin"),
        api("/admin/analytics")
      ]);
      setData(adminData);
      setAnalytics(analyticsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="flex items-center justify-center py-20">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      </AdminLayout>
    );
  }

  const a = analytics?.overview || {};
  const v = analytics?.vendors || {};

  const stats = [
    { label: "Total Users", value: a.totalUsers || data?.users?.length || 0, icon: Users, color: "from-blue-500 to-cyan-500", bg: "bg-blue-500/10", link: "/admin/users" },
    { label: "Total Vendors", value: a.totalVendors || data?.vendors?.length || 0, icon: Building2, color: "from-emerald-500 to-green-500", bg: "bg-emerald-500/10", link: "/admin/vendors" },
    { label: "Total Leads", value: a.totalLeads || data?.leads?.length || 0, icon: Target, color: "from-orange-500 to-amber-500", bg: "bg-orange-500/10", link: "/admin/leads" },
    { label: "Total Revenue", value: `₹${(a.totalRevenue || data?.vendors?.reduce((s, v) => s + (v.revenue || 0), 0) || 0).toLocaleString()}`, icon: DollarSign, color: "from-purple-500 to-pink-500", bg: "bg-purple-500/10", link: "/admin/analytics" },
  ];

  const pendingApprovals = data?.vendors?.filter(v => !v.approved) || [];
  const recentActivity = data?.activityLogs?.slice(-5).reverse() || [];

  const quickLinks = [
    { path: "/admin/analytics", label: "Analytics", icon: LineChart, color: "text-indigo-400", bg: "bg-indigo-500/10" },
    { path: "/admin/users", label: "Users", icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
    { path: "/admin/vendors", label: "Vendors", icon: Building2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { path: "/admin/vendor-registrations", label: "Registrations", icon: UserPlus, color: "text-amber-400", bg: "bg-amber-500/10" },
    { path: "/admin/businesses", label: "Businesses", icon: Store, color: "text-purple-400", bg: "bg-purple-500/10" },
    { path: "/admin/categories", label: "Categories", icon: LayoutGrid, color: "text-pink-400", bg: "bg-pink-500/10" },
    { path: "/admin/leads", label: "Leads", icon: Target, color: "text-orange-400", bg: "bg-orange-500/10" },
    { path: "/admin/reviews", label: "Reviews", icon: Star, color: "text-yellow-400", bg: "bg-yellow-500/10" },
    { path: "/admin/fake-data", label: "Fake Data", icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10" },
    { path: "/admin/reports", label: "Reports", icon: FileText, color: "text-cyan-400", bg: "bg-cyan-500/10" },
  ];

  return (
    <AdminLayout title="Dashboard">
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-[#1E293B] rounded-2xl border border-white/5 p-6 hover:border-white/10 transition">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl shrink-0 ${stat.bg}`}>
                  <stat.icon className="text-white" size={22} />
                </div>
                <span className="text-3xl font-bold text-white truncate max-w-[60%] text-right">{stat.value}</span>
              </div>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions & Pending Approvals */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2 bg-[#1E293B] rounded-2xl border border-white/5 p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="text-indigo-400" size={20} />
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Link to="/admin/vendor-registrations" className="bg-[#0F172A] rounded-xl p-4 text-center hover:border-indigo-500/30 border border-white/5 transition group">
                <UserPlus className="mx-auto text-indigo-400 mb-2 group-hover:scale-110 transition" size={24} />
                <p className="text-xs text-gray-400">Vendor Registrations</p>
              </Link>
              <Link to="/admin/users" className="bg-[#0F172A] rounded-xl p-4 text-center hover:border-blue-500/30 border border-white/5 transition group">
                <Users className="mx-auto text-blue-400 mb-2 group-hover:scale-110 transition" size={24} />
                <p className="text-xs text-gray-400">Manage Users</p>
              </Link>
              <Link to="/admin/vendors" className="bg-[#0F172A] rounded-xl p-4 text-center hover:border-emerald-500/30 border border-white/5 transition group">
                <Building2 className="mx-auto text-emerald-400 mb-2 group-hover:scale-110 transition" size={24} />
                <p className="text-xs text-gray-400">Manage Vendors</p>
              </Link>
              <Link to="/admin/leads" className="bg-[#0F172A] rounded-xl p-4 text-center hover:border-orange-500/30 border border-white/5 transition group">
                <Target className="mx-auto text-orange-400 mb-2 group-hover:scale-110 transition" size={24} />
                <p className="text-xs text-gray-400">Manage Leads</p>
              </Link>
              <Link to="/admin/settings" className="bg-[#0F172A] rounded-xl p-4 text-center hover:border-purple-500/30 border border-white/5 transition group">
                <Activity className="mx-auto text-purple-400 mb-2 group-hover:scale-110 transition" size={24} />
                <p className="text-xs text-gray-400">Settings</p>
              </Link>
            </div>
          </div>

          {/* Pending Approvals & Vendor Registrations */}
          <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Clock className="text-amber-400" size={20} />
              Pending Approvals
            </h2>
            {pendingApprovals.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="mx-auto text-emerald-400 mb-2" size={32} />
                <p className="text-sm text-gray-400">All vendors approved</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingApprovals.slice(0, 5).map(v => (
                  <div key={v.id} className="bg-[#0F172A] rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">{v.name}</p>
                      <p className="text-xs text-gray-400">{v.category}</p>
                    </div>
                    <Link to="/admin/vendor-registrations" className="text-xs text-indigo-400 hover:text-indigo-300">Review</Link>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 pt-4 border-t border-white/5">
              <Link to="/admin/vendor-registrations" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-2">
                <UserPlus size={16} />
                View all vendor registrations
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Activity className="text-indigo-400" size={20} />
            Recent Activity
          </h2>
          <div className="space-y-3">
            {recentActivity.map((log, i) => (
              <div key={log.id || i} className="flex items-center gap-3 bg-[#0F172A] rounded-xl p-3">
                <div className={`w-2 h-2 rounded-full ${log.risk === 'low' ? 'bg-emerald-400' : log.risk === 'medium' ? 'bg-amber-400' : 'bg-red-400'}`} />
                <p className="text-sm text-gray-300 flex-1">{log.action}</p>
                <span className="text-xs text-gray-500">{log.actor}</span>
              </div>
            ))}
            {recentActivity.length === 0 && (
              <p className="text-center text-gray-500 py-4 text-sm">No recent activity</p>
            )}
          </div>
        </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
