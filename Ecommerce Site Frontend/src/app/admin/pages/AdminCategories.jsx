import { useEffect, useState } from "react";
import apiClient from "../../../api/apiClient";
import { toast } from "react-toastify";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/admin/categories");
      setCategories(res.data);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await apiClient.post("/admin/categories", {
        name: name.trim(),
        active: true,
      });
      setName("");
      toast.success("Category created");
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create category");
    }
  };

  const startEdit = (category) => {
    setEditingId(category.id);
    setEditName(category.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  const saveEdit = async (id) => {
    if (!editName.trim()) return;
    try {
      await apiClient.put(`/admin/categories/${id}`, {
        name: editName.trim(),
        active: true,
      });
      toast.success("Category updated");
      setEditingId(null);
      setEditName("");
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update category");
    }
  };

  const remove = async (id, categoryName) => {
    if (!confirm(`Are you sure you want to delete "${categoryName}"?`)) return;
    try {
      await apiClient.delete(`/admin/categories/${id}`);
      toast.success("Category deleted");
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete category");
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-8 border-2 border-amber-900/10">
        <p className="text-amber-800">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 sm:p-8 border-2 border-amber-900/10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-serif text-amber-900">Categories</h2>
      </div>

      <form onSubmit={create} className="flex flex-col sm:flex-row gap-2 mb-6">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name"
          className="flex-1 px-3 py-2 border-2 border-amber-900/20 rounded focus:outline-none focus:border-amber-900"
        />
        <button className="px-6 py-2 bg-amber-900 text-amber-50 rounded hover:bg-amber-800 transition">
          Add
        </button>
      </form>

      <div className="space-y-2">
        {categories.map((c) => (
          <div
            key={c.id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-2 border-amber-900/10 rounded p-3"
          >
            {editingId === c.id ? (
              <>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 px-3 py-2 border-2 border-amber-900/20 rounded focus:outline-none focus:border-amber-900 mr-2"
                  autoFocus
                />
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => saveEdit(c.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition w-full sm:w-auto"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-4 py-2 border-2 border-gray-400 text-gray-600 rounded hover:bg-gray-100 transition w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <div className="text-amber-900 font-semibold">{c.name}</div>
                  <div className="text-xs text-amber-700">
                    {c.active === false ? "Inactive" : "Active"}
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => startEdit(c)}
                    className="px-4 py-2 border-2 border-amber-900 text-amber-900 rounded hover:bg-amber-900 hover:text-amber-50 transition w-full sm:w-auto"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(c.id, c.name)}
                    className="px-4 py-2 border-2 border-red-500 text-red-600 rounded hover:bg-red-500 hover:text-white transition w-full sm:w-auto"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
        {categories.length === 0 && (
          <p className="text-amber-800">No categories yet.</p>
        )}
      </div>
    </div>
  );
}
