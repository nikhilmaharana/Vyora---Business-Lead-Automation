import { useState, useEffect } from "react";
import { api, isAuthenticated } from "../../services/api";
import VendorLayout from "../../layout/VendorLayout";
import Icon from "../../components/common/Icon";

const VendorLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = "/login";
      return;
    }
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const data = await api("/leads");
      setLeads(Array.isArray(data) ? data : []);
    } catch {
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score === "Hot") return "bg-red-50 text-red-700";
    if (score === "Warm") return "bg-amber-50 text-amber-700";
    return "bg-gray-50 text-gray-600";
  };

  return (
    <VendorLayout title="My Leads">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <p className="text-gray-500">View and manage incoming customer requirements</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
          </div>
        ) : leads.length === 0 ? (
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-12 text-center">
            <Icon name="leaderboard" size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-500">No leads yet</h3>
            <p className="text-sm text-gray-400 mt-2">Customer requirements will appear here</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {leads.map((lead) => (
              <div key={lead.id} className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-[#1F2937]">{lead.name}</h3>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getScoreColor(lead.score)}`}>
                        {lead.score || "New"}
                      </span>
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        {lead.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{lead.requirement}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                      <span>📍 {lead.location}</span>
                      <span>💰 ₹{Number(lead.budget || 0).toLocaleString()}</span>
                      <span>📅 {lead.timeline || "Flexible"}</span>
                      <span className={`font-medium ${
                        lead.status === "New" ? "text-green-600" : "text-blue-600"
                      }`}>
                        {lead.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </VendorLayout>
  );
};

export default VendorLeads;