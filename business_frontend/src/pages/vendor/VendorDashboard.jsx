import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, getUser, isAuthenticated } from "../../services/api";
import Icon from "../../components/common/Icon";
import VendorLayout from "../../layout/VendorLayout";
import { Package, Building2, AlertCircle, CheckCircle, Clock, XCircle, FileText, Plus, ChevronRight, Shield } from "lucide-react";

const VendorDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [vendorStatus, setVendorStatus] = useState(null);
  const [business, setBusiness] = useState(null);
  const [gstin, setGstin] = useState("");
  const [gstinMessage, setGstinMessage] = useState({ type: "", text: "" });
  const [gstinLoading, setGstinLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      // Fetch vendor status
      const statusData = await api("/vendor/status");
      setVendorStatus(statusData);
      
      // Fetch business info
      const businessData = await api("/vendor/business");
      setBusiness(businessData.business);
      if (businessData.business?.gstin) {
        setGstin(businessData.business.gstin);
      }
      
      // Fetch dashboard data
      const data = await api("/vendor/dashboard");
      setDashboard(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGstinSubmit = async (e) => {
    e.preventDefault();
    if (!gstin || gstin.trim().length < 15) {
      setGstinMessage({ type: "error", text: "Please enter a valid 15-character GSTIN number" });
      return;
    }
    setGstinLoading(true);
    setGstinMessage({ type: "", text: "" });
    
    try {
      const data = await api("/vendor/gstin", {
        method: "POST",
        body: { gstin: gstin.trim() }
      });
      setBusiness(data.business);
      setGstinMessage({ type: "success", text: "GSTIN added successfully! Profile completion increased." });
      setTimeout(() => setGstinMessage({ type: "", text: "" }), 5000);
    } catch (err) {
      setGstinMessage({ type: "error", text: err.message });
    } finally {
      setGstinLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
          <p className="mt-4 text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const user = getUser();
  const isPending = vendorStatus?.vendorStatus === 'pending_approval';
  const isRejected = vendorStatus?.vendorStatus === 'rejected';
  const isApproved = vendorStatus?.isApproved;
  const hasGstin = business?.gstin;

  return (
    <VendorLayout title="Dashboard">
      <div className="mx-auto max-w-7xl">
        {/* Approval Status Banner */}
        {isPending && (
          <div className="mb-6 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                <Clock size={28} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-amber-800">Account Pending Approval</h3>
                <p className="mt-1 text-sm text-amber-700">
                  Your vendor registration is under review by the admin team. You'll be notified once it's approved.
                  In the meantime, you can update your business profile.
                </p>
              </div>
            </div>
          </div>
        )}

        {isRejected && (
          <div className="mb-6 rounded-2xl bg-red-50 border border-red-200 p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
                <XCircle size={28} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-red-800">Registration Rejected</h3>
                <p className="mt-1 text-sm text-red-700">
                  Your vendor registration was not approved. Please contact support for more details or re-register.
                </p>
              </div>
            </div>
          </div>
        )}

        {isApproved && (
          <div className="mb-6 rounded-2xl bg-green-50 border border-green-200 p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                <CheckCircle size={28} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-green-800">Account Verified ✓</h3>
                <p className="mt-1 text-sm text-green-700">
                  Your vendor account is approved! You can now add products and start receiving leads.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1F2937]">Vendor Dashboard</h1>
          <p className="mt-2 text-gray-500">Welcome back, {user?.name || "Vendor"}</p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* GSTIN Section - visible only when approved */}
        {isApproved && (
          <div className="mb-8 rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="text-green-600" size={24} />
              <h2 className="text-lg font-bold text-[#1F2937]">GSTIN Details</h2>
            </div>
            
            {gstinMessage.text && (
              <div className={`mb-4 rounded-lg px-4 py-2 text-sm flex items-center gap-2 ${
                gstinMessage.type === "success" 
                  ? "bg-green-50 border border-green-200 text-green-700" 
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}>
                {gstinMessage.type === "success" ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                {gstinMessage.text}
              </div>
            )}
            
            {hasGstin ? (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <CheckCircle size={20} className="text-green-500" />
                <div>
                  <p className="text-sm font-medium text-[#1F2937]">GSTIN Verified</p>
                  <p className="text-xs text-gray-500">{business.gstin}</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleGstinSubmit} className="flex items-end gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Add GSTIN Number</label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    placeholder="Enter 15-digit GSTIN"
                    maxLength={15}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  />
                </div>
                <button
                  type="submit"
                  disabled={gstinLoading}
                  className="bg-green-500 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-green-600 transition disabled:opacity-50"
                >
                  {gstinLoading ? "Adding..." : "Add GSTIN"}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-[#22C55E]">
                <Icon name="leaderboard" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1F2937]">{dashboard?.metrics?.totalLeads || 0}</p>
                <p className="text-sm text-gray-500">Total Leads</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
                <Icon name="trending_up" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1F2937]">{dashboard?.metrics?.conversionRate || 0}%</p>
                <p className="text-sm text-gray-500">Conversion Rate</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-500">
                <Icon name="payments" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1F2937]">₹{(dashboard?.metrics?.revenue || 0).toLocaleString()}</p>
                <p className="text-sm text-gray-500">Revenue</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
                <Icon name="verified" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1F2937]">{dashboard?.metrics?.totalListings || 0}</p>
                <p className="text-sm text-gray-500">Products</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-3">
          <Link
            to="/vendor/products"
            className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-[#22C55E] mb-4">
              <Package size={28} />
            </div>
            <h3 className="text-lg font-bold text-[#1F2937]">My Products</h3>
            <p className="mt-2 text-sm text-gray-500">Add and manage your products and services</p>
          </Link>

          <Link
            to="/vendor/leads"
            className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-500 mb-4">
              <Icon name="leaderboard" size={28} />
            </div>
            <h3 className="text-lg font-bold text-[#1F2937]">My Leads</h3>
            <p className="mt-2 text-sm text-gray-500">View and manage incoming customer leads</p>
          </Link>

          <Link
            to="/profile"
            className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-500 mb-4">
              <Icon name="person" size={28} />
            </div>
            <h3 className="text-lg font-bold text-[#1F2937]">My Profile</h3>
            <p className="mt-2 text-sm text-gray-500">Update your business profile and settings</p>
          </Link>
        </div>

        {/* Business Info Card */}
        {business && (
          <div className="mt-8 rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="text-green-600" size={24} />
              <h2 className="text-lg font-bold text-[#1F2937]">Business Overview</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-500">Business Name</p>
                <p className="text-sm font-medium text-[#1F2937]">{business.name || "Not set"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Category</p>
                <p className="text-sm font-medium text-[#1F2937]">{business.category || "Not set"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Plan</p>
                <p className="text-sm font-medium text-[#1F2937]">{business.plan || "Free"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Profile Completion</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full transition-all"
                      style={{ width: `${business.profileCompletion || 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-[#1F2937]">{business.profileCompletion || 0}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Registration Status Links */}
        {!isApproved && !isPending && !isRejected && (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Link
              to="/vendor/register"
              className="rounded-2xl border border-green-200 bg-green-50 p-6 hover:shadow-md transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-green-600 group-hover:scale-105 transition">
                  <FileText size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-green-800">Complete Registration</h3>
                  <p className="text-sm text-green-600">Multi-step vendor registration process</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm font-medium text-green-700">
                Start Registration <ChevronRight size={16} />
              </div>
            </Link>

            <Link
              to="/vendor/verification"
              className="rounded-2xl border border-blue-200 bg-blue-50 p-6 hover:shadow-md transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-105 transition">
                  <Shield size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-blue-800">Verification Status</h3>
                  <p className="text-sm text-blue-600">Track your approval progress</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-700">
                Check Status <ChevronRight size={16} />
              </div>
            </Link>
          </div>
        )}

        {/* Pending State Info */}
        {isPending && (
          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-amber-800">While You Wait</h3>
                <p className="text-sm text-amber-600">Your registration is pending admin approval</p>
              </div>
              <Link
                to="/vendor/verification"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-amber-100 text-amber-700 rounded-xl hover:bg-amber-200 transition"
              >
                <Shield size={16} />
                View Status
              </Link>
            </div>
            <ul className="space-y-2 text-sm text-amber-700">
              <li className="flex items-center gap-2">• Complete your business profile details</li>
              <li className="flex items-center gap-2">• Add your GSTIN once approved</li>
              <li className="flex items-center gap-2">• Prepare your product listings</li>
              <li className="flex items-center gap-2">• Check verification page for updates</li>
            </ul>
          </div>
        )}
      </div>
    </VendorLayout>
  );
};

export default VendorDashboard;