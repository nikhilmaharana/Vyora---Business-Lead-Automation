import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api, getUser, isAuthenticated } from "../../services/api";
import VendorLayout from "../../layout/VendorLayout";
import { Package, Plus, Edit3, Trash2, RefreshCw, AlertCircle, CheckCircle, X } from "lucide-react";

const VendorProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", price: "", category: "", image: "" });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    checkVendorStatus();
  }, []);

  const checkVendorStatus = async () => {
    try {
      const statusData = await api("/vendor/status");
      if (!statusData.isApproved) {
        navigate("/vendor/dashboard");
        return;
      }
      fetchProducts();
    } catch {
      fetchProducts();
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await api("/vendor/products");
      setProducts(data.products || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ title: "", description: "", price: "", category: "", image: "" });
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setMessage({ type: "error", text: "Product title is required" });
      return;
    }
    setSubmitting(true);
    setMessage({ type: "", text: "" });
    
    try {
      if (editingId) {
        const data = await api(`/vendor/products/${editingId}`, {
          method: "PATCH",
          body: form
        });
        setProducts(prev => prev.map(p => p.id === editingId ? { ...p, ...data.product } : p));
        setMessage({ type: "success", text: "Product updated successfully!" });
      } else {
        const data = await api("/vendor/products", {
          method: "POST",
          body: form
        });
        setProducts(prev => [...prev, data.product]);
        setMessage({ type: "success", text: "Product added successfully!" });
      }
      resetForm();
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setForm({
      title: product.title || "",
      description: product.description || "",
      price: product.price || "",
      category: product.category || "",
      image: product.image || ""
    });
    setShowAddForm(true);
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api(`/vendor/products/${id}`, { method: "DELETE" });
      setProducts(prev => prev.filter(p => p.id !== id));
      setMessage({ type: "success", text: "Product deleted successfully!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <VendorLayout title="My Products">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#1F2937]">My Products</h1>
            <p className="mt-2 text-gray-500">Manage your products and services</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchProducts} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
              <RefreshCw size={16} /> Refresh
            </button>
            <button
              onClick={() => { resetForm(); setShowAddForm(true); }}
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-green-600 transition"
            >
              <Plus size={18} /> Add Product
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {message.text && (
          <div className={`mb-6 rounded-lg px-4 py-3 text-sm flex items-center gap-2 ${
            message.type === "success" 
              ? "bg-green-50 border border-green-200 text-green-700" 
              : "bg-red-50 border border-red-200 text-red-700"
          }`}>
            {message.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {message.text}
          </div>
        )}

        {/* Add/Edit Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#1F2937]">
                  {editingId ? "Edit Product" : "Add New Product"}
                </h2>
                <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Product Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Premium Interior Design Package"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Price (₹)</label>
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      placeholder="e.g. 50000"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Category</label>
                    <input
                      type="text"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      placeholder="e.g. Interior Design"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe your product or service..."
                    rows={3}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-[#1F2937] mb-1.5">Image URL (optional)</label>
                  <input
                    type="url"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  />
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-green-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-600 transition disabled:opacity-50"
                  >
                    {submitting ? "Saving..." : editingId ? "Update Product" : "Add Product"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 rounded-xl font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Products List */}
        {products.length === 0 ? (
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-16 text-center">
            <Package className="mx-auto text-gray-300 mb-4" size={56} />
            <h3 className="text-xl font-semibold text-gray-500">No products yet</h3>
            <p className="text-sm text-gray-400 mt-2 mb-6">Add your first product to start getting leads</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-600 transition"
            >
              <Plus size={18} /> Add Your First Product
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div key={product.id} className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm hover:shadow-md transition">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white">
                    <Package size={24} />
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => startEdit(product)}
                      className="p-2 rounded-lg hover:bg-blue-50 text-blue-500 transition"
                      title="Edit"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-[#1F2937] mb-1">{product.title}</h3>
                
                {product.category && (
                  <span className="inline-block text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full mb-2">
                    {product.category}
                  </span>
                )}
                
                {product.description && (
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>
                )}
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-lg font-bold text-green-600">
                    ₹{Number(product.price || 0).toLocaleString()}
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    product.status === "approved" 
                      ? "bg-green-50 text-green-700" 
                      : "bg-amber-50 text-amber-700"
                  }`}>
                    {product.status === "approved" ? "Active" : "Pending"}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                  <span>{product.views || 0} views</span>
                  <span>{product.leads || 0} leads</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </VendorLayout>
  );
};

export default VendorProducts;