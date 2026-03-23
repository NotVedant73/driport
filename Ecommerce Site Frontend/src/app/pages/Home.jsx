import { Link, useLoaderData } from "react-router-dom";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { ArrowRight, Star, Truck, RefreshCw, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllProducts } from "./ProductService";
import { BASE_URL } from "../../config";

export default function Home() {
  const featuredProducts = useLoaderData();
  // const [featuredProducts, setFeaturedProducts] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // useEffect(() => {
  //   fetchFeatured();
  // }, []);

  // const fetchFeatured = async () => {
  //   try {
  //     const data = await getAllProducts();
  //     //take first 3 products as featured
  //     setFeaturedProducts(data.slice(0, 4));
  //   } catch (error) {
  //     setError(
  //       error.response?.data?.message ||
  //         "Failed to fetch products. Please try again.",
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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

  // const featuredProducts = [
  //   {
  //     id: 1,
  //     name: 'Vintage Floral Dress',
  //     price: 89.99,
  //     image: 'https://images.unsplash.com/photo-1764684808666-ca5969aba565?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwZmFzaGlvbiUyMHdvbWFuJTIwZHJlc3N8ZW58MXx8fHwxNzcwNjQ5NzAxfDA&ixlib=rb-4.1.0&q=80&w=1080',
  //     category: 'Dresses'
  //   },
  //   {
  //     id: 2,
  //     name: 'Classic Leather Jacket',
  //     price: 159.99,
  //     image: 'https://images.unsplash.com/photo-1763922756509-a00702811d83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRybyUyMGphY2tldCUyMGxlYXRoZXIlMjB2aW50YWdlfGVufDF8fHx8MTc3MDY0OTcwMXww&ixlib=rb-4.1.0&q=80&w=1080',
  //     category: 'Jackets'
  //   },
  //   {
  //     id: 3,
  //     name: 'Retro Denim Jeans',
  //     price: 69.99,
  //     image: 'https://images.unsplash.com/photo-1758615590250-e26d339f322c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwZGVuaW0lMjBqZWFucyUyMGNsYXNzaWN8ZW58MXx8fHwxNzcwNjQ5NzAyfDA&ixlib=rb-4.1.0&q=80&w=1080',
  //     category: 'Bottoms'
  //   },
  //   {
  //     id: 4,
  //     name: 'Vintage Sunglasses',
  //     price: 45.99,
  //     image: 'https://images.unsplash.com/photo-1756725519458-6f99b485569e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwYWNjZXNzb3JpZXMlMjBzdW5nbGFzc2VzfGVufDF8fHx8MTc3MDY0OTcwMnww&ixlib=rb-4.1.0&q=80&w=1080',
  //     category: 'Accessories'
  //   }
  // ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-r from-amber-100 to-amber-50 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1666861585341-5bd1e7b1ed71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwc3RvcmUlMjBjbG90aGluZyUyMGJvdXRpcXVlfGVufDF8fHx8MTc3MDY0OTcwM3ww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Vintage Store"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-6xl font-serif text-amber-900 mb-6">
              Timeless Fashion,
              <br />
              Modern Style
            </h1>
            <p className="text-xl text-amber-800 mb-8">
              Discover curated vintage pieces that tell a story. Each garment is
              hand-selected for its quality and character.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-amber-900 text-amber-50 px-8 py-4 rounded hover:bg-amber-800 transition text-lg"
            >
              Shop Collection
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white border-y-2 border-amber-900/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-900 mb-4">
                <Truck size={24} />
              </div>
              <h3 className="font-semibold text-amber-900 mb-2">
                Free Shipping
              </h3>
              <p className="text-sm text-amber-800">On orders over ₹800</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-900 mb-4">
                <RefreshCw size={24} />
              </div>
              <h3 className="font-semibold text-amber-900 mb-2">
                Easy Returns
              </h3>
              <p className="text-sm text-amber-800">30-day return policy</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-900 mb-4">
                <Shield size={24} />
              </div>
              <h3 className="font-semibold text-amber-900 mb-2">
                Authentic Items
              </h3>
              <p className="text-sm text-amber-800">100% genuine vintage</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-900 mb-4">
                <Star size={24} />
              </div>
              <h3 className="font-semibold text-amber-900 mb-2">
                Quality Assured
              </h3>
              <p className="text-sm text-amber-800">Hand-picked with care</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-amber-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif text-amber-900 mb-4">
              Featured Pieces
            </h2>
            <p className="text-amber-800">Our most loved vintage finds</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-amber-900/10"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <ImageWithFallback
                    src={`${BASE_URL}${product.image}`}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <div className="text-xs text-amber-700 mb-1">
                    {product.category}
                  </div>
                  <h3 className="font-semibold text-amber-900 mb-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-serif text-amber-900">
                      ₹{product.price}
                    </span>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className="fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 border-2 border-amber-900 text-amber-900 px-8 py-3 rounded hover:bg-amber-900 hover:text-amber-50 transition"
            >
              View All Products
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Collections Banner */}
      <section className="py-20 bg-gradient-to-r from-amber-900 to-amber-800 text-amber-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-serif mb-4">New Collection Available</h2>
          <p className="text-xl text-amber-100 mb-8">
            Explore our latest arrivals from the golden age of fashion
          </p>
          <Link
            to="/collections"
            className="inline-flex items-center gap-2 bg-amber-50 text-amber-900 px-8 py-4 rounded hover:bg-white transition text-lg"
          >
            Browse Collections
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-serif text-amber-900 mb-6">
                Our Story
              </h2>
              <p className="text-amber-800 mb-4">
                Founded in 2015, Vintage Vogue has been dedicated to preserving
                the artistry and craftsmanship of fashion's most iconic eras. We
                believe that true style is timeless.
              </p>
              <p className="text-amber-800 mb-6">
                Each piece in our collection is carefully curated,
                authenticated, and restored to its original glory. We're not
                just selling clothes – we're sharing history.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-amber-900 font-semibold hover:text-amber-700 transition"
              >
                Read More About Us
                <ArrowRight size={18} />
              </Link>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1764627511567-af015c644c24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRybyUyMGZhc2hpb24lMjBtb2RlbCUyMHN0eWxlfGVufDF8fHx8MTc3MDY0OTcwM3ww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Our Story"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
