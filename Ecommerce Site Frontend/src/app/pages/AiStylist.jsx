import { useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../api/apiClient";
import { useCart } from "../context/CartContext.jsx";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Sparkles, ShoppingBag } from "lucide-react";
import { toast } from "react-toastify";

const OCCASIONS = [
  { value: "", label: "Any occasion" },
  { value: "festival", label: "Festival" },
  { value: "party", label: "Party" },
  { value: "casual", label: "Casual" },
  { value: "office", label: "Office" },
  { value: "date", label: "Date night" },
  { value: "daily", label: "Daily" },
];

const VIBES = [
  { value: "", label: "Any vibe" },
  { value: "vintage", label: "Vintage" },
  { value: "genz", label: "Gen-Z" },
  { value: "minimal", label: "Minimal" },
  { value: "boho", label: "Boho" },
  { value: "streetwear", label: "Streetwear" },
  { value: "classic", label: "Classic" },
];

export default function AiStylist() {
  const { addToCart } = useCart();
  const [occasion, setOccasion] = useState("");
  const [vibe, setVibe] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setData(null);
    try {
      const res = await apiClient.get("/ai/outfit", {
        params: { occasion, vibe },
      });
      setData(res.data);
    } catch (err) {
      setError(err.response?.data || "Failed to generate outfit. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const addOutfitToCart = (outfit) => {
    if (!outfit?.items?.length) return;
    outfit.items.forEach((item) => {
      addToCart(
        {
          id: item.productId,
          name: item.name,
          price: item.price,
          image: item.image,
          category: item.category,
        },
        1
      );
    });
    toast.success("Outfit added to cart!");
  };

  return (
    <div className="bg-amber-50/30 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-900 mb-4">
            <Sparkles size={32} />
          </div>
          <h1 className="text-4xl font-serif text-amber-900 mb-2">
            AI Outfit Stylist
          </h1>
          <p className="text-amber-800 text-lg max-w-xl mx-auto">
            Choose an occasion and vibe — we’ll suggest a complete outfit from our collection.
          </p>
        </div>

        <form
          onSubmit={generate}
          className="bg-white rounded-lg p-8 border-2 border-amber-900/10 max-w-2xl mx-auto mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">
                Occasion
              </label>
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full px-4 py-3 border-2 border-amber-900/20 rounded focus:outline-none focus:border-amber-900 bg-white text-amber-900"
              >
                {OCCASIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">
                Vibe
              </label>
              <select
                value={vibe}
                onChange={(e) => setVibe(e.target.value)}
                className="w-full px-4 py-3 border-2 border-amber-900/20 rounded focus:outline-none focus:border-amber-900 bg-white text-amber-900"
              >
                {VIBES.map((v) => (
                  <option key={v.value} value={v.value}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <p className="text-red-600 text-sm mt-2 mb-4">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-900 text-amber-50 py-4 rounded hover:bg-amber-800 transition font-semibold text-lg disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              "Generating outfit..."
            ) : (
              <>
                <Sparkles size={20} />
                Generate outfit
              </>
            )}
          </button>
        </form>

        {data?.outfits?.length > 0 && (
          <div className="space-y-8">
            <h2 className="text-2xl font-serif text-amber-900 text-center">
              Your outfit for {data.occasion || "any occasion"} ({data.vibe || "any vibe"})
            </h2>

            {data.outfits.map((outfit) => (
              <div
                key={outfit.id}
                className="bg-white rounded-lg p-8 border-2 border-amber-900/10"
              >
                {outfit.explanation && (
                  <p className="text-amber-800 mb-6 italic">
                    {outfit.explanation}
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
                  {outfit.items?.map((item) => (
                    <Link
                      key={item.productId}
                      to={`/product/${item.productId}`}
                      className="group border-2 border-amber-900/10 rounded-lg overflow-hidden hover:border-amber-900/30 transition"
                    >
                      <div className="aspect-[3/4] overflow-hidden bg-amber-50">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="p-3">
                        <span className="text-xs font-semibold text-amber-700 uppercase">
                          {item.role}
                        </span>
                        <h3 className="font-semibold text-amber-900 truncate">
                          {item.name}
                        </h3>
                        <p className="text-amber-800">${item.price}</p>
                      </div>
                    </Link>
                  ))}
                </div>

                <button
                  onClick={() => addOutfitToCart(outfit)}
                  className="w-full md:w-auto px-8 py-3 bg-amber-900 text-amber-50 rounded hover:bg-amber-800 transition font-semibold flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={20} />
                  Add full outfit to cart
                </button>
              </div>
            ))}
          </div>
        )}

        {data?.outfits?.length === 0 && data !== null && !loading && (
          <div className="bg-white rounded-lg p-12 border-2 border-amber-900/10 text-center">
            <p className="text-amber-800 mb-4">
              No matching outfit found. Add more products in Admin with Type and tags (style / occasion) to get AI suggestions.
            </p>
            <Link
              to="/shop"
              className="text-amber-900 font-semibold hover:text-amber-700"
            >
              Browse shop
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
