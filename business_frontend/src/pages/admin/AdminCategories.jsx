import { useState, useEffect } from "react";
import { api } from "../../services/api";
import AdminLayout from "../../layout/AdminLayout";
import { Search, Plus, X, Edit2 } from "lucide-react";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await api("/admin/categories");
      setCategories(data.categories || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCategory.name.trim()) return;
    setCreating(true);
    try {
      const data = await api("/admin/categories", {
        method: "POST",
        body: { name: newCategory.name.trim(), description: newCategory.description.trim() }
      });
      setNewCategory({ name: "", description: "" });
      setShowForm(false);
      fetchCategories();
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const filtered = categories.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.subCategories?.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return (
      <AdminLayout title="Categories">
        <div className="flex items-center justify-center py-20">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Category Management">
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Stats + Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-[#1E293B] rounded-xl border border-white/5 p-3 text-center">
            <p className="text-xl font-bold text-white">{categories.length}</p>
            <p className="text-xs text-gray-400">Total Categories</p>
          </div>
          <div className="bg-[#1E293B] rounded-xl border border-white/5 p-3 text-center">
            <p className="text-xl font-bold text-white">{categories.reduce((s, c) => s + c.businessCount, 0)}</p>
            <p className="text-xs text-gray-400">Businesses</p>
          </div>
          <div className="bg-[#1E293B] rounded-xl border border-white/5 p-3 text-center">
            <p className="text-xl font-bold text-white">{categories.reduce((s, c) => s + c.leadCount, 0)}</p>
            <p className="text-xs text-gray-400">Leads</p>
          </div>
          <div className="bg-[#1E293B] rounded-xl border border-white/5 p-3 text-center">
            <p className="text-xl font-bold text-white">{categories.filter(c => c.verifiedCount > 0).length}</p>
            <p className="text-xs text-gray-400">Verified</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-medium transition"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="mb-6 bg-[#1E293B] rounded-2xl border border-white/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Create New Category</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleCreate} className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                placeholder="Category name"
                className="w-full bg-[#0F172A] border border-white/10 rounded-xl py-2.5 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex-[2]">
              <input
                type="text"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                placeholder="Description (optional)"
                className="w-full bg-[#0F172A] border border-white/10 rounded-xl py-2.5 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={creating || !newCategory.name.trim()}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition disabled:opacity-50"
            >
              {creating ? "Creating..." : "Create"}
            </button>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#1E293B] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Categories Table */}
      <div className="bg-[#1E293B] rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-[#0F172A]/50">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Category</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Businesses</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Leads</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Revenue</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Rating</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Verified</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Cities</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((cat) => (
                <tr key={cat.name} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4">
                    <span className="text-white font-medium">{cat.name}</span>
                  </td>
                  <td className="py-3 px-4 text-right text-gray-300">{cat.businessCount}</td>
                  <td className="py-3 px-4 text-right text-gray-300">{cat.leadCount}</td>
                  <td className="py-3 px-4 text-right text-emerald-400">₹{(cat.totalRevenue || 0).toLocaleString()}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-yellow-400">{cat.avgRating}</span>
                  </td>
                  <td className="py-3 px-4 text-right text-blue-400">{cat.verifiedCount}</td>
                  <td className="py-3 px-4 text-right text-gray-300">{cat.cities?.length || 0}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    {search ? "No categories matching your search" : "No categories found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCategories;