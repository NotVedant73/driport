import { useEffect, useMemo, useState } from "react";
import apiClient from "../../../api/apiClient";
import { toast } from "react-toastify";

const SHIPMENT_STATUSES = [
  "CREATED",
  "PICKED_UP",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "FAILED_ATTEMPT",
];

export default function AdminShipments() {
  const [shipments, setShipments] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [selectedShipmentId, setSelectedShipmentId] = useState(null);
  const [form, setForm] = useState({
    orderId: "",
    courierName: "",
    trackingNumber: "",
    estimatedDeliveryDate: "",
  });

  const selected = useMemo(
    () =>
      shipments.find(
        (shipment) => shipment.shipmentId === selectedShipmentId,
      ) || null,
    [shipments, selectedShipmentId],
  );

  const load = async () => {
    const [shipmentsRes, lowStockRes] = await Promise.all([
      apiClient.get("/admin/shipments"),
      apiClient.get("/admin/shipments/low-stock"),
    ]);
    setShipments(shipmentsRes.data || []);
    setLowStock(lowStockRes.data || []);

    if (!selectedShipmentId && shipmentsRes.data?.length) {
      setSelectedShipmentId(shipmentsRes.data[0].shipmentId);
    }
  };

  useEffect(() => {
    load().catch(() => toast.error("Failed to load shipment data"));
  }, []);

  const createShipment = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post("/admin/shipments", {
        orderId: Number(form.orderId),
        courierName: form.courierName,
        trackingNumber: form.trackingNumber,
        estimatedDeliveryDate: form.estimatedDeliveryDate || null,
      });
      toast.success("Shipment created");
      setForm({
        orderId: "",
        courierName: "",
        trackingNumber: "",
        estimatedDeliveryDate: "",
      });
      await load();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create shipment");
    }
  };

  const updateStatus = async (shipmentId, status) => {
    try {
      await apiClient.patch(`/admin/shipments/${shipmentId}/status`, {
        status,
        location: "Operations Center",
        note: `Status changed to ${status}`,
      });
      toast.success("Shipment status updated");
      await load();
      setSelectedShipmentId(shipmentId);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update shipment status",
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 border-2 border-amber-900/10">
        <h2 className="text-2xl font-serif text-amber-900 mb-4">
          Create Shipment
        </h2>
        <form
          className="grid grid-cols-1 md:grid-cols-4 gap-3"
          onSubmit={createShipment}
        >
          <input
            type="number"
            min="1"
            placeholder="Order ID"
            className="px-3 py-2 border-2 border-amber-900/20 rounded"
            value={form.orderId}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, orderId: e.target.value }))
            }
            required
          />
          <input
            type="text"
            placeholder="Courier Name"
            className="px-3 py-2 border-2 border-amber-900/20 rounded"
            value={form.courierName}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, courierName: e.target.value }))
            }
            required
          />
          <input
            type="text"
            placeholder="Tracking Number"
            className="px-3 py-2 border-2 border-amber-900/20 rounded"
            value={form.trackingNumber}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, trackingNumber: e.target.value }))
            }
            required
          />
          <div className="flex gap-2">
            <input
              type="date"
              className="flex-1 px-3 py-2 border-2 border-amber-900/20 rounded"
              value={form.estimatedDeliveryDate}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  estimatedDeliveryDate: e.target.value,
                }))
              }
            />
            <button
              type="submit"
              className="px-4 py-2 bg-amber-900 text-amber-50 rounded hover:bg-amber-800 transition"
            >
              Create
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg p-6 border-2 border-amber-900/10">
          <h3 className="text-xl font-serif text-amber-900 mb-4">Shipments</h3>
          <div className="overflow-auto border-2 border-amber-900/10 rounded">
            <table className="min-w-full text-sm">
              <thead className="bg-amber-50 text-left text-amber-900">
                <tr>
                  <th className="p-3">Shipment</th>
                  <th className="p-3">Order</th>
                  <th className="p-3">Courier</th>
                  <th className="p-3">Tracking</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {shipments.map((shipment) => (
                  <tr
                    key={shipment.shipmentId}
                    className="border-t border-amber-900/10"
                  >
                    <td className="p-3 font-semibold text-amber-900">
                      #{shipment.shipmentId}
                    </td>
                    <td className="p-3 text-amber-800">#{shipment.orderId}</td>
                    <td className="p-3 text-amber-800">
                      {shipment.courierName}
                    </td>
                    <td className="p-3 text-amber-800">
                      {shipment.trackingNumber}
                    </td>
                    <td className="p-3 text-amber-800">
                      {shipment.shipmentStatus}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() =>
                          setSelectedShipmentId(shipment.shipmentId)
                        }
                        className="px-3 py-1 border-2 border-amber-900 text-amber-900 rounded hover:bg-amber-900 hover:text-amber-50 transition"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
                {shipments.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-3 text-amber-800">
                      No shipments created yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border-2 border-amber-900/10">
          <h3 className="text-xl font-serif text-amber-900 mb-4">
            Shipment Detail
          </h3>

          {!selected ? (
            <p className="text-amber-800">Select a shipment to view details.</p>
          ) : (
            <div className="space-y-4">
              <div className="text-amber-900 font-semibold">
                Shipment #{selected.shipmentId}
              </div>
              <div className="text-sm text-amber-800">
                Order #{selected.orderId} ({selected.orderStatus})
              </div>
              <div className="text-sm text-amber-800">
                {selected.courierName} • {selected.trackingNumber}
              </div>
              <div>
                <label className="block text-sm text-amber-900 font-semibold mb-1">
                  Update Status
                </label>
                <select
                  className="w-full px-3 py-2 border-2 border-amber-900/20 rounded"
                  value={selected.shipmentStatus}
                  onChange={(e) =>
                    updateStatus(selected.shipmentId, e.target.value)
                  }
                >
                  {SHIPMENT_STATUSES.map((status) => (
                    <option value={status} key={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="border-t-2 border-amber-900/10 pt-4">
                <div className="text-sm font-semibold text-amber-900 mb-2">
                  Timeline
                </div>
                <div className="space-y-2">
                  {selected.events?.map((event, idx) => (
                    <div
                      key={`${event.eventTime}-${idx}`}
                      className="text-xs text-amber-800 border-l-2 border-amber-700/20 pl-2"
                    >
                      <div className="font-semibold text-amber-900">
                        {event.status}
                      </div>
                      <div>{event.location}</div>
                      <div>{event.note}</div>
                      <div>{new Date(event.eventTime).toLocaleString()}</div>
                    </div>
                  ))}
                  {!selected.events?.length && (
                    <div className="text-xs text-amber-700">
                      No timeline events yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 border-2 border-amber-900/10">
        <h3 className="text-xl font-serif text-amber-900 mb-4">
          Low Stock Alerts
        </h3>
        {lowStock.length === 0 ? (
          <p className="text-amber-800">No low stock items.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {lowStock.map((item) => (
              <div
                key={item.productId}
                className="border-2 border-red-300 rounded p-3 bg-red-50"
              >
                <div className="font-semibold text-red-800">
                  {item.productName}
                </div>
                <div className="text-sm text-red-700">
                  Stock: {item.stockQuantity} | Threshold:{" "}
                  {item.lowStockThreshold}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
