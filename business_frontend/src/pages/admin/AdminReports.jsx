import { useState, useEffect } from "react";
import { api } from "../../services/api";
import AdminLayout from "../../layout/AdminLayout";
import { FileText, Download, Users, Building2, Target, DollarSign } from "lucide-react";

const AdminReports = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [reportType, setReportType] = useState("summary");

  useEffect(() => {
    fetchReport();
  }, [reportType]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ type: reportType });
      if (dateRange.start) params.set("startDate", dateRange.start);
      if (dateRange.end) params.set("endDate", dateRange.end);
      const data = await api(`/admin/reports?${params.toString()}`);
      setReport(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDateFilter = (e) => {
    e.preventDefault();
    fetchReport();
  };

  if (loading && !report) {
    return (
      <AdminLayout title="Reports">
        <div className="flex items-center justify-center py-20">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Reports & Analytics">
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">{error}</div>
      )}

      {/* Controls */}
      <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex gap-2">
            {["summary", "users", "leads", "revenue"].map((type) => (
              <button
                key={type}
                onClick={() => setReportType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  reportType === type
                    ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                    : "bg-[#0F172A] text-gray-400 border border-white/5 hover:border-white/10"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
          <form onSubmit={handleDateFilter} className="flex items-center gap-3 ml-auto">
            <input
              type="date"
              value={dateRange.start}
              onChange={e => setDateRange({ ...dateRange, start: e.target.value })}
              className="bg-[#0F172A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={e => setDateRange({ ...dateRange, end: e.target.value })}
              className="bg-[#0F172A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-lg text-sm font-medium hover:bg-indigo-500/30 transition"
            >
              Apply
            </button>
          </form>
        </div>
      </div>

      {report && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 rounded-xl bg-blue-500/10">
                  <Users className="text-blue-400" size={20} />
                </div>
                <span className="text-2xl font-bold text-white">{report.summary?.newUsers || 0}</span>
              </div>
              <p className="text-gray-400 text-sm">New Users</p>
            </div>
            <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 rounded-xl bg-emerald-500/10">
                  <Building2 className="text-emerald-400" size={20} />
                </div>
                <span className="text-2xl font-bold text-white">{report.summary?.newBusinesses || 0}</span>
              </div>
              <p className="text-gray-400 text-sm">New Businesses</p>
            </div>
            <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 rounded-xl bg-orange-500/10">
                  <Target className="text-orange-400" size={20} />
                </div>
                <span className="text-2xl font-bold text-white">{report.summary?.newLeads || 0}</span>
              </div>
              <p className="text-gray-400 text-sm">New Leads</p>
            </div>
            <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 rounded-xl bg-purple-500/10">
                  <DollarSign className="text-purple-400" size={20} />
                </div>
                <span className="text-2xl font-bold text-white">₹{(report.summary?.totalRevenue || 0).toLocaleString()}</span>
              </div>
              <p className="text-gray-400 text-sm">Total Revenue</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Users by Role */}
            <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-6">
              <h2 className="text-lg font-bold text-white mb-4">Users by Role</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[#0F172A] rounded-xl">
                  <span className="text-sm text-gray-300">Regular Users</span>
                  <span className="text-lg font-bold text-blue-400">{report.usersByRole?.users || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#0F172A] rounded-xl">
                  <span className="text-sm text-gray-300">Vendors</span>
                  <span className="text-lg font-bold text-emerald-400">{report.usersByRole?.vendors || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#0F172A] rounded-xl">
                  <span className="text-sm text-gray-300">Admins</span>
                  <span className="text-lg font-bold text-purple-400">{report.usersByRole?.admins || 0}</span>
                </div>
              </div>
            </div>

            {/* Leads by Status */}
            <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-6">
              <h2 className="text-lg font-bold text-white mb-4">Leads by Status</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[#0F172A] rounded-xl">
                  <span className="text-sm text-gray-300">New</span>
                  <span className="text-lg font-bold text-amber-400">{report.leadsByStatus?.new || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#0F172A] rounded-xl">
                  <span className="text-sm text-gray-300">Contacted</span>
                  <span className="text-lg font-bold text-blue-400">{report.leadsByStatus?.contacted || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#0F172A] rounded-xl">
                  <span className="text-sm text-gray-300">Converted</span>
                  <span className="text-lg font-bold text-emerald-400">{report.leadsByStatus?.converted || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#0F172A] rounded-xl">
                  <span className="text-sm text-gray-300">Follow-up</span>
                  <span className="text-lg font-bold text-purple-400">{report.leadsByStatus?.followUp || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Businesses by Status */}
          <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-6">
            <h2 className="text-lg font-bold text-white mb-4">Businesses by Status</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#0F172A] rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-emerald-400">{report.businessesByStatus?.approved || 0}</p>
                <p className="text-sm text-gray-400">Approved</p>
              </div>
              <div className="bg-[#0F172A] rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-amber-400">{report.businessesByStatus?.pending || 0}</p>
                <p className="text-sm text-gray-400">Pending</p>
              </div>
              <div className="bg-[#0F172A] rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-blue-400">{report.businessesByStatus?.verified || 0}</p>
                <p className="text-sm text-gray-400">Verified</p>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminReports;