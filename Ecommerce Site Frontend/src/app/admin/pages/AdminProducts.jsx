import { useEffect, useMemo, useState } from "react";
import apiClient from "../../../api/apiClient";
import { toast } from "react-toastify";

const emptyForm = {
  name: "",
  price: "",
  image: "",
  category: "",
  rating: 5,
  description: "",
  active: true,
  type: "",
  styleTags: "",
  occasionTags: "",
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [query, setQuery] = useState("");

  const load = async () => {
    const [p, c] = await Promise.all([
      apiClient.get("/admin/products"),
      apiClient.get("/admin/categories"),
    ]);
    setProducts(p.data);
    setCategories(c.data);
  };

  useEffect(() => {
    load().catch(() => toast.error("Failed to load products"));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        String(p.name || "").toLowerCase().includes(q) ||
        String(p.category || "").toLowerCase().includes(q)
    );
  }, [products, query]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const startCreate = () => {
    setEditing(null);
    setForm(emptyForm);
  };

  const startEdit = (p) => {
    setEditing(p);
    setForm({
      name: p.name || "",
      price: String(p.price ?? ""),
      image: p.image || "",
      category: p.category || "",
      rating: p.rating ?? 5,
      description: p.description || "",
      active: p.active !== false,
      type: p.type || "",
      styleTags: p.styleTags || "",
      occasionTags: p.occasionTags || "",
    });
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        rating: Number(form.rating),
      };
      if (editing?.id) {
        await apiClient.put(`/admin/products/${editing.id}`, payload);
        toast.success("Product updated");
      } else {
        await apiClient.post("/admin/products", payload);
        toast.success("Product created");
      }
      await load();
      startCreate();
    } catch (err) {
      toast.error(err.response?.data || "Failed to save product");
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await apiClient.delete(`/admin/products/${id}`);
      toast.success("Product deleted");
      await load();
    } catch (err) {
      toast.error(err.response?.data || "Failed to delete product");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-8 border-2 border-amber-900/10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif text-amber-900">Products</h2>
          <button
            onClick={startCreate}
            className="px-5 py-2 bg-amber-900 text-amber-50 rounded hover:bg-amber-800 transition"
          >
            New Product
          </button>
        </div>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or category..."
          className="w-full px-3 py-2 border-2 border-amber-900/20 rounded focus:outline-none focus:border-amber-900 mb-6"
        />

        <div className="overflow-auto border-2 border-amber-900/10 rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-amber-50">
              <tr className="text-left text-amber-900">
                <th className="p-3">Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Active</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-amber-900/10">
                  <td className="p-3 font-semibold text-amber-900">
                    {p.name}
                  </td>
                  <td className="p-3 text-amber-800">{p.category}</td>
                  <td className="p-3 text-amber-800">${p.price}</td>
                  <td className="p-3 text-amber-800">{p.rating}</td>
                  <td className="p-3 text-amber-800">
                    {p.active === false ? "No" : "Yes"}
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => startEdit(p)}
                      className="px-3 py-1 border-2 border-amber-900 text-amber-900 rounded hover:bg-amber-900 hover:text-amber-50 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => remove(p.id)}
                      className="px-3 py-1 border-2 border-red-500 text-red-600 rounded hover:bg-red-500 hover:text-white transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td className="p-3 text-amber-800" colSpan={6}>
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg p-8 border-2 border-amber-900/10">
        <h3 className="text-xl font-serif text-amber-900 mb-4">
          {editing ? `Edit: ${editing.name}` : "Create Product"}
        </h3>

        <form onSubmit={save} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-1">
                Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                className="w-full px-3 py-2 border-2 border-amber-900/20 rounded focus:outline-none focus:border-amber-900"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-1">
                Price
              </label>
              <input
                name="price"
                value={form.price}
                onChange={onChange}
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border-2 border-amber-900/20 rounded focus:outline-none focus:border-amber-900"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-1">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={onChange}
                className="w-full px-3 py-2 border-2 border-amber-900/20 rounded bg-white text-amber-900"
                required
              >
                <option value="" disabled>
                  Select category
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-1">
                Rating (1-5)
              </label>
              <input
                name="rating"
                value={form.rating}
                onChange={onChange}
                type="number"
                min="1"
                max="5"
                className="w-full px-3 py-2 border-2 border-amber-900/20 rounded focus:outline-none focus:border-amber-900"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-amber-900 mb-1">
              Image URL
            </label>
            <input
              name="image"
              value={form.image}
              onChange={onChange}
              className="w-full px-3 py-2 border-2 border-amber-900/20 rounded focus:outline-none focus:border-amber-900"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-amber-900 mb-1">
              Description (optional)
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              rows={4}
              className="w-full px-3 py-2 border-2 border-amber-900/20 rounded focus:outline-none focus:border-amber-900"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-1">
                Type (for AI outfit)
              </label>
              <select
                name="type"
                value={form.type}
                onChange={onChange}
                className="w-full px-3 py-2 border-2 border-amber-900/20 rounded bg-white text-amber-900"
              >
                <option value="">—</option>
                <option value="TOP">TOP</option>
                <option value="BOTTOM">BOTTOM</option>
                <option value="OUTERWEAR">OUTERWEAR</option>
                <option value="SHOES">SHOES</option>
                <option value="ACCESSORY">ACCESSORY</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-1">
                Style tags (comma-separated)
              </label>
              <input
                name="styleTags"
                value={form.styleTags}
                onChange={onChange}
                placeholder="vintage, genz, casual"
                className="w-full px-3 py-2 border-2 border-amber-900/20 rounded focus:outline-none focus:border-amber-900"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-1">
                Occasion tags (comma-separated)
              </label>
              <input
                name="occasionTags"
                value={form.occasionTags}
                onChange={onChange}
                placeholder="festival, party, casual"
                className="w-full px-3 py-2 border-2 border-amber-900/20 rounded focus:outline-none focus:border-amber-900"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-amber-900">
            <input
              name="active"
              type="checkbox"
              checked={form.active}
              onChange={onChange}
            />
            Active
          </label>

          <button className="w-full bg-amber-900 text-amber-50 py-3 rounded hover:bg-amber-800 transition font-semibold">
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

