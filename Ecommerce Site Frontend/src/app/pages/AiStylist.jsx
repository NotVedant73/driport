import { useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../api/apiClient";
import { useCart } from "../context/CartContext.jsx";
import { BASE_URL } from "../../config";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Sparkles, ShoppingBag, RefreshCw } from "lucide-react"; // ← ADD RefreshCw
import { toast } from "react-toastify";

// UPDATED FIT TYPES - Match streetwear style
const FIT_TYPES = [
  { value: "", label: "Any fit" },
  { value: "oversized", label: "Oversized" },
  { value: "regular", label: "Regular Fit" },
  { value: "slim", label: "Slim Fit" },
  { value: "relaxed", label: "Relaxed Fit" },
  { value: "loose", label: "Loose Fit" },
];

// UPDATED VIBES - Match your product tags
const VIBES = [
  { value: "", label: "Any vibe" },
  { value: "casual", label: "Casual" },
  { value: "streetwear", label: "Streetwear" },
  { value: "vintage", label: "Vintage" },
  { value: "minimal", label: "Minimal" },
  { value: "retro", label: "Retro" },
  { value: "sporty", label: "Sporty" },
  { value: "anime", label: "Anime Style" },
];

export default function AiStylist() {
  const { addToCart } = useCart();
  const [fitType, setFitType] = useState("");
  const [vibe, setVibe] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // GENERATE FUNCTION - Called on first generation AND regeneration
  const generate = async (e) => {
    if (e) e.preventDefault(); // Only prevent default if called from form submit
    setLoading(true);
    setError("");
    setData(null);
    try {
      const res = await apiClient.get("/ai/outfit", {
        params: { fitType, vibe },
      });
      setData(res.data);

      // Show toast on successful generation
      if (res.data?.outfits?.length > 0) {
        toast.success("AI generated your outfit! ✨");
      }
    } catch (err) {
      console.error("AI generation error:", err);
      setError(
        err.response?.data?.message || "Failed to generate outfit. Try again.",
      );
      toast.error("Failed to generate outfit");
    } finally {
      setLoading(false);
    }
  };

  // NEW: REGENERATE FUNCTION - Just calls generate again!
  const regenerate = () => {
    generate(); // Same function, AI returns different result due to temperature=0.7
  };

  const addOutfitToCart = (outfit) => {
    if (!outfit?.items?.length) return;
    outfit.items.forEach((item) => {
      addToCart(
        {
          id: item.productId,
          name: item.name,
          price: item.price,
          image: item.image ? `${BASE_URL}${item.image}` : "",
          category: item.category,
        },
        1,
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
            Powered by Google Gemini AI — Select your style and let AI curate
            the perfect outfit from our collection.
          </p>
        </div>

        <form
          onSubmit={generate}
          className="bg-white rounded-lg p-8 border-2 border-amber-900/10 max-w-2xl mx-auto mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">
                Fit Type
              </label>
              <select
                value={fitType}
                onChange={(e) => setFitType(e.target.value)}
                className="w-full px-4 py-3 border-2 border-amber-900/20 rounded focus:outline-none focus:border-amber-900 bg-white text-amber-900"
              >
                {FIT_TYPES.map((o) => (
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
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="pt-6 mt-2 border-t-2 border-amber-900/10">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-900 text-amber-50 py-4 rounded hover:bg-amber-800 transition font-semibold text-lg disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw size={20} className="animate-spin" />
                  Generating outfit...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Generate Outfit with AI
                </>
              )}
            </button>
          </div>
        </form>

        {data?.outfits?.length > 0 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-serif text-amber-900 mb-2">
                Your AI-Curated Outfit
              </h2>
              <p className="text-amber-700">
                {data.occasion && `Fit: ${data.occasion}`}
                {data.occasion && data.vibe && " • "}
                {data.vibe && `Vibe: ${data.vibe}`}
              </p>
            </div>

            {data.outfits.map((outfit) => (
              <div
                key={outfit.id}
                className="bg-white rounded-lg p-8 border-2 border-amber-900/10"
              >
                {/* AI EXPLANATION */}
                {outfit.explanation && (
                  <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-amber-900 flex items-start gap-2">
                      <Sparkles
                        size={18}
                        className="mt-1 flex-shrink-0 text-amber-600"
                      />
                      <span className="italic">{outfit.explanation}</span>
                    </p>
                  </div>
                )}

                {/* OUTFIT ITEMS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
                  {outfit.items?.map((item) => (
                    <Link
                      key={item.productId}
                      to={`/product/${item.productId}`}
                      className="group border-2 border-amber-900/10 rounded-lg overflow-hidden hover:border-amber-900/30 transition"
                    >
                      <div className="aspect-[3/4] overflow-hidden bg-amber-50">
                        <ImageWithFallback
                          src={item.image ? `${BASE_URL}${item.image}` : ""}
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
                        <p className="text-amber-800">₹{item.price}</p>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => addOutfitToCart(outfit)}
                    className="flex-1 px-8 py-3 bg-amber-900 text-amber-50 rounded hover:bg-amber-800 transition font-semibold flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={20} />
                    Add Full Outfit to Cart
                  </button>

                  {/* NEW: REGENERATE BUTTON */}
                  <button
                    onClick={regenerate}
                    disabled={loading}
                    className="px-8 py-3 bg-white text-amber-900 border-2 border-amber-900 rounded hover:bg-amber-50 transition font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    <RefreshCw
                      size={20}
                      className={loading ? "animate-spin" : ""}
                    />
                    {loading ? "Regenerating..." : "Try Another Outfit"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {data?.outfits?.length === 0 && data !== null && !loading && (
          <div className="bg-white rounded-lg p-12 border-2 border-amber-900/10 text-center">
            <Sparkles size={48} className="mx-auto text-amber-300 mb-4" />
            <p className="text-amber-800 mb-4 text-lg">
              No matching outfit found for these preferences.
            </p>
            <p className="text-amber-700 text-sm mb-6">
              Try different combinations or browse our shop to see all products.
            </p>
            <Link
              to="/shop"
              className="inline-block px-6 py-3 bg-amber-900 text-amber-50 rounded hover:bg-amber-800 transition font-semibold"
            >
              Browse Shop
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
