import { useEffect, useMemo, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Star, Heart, SlidersHorizontal } from "lucide-react";
import apiClient from "../../api/apiClient";
import { getAllProducts } from "./ProductService";

export default function Shop() {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSort, setSelectedSort] = useState("ratingDesc");
  //const [products, setProducts] = useState([]);

  //const [loading, setLoading] = useState(true);

  //const [error, setError] = useState(null);

  const products = useLoaderData();

  const sortList = [
    { label: "Price : low to high", value: "priceAsc" },
    { label: "Price : high to low", value: "priceDesc" },
    { label: "Rating", value: "ratingDesc" },
  ];

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

  const sortedProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];

    return [...products].sort((a, b) => {
      switch (selectedSort) {
        case "priceAsc":
          return a.price - b.price;

        case "priceDesc":
          return b.price - a.price;

        case "ratingDesc":
          return b.rating - a.rating;

        default:
          return 0;
      }
    });
  }, [products, selectedSort]);

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
    <div className="bg-amber-50/30 min-h-screen">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-amber-100 to-amber-50 py-16 border-b-2 border-amber-900/20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-serif text-amber-900 mb-4">
            Shop Vintage
          </h1>
          <p className="text-amber-800 text-lg">
            Discover timeless pieces from past decades
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside
            className={`${showFilters ? "block" : "hidden"} lg:block w-full lg:w-64 space-y-6`}
          >
            <div className="bg-white p-6 rounded-lg border-2 border-amber-900/10">
              <h3 className="font-semibold text-amber-900 mb-4">Categories</h3>
              <ul className="space-y-2">
                <li>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded text-amber-900" />
                    <span className="text-amber-800">All Items</span>
                  </label>
                </li>
                <li>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded text-amber-900" />
                    <span className="text-amber-800">Dresses</span>
                  </label>
                </li>
                <li>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded text-amber-900" />
                    <span className="text-amber-800">Jackets</span>
                  </label>
                </li>
                <li>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded text-amber-900" />
                    <span className="text-amber-800">Accessories</span>
                  </label>
                </li>
                <li>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded text-amber-900" />
                    <span className="text-amber-800">Shoes</span>
                  </label>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg border-2 border-amber-900/10">
              <h3 className="font-semibold text-amber-900 mb-4">Price Range</h3>
              <input type="range" min="0" max="500" className="w-full" />
              <div className="flex justify-between text-sm text-amber-800 mt-2">
                <span>$0</span>
                <span>$500</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border-2 border-amber-900/10">
              <h3 className="font-semibold text-amber-900 mb-4">Era</h3>
              <ul className="space-y-2">
                <li>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded text-amber-900" />
                    <span className="text-amber-800">1950s</span>
                  </label>
                </li>
                <li>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded text-amber-900" />
                    <span className="text-amber-800">1960s</span>
                  </label>
                </li>
                <li>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded text-amber-900" />
                    <span className="text-amber-800">1970s</span>
                  </label>
                </li>
                <li>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded text-amber-900" />
                    <span className="text-amber-800">1980s</span>
                  </label>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg border-2 border-amber-900/10">
              <h3 className="font-semibold text-amber-900 mb-4">Size</h3>
              <div className="grid grid-cols-3 gap-2">
                {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                  <button
                    key={size}
                    className="border-2 border-amber-900/20 text-amber-800 py-2 rounded hover:bg-amber-900 hover:text-amber-50 transition"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-8">
              <div className="text-amber-800">
                Showing <span className="font-semibold">{products.length}</span>{" "}
                products
              </div>
              <div className="flex items-center gap-4">
                <button
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border-2 border-amber-900 text-amber-900 rounded hover:bg-amber-900 hover:text-amber-50 transition"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal size={18} />
                  Filters
                </button>
                <select
                  className="px-4 py-2 border-2 border-amber-900/20 rounded bg-white text-amber-900"
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-amber-900/10"
                >
                  <Link
                    to={`/product/${product.id}`}
                    className="block relative"
                  >
                    <div className="aspect-[3/4] overflow-hidden relative">
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* {product.isNew && (
                        <span className="absolute top-2 left-2 bg-amber-900 text-amber-50 text-xs px-3 py-1 rounded">
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
                      <div className="text-xs text-amber-700 mb-1">
                        {product.category}
                      </div>
                      <h3 className="font-semibold text-amber-900 mb-2">
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
                          <span className="text-lg font-serif text-amber-900">
                            ${product.price}
                          </span>
                          {product.price && (
                            <span className="text-sm text-gray-400 line-through ml-2">
                              ${product.price}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                  <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-2 rounded-full hover:bg-white">
                    <Heart size={18} className="text-amber-900" />
                  </button>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-12">
              <button className="px-4 py-2 border-2 border-amber-900/20 text-amber-900 rounded hover:bg-amber-900 hover:text-amber-50 transition">
                Previous
              </button>
              <button className="px-4 py-2 bg-amber-900 text-amber-50 rounded">
                1
              </button>
              <button className="px-4 py-2 border-2 border-amber-900/20 text-amber-900 rounded hover:bg-amber-900 hover:text-amber-50 transition">
                2
              </button>
              <button className="px-4 py-2 border-2 border-amber-900/20 text-amber-900 rounded hover:bg-amber-900 hover:text-amber-50 transition">
                3
              </button>
              <button className="px-4 py-2 border-2 border-amber-900/20 text-amber-900 rounded hover:bg-amber-900 hover:text-amber-50 transition">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
