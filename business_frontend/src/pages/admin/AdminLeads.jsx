import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api, getUser, isAuthenticated } from "../../services/api";
import { Target, Search, Shield, Filter, MapPin, DollarSign, Calendar, TrendingUp } from "lucide-react";

const AdminLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const user = getUser();
    if (!isAuthenticated() || !user || (user.role !== "admin" && user.role !== "super_admin")) {
      navigate("/admin/login");
      return;
    }
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const data = await api("/leads");
      setLeads(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name?.toLowerCase().includes(search.toLowerCase()) ||
      lead.category?.toLowerCase().includes(search.toLowerCase()) ||
      lead.location?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || lead.status?.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  const statuses = ["all", "New", "Contacted", "Follow-up", "Converted"];

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <div className="border-b border-white/5 bg-[#1E293B]/50 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="text-indigo-400" size={24} />
            <h1 className="text-xl font-bold text-white">Manage Leads</h1>
          </div>
          <button onClick={() => navigate("/admin/dashboard")} className="text-sm text-indigo-400 hover:text-indigo-300">← Back</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">{error}</div>
        )}

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 relative min-w-[200px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#1E293B] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {statuses.map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`text-xs px-4 py-2 rounded-lg font-medium transition ${
                  filterStatus === status
                    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                    : "bg-[#1E293B] text-gray-400 border border-white/5 hover:border-white/10"
                }`}
              >
                {status === "all" ? "All" : status}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          {filteredLeads.map((lead) => (
            <div key={lead.id} className="bg-[#1E293B] rounded-2xl border border-white/5 p-6 hover:border-white/10 transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold">
                      {lead.name?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{lead.name}</h3>
                      <p className="text-xs text-gray-400">{lead.mobile}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      lead.score === "Hot" ? "bg-red-500/10 text-red-400" :
                      lead.score === "Warm" ? "bg-amber-500/10 text-amber-400" :
                      "bg-gray-500/10 text-gray-400"
                    }`}>
                      {lead.score || "New"}
                    </span>
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      lead.status === "New" ? "bg-blue-500/10 text-blue-400" :
                      lead.status === "Contacted" ? "bg-purple-500/10 text-purple-400" :
                      lead.status === "Follow-up" ? "bg-amber-500/10 text-amber-400" :
                      "bg-emerald-500/10 text-emerald-400"
                    }`}>
                      {lead.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">{lead.requirement}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><MapPin size={12} /> {lead.location}</span>
                    <span className="flex items-center gap-1"><DollarSign size={12} /> ₹{Number(lead.budget || 0).toLocaleString()}</span>
                    <span className="flex items-center gap-1"><Calendar size={12} /> {lead.timeline || "Flexible"}</span>
                    <span className="flex items-center gap-1"><Target size={12} /> {lead.category}</span>
                  </div>
                  {lead.notes && lead.notes.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {lead.notes.map((note, i) => (
                        <span key={i} className="text-xs bg-[#0F172A] text-gray-400 px-3 py-1 rounded-full">{note}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {filteredLeads.length === 0 && (
            <div className="text-center py-12 bg-[#1E293B] rounded-2xl border border-white/5">
              <Target className="mx-auto text-gray-500 mb-3" size={36} />
              <p className="text-gray-400">No leads found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLeads;