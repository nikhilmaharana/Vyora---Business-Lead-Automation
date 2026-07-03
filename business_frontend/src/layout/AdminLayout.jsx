import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { api, getUser, isAuthenticated, logout } from "../services/api";
import Icon from "../components/common/Icon";
import logo from "../assets/image.png";

const AdminLayout = ({ children, title }) => {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const u = getUser();
    if (!isAuthenticated() || !u || (u.role !== "admin" && u.role !== "super_admin")) {
      navigate("/admin/login");
      return;
    }
    setUser(u);
  }, []);

  const handleLogout = () => {
    logout();
  };

  const navItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: "dashboard" },
    { path: "/admin/analytics", label: "Analytics", icon: "analytics" },
    { path: "/admin/users", label: "Users", icon: "people" },
    { path: "/admin/vendors", label: "Vendors", icon: "business" },
    { path: "/admin/vendor-registrations", label: "Vendor Registrations", icon: "how_to_reg" },
    { path: "/admin/verifications", label: "Verifications", icon: "verified" },
    { path: "/admin/businesses", label: "Businesses", icon: "store" },
    { path: "/admin/categories", label: "Categories", icon: "category" },
    { path: "/admin/leads", label: "Leads", icon: "leaderboard" },
    { path: "/admin/reviews", label: "Reviews", icon: "star" },
    { path: "/admin/fake-data", label: "Fake Data", icon: "report" },
    { path: "/admin/reports", label: "Reports", icon: "description" },
    { path: "/admin/settings", label: "Settings", icon: "settings" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 border-b border-white/5 bg-[#1E293B]/95 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 md:px-6 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
            >
              <Icon name={sidebarOpen ? "close" : "menu"} size={24} />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Vyora" className="h-8 w-8 object-contain" />
              <h1 className="text-lg font-bold text-white">
                Vyora<span className="text-[#22C55E]">.</span>
              </h1>
            </Link>
            <span className="hidden sm:block text-sm text-gray-500">|</span>
            <span className="hidden sm:block text-sm text-gray-400">
              Admin Panel
            </span>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-3">
                <Link to="/" className="text-sm text-indigo-400 hover:text-indigo-300 transition">
                  Back to Site
                </Link>
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">
                  {(user.name || "A").charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block text-sm text-gray-400">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-400 hover:text-red-300 transition"
                >
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
          className={`fixed lg:sticky top-[57px] left-0 z-40 h-[calc(100vh-57px)] w-64 bg-[#1E293B] border-r border-white/5 overflow-y-auto transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive(item.path)
                    ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon name={item.icon} size={18} />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-57px)] overflow-auto">
          <div className="p-4 md:p-6 lg:p-8">
            {title && (
              <h1 className="text-2xl font-bold text-white mb-6">{title}</h1>
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;