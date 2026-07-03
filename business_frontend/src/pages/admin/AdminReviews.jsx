import { useState, useEffect } from "react";
import { api } from "../../services/api";
import AdminLayout from "../../layout/AdminLayout";
import { Star, Trash2, User, Calendar } from "lucide-react";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const data = await api("/admin/reviews");
      setReviews(data.reviews || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this review?")) return;
    setActionLoading(id);
    try {
      await api(`/admin/reviews/${id}`, { method: "DELETE" });
      fetchReviews();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Reviews">
        <div className="flex items-center justify-center py-20">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Review Management">
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">{error}</div>
      )}

      <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-500/10 p-3 rounded-xl">
            <Star className="text-indigo-400" size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{reviews.length}</p>
            <p className="text-sm text-gray-400">Total Reviews</p>
          </div>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-12 text-center">
          <Star className="mx-auto text-gray-500 mb-3" size={48} />
          <p className="text-gray-400 text-lg font-medium">No reviews yet</p>
          <p className="text-gray-500 text-sm mt-1">Reviews will appear here once customers start leaving feedback</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-[#1E293B] rounded-2xl border border-white/5 p-6 hover:border-white/10 transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                      {(review.user || "A").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-medium">{review.user || "Anonymous"}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={12}
                              className={star <= (review.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}
                            />
                          ))}
                        </div>
                        {review.verifiedWork && (
                          <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">
                            Verified
                          </span>
                        )}
                        {review.authenticityScore && (
                          <span className="text-xs text-gray-500">
                            Score: {review.authenticityScore}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mt-2">{review.text}</p>
                  {review.media && review.media.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {review.media.map((m, j) => (
                        <span key={j} className="text-xs bg-[#0F172A] text-gray-400 px-2 py-1 rounded-lg">{m}</span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(review.id)}
                  disabled={actionLoading === review.id}
                  className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition disabled:opacity-50"
                  title="Delete review"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminReviews;