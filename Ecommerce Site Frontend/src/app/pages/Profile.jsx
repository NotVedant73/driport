import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  LogOut,
  ShoppingBag,
  Settings,
  Shield,
} from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import apiClient from "../../api/apiClient";

export default function Profile() {
  const navigate = useNavigate();
  const { isLoggedIn, userEmail, userRole, logout } = useAuth(); // ✅ Use auth context
  const [orders, setOrders] = useState([]);
  const [tracking, setTracking] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoggedIn) {
      toast.error("Please login to view your profile");
      navigate("/login");
      return;
    }

    setLoadingOrders(true);
    apiClient
      .get("/orders/my-orders")
      .then((res) => setOrders(res.data || []))
      .catch(() => toast.error("Failed to load your orders"))
      .finally(() => setLoadingOrders(false));
  }, [isLoggedIn, navigate]);

  const handleLogout = () => {
    // Use AuthContext logout method (clears global state + localStorage)
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const isAdmin = userRole === "ROLE_ADMIN";

  const canCancelOrder = (status) => {
    return ["PENDING", "PAID", "PROCESSING", "PACKED"].includes(status);
  };

  const handleTrackOrder = async (orderId) => {
    try {
      const res = await apiClient.get(`/orders/${orderId}/tracking`);
      setTracking(res.data);
    } catch {
      toast.error("Tracking is not available yet for this order");
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await apiClient.delete(`/orders/${orderId}`);
      toast.success("Order cancelled successfully");
      const res = await apiClient.get("/orders/my-orders");
      setOrders(res.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel order");
    }
  };

  return (
    <div className="bg-[#f5f0e8] min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Page Header */}
        <div className="bg-white rounded-lg p-8 border-2 border-stone-200 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center">
                <User size={32} className="text-stone-900" />
              </div>
              <div>
                <h1 className="text-3xl font-serif text-stone-900">
                  My Profile
                </h1>
                <p className="text-stone-600">Manage your account and orders</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 border-2 border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-lg">
              <Mail size={20} className="text-stone-500" />
              <div>
                <div className="text-xs text-stone-500 mb-1">Email</div>
                <div className="text-stone-900 font-medium">{userEmail}</div>
              </div>
            </div>

            {/* Role */}
            <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-lg">
              <Shield size={20} className="text-stone-500" />
              <div>
                <div className="text-xs text-stone-500 mb-1">Account Type</div>
                <div className="flex items-center gap-2">
                  <span className="text-stone-900 font-medium">
                    {isAdmin ? "Administrator" : "Customer"}
                  </span>
                  {isAdmin && (
                    <span className="bg-stone-900 text-white text-xs px-2 py-1 rounded">
                      Admin
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Admin Link */}
          {isAdmin && (
            <div className="mt-6 pt-6 border-t-2 border-stone-200">
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded hover:bg-stone-700 transition font-semibold"
              >
                <Settings size={20} />
                Go to Admin Dashboard
              </Link>
            </div>
          )}
        </div>

        {/* Order History Section */}
        <div className="bg-white rounded-lg p-8 border-2 border-stone-200">
          <h2 className="text-2xl font-serif text-stone-900 mb-6 flex items-center gap-2">
            <ShoppingBag size={24} />
            Order History
          </h2>

          {loadingOrders ? (
            <div className="text-center py-12 text-stone-600">
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag size={48} className="mx-auto text-amber-300 mb-4" />
              <p className="text-stone-600 mb-4">No orders yet</p>
              <Link
                to="/shop"
                className="inline-block bg-stone-900 text-white px-6 py-3 rounded hover:bg-stone-700 transition"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border-2 border-stone-200 rounded-lg p-4 hover:border-amber-900/30 transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-sm text-stone-500">
                        Order #{order.id}
                      </div>
                      <div className="text-lg font-semibold text-stone-900">
                        ₹{order.totalAmount}
                      </div>
                    </div>
                    <span className="bg-stone-100 text-stone-900 px-3 py-1 rounded text-sm font-medium">
                      {order.status}
                    </span>
                  </div>
                  <div className="text-sm text-stone-600">
                    Ordered on {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-stone-500 mt-1">
                    Shipment: {order.shipmentStatus || "Not created yet"}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleTrackOrder(order.id)}
                      className="px-3 py-1 border-2 border-amber-900 text-stone-900 rounded hover:bg-stone-100 hover:text-amber-50 transition"
                    >
                      Track
                    </button>
                    {canCancelOrder(order.status) && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="px-3 py-1 border-2 border-red-500 text-red-600 rounded hover:bg-red-500 hover:text-white transition"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {tracking && (
          <div className="mt-8 bg-white rounded-lg p-8 border-2 border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-serif text-stone-900">
                Tracking for Order #{tracking.orderId}
              </h3>
              <button
                onClick={() => setTracking(null)}
                className="px-3 py-1 border-2 border-amber-900 text-stone-900 rounded hover:bg-stone-100 hover:text-amber-50 transition"
              >
                Close
              </button>
            </div>
            <div className="text-sm text-stone-600 mb-2">
              {tracking.courierName} • {tracking.trackingNumber}
            </div>
            <div className="text-sm text-stone-600 mb-4">
              Current shipment status:{" "}
              <span className="font-semibold">{tracking.shipmentStatus}</span>
            </div>
            <div className="space-y-3">
              {tracking.events?.map((event, idx) => (
                <div
                  key={`${event.eventTime}-${idx}`}
                  className="border-l-2 border-amber-900/30 pl-3"
                >
                  <div className="text-sm font-semibold text-stone-900">
                    {event.status}
                  </div>
                  <div className="text-sm text-stone-600">{event.location}</div>
                  <div className="text-sm text-stone-500">{event.note}</div>
                  <div className="text-xs text-stone-500">
                    {new Date(event.eventTime).toLocaleString()}
                  </div>
                </div>
              ))}
              {!tracking.events?.length && (
                <div className="text-sm text-stone-600">
                  No tracking events yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Account Actions */}
        <div className="mt-8 bg-white rounded-lg p-8 border-2 border-stone-200">
          <h3 className="text-xl font-serif text-stone-900 mb-4">
            Account Settings
          </h3>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 border-2 border-stone-300 rounded hover:border-amber-900 transition">
              <Settings size={18} className="inline mr-2" />
              Update Profile Information
            </button>
            <button className="w-full text-left px-4 py-3 border-2 border-stone-300 rounded hover:border-amber-900 transition">
              <Mail size={18} className="inline mr-2" />
              Change Email Address
            </button>
            <button className="w-full text-left px-4 py-3 border-2 border-stone-300 rounded hover:border-amber-900 transition">
              <Shield size={18} className="inline mr-2" />
              Change Password
            </button>
          </div>
          <p className="text-sm text-stone-500 mt-4">
            * These features will be connected to backend endpoints
          </p>
        </div>
      </div>
    </div>
  );
}
