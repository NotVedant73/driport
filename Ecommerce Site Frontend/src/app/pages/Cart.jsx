import { Link, useNavigate } from "react-router-dom";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";

export default function Cart() {
  const navigate = useNavigate();
  const { items, subtotal, updateQuantity, removeFromCart } = useCart();

  const shipping = items.length > 0 ? 10 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-[#f5f0e8] min-h-screen">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#f0e7d8] to-[#f7f1e8] py-12 sm:py-16 border-b-2 border-stone-300">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-5xl font-serif text-stone-900 mb-4">
            Shopping Cart
          </h1>
          <p className="text-stone-600 text-lg">
            {items.length} items in your cart
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {items.length === 0 ? (
          <div className="bg-white rounded-lg p-8 sm:p-16 text-center border-2 border-stone-200">
            <ShoppingBag size={64} className="mx-auto text-amber-300 mb-6" />
            <h2 className="text-2xl font-serif text-stone-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-stone-600 mb-8">
              Discover our vintage collection and find your perfect piece
            </p>
            <Link
              to="/shop"
              className="inline-block bg-stone-900 text-white px-8 py-4 rounded hover:bg-stone-700 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="bg-white rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 border-2 border-stone-200"
                >
                  <Link
                    to={`/product/${item.productId}`}
                    className="flex-shrink-0"
                  >
                    <div className="w-full h-56 sm:w-32 sm:h-32 rounded overflow-hidden">
                      <ImageWithFallback
                        src={item.image || ""}
                        alt={item.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  </Link>
                  <div className="flex-1">
                    <Link to={`/product/${item.productId}`}>
                      <h3 className="font-semibold text-stone-900 text-lg mb-2 hover:text-stone-500">
                        {item.name}
                      </h3>
                    </Link>
                    <div className="text-stone-500 text-sm mb-4">Quantity</div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center border-2 border-stone-300 rounded overflow-hidden">
                        <button
                          className="px-3 py-1 hover:bg-amber-50 transition"
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              Math.max(1, item.quantity - 1),
                            )
                          }
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 py-1 border-x-2 border-stone-300">
                          {item.quantity}
                        </span>
                        <button
                          className="px-3 py-1 hover:bg-amber-50 transition"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <div className="text-xl font-serif text-stone-900">
                        ₹{(Number(item.price) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <button
                    className="self-end sm:self-auto flex-shrink-0 text-red-500 hover:text-red-700 transition"
                    onClick={() => removeFromCart(item.productId)}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-5 sm:p-6 border-2 border-stone-200 sticky top-24">
                <h2 className="text-2xl font-serif text-stone-900 mb-6">
                  Order Summary
                </h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Shipping</span>
                    <span>₹{shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Tax</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t-2 border-stone-200 pt-4">
                    <div className="flex justify-between text-xl font-serif text-stone-900">
                      <span>Total</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  className="w-full bg-stone-900 text-white py-4 rounded hover:bg-stone-700 transition text-lg font-semibold mb-4"
                  disabled={items.length === 0}
                  onClick={() => navigate("/checkout")}
                >
                  Proceed to Checkout
                </button>

                <Link
                  to="/shop"
                  className="block text-center text-stone-900 hover:text-stone-500 transition"
                >
                  Continue Shopping
                </Link>

                <div className="mt-6 pt-6 border-t-2 border-stone-200">
                  <h3 className="font-semibold text-stone-900 mb-3">
                    Promo Code
                  </h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter code"
                      className="flex-1 px-3 py-2 border-2 border-stone-300 rounded focus:outline-none focus:border-amber-300"
                    />
                    <button className="px-6 py-2 border-2 border-amber-900 text-stone-900 rounded hover:bg-stone-100 hover:text-amber-50 transition">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
