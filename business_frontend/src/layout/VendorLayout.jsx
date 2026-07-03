import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { api, getUser, isAuthenticated, logout } from "../services/api";
import Icon from "../components/common/Icon";
import logo from "../assets/image.png";
import {
  LayoutDashboard, Package, Target, Settings, LogOut,
  ChevronRight, Store, BarChart3, Shield, PlusCircle, Star, FileText
} from "lucide-react";

const VendorLayout = ({ children, title }) => {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [vendorStatus, setVendorStatus] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const u = getUser();
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    setUser(u);
    if (u?.role === "business_owner") {
      fetchVendorStatus();
    }
  }, []);

  const fetchVendorStatus = async () => {
    try {
      const data = await api("/vendor/status");
      setVendorStatus(data);
    } catch {
      // Silent fail
    }
  };

  const handleLogout = () => {
    logout();
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: "/vendor/dashboard", label: "Dashboard", icon: LayoutDashboard, color: "text-emerald-400" },
    { path: "/vendor/products", label: "My Products", icon: Package, color: "text-blue-400" },
    { path: "/vendor/listings", label: "My Listings", icon: Store, color: "text-purple-400" },
    { path: "/vendor/leads", label: "My Leads", icon: Target, color: "text-orange-400" },
    { path: "/vendor/register", label: "Registration", icon: FileText, color: "text-amber-400" },
    { path: "/vendor/verification", label: "Verification", icon: Shield, color: "text-indigo-400" },
    { path: "/vendor/settings", label: "Settings", icon: Settings, color: "text-gray-400" },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="flex items-center justify-between px-4 md:px-6 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <Icon name={sidebarOpen ? "close" : "menu"} size={24} />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Vyora" className="h-8 w-8 object-contain" />
              <h1 className="text-lg font-bold text-[#1F2937]">
                Vyora<span className="text-[#22C55E]">.</span>
              </h1>
            </Link>
            <span className="hidden sm:block text-sm text-gray-400">|</span>
            <span className="hidden sm:block text-sm text-gray-500">
              Vendor Panel
            </span>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-3">
                <Link to="/" className="text-sm text-[#22C55E] hover:text-green-600 transition font-medium">
                  Back to Site
                </Link>
                {vendorStatus?.vendorStatus && (
                  <span className={`hidden sm:inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${
                    vendorStatus.vendorStatus === 'approved' 
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : vendorStatus.vendorStatus === 'pending_approval'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {vendorStatus.vendorStatus === 'approved' ? '✓ Approved' : 
                     vendorStatus.vendorStatus === 'pending_approval' ? '⏳ Pending' : '✕ Rejected'}
                  </span>
                )}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#22C55E] to-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                  {(user.name || "V").charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block text-sm font-medium text-[#1F2937]">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-500 hover:text-red-600 transition font-medium flex items-center gap-1"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-[57px] left-0 z-40 h-[calc(100vh-57px)] w-64 bg-white border-r border-gray-200 overflow-y-auto transition-transform duration-300 shadow-sm ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          {/* Vendor Status Banner in Sidebar */}
          {vendorStatus && vendorStatus.vendorStatus !== 'approved' && (
            <div className={`mx-3 mt-3 p-3 rounded-xl text-xs ${
              vendorStatus.vendorStatus === 'pending_approval'
                ? 'bg-amber-50 border border-amber-200 text-amber-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {vendorStatus.vendorStatus === 'pending_approval'
                ? '⏳ Account pending admin approval'
                : '✕ Account was rejected. Please re-register.'}
            </div>
          )}

          <nav className="p-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive(item.path)
                    ? "bg-green-50 text-[#22C55E] border border-green-200 shadow-sm"
                    : "text-gray-600 hover:text-[#1F2937] hover:bg-gray-50"
                }`}
              >
                <item.icon size={18} className={isActive(item.path) ? "text-[#22C55E]" : item.color} />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-gray-200 mt-4 pt-4 px-4 pb-4">
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition"
            >
              <Store size={18} />
              Visit Marketplace
            </Link>
            <Link
              to="/vendor/register"
              className="mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#22C55E] to-emerald-600 text-white text-sm font-semibold hover:from-[#22C55E] hover:to-emerald-700 transition shadow-sm"
            >
              <PlusCircle size={16} />
              Complete Registration
            </Link>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-57px)] overflow-auto bg-[#F9FAFB]">
          <div className="p-4 md:p-6 lg:p-8">
            {title && (
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#1F2937]">{title}</h1>
              </div>
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default VendorLayout;