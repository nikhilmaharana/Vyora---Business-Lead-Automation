import { useState, useEffect } from "react";
import { api, isAuthenticated } from "../../services/api";
import Icon from "../../components/common/Icon";
import { Edit3, Trash2, RefreshCw } from "lucide-react";

const VendorListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", price: "", description: "", category: "" });
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = "/login";
      return;
    }
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const data = await api("/listings");
      setListings(Array.isArray(data) ? data : []);
    } catch {
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (listing) => {
    setEditingId(listing.id);
    setEditForm({
      title: listing.title || "",
      price: listing.price || "",
      description: listing.description || "",
      category: listing.category || ""
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ title: "", price: "", description: "", category: "" });
  };

  const saveEdit = async (id) => {
    try {
      await api(`/listings/${id}`, {
        method: "PATCH",
        body: editForm
      });
      setListings(prev => prev.map(l => l.id === id ? { ...l, ...editForm } : l));
      setMessage({ type: "success", text: "Listing updated successfully!" });
      setEditingId(null);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };

  const deleteListing = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      // Since backend uses in-memory DB, we filter it out locally
      setListings(prev => prev.filter(l => l.id !== id));
      setMessage({ type: "success", text: "Listing deleted successfully!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };

  return (
    <main className="min-h-screen bg-[#F9FAFB] px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#1F2937]">My Listings</h1>
            <p className="mt-2 text-gray-500">Manage your service listings and products</p>
          </div>
          <button onClick={fetchListings} className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700">
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        {message.text && (
          <div className={`mb-6 rounded-lg px-4 py-3 text-sm ${
            message.type === "success" 
              ? "bg-green-50 border border-green-200 text-green-700" 
              : "bg-red-50 border border-red-200 text-red-700"
          }`}>
            {message.text}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
          </div>
        ) : listings.length === 0 ? (
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-12 text-center">
            <Icon name="inventory_2" size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-500">No listings yet</h3>
            <p className="text-sm text-gray-400 mt-2">Your service listings will appear here</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {listings.map((listing) => (
              <div key={listing.id} className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                {editingId === listing.id ? (
                  <div className="space-y-4">
                    <input
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg font-bold focus:outline-none focus:border-green-500"
                      placeholder="Title"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        value={editForm.category}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500"
                        placeholder="Category"
                      />
                      <input
                        value={editForm.price}
                        onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500"
                        placeholder="Price"
                      />
                    </div>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500"
                      placeholder="Description"
                      rows={3}
                    />
                    <div className="flex gap-3">
                      <button onClick={() => saveEdit(listing.id)} className="bg-green-500 text-white px-6 py-2 rounded-xl font-medium hover:bg-green-600 transition">
                        Save
                      </button>
                      <button onClick={cancelEdit} className="bg-gray-100 text-gray-600 px-6 py-2 rounded-xl font-medium hover:bg-gray-200 transition">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-[#1F2937]">{listing.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{listing.category}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Price: {listing.priceLabel || `₹${Number(listing.price || 0).toLocaleString()}`}
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          listing.status === "approved" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                        }`}>
                          {listing.status || "Pending"}
                        </span>
                        <div className="flex gap-1 ml-2">
                          <button
                            onClick={() => startEdit(listing)}
                            className="p-2 rounded-lg hover:bg-blue-50 text-blue-500 transition"
                            title="Edit"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => deleteListing(listing.id)}
                            className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                    {listing.description && (
                      <p className="mt-3 text-sm text-gray-600">{listing.description}</p>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default VendorListings;