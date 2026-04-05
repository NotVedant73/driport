import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Star, Heart, SlidersHorizontal } from "lucide-react";
import { searchProducts } from "./ProductService";
import { resolveImageUrl } from "../utils/resolveImageUrl";

export default function Shop() {
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSort, setSelectedSort] = useState("ratingDesc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [maxPrice, setMaxPrice] = useState(5000);
  const [products, setProducts] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const ITEMS_PER_PAGE = 20;
  const CATEGORIES = [
    "Jerseys",
    "Jeans",
    "Jackets",
    "Cargos",
    "Tracks",
    "Pants",
    "Sweatshirts",
    "Tshirts",
    "Shirts",
    "Jorts",
  ];

  //const [loading, setLoading] = useState(true);

  //const [error, setError] = useState(null);

  const sortList = [
    { label: "Price : low to high", value: "priceAsc" },
    { label: "Price : high to low", value: "priceDesc" },
    { label: "Rating", value: "ratingDesc" },
    { label: "Newest", value: "newest" },
  ];

  useEffect(() => {
    const searchQuery = searchParams.get("q") || "";
    const categoryQuery =
      searchParams.get("categories") || searchParams.get("category") || "";
    const sortQuery = searchParams.get("sort") || "";

    if (searchQuery !== searchTerm) {
      setSearchTerm(searchQuery);
    }

    if (categoryQuery) {
      const parsed = categoryQuery
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);

      const normalized = CATEGORIES.filter((cat) =>
        parsed.some((value) => value.toLowerCase() === cat.toLowerCase()),
      );
      setSelectedCategories(normalized);
    } else {
      setSelectedCategories([]);
    }

    if (sortQuery && sortList.some((s) => s.value === sortQuery)) {
      setSelectedSort(sortQuery);
    }

    setCurrentPage(1);
  }, [searchParams]);

  // useEffect(() => {
  //   fetchProducts();
  // }, []);

  // const fetchProducts = async () => {
  //   try {
  //     setLoading(true);
  //     const data = await getAllProducts();
  //     setProducts(data);
  //   } catch (error) {
  //     setError(
  //       error.response?.data?.message ||
  //         "Failed to fetch products. Please try again.",
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await searchProducts({
          q: searchTerm || undefined,
          categories: selectedCategories.length
            ? selectedCategories.join(",")
            : undefined,
          minPrice: 0,
          maxPrice,
          sort: selectedSort,
          page: currentPage - 1,
          size: ITEMS_PER_PAGE,
        });

        if (!isMounted) return;
        setProducts(data.content || []);
        setTotalElements(data.totalElements || 0);
        setTotalPages(Math.max(data.totalPages || 1, 1));
      } catch (error) {
        if (isMounted) {
          setProducts([]);
          setTotalElements(0);
          setTotalPages(1);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [searchTerm, selectedCategories, maxPrice, selectedSort, currentPage]);

  const rangeStart = useMemo(() => {
    if (totalElements === 0) return 0;
    return (currentPage - 1) * ITEMS_PER_PAGE + 1;
  }, [currentPage, totalElements]);

  const rangeEnd = useMemo(() => {
    if (totalElements === 0) return 0;
    return Math.min(currentPage * ITEMS_PER_PAGE, totalElements);
  }, [currentPage, totalElements]);

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <span className="text-xl font-semibold">Loading products...</span>
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <span className="text-xl text-red-500">Error: {error}</span>
  //     </div>
  //   );
  // }

  // Mock products data - replace with API call later
  // const products = [
  //   {
  //     id: 1,
  //     name: "Vintage Floral Dress",
  //     price: 89.99,
  //     oldPrice: 129.99,
  //     image:
  //       "https://images.unsplash.com/photo-1764684808666-ca5969aba565?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwZmFzaGlvbiUyMHdvbWFuJTIwZHJlc3N8ZW58MXx8fHwxNzcwNjQ5NzAxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  //     category: "Dresses",
  //     rating: 5,
  //     isNew: true,
  //   },
  //   {
  //     id: 2,
  //     name: "Classic Leather Jacket",
  //     price: 159.99,
  //     image:
  //       "https://images.unsplash.com/photo-1763922756509-a00702811d83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRybyUyMGphY2tldCUyMGxlYXRoZXIlMjB2aW50YWdlfGVufDF8fHx8MTc3MDY0OTcwMXww&ixlib=rb-4.1.0&q=80&w=1080",
  //     category: "Jackets",
  //     rating: 4,
  //   },
  //   {
  //     id: 3,
  //     name: "Retro Denim Jeans",
  //     price: 69.99,
  //     image:
  //       "https://images.unsplash.com/photo-1758615590250-e26d339f322c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwZGVuaW0lMjBqZWFucyUyMGNsYXNzaWN8ZW58MXx8fHwxNzcwNjQ5NzAyfDA&ixlib=rb-4.1.0&q=80&w=1080",
  //     category: "Bottoms",
  //     rating: 5,
  //   },
  //   {
  //     id: 4,
  //     name: "Vintage Sunglasses",
  //     price: 45.99,
  //     image:
  //       "https://images.unsplash.com/photo-1756725519458-6f99b485569e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwYWNjZXNzb3JpZXMlMjBzdW5nbGFzc2VzfGVufDF8fHx8MTc3MDY0OTcwMnww&ixlib=rb-4.1.0&q=80&w=1080",
  //     category: "Accessories",
  //     rating: 4,
  //     isNew: true,
  //   },
  //   {
  //     id: 5,
  //     name: "Retro Pattern Shirt",
  //     price: 54.99,
  //     oldPrice: 79.99,
  //     image:
  //       "https://images.unsplash.com/photo-1769467304499-8f2e56c88ec7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRybyUyMHNoaXJ0JTIwcGF0dGVybiUyMHZpbnRhZ2V8ZW58MXx8fHwxNzcwNjQ5NzAyfDA&ixlib=rb-4.1.0&q=80&w=1080",
  //     category: "Tops",
  //     rating: 5,
  //   },
  //   {
  //     id: 6,
  //     name: "Classic Wool Coat",
  //     price: 189.99,
  //     image:
  //       "https://images.unsplash.com/photo-1649937408746-4d2f603f91c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwY29hdCUyMHdvb2wlMjBjbGFzc2ljfGVufDF8fHx8MTc3MDY0OTcwM3ww&ixlib=rb-4.1.0&q=80&w=1080",
  //     category: "Outerwear",
  //     rating: 5,
  //   },
  //   {
  //     id: 7,
  //     name: "Vintage Boho Dress",
  //     price: 94.99,
  //     image:
  //       "https://images.unsplash.com/photo-1764684808666-ca5969aba565?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwZmFzaGlvbiUyMHdvbWFuJTIwZHJlc3N8ZW58MXx8fHwxNzcwNjQ5NzAxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  //     category: "Dresses",
  //     rating: 4,
  //   },
  //   {
  //     id: 8,
  //     name: "Classic Leather Boots",
  //     price: 129.99,
  //     oldPrice: 169.99,
  //     image:
  //       "https://images.unsplash.com/photo-1758615590250-e26d339f322c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwZGVuaW0lMjBqZWFucyUyMGNsYXNzaWN8ZW58MXx8fHwxNzcwNjQ5NzAyfDA&ixlib=rb-4.1.0&q=80&w=1080",
  //     category: "Shoes",
  //     rating: 5,
  //     isNew: true,
  //   },
  // ];

  return (
    <div className="bg-[#f5f0e8] min-h-screen">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#f0e7d8] to-[#f7f1e8] py-16 border-b-2 border-stone-300">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-serif text-stone-900 mb-4">
            Shop Vintage
          </h1>
          <p className="text-stone-600 text-lg">
            Discover timeless pieces from past decades
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar Filters */}
          <aside
            className={`${showFilters ? "block" : "hidden"} lg:block w-full lg:w-64 space-y-6`}
          >
            {/* Categories */}
            <div className="bg-white p-6 rounded-lg border-2 border-stone-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-stone-900">Categories</h3>
                {selectedCategories.length > 0 && (
                  <button
                    onClick={() => {
                      setSelectedCategories([]);
                      setCurrentPage(1);
                    }}
                    className="text-xs text-stone-500 hover:text-stone-900 underline"
                  >
                    Clear
                  </button>
                )}
              </div>
              <ul className="space-y-2">
                {CATEGORIES.map((cat) => (
                  <li key={cat}>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded text-stone-900"
                        checked={selectedCategories.includes(cat)}
                        onChange={(e) => {
                          setCurrentPage(1);
                          setSelectedCategories((prev) =>
                            e.target.checked
                              ? [...prev, cat]
                              : prev.filter((c) => c !== cat),
                          );
                        }}
                      />
                      <span className="text-stone-600">{cat}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Range */}
            <div className="bg-white p-6 rounded-lg border-2 border-stone-200">
              <h3 className="font-semibold text-stone-900 mb-4">Price Range</h3>
              <input
                type="range"
                min="0"
                max="5000"
                step="50"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-full accent-amber-900"
              />
              <div className="flex justify-between text-sm text-stone-600 mt-2">
                <span>₹0</span>
                <span className="font-semibold text-stone-900">
                  ≤ ₹{maxPrice.toLocaleString()}
                </span>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-3 sm:gap-4">
              <div className="text-stone-600 text-sm sm:text-base">
                Showing{" "}
                <span className="font-semibold">
                  {rangeStart}–{rangeEnd}
                </span>{" "}
                of <span className="font-semibold">{totalElements}</span>{" "}
                products
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search products..."
                  className="w-full sm:w-64 px-3 py-2 border-2 border-stone-300 rounded bg-white text-stone-900"
                />
                <button
                  className="lg:hidden w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 border-2 border-amber-900 text-stone-900 rounded hover:bg-stone-100 transition"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal size={18} />
                  Filters
                </button>
                <select
                  className="w-full sm:w-auto px-4 py-2 border-2 border-stone-300 rounded bg-white text-stone-900"
                  value={selectedSort}
                  onChange={(e) => {
                    setSelectedSort(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  {sortList.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products */}
            {loading && (
              <div className="text-center text-stone-900 py-10 font-semibold">
                Loading products...
              </div>
            )}

            {!loading && products.length === 0 && (
              <div className="text-center text-stone-900 py-10 font-semibold">
                No products found for selected filters.
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-stone-200"
                >
                  <Link
                    to={`/product/${product.id}`}
                    className="block relative"
                  >
                    <div className="aspect-[3/4] overflow-hidden relative">
                      <ImageWithFallback
                        src={resolveImageUrl(product.image)}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* {product.isNew && (
                        <span className="absolute top-2 left-2 bg-stone-900 text-white text-xs px-3 py-1 rounded">
                          NEW
                        </span>
                      )}
                      {product.oldPrice && (
                        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-3 py-1 rounded">
                          SALE
                        </span>
                      )} */}
                    </div>
                    <div className="p-4">
                      <div className="text-xs text-stone-500 mb-1">
                        {product.category}
                      </div>
                      <h3 className="font-semibold text-stone-900 mb-2">
                        {product.name}
                      </h3>
                      <div className="flex gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={
                              i < product.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-serif text-stone-900">
                            ₹{product.price}
                          </span>
                          {product.price && (
                            <span className="text-sm text-gray-400 line-through ml-2">
                              ₹{product.price}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                  <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-2 rounded-full hover:bg-white">
                    <Heart size={18} className="text-stone-900" />
                  </button>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-12 flex-wrap">
                <button
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage((p) => p - 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="px-4 py-2 border-2 border-stone-300 text-stone-900 rounded hover:bg-stone-100 hover:text-amber-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => {
                        setCurrentPage(page);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className={`px-4 py-2 rounded transition ${
                        currentPage === page
                          ? "bg-stone-900 text-white"
                          : "border-2 border-stone-300 text-stone-900 hover:bg-stone-100 hover:text-amber-50"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage((p) => p + 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="px-4 py-2 border-2 border-stone-300 text-stone-900 rounded hover:bg-stone-100 hover:text-amber-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
