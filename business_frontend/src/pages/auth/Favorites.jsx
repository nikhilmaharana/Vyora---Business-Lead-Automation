import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, getUser, isAuthenticated, logout } from "../../services/api";
import Icon from "../../components/common/Icon";

const Favorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(getUser());

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const userData = await api("/auth/me");
      setUser(userData.user);
      const allBusinesses = await api("/businesses");
      const favBusinesses = allBusinesses.results?.filter(b => 
        (userData.user.favorites || []).includes(b.id)
      ) || [];
      setFavorites(favBusinesses);
    } catch (err) {
      console.error("Failed to fetch favorites:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (businessId) => {
    try {
      await api(`/users/${user.id}/favorites/${businessId}`, { method: "DELETE" });
      setFavorites(prev => prev.filter(b => b.id !== businessId));
    } catch (err) {
      console.error("Failed to remove favorite:", err);
    }
  };

  const getInitials = (name) => {
    return (name || "B").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <main className="min-h-screen bg-[#F9FAFB] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1F2937]">My Favorites</h1>
            <p className="text-[#6B7280] mt-1">Businesses you've saved</p>
          </div>
          <Link to="/search" className="bg-[#22C55E] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-600 transition">
            Browse More
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#22C55E] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : favorites.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#E5E7EB] p-16 text-center">
            <p className="text-6xl mb-4">💔</p>
            <h2 className="text-2xl font-bold text-[#1F2937] mb-2">No favorites yet</h2>
            <p className="text-[#6B7280] mb-6">Save businesses you like to easily find them later</p>
            <Link to="/search" className="bg-[#22C55E] text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition inline-block">
              Browse Businesses
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {favorites.map((business) => (
              <div key={business.id} className="bg-white rounded-2xl border border-[#E5E7EB] p-5 hover:shadow-md transition">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0 ${
                    business.verifiedBadge ? "bg-gradient-to-br from-[#22C55E] to-emerald-600" : "bg-gradient-to-br from-gray-400 to-gray-500"
                  }`}>
                    {getInitials(business.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-[#1F2937] truncate">{business.name}</h3>
                        <p className="text-sm text-[#6B7280]">{business.category}</p>
                      </div>
                      <button
                        onClick={() => removeFavorite(business.id)}
                        className="text-red-400 hover:text-red-600 transition p-1"
                        title="Remove from favorites"
                      >
                        <Icon name="close" size={18} />
                      </button>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-sm text-[#6B7280]">
                      <span>⭐ {business.rating || 4.0}</span>
                      <span>📍 {business.city || "Service Area"}</span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Link
                        to={`/product-details/${business.id}`}
                        state={{ business }}
                        className="flex-1 rounded-lg border border-[#22C55E] py-2 text-xs font-semibold text-[#22C55E] hover:bg-green-50 transition text-center"
                      >
                        View Details
                      </Link>
                      <Link
                        to="/instant-hire"
                        state={{ business }}
                        className="flex-1 rounded-lg bg-[#22C55E] py-2 text-xs font-semibold text-white hover:bg-green-600 transition text-center"
                      >
                        Get Quote
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Favorites;