import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api, getUser, getToken, isAuthenticated, logout } from "../../services/api";
import DeleteAccountModal from "../../components/auth/DeleteAccountModal";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(getUser());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success"); // 'success' or 'error'
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Delete account modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await api("/auth/me");
      setUser(data.user);
      setForm({
        name: data.user.name || "",
        email: data.user.email || "",
        phone: data.user.phone || "",
      });
    } catch (err) {
      // Token invalid, redirect to login
      logout();
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const data = await api("/auth/profile", {
        method: "PATCH",
        body: { name: form.name, email: form.email, phone: form.phone },
      });
      setUser(data.user);
      // Update session
      const session = JSON.parse(localStorage.getItem("vyora_session") || "{}");
      session.user = data.user;
      localStorage.setItem("vyora_session", JSON.stringify(session));
      setMessage("Profile updated successfully!");
      setMessageType("success");
    } catch (err) {
      setMessage(err.message);
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const handleAccountDeleted = (successMessage) => {
    setDeleteMessage(successMessage);
    setMessageType("success");
    setUser(null);
  };

  const getInitials = (name) => {
    return (name || "U").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#22C55E] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show success message after account deletion before redirect
  if (deleteMessage) {
    return (
      <main className="min-h-screen bg-[#F9FAFB] px-6 py-10">
        <div className="mx-auto max-w-lg text-center py-20">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#1F2937] mb-3">Account Deleted</h2>
          <p className="text-[#6B7280]">{deleteMessage}</p>
          <p className="text-sm text-[#9CA3AF] mt-4">Redirecting to home page...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F9FAFB] px-6 py-10">
      <div className="mx-auto max-w-4xl">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-[#111827] to-[#1a2332] p-8 text-white">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-[#22C55E] flex items-center justify-center text-white font-bold text-3xl">
                {getInitials(user?.name)}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{user?.name}</h1>
                <p className="text-gray-300 mt-1">
                  {user?.email || user?.phone} • {user?.role === "business_owner" ? "Vendor" : "User"}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Referral Code: <span className="text-[#22C55E] font-semibold">{user?.referralCode || "N/A"}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Profile Stats */}
          <div className="grid grid-cols-3 divide-x divide-[#E5E7EB]">
            <div className="p-6 text-center">
              <p className="text-2xl font-bold text-[#1F2937]">{user?.favorites?.length || 0}</p>
              <p className="text-sm text-[#6B7280]">Favorites</p>
            </div>
            <div className="p-6 text-center">
              <p className="text-2xl font-bold text-[#1F2937]">{user?.activity?.length || 0}</p>
              <p className="text-sm text-[#6B7280]">Activities</p>
            </div>
            <div className="p-6 text-center">
              <p className="text-2xl font-bold text-[#22C55E]">{user?.role === "business_owner" ? "Vendor" : "Standard"}</p>
              <p className="text-sm text-[#6B7280]">Account Type</p>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm p-8">
          <h2 className="text-2xl font-bold text-[#1F2937] mb-6">Edit Profile</h2>
          
          {message && (
            <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${
              messageType === "success" 
                ? "bg-green-50 text-green-700 border border-green-200" 
                : "bg-red-50 text-red-600 border border-red-200"
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1F2937]">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-sm text-[#1F2937] outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-green-100"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1F2937]">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-sm text-[#1F2937] outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-green-100"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1F2937]">Mobile Number</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-sm text-[#1F2937] outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="rounded-lg bg-[#22C55E] px-6 py-3 text-sm font-semibold text-white hover:bg-green-600"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-red-200 px-6 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          </form>
        </div>

        {/* Danger Zone - Delete Account */}
        <div className="bg-white rounded-3xl border border-red-200 shadow-sm p-8 mt-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-[#1F2937]">Danger Zone</h2>
              <p className="mt-1 text-sm text-[#6B7280]">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button
                onClick={handleDeleteAccount}
                className="mt-4 rounded-lg border border-red-300 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition"
              >
                Delete My Account
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        {user?.activity && user.activity.length > 0 && (
          <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm p-8 mt-6">
            <h2 className="text-2xl font-bold text-[#1F2937] mb-6">Recent Activity</h2>
            <div className="space-y-3">
              {user.activity.slice(-5).reverse().map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-[#F9FAFB]">
                  <div className="w-2 h-2 rounded-full bg-[#22C55E]"></div>
                  <p className="text-sm text-[#4B5563]">{activity}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <Link to="/my-favorites" className="bg-white rounded-2xl border border-[#E5E7EB] p-6 hover:shadow-md transition text-center">
            <p className="text-3xl mb-2">❤️</p>
            <p className="font-semibold text-[#1F2937]">My Favorites</p>
            <p className="text-sm text-[#6B7280]">Saved businesses</p>
          </Link>
          <Link to="/search" className="bg-white rounded-2xl border border-[#E5E7EB] p-6 hover:shadow-md transition text-center">
            <p className="text-3xl mb-2">🔍</p>
            <p className="font-semibold text-[#1F2937]">Browse</p>
            <p className="text-sm text-[#6B7280]">Find services</p>
          </Link>
        </div>
      </div>

      {/* Delete Account Modal */}
      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDeleted={handleAccountDeleted}
      />
    </main>
  );
};

export default Profile;