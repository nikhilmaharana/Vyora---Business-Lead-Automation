import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api, getUser, isAuthenticated } from "../../services/api";
import { Settings, Shield, Save, RefreshCw } from "lucide-react";

const AdminSettings = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = getUser();
    if (!isAuthenticated() || !user || (user.role !== "admin" && user.role !== "super_admin")) {
      navigate("/admin/login");
      return;
    }
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const data = await api("/admin");
      setConfig(data.config || {});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await api("/admin/config", {
        method: "POST",
        body: config
      });
      setSuccess("Settings saved successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
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
            <h1 className="text-xl font-bold text-white">Platform Settings</h1>
          </div>
          <button onClick={() => navigate("/admin/dashboard")} className="text-sm text-indigo-400 hover:text-indigo-300">← Back</button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">{error}</div>
        )}
        {success && (
          <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 text-sm text-emerald-400">{success}</div>
        )}

        <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-8">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Settings className="text-indigo-400" size={20} />
            Platform Configuration
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">WhatsApp API Provider</label>
              <input
                type="text"
                value={config?.whatsappApi || ""}
                onChange={(e) => setConfig({ ...config, whatsappApi: e.target.value })}
                className="w-full bg-[#0F172A] border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Payment Gateway</label>
              <input
                type="text"
                value={config?.paymentGateway || ""}
                onChange={(e) => setConfig({ ...config, paymentGateway: e.target.value })}
                className="w-full bg-[#0F172A] border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Lead Distribution Limit</label>
              <input
                type="number"
                value={config?.leadDistributionLimit || 5}
                onChange={(e) => setConfig({ ...config, leadDistributionLimit: parseInt(e.target.value) || 5 })}
                className="w-full bg-[#0F172A] border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="fakeLeadRefund"
                checked={config?.fakeLeadRefund || false}
                onChange={(e) => setConfig({ ...config, fakeLeadRefund: e.target.checked })}
                className="w-4 h-4 rounded border-white/10 bg-[#0F172A] text-indigo-500 focus:ring-indigo-500"
              />
              <label htmlFor="fakeLeadRefund" className="text-sm text-gray-300">Enable Fake Lead Refund</label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Profile Lock Threshold (%)</label>
              <input
                type="number"
                value={config?.profileLockThreshold || 80}
                onChange={(e) => setConfig({ ...config, profileLockThreshold: parseInt(e.target.value) || 80 })}
                className="w-full bg-[#0F172A] border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Available Roles (comma separated)</label>
              <input
                type="text"
                value={(config?.roles || []).join(", ")}
                onChange={(e) => setConfig({ ...config, roles: e.target.value.split(",").map(r => r.trim()).filter(Boolean) })}
                className="w-full bg-[#0F172A] border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <RefreshCw className="animate-spin" size={18} />
              ) : (
                <Save size={18} />
              )}
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;