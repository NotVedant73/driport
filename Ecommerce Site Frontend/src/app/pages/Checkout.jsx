import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../../api/apiClient";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const { userEmail } = useAuth(); // ✅ Get user email from auth

  const [form, setForm] = useState({
    customerName: "",
    customerEmail: userEmail || "", // ✅ Pre-fill email
    customerPhone: "",
    shippingAddress: "",
    notes: "",
  });

  // Update email if it changes (edge case)
  useEffect(() => {
    if (userEmail && !form.customerEmail) {
      setForm((prev) => ({ ...prev, customerEmail: userEmail }));
    }
  }, [userEmail]);

  // Load Razorpay script on component mount
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (items.length === 0) {
    return (
      <div className="bg-[#f5f0e8] min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 border-2 border-stone-200 text-center">
          <h1 className="text-3xl font-serif text-stone-900 mb-4">
            Your cart is empty
          </h1>
          <p className="text-stone-600 mb-6">
            Add some items to your cart before checking out.
          </p>
          <Link
            to="/shop"
            className="bg-stone-900 text-white px-6 py-3 rounded hover:bg-stone-700 transition"
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

  /**
   * Opens Razorpay checkout modal for payment
   * Called after order is created in backend
   */
  const openRazorpayCheckout = (paymentDetails, orderData) => {
    const { razorpayOrderId, amount, currency, key } = paymentDetails;

    const options = {
      key: key, // Razorpay Key ID from backend
      amount: Math.round(amount * 100), // Amount in paise
      currency: currency,
      name: "Driport",
      description: `Order #${orderData.id}`,
      order_id: razorpayOrderId, // Razorpay order ID from backend

      // Handler on successful payment
      handler: async (response) => {
        try {
          // Call backend to verify payment signature
          const verificationResponse = await apiClient.post(
            "/payments/verify",
            {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            },
          );

          if (verificationResponse.data.success) {
            toast.success("Payment successful! 🎉");
            clearCart();
            // Redirect to order success page or shop
            navigate("/shop");
          } else {
            toast.error("Payment verification failed");
          }
        } catch (err) {
          console.error("Verification error:", err);
          toast.error("Error verifying payment");
        }
      },

      // Handler on payment failure
      modal: {
        ondismiss: async () => {
          try {
            // Notify backend about payment failure
            await apiClient.post("/payments/failure", {
              razorpayOrderId: razorpayOrderId,
              reason: "User cancelled payment",
            });
            toast.warning("Payment cancelled");
          } catch (err) {
            console.error("Error handling failure:", err);
          }
        },
      },

      // Prefill customer details for convenience
      prefill: {
        name: form.customerName,
        email: form.customerEmail,
        contact: form.customerPhone,
      },

      // Theme colors
      theme: {
        color: "#78350f", // amber-900
      },
    };

    try {
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("Razorpay error:", err);
      toast.error("Failed to open payment modal");
    }
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

      // Step 1: Create order in backend
      const response = await apiClient.post("/orders", payload);
      const { order, payment } = response.data;

      // Step 2: Open Razorpay checkout modal
      openRazorpayCheckout(payment, order);
    } catch (err) {
      const data = err.response?.data;

      if (err.response?.status === 401) {
        toast.error("Please login to place an order");
        navigate("/login", { state: { from: "/checkout" } });
      } else {
        const errorMsg =
          data?.error ||
          data?.message ||
          (typeof data === "string"
            ? data
            : "Something went wrong while placing your order.");
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f5f0e8] min-h-screen">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <h1 className="text-3xl sm:text-4xl font-serif text-stone-900 mb-8 text-center">
          Checkout
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg p-5 sm:p-8 border-2 border-stone-200 lg:col-span-2 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-stone-900 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={form.customerName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border-2 border-stone-300 rounded focus:outline-none focus:border-amber-300"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-900 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="customerEmail"
                  value={form.customerEmail}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border-2 border-stone-300 rounded focus:outline-none focus:border-amber-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-900 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="customerPhone"
                value={form.customerPhone}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border-2 border-stone-300 rounded focus:outline-none focus:border-amber-300"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-900 mb-1">
                Shipping Address
              </label>
              <textarea
                name="shippingAddress"
                value={form.shippingAddress}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-3 py-2 border-2 border-stone-300 rounded focus:outline-none focus:border-amber-300"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-900 mb-1">
                Notes (optional)
              </label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border-2 border-stone-300 rounded focus:outline-none focus:border-amber-300"
              />
            </div>

            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-stone-900 text-white py-4 rounded hover:bg-stone-700 transition text-lg font-semibold disabled:opacity-60"
            >
              {isSubmitting ? "Processing Payment..." : "Proceed to Payment"}
            </button>
          </form>

          <div className="bg-white rounded-lg p-5 sm:p-8 border-2 border-stone-200">
            <h2 className="text-2xl font-serif text-stone-900 mb-6">
              Order Summary
            </h2>
            <ul className="space-y-3 mb-6">
              {items.map((item) => (
                <li
                  key={item.productId}
                  className="flex justify-between text-stone-600"
                >
                  <span className="pr-3 break-words">
                    {item.name} × {item.quantity}
                  </span>
                  <span>
                    ₹{(Number(item.price) * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="border-t-2 border-stone-200 pt-4 space-y-2">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
