import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import Icon from "../components/common/Icon";
import logo from "../assets/image.png";
import { getUser, isAuthenticated, logout } from "../services/api";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check auth state on mount and on every URL change
  useEffect(() => {
    if (isAuthenticated()) setUser(getUser());
    else setUser(null);
  }, [location.pathname]);

  // Also listen for storage events (cross-tab sync)
  useEffect(() => {
    const checkUser = () => {
      if (isAuthenticated()) setUser(getUser());
      else setUser(null);
    };
    window.addEventListener("storage", checkUser);
    return () => window.removeEventListener("storage", checkUser);
  }, []);

  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    setUser(null);
    setUserMenuOpen(false);
    logout();
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 rounded-xl px-3 py-2 transition duration-200 ${
      isActive
        ? "bg-green-500/10 text-[#22C55E]"
        : "text-gray-300 hover:bg-white/5 hover:text-[#22C55E]"
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
      isActive
        ? "bg-green-500/10 text-[#22C55E]"
        : "text-gray-300 hover:bg-white/5 hover:text-[#22C55E]"
    }`;

  const getInitials = (name) => {
    return (name || "U").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#111827]/95 px-4 shadow-md backdrop-blur-md md:px-8">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4">
        {/* Brand / Logo */}
        <NavLink
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-3"
        >
          <img
            src={logo}
            alt="Vyora Logo"
            className="h-12 w-12 object-contain"
          />
          <h1 className="text-2xl font-bold text-white">
            Vyora<span className="text-[#22C55E]">.</span>
          </h1>
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-1 text-sm font-medium xl:flex">
          <NavLink to="/search" className={navLinkClass}>
            <Icon name="manage_search" size={18}/>
            <span className="block">Search</span>
          </NavLink>

          <NavLink to="/categories" className={navLinkClass}>
            <Icon name="category_search" size={18} />
            <span className="block">Categories</span>
          </NavLink>

          <NavLink to="/compare-businesses" className={navLinkClass}>
            <Icon name="compare_arrows" size={18} />
            <span className="block">Compare</span>
          </NavLink>

          <NavLink to="/top-rated-businesses" className={navLinkClass}>
            <Icon name="workspace_premium" size={18} />
            <span className="block">Top Rated</span>
          </NavLink>

          <NavLink to="/trending-services" className={navLinkClass}>
            <Icon name="local_fire_department" size={18} />
            <span className="block">Trending</span>
          </NavLink>

          <NavLink
            to="/instant-hire"
            className="ml-2 flex items-center gap-2 rounded-xl bg-[#22C55E] px-4 py-2 font-semibold text-white transition hover:bg-green-600"
          >
            <Icon name="bolt" size={18} />
            <span className="block">Instant Hire</span>
          </NavLink>

          {user ? (
            <div className="relative ml-2">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-white hover:bg-white/20 transition"
              >
                <div className="w-7 h-7 rounded-full bg-[#22C55E] flex items-center justify-center text-white font-bold text-xs">
                  {getInitials(user.name)}
                </div>
                <span className="text-sm font-medium">{user.name.split(" ")[0]}</span>
                <Icon name="arrow_drop_down" size={18} />
              </button>
              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 z-50 w-56 rounded-xl border border-white/10 bg-[#1a2332] shadow-2xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-sm font-semibold text-white">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email || user.phone}</p>
                    </div>
                    <NavLink
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition"
                    >
                      <Icon name="person" size={18} />
                      My Profile
                    </NavLink>
                    {/* Vendor-specific menu items */}
                    {user.role === "business_owner" && (
                      <>
                        <NavLink
                          to="/vendor/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition"
                        >
                          <Icon name="dashboard" size={18} />
                          Vendor Dashboard
                        </NavLink>
                        <NavLink
                          to="/vendor/listings"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition"
                        >
                          <Icon name="inventory_2" size={18} />
                          My Listings
                        </NavLink>
                        <NavLink
                          to="/vendor/leads"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition"
                        >
                          <Icon name="leaderboard" size={18} />
                          My Leads
                        </NavLink>
                        <NavLink
                          to="/vendor/settings"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition"
                        >
                          <Icon name="settings" size={18} />
                          Business Settings
                        </NavLink>
                      </>
                    )}
                    {/* Admin menu items */}
                    {(user.role === "admin" || user.role === "super_admin") && (
                      <>
                        <NavLink
                          to="/admin/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition"
                        >
                          <Icon name="shield" size={18} />
                          Admin Panel
                        </NavLink>
                      </>
                    )}
                    <NavLink
                      to="/my-favorites"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition"
                    >
                      <Icon name="favorite" size={18} />
                      Favorites
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-white/5 hover:text-red-300 transition border-t border-white/10"
                    >
                      <Icon name="logout" size={18} />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <NavLink to="/login" className={navLinkClass}>
              <Icon name="account_circle" size={18} />
              <span className="block">Login</span>
            </NavLink>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition hover:border-[#22C55E]/40 hover:bg-white/10 xl:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <Icon name="close" size={23} className="transition group-hover:text-[#22C55E]" />
          ) : (
            <Icon name="menu" size={23} className="transition group-hover:text-[#22C55E]" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`mx-auto max-w-7xl overflow-hidden transition-all duration-300 xl:hidden ${
          isOpen ? "max-h-150 pb-5 opacity-100" : "max-h-0 pb-0 opacity-0"
        }`}
      >
        <div className="mt-2 rounded-2xl border border-white/10 bg-[#111827] p-3 shadow-lg">
          {/* Mobile user info */}
          {user && (
            <div className="flex items-center gap-3 px-4 py-3 mb-2 border-b border-white/10">
              <div className="w-10 h-10 rounded-full bg-[#22C55E] flex items-center justify-center text-white font-bold">
                {getInitials(user.name)}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{user.name}</p>
                <p className="text-xs text-gray-400">{user.email || user.phone}</p>
              </div>
            </div>
          )}

          <NavLink to="/search" onClick={closeMenu} className={mobileNavLinkClass}>
            <Icon name="manage_search" size={19} />
            Search
          </NavLink>

          <NavLink to="/categories" onClick={closeMenu} className={mobileNavLinkClass}>
            <Icon name="category_search" size={19} />
            Categories
          </NavLink>

          <NavLink to="/compare-businesses" onClick={closeMenu} className={mobileNavLinkClass}>
            <Icon name="compare_arrows" size={19} />
            Compare Businesses
          </NavLink>

          <NavLink to="/top-rated-businesses" onClick={closeMenu} className={mobileNavLinkClass}>
            <Icon name="workspace_premium" size={19} />
            Top Rated Businesses
          </NavLink>

          <NavLink to="/trending-services" onClick={closeMenu} className={mobileNavLinkClass}>
            <Icon name="local_fire_department" size={19} />
            Trending Services
          </NavLink>

          <NavLink
            to="/instant-hire"
            onClick={closeMenu}
            className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#22C55E] px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-600"
          >
            <Icon name="bolt" size={19} />
            Instant Hire
          </NavLink>

          {user ? (
            <>
              <NavLink to="/profile" onClick={closeMenu} className={mobileNavLinkClass}>
                <Icon name="person" size={19} />
                My Profile
              </NavLink>
              {/* Vendor-specific mobile menu items */}
              {user.role === "business_owner" && (
                <>
                  <NavLink to="/vendor/dashboard" onClick={closeMenu} className={mobileNavLinkClass}>
                    <Icon name="dashboard" size={19} />
                    Vendor Dashboard
                  </NavLink>
                  <NavLink to="/vendor/listings" onClick={closeMenu} className={mobileNavLinkClass}>
                    <Icon name="inventory_2" size={19} />
                    My Listings
                  </NavLink>
                  <NavLink to="/vendor/leads" onClick={closeMenu} className={mobileNavLinkClass}>
                    <Icon name="leaderboard" size={19} />
                    My Leads
                  </NavLink>
                  <NavLink to="/vendor/settings" onClick={closeMenu} className={mobileNavLinkClass}>
                    <Icon name="settings" size={19} />
                    Business Settings
                  </NavLink>
                </>
              )}
              {/* Admin mobile menu items */}
              {(user.role === "admin" || user.role === "super_admin") && (
                <>
                  <NavLink to="/admin/dashboard" onClick={closeMenu} className={mobileNavLinkClass}>
                    <Icon name="shield" size={19} />
                    Admin Panel
                  </NavLink>
                </>
              )}
              <button
                onClick={() => { closeMenu(); handleLogout(); }}
                className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 hover:bg-white/5"
              >
                <Icon name="logout" size={19} />
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login" onClick={closeMenu} className={mobileNavLinkClass}>
              <Icon name="account_circle" size={19} />
              Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;