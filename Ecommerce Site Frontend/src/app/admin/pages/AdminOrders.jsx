import { useEffect, useState } from "react";
import apiClient from "../../../api/apiClient";
import { toast } from "react-toastify";

const STATUSES = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "PAYMENT_FAILED",
];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);

  const load = async () => {
    const res = await apiClient.get("/admin/orders");
    setOrders(res.data);
  };

  const loadDetail = async (id) => {
    const res = await apiClient.get(`/admin/orders/${id}`);
    setDetail(res.data);
  };

  useEffect(() => {
    load().catch(() => toast.error("Failed to load orders"));
  }, []);

  const open = async (o) => {
    setSelected(o);
    try {
      await loadDetail(o.id);
    } catch {
      toast.error("Failed to load order detail");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await apiClient.patch(`/admin/orders/${id}/status`, { status });
      toast.success("Status updated");
      await load();
      await loadDetail(id);
    } catch (err) {
      toast.error(err.response?.data || "Failed to update status");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg p-4 sm:p-6 border-2 border-amber-900/10 lg:col-span-2">
        <h2 className="text-2xl font-serif text-amber-900 mb-4">Orders</h2>

        <div className="overflow-auto border-2 border-amber-900/10 rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-amber-50">
              <tr className="text-left text-amber-900">
                <th className="p-3">Order</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Status</th>
                <th className="p-3">Total</th>
                <th className="p-3">Items</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-amber-900/10">
                  <td className="p-3 font-semibold text-amber-900">#{o.id}</td>
                  <td className="p-3 text-amber-800">{o.customerName}</td>
                  <td className="p-3 text-amber-800">{o.status}</td>
                  <td className="p-3 text-amber-800">₹{o.totalAmount}</td>
                  <td className="p-3 text-amber-800">{o.itemCount}</td>
                  <td className="p-3">
                    <button
                      onClick={() => open(o)}
                      className="px-3 py-1 border-2 border-amber-900 text-amber-900 rounded hover:bg-amber-900 hover:text-amber-50 transition"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td className="p-3 text-amber-800" colSpan={6}>
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 sm:p-6 border-2 border-amber-900/10">
        <h3 className="text-xl font-serif text-amber-900 mb-4">Order Detail</h3>

        {!detail ? (
          <p className="text-amber-800">Select an order to view details.</p>
        ) : (
          <div className="space-y-4">
            <div className="text-amber-900 font-semibold">#{detail.id}</div>
            <div className="text-sm text-amber-800">
              {detail.customerName} • {detail.customerEmail}
            </div>
            <div className="text-sm text-amber-800">{detail.customerPhone}</div>
            <div className="text-sm text-amber-800 whitespace-pre-wrap">
              {detail.shippingAddress}
            </div>

            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-1">
                Status
              </label>
              <select
                className="w-full px-3 py-2 border-2 border-amber-900/20 rounded bg-white text-amber-900"
                value={detail.status}
                onChange={(e) => updateStatus(detail.id, e.target.value)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="border-t-2 border-amber-900/10 pt-4">
              <div className="text-sm font-semibold text-amber-900 mb-2">
                Items
              </div>
              <div className="space-y-2">
                {detail.items?.map((it, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between text-sm text-amber-800"
                  >
                    <span>
                      {it.productName} × {it.quantity}
                    </span>
                    <span>₹{it.lineTotal}</span>
                  </div>
                ))}
              </div>
              <div className="border-t-2 border-amber-900/10 mt-3 pt-3 flex justify-between text-amber-900 font-semibold">
                <span>Total</span>
                <span>₹{detail.totalAmount}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
