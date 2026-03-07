import { useEffect, useState } from "react";
import apiClient from "../../../api/apiClient";

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await apiClient.get("/admin/analytics/summary");
        setSummary(res.data);
      } catch (e) {
        setError(e.response?.data || "Failed to load analytics.");
      }
    })();
  }, []);

  return (
    <div className="bg-white rounded-lg p-8 border-2 border-amber-900/10">
      <h2 className="text-2xl font-serif text-amber-900 mb-6">
        Sales & Analytics
      </h2>

      {error && <p className="text-red-600">{error}</p>}

      {!summary ? (
        <p className="text-amber-800">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="border-2 border-amber-900/10 rounded p-4">
            <div className="text-sm text-amber-700">Total Revenue</div>
            <div className="text-2xl font-serif text-amber-900">
              ${Number(summary.totalRevenue || 0).toFixed(2)}
            </div>
          </div>
          <div className="border-2 border-amber-900/10 rounded p-4">
            <div className="text-sm text-amber-700">Total Orders</div>
            <div className="text-2xl font-serif text-amber-900">
              {summary.totalOrders || 0}
            </div>
          </div>
          <div className="border-2 border-amber-900/10 rounded p-4">
            <div className="text-sm text-amber-700">Pending</div>
            <div className="text-2xl font-serif text-amber-900">
              {summary.pendingOrders || 0}
            </div>
          </div>
          <div className="border-2 border-amber-900/10 rounded p-4">
            <div className="text-sm text-amber-700">Delivered</div>
            <div className="text-2xl font-serif text-amber-900">
              {summary.deliveredOrders || 0}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

