import { useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../api/apiClient";
import { useCart } from "../context/CartContext.jsx";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Sparkles, ShoppingBag, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import { resolveImageUrl } from "../utils/resolveImageUrl";

const FIT_TYPES = [
  { value: "", label: "Any fit" },
  { value: "baggy", label: "Baggy" },
  { value: "oversized", label: "Oversized" },
  { value: "regular", label: "Regular Fit" },
  { value: "slim", label: "Slim Fit" },
  { value: "relaxed", label: "Relaxed Fit" },
  { value: "loose", label: "Loose Fit" },
];

const VIBES = [
  { value: "", label: "Any vibe" },
  { value: "casual", label: "Casual" },
  { value: "streetwear", label: "Streetwear" },
  { value: "minimal", label: "Minimal" },
  { value: "clean", label: "Clean" },
  { value: "retro", label: "Retro" },
  { value: "vintage", label: "Vintage" },
  { value: "sports", label: "Sports" },
  { value: "football", label: "Football" },
  { value: "jersey", label: "Jersey" },
  { value: "denim", label: "Denim" },
  { value: "graphic", label: "Graphic" },
  { value: "anime", label: "Anime Style" },
  { value: "formal", label: "Formal" },
  { value: "gothic", label: "Gothic" },
  { value: "y2k", label: "Y2K" },
];

export default function AiStylist() {
  const { addToCart } = useCart();
  const [fitType, setFitType] = useState("");
  const [vibe, setVibe] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");
    setData(null);
    try {
      const res = await apiClient.get("/ai/outfit", {
        params: { fitType, vibe },
      });
      setData(res.data);
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

  const regenerate = () => {
    generate();
  };

  const addOutfitToCart = (outfit) => {
    if (!outfit?.items?.length) return;
    outfit.items.forEach((item) => {
      addToCart(
        {
          id: item.productId,
          name: item.name,
          price: item.price,
          image: resolveImageUrl(item.image),
          category: item.category,
        },
        1,
      );
    });
    toast.success("Outfit added to cart!");
  };

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      {/* ── HERO ── */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#ede8df] via-[#f5f0e8] to-[#f5f0e8] pt-16 pb-12 px-4">
        {/* decorative orbs */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-amber-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -top-16 -right-16 w-80 h-80 rounded-full bg-stone-300/20 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-48 bg-amber-100/40 blur-3xl rounded-full" />

        <div className="relative z-10 text-center max-w-2xl mx-auto">
          {/* icon badge */}
          <div className="inline-flex items-center justify-center mb-5">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-amber-300/30 blur-md scale-150" />
              <div className="relative w-14 h-14 rounded-full bg-white border border-stone-200/80 shadow-sm flex items-center justify-center">
                <Sparkles size={24} className="text-amber-600" />
              </div>
            </div>
          </div>

          {/* pill label */}
          <div className="inline-flex items-center gap-1.5 bg-white/80 border border-stone-200 px-3 py-1 rounded-full mb-4 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[10px] tracking-[0.25em] uppercase text-stone-500 font-medium">
              Powered by Gemini AI
            </span>
          </div>

          <h1 className="font-serif text-stone-900 text-4xl md:text-5xl leading-tight tracking-tight mb-3">
            Your Personal
            <br />
            <span className="italic text-stone-500">AI Stylist</span>
          </h1>

          <p className="text-stone-500 text-sm md:text-base leading-relaxed max-w-md mx-auto">
            Tell us your fit and vibe. We'll curate a complete outfit from our
            collection — just for you.
          </p>
        </div>
      </div>

      {/* ── FORM ── */}
      <div className="px-4 pb-6 -mt-2">
        <form
          onSubmit={generate}
          className="max-w-2xl mx-auto bg-white/80 backdrop-blur-md rounded-2xl border border-stone-200/80 shadow-[0_8px_40px_rgba(0,0,0,0.06)] p-8"
        >
          <p className="text-[10px] tracking-[0.25em] uppercase text-stone-400 mb-5">
            Set your preferences
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fit */}
            <div>
              <label className="block text-xs tracking-[0.12em] uppercase text-stone-500 font-medium mb-2">
                Fit Type
              </label>
              <div className="relative">
                <select
                  value={fitType}
                  onChange={(e) => setFitType(e.target.value)}
                  className="
                    w-full appearance-none bg-[#f9f6f1] border border-stone-200
                    text-stone-800 text-sm px-4 py-3 pr-9 rounded-xl
                    focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100
                    hover:border-stone-300 transition-all duration-200
                  "
                >
                  {FIT_TYPES.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 4L6 8L10 4"
                      stroke="#78716c"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Vibe */}
            <div>
              <label className="block text-xs tracking-[0.12em] uppercase text-stone-500 font-medium mb-2">
                Vibe
              </label>
              <div className="relative">
                <select
                  value={vibe}
                  onChange={(e) => setVibe(e.target.value)}
                  className="
                    w-full appearance-none bg-[#f9f6f1] border border-stone-200
                    text-stone-800 text-sm px-4 py-3 pr-9 rounded-xl
                    focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100
                    hover:border-stone-300 transition-all duration-200
                  "
                >
                  {VIBES.map((v) => (
                    <option key={v.value} value={v.value}>
                      {v.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 4L6 8L10 4"
                      stroke="#78716c"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* CTA */}
          <div className="mt-6 pt-5 border-t border-stone-100">
            <button
              type="submit"
              disabled={loading}
              className="
                group relative w-full overflow-hidden
                bg-gradient-to-r from-amber-700 to-amber-900
                text-white text-[11px] tracking-[0.2em] uppercase font-semibold
                py-4 rounded-xl
                hover:scale-[1.015] hover:shadow-[0_8px_24px_rgba(120,53,15,0.3)]
                active:scale-[0.99]
                transition-all duration-200
                disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100
                flex items-center justify-center gap-2.5
              "
            >
              {/* shimmer on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Curating your outfit…
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Generate Outfit with AI
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ── RESULTS ── */}
      {data?.outfits?.length > 0 && (
        <div className="px-4 pb-20 max-w-5xl mx-auto space-y-6">
          {/* result header */}
          <div className="text-center pt-6 pb-2">
            <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400 mb-1">
              Ready for you
            </p>
            <h2 className="font-serif text-stone-900 text-2xl md:text-3xl">
              Your curated outfit
            </h2>
            {(data.occasion || data.vibe) && (
              <p className="text-stone-400 text-xs tracking-widest uppercase mt-1.5">
                {data.occasion && `Fit: ${data.occasion}`}
                {data.occasion && data.vibe && " · "}
                {data.vibe && `Vibe: ${data.vibe}`}
              </p>
            )}
          </div>

          {data.outfits.map((outfit) => (
            <div
              key={outfit.id}
              className="bg-white/80 backdrop-blur-md rounded-2xl border border-stone-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.05)] overflow-hidden"
            >
              {/* AI explanation */}
              {outfit.explanation && (
                <div className="px-8 pt-7 pb-5">
                  <div className="flex items-start gap-3 bg-gradient-to-r from-amber-50 to-[#f9f6f0] border border-amber-100 rounded-xl p-4">
                    <Sparkles
                      size={15}
                      className="mt-0.5 flex-shrink-0 text-amber-500"
                    />
                    <p className="text-stone-600 text-sm leading-relaxed italic">
                      {outfit.explanation}
                    </p>
                  </div>
                </div>
              )}

              {/* product grid */}
              <div className="px-8 pb-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {outfit.items?.map((item) => (
                  <Link
                    key={item.productId}
                    to={`/product/${item.productId}`}
                    className="group overflow-hidden rounded-xl border border-stone-200/80 bg-[#f9f6f1] hover:border-stone-300 hover:shadow-md transition-all duration-300"
                  >
                    <div className="aspect-[3/4] overflow-hidden">
                      <ImageWithFallback
                        src={resolveImageUrl(item.image)}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                      />
                    </div>
                    <div className="p-3">
                      <span className="text-[9px] tracking-[0.18em] uppercase text-stone-400 font-medium">
                        {item.role}
                      </span>
                      <h3 className="text-stone-900 text-xs font-medium mt-0.5 truncate">
                        {item.name}
                      </h3>
                      <p className="text-stone-500 text-xs mt-0.5">
                        ₹{item.price}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* action bar */}
              <div className="px-8 pb-7 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => addOutfitToCart(outfit)}
                  className="
                    flex-1 inline-flex items-center justify-center gap-2
                    bg-stone-900 text-white text-[11px] tracking-[0.15em] uppercase font-medium
                    py-3.5 rounded-xl
                    hover:bg-stone-700 hover:scale-[1.01] hover:shadow-lg
                    transition-all duration-200
                  "
                >
                  <ShoppingBag size={15} />
                  Add Full Outfit to Cart
                </button>

                <button
                  onClick={regenerate}
                  disabled={loading}
                  className="
                    inline-flex items-center justify-center gap-2
                    border border-stone-300 bg-white text-stone-700 text-[11px] tracking-[0.15em] uppercase font-medium
                    px-6 py-3.5 rounded-xl
                    hover:border-amber-700 hover:text-amber-800 hover:scale-[1.01]
                    transition-all duration-200
                    disabled:opacity-50
                  "
                >
                  <RefreshCw
                    size={14}
                    className={loading ? "animate-spin" : ""}
                  />
                  {loading ? "Regenerating…" : "Try Another"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── EMPTY STATE ── */}
      {data?.outfits?.length === 0 && data !== null && !loading && (
        <div className="px-4 pb-20 max-w-2xl mx-auto">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-stone-200/80 shadow-sm p-14 text-center">
            <Sparkles size={36} className="mx-auto text-amber-300 mb-4" />
            <h3 className="font-serif text-stone-800 text-xl mb-2">
              No match found
            </h3>
            <p className="text-stone-500 text-sm leading-relaxed mb-2">
              No outfit matched these preferences.
            </p>
            <p className="text-stone-400 text-xs mb-7">
              Try a different combination or browse all products.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-stone-900 text-white text-[11px] tracking-[0.15em] uppercase font-medium px-6 py-3 rounded-xl hover:bg-stone-700 transition-all duration-200"
            >
              Browse Shop
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
