import { useEffect, useMemo, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  Star,
  Heart,
  Truck,
  RefreshCw,
  Shield,
  Share2,
  ChevronLeft,
} from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import apiClient from "../../api/apiClient";
import { BASE_URL } from "../../config";

export default function ProductDetail() {
  const backendProduct = useLoaderData();
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [aiOutfit, setAiOutfit] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const product = useMemo(() => {
    const price = Number(backendProduct?.price ?? 0);
    const image = backendProduct?.image
      ? `${BASE_URL}${backendProduct.image}`
      : "https://images.unsplash.com/photo-1666861585341-5bd1e7b1ed71?auto=format&fit=crop&w=1080&q=80";

    return {
      id: backendProduct?.id,
      name: backendProduct?.name || "Product",
      price,
      oldPrice: price ? Number((price * 1.2).toFixed(2)) : null,
      description:
        "This is a curated vintage piece. Product details will be expanded as we enrich the catalog data.",
      category: backendProduct?.category || "Vintage",
      rating: backendProduct?.rating ?? 4,
      reviews: 0,
      inStock: true,
      sizes: ["XS", "S", "M", "L", "XL"],
      images: [image, image, image],
      image,
      details: {
        era: "Vintage",
        condition: "Good",
        material: "Mixed",
        care: "Handle with care",
      },
    };
  }, [backendProduct]);

  const [mainImage, setMainImage] = useState(product.images[0]);

  useEffect(() => {
    setMainImage(product.images[0]);
  }, [product.images]);

  const loadCompleteFit = async () => {
    if (!backendProduct?.id) return;
    setAiLoading(true);
    setAiError("");
    setAiOutfit(null);
    try {
      const res = await apiClient.get("/ai/complete-fit", {
        params: { productId: backendProduct.id },
      });
      const outfit = res.data?.outfits?.[0] || null;
      setAiOutfit(outfit);
    } catch (err) {
      setAiError(err.response?.data || "Failed to generate outfit.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="bg-amber-50/30 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-amber-800 mb-8">
          <Link to="/" className="hover:text-amber-900">
            Home
          </Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-amber-900">
            Shop
          </Link>
          <span>/</span>
          <span className="text-amber-900">{product.name}</span>
        </div>

        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-amber-900 hover:text-amber-700 mb-6"
        >
          <ChevronLeft size={20} />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="bg-white rounded-lg overflow-hidden border-2 border-amber-900/10 mb-4">
              <div className="aspect-[3/4]">
                <ImageWithFallback
                  src={mainImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setMainImage(image)}
                  className={`bg-white rounded-lg overflow-hidden border-2 ${
                    mainImage === image
                      ? "border-amber-900"
                      : "border-amber-900/10"
                  } hover:border-amber-900 transition`}
                >
                  <div className="aspect-square">
                    <ImageWithFallback
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="bg-white rounded-lg p-8 border-2 border-amber-900/10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-sm text-amber-700 mb-2">
                    {product.category}
                  </div>
                  <h1 className="text-4xl font-serif text-amber-900 mb-4">
                    {product.name}
                  </h1>
                </div>
                <button className="p-2 hover:bg-amber-50 rounded-full transition">
                  <Heart size={24} className="text-amber-900" />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={
                        i < product.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <span className="text-amber-800">
                  ({product.reviews} reviews)
                </span>
              </div>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-serif text-amber-900">
                  ₹{product.price}
                </span>
                {product.oldPrice && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      ₹{product.oldPrice}
                    </span>
                    <span className="bg-red-500 text-white text-sm px-3 py-1 rounded">
                      Save{" "}
                      {Math.round((1 - product.price / product.oldPrice) * 100)}
                      %
                    </span>
                  </>
                )}
              </div>

              <p className="text-amber-800 mb-8">{product.description}</p>

              {/* Size Selection */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="font-semibold text-amber-900">Size</label>
                  <a
                    href="#"
                    className="text-sm text-amber-700 hover:text-amber-900"
                  >
                    Size Guide
                  </a>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 border-2 rounded transition ${
                        selectedSize === size
                          ? "border-amber-900 bg-amber-900 text-amber-50"
                          : "border-amber-900/20 text-amber-900 hover:border-amber-900"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-8">
                <label className="font-semibold text-amber-900 block mb-3">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-amber-900/20 rounded overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-amber-50 transition"
                    >
                      -
                    </button>
                    <span className="px-6 py-2 border-x-2 border-amber-900/20">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 hover:bg-amber-50 transition"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-amber-700">
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 mb-8">
                <button
                  className="flex-1 bg-amber-900 text-amber-50 py-4 rounded hover:bg-amber-800 transition text-lg font-semibold"
                  onClick={() => addToCart(product, quantity)}
                >
                  Add to Cart
                </button>
                <button
                  className="flex-1 border-2 border-amber-900 text-amber-900 py-4 rounded hover:bg-amber-900 hover:text-amber-50 transition text-lg font-semibold"
                  onClick={loadCompleteFit}
                >
                  Complete this look
                </button>
                <button className="px-6 border-2 border-amber-900 text-amber-900 rounded hover:bg-amber-900 hover:text-amber-50 transition">
                  <Share2 size={20} />
                </button>
              </div>

              {/* Features */}
              <div className="space-y-3 pt-6 border-t-2 border-amber-900/10">
                <div className="flex items-center gap-3 text-amber-800">
                  <Truck size={20} className="text-amber-700" />
                  <span>Free shipping on orders over ₹899</span>
                </div>
                <div className="flex items-center gap-3 text-amber-800">
                  <RefreshCw size={20} className="text-amber-700" />
                  <span>30-day easy returns</span>
                </div>
                <div className="flex items-center gap-3 text-amber-800">
                  <Shield size={20} className="text-amber-700" />
                  <span>100% authentic vintage</span>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="bg-white rounded-lg p-8 border-2 border-amber-900/10 mt-6">
              <h3 className="font-semibold text-amber-900 text-xl mb-4">
                Product Details
              </h3>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-amber-700">Era:</dt>
                  <dd className="text-amber-900 font-medium">
                    {product.details.era}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-amber-700">Condition:</dt>
                  <dd className="text-amber-900 font-medium">
                    {product.details.condition}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-amber-700">Material:</dt>
                  <dd className="text-amber-900 font-medium">
                    {product.details.material}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-amber-700">Care:</dt>
                  <dd className="text-amber-900 font-medium">
                    {product.details.care}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {aiLoading && (
          <div className="mt-16 bg-white rounded-lg p-6 border-2 border-amber-900/10 text-center">
            <p className="text-amber-800">Generating outfit suggestions...</p>
          </div>
        )}

        {aiError && !aiLoading && (
          <div className="mt-16 bg-white rounded-lg p-6 border-2 border-amber-900/10 text-center">
            <p className="text-red-600 text-sm">{aiError}</p>
          </div>
        )}

        {aiOutfit && !aiLoading && (
          <div className="mt-16 bg-white rounded-lg p-8 border-2 border-amber-900/10">
            <h3 className="font-semibold text-amber-900 text-2xl mb-4">
              Suggested outfit
            </h3>
            {aiOutfit.explanation && (
              <p className="text-amber-800 mb-6 italic">
                {aiOutfit.explanation}
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {aiOutfit.items?.map((item, index) => (
                <Link
                  key={`${item.productId}-${index}`}
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
                    <h4 className="font-semibold text-amber-900 truncate">
                      {item.name}
                    </h4>
                    <p className="text-amber-800">₹{item.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section Placeholder */}
        <div className="mt-16 bg-white rounded-lg p-8 border-2 border-amber-900/10">
          <h3 className="font-semibold text-amber-900 text-2xl mb-6">
            Customer Reviews
          </h3>
          <div className="text-center py-12 text-amber-700">
            Reviews section - connect to your backend API
          </div>
        </div>
      </div>
    </div>
  );
}
