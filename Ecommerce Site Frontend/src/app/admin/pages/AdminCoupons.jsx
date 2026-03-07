import { useEffect, useState } from "react";
import apiClient from "../../../api/apiClient";
import { toast } from "react-toastify";

const empty = { code: "", type: "PERCENT", value: "", active: true };

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const res = await apiClient.get("/admin/coupons");
    setCoupons(res.data);
  };

  useEffect(() => {
    load().catch(() => toast.error("Failed to load coupons"));
  }, []);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const startCreate = () => {
    setEditing(null);
    setForm(empty);
  };

  const startEdit = (c) => {
    setEditing(c);
    setForm({
      code: c.code || "",
      type: c.type || "PERCENT",
      value: String(c.value ?? ""),
      active: c.active !== false,
    });
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        code: form.code,
        type: form.type,
        value: Number(form.value),
        active: form.active,
      };
      if (editing?.id) {
        await apiClient.put(`/admin/coupons/${editing.id}`, payload);
        toast.success("Coupon updated");
      } else {
        await apiClient.post("/admin/coupons", payload);
        toast.success("Coupon created");
      }
      await load();
      startCreate();
    } catch (err) {
      toast.error(err.response?.data || "Failed to save coupon");
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this coupon?")) return;
    try {
      await apiClient.delete(`/admin/coupons/${id}`);
      toast.success("Coupon deleted");
      await load();
    } catch (err) {
      toast.error(err.response?.data || "Failed to delete coupon");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-8 border-2 border-amber-900/10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif text-amber-900">Coupons</h2>
          <button
            onClick={startCreate}
            className="px-5 py-2 bg-amber-900 text-amber-50 rounded hover:bg-amber-800 transition"
          >
            New Coupon
          </button>
        </div>

        <div className="overflow-auto border-2 border-amber-900/10 rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-amber-50">
              <tr className="text-left text-amber-900">
                <th className="p-3">Code</th>
                <th className="p-3">Type</th>
                <th className="p-3">Value</th>
                <th className="p-3">Active</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id} className="border-t border-amber-900/10">
                  <td className="p-3 font-semibold text-amber-900">{c.code}</td>
                  <td className="p-3 text-amber-800">{c.type}</td>
                  <td className="p-3 text-amber-800">{c.value}</td>
                  <td className="p-3 text-amber-800">
                    {c.active === false ? "No" : "Yes"}
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => startEdit(c)}
                      className="px-3 py-1 border-2 border-amber-900 text-amber-900 rounded hover:bg-amber-900 hover:text-amber-50 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => remove(c.id)}
                      className="px-3 py-1 border-2 border-red-500 text-red-600 rounded hover:bg-red-500 hover:text-white transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td className="p-3 text-amber-800" colSpan={5}>
                    No coupons yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg p-8 border-2 border-amber-900/10">
        <h3 className="text-xl font-serif text-amber-900 mb-4">
          {editing ? `Edit: ${editing.code}` : "Create Coupon"}
        </h3>

        <form onSubmit={save} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-1">
                Code
              </label>
              <input
                name="code"
                value={form.code}
                onChange={onChange}
                className="w-full px-3 py-2 border-2 border-amber-900/20 rounded focus:outline-none focus:border-amber-900"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-1">
                Type
              </label>
              <select
                name="type"
                value={form.type}
                onChange={onChange}
                className="w-full px-3 py-2 border-2 border-amber-900/20 rounded bg-white text-amber-900"
              >
                <option value="PERCENT">PERCENT</option>
                <option value="FIXED">FIXED</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-amber-900 mb-1">
              Value
            </label>
            <input
              name="value"
              value={form.value}
              onChange={onChange}
              type="number"
              step="0.01"
              className="w-full px-3 py-2 border-2 border-amber-900/20 rounded focus:outline-none focus:border-amber-900"
              required
            />
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

