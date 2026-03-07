import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../../api/apiClient";
import { useCart } from "../context/CartContext.jsx";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();

  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (items.length === 0) {
    return (
      <div className="bg-amber-50/30 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 border-2 border-amber-900/10 text-center">
          <h1 className="text-3xl font-serif text-amber-900 mb-4">
            Your cart is empty
          </h1>
          <p className="text-amber-800 mb-6">
            Add some items to your cart before checking out.
          </p>
          <Link
            to="/shop"
            className="bg-amber-900 text-amber-50 px-6 py-3 rounded hover:bg-amber-800 transition"
          >
            Go to Shop
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const payload = {
        customerName: form.customerName,
        customerEmail: form.customerEmail,
        customerPhone: form.customerPhone,
        shippingAddress: form.shippingAddress,
        notes: form.notes,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      await apiClient.post("/orders", payload);
      clearCart();
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data || "Something went wrong while placing your order."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-amber-50/30 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-serif text-amber-900 mb-8 text-center">
          Checkout
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg p-8 border-2 border-amber-900/10 lg:col-span-2 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-amber-900 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={form.customerName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border-2 border-amber-900/20 rounded focus:outline-none focus:border-amber-900"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-amber-900 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="customerEmail"
                  value={form.customerEmail}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border-2 border-amber-900/20 rounded focus:outline-none focus:border-amber-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="customerPhone"
                value={form.customerPhone}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border-2 border-amber-900/20 rounded focus:outline-none focus:border-amber-900"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-1">
                Shipping Address
              </label>
              <textarea
                name="shippingAddress"
                value={form.shippingAddress}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-3 py-2 border-2 border-amber-900/20 rounded focus:outline-none focus:border-amber-900"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-1">
                Notes (optional)
              </label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border-2 border-amber-900/20 rounded focus:outline-none focus:border-amber-900"
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm mt-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-amber-900 text-amber-50 py-4 rounded hover:bg-amber-800 transition text-lg font-semibold disabled:opacity-60"
            >
              {isSubmitting ? "Placing Order..." : "Place Order"}
            </button>
          </form>

          <div className="bg-white rounded-lg p-8 border-2 border-amber-900/10">
            <h2 className="text-2xl font-serif text-amber-900 mb-6">
              Order Summary
            </h2>
            <ul className="space-y-3 mb-6">
              {items.map((item) => (
                <li
                  key={item.productId}
                  className="flex justify-between text-amber-800"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>
                    ${(Number(item.price) * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="border-t-2 border-amber-900/10 pt-4 space-y-2">
              <div className="flex justify-between text-amber-800">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

