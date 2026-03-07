import { useEffect, useState } from "react";
import apiClient from "../../../api/apiClient";
import { toast } from "react-toastify";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");

  const load = async () => {
    const res = await apiClient.get("/admin/categories");
    setCategories(res.data);
  };

  useEffect(() => {
    load().catch(() => toast.error("Failed to load categories"));
  }, []);

  const create = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post("/admin/categories", { name, active: true });
      setName("");
      toast.success("Category created");
      await load();
    } catch (err) {
      toast.error(err.response?.data || "Failed to create category");
    }
  };

  const remove = async (id) => {
    try {
      await apiClient.delete(`/admin/categories/${id}`);
      toast.success("Category deleted");
      await load();
    } catch (err) {
      toast.error(err.response?.data || "Failed to delete category");
    }
  };

  return (
    <div className="bg-white rounded-lg p-8 border-2 border-amber-900/10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-serif text-amber-900">Categories</h2>
      </div>

      <form onSubmit={create} className="flex gap-2 mb-6">
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
            className="flex items-center justify-between border-2 border-amber-900/10 rounded p-3"
          >
            <div>
              <div className="text-amber-900 font-semibold">{c.name}</div>
              <div className="text-xs text-amber-700">
                {c.active === false ? "Inactive" : "Active"}
              </div>
            </div>
            <button
              onClick={() => remove(c.id)}
              className="px-4 py-2 border-2 border-red-500 text-red-600 rounded hover:bg-red-500 hover:text-white transition"
            >
              Delete
            </button>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="text-amber-800">No categories yet.</p>
        )}
      </div>
    </div>
  );
}

