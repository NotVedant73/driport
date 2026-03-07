import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Heart, User, Menu, X, Search } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-amber-50 border-b-2 border-amber-900/20 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-2 text-sm border-b border-amber-900/10">
          <div className="text-amber-900">
            Free shipping on orders over $100
          </div>
          <div className="flex gap-4 text-amber-900">
            <a href="#" className="hover:text-amber-700">
              Track Order
            </a>
            <a href="#" className="hover:text-amber-700">
              Help
            </a>
          </div>
        </div>

        {/* Main Nav */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="text-3xl font-serif text-amber-900">
            DriPort
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-amber-900 hover:text-amber-700 transition"
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="text-amber-900 hover:text-amber-700 transition"
            >
              Shop
            </Link>
            <Link
              to="/collections"
              className="text-amber-900 hover:text-amber-700 transition"
            >
              Collections
            </Link>
            <Link
              to="/ai-stylist"
              className="text-amber-900 hover:text-amber-700 transition"
            >
              AI Stylist
            </Link>
            <Link
              to="/about"
              className="text-amber-900 hover:text-amber-700 transition"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-amber-900 hover:text-amber-700 transition"
            >
              Contact
            </Link>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <button className="text-amber-900 hover:text-amber-700 hidden md:block">
              <Search size={20} />
            </button>
            <Link
              to="/wishlist"
              className="text-amber-900 hover:text-amber-700 relative hidden md:block"
            >
              <Heart size={20} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </Link>
            <Link
              to="/account"
              className="text-amber-900 hover:text-amber-700 hidden md:block"
            >
              <User size={20} />
            </Link>
            <Link
              to="/cart"
              className="text-amber-900 hover:text-amber-700 relative"
            >
              <ShoppingBag size={20} />
              <span className="absolute -top-2 -right-2 bg-amber-900 text-amber-50 text-xs rounded-full w-4 h-4 flex items-center justify-center">
                5
              </span>
            </Link>
            <button
              className="md:hidden text-amber-900"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-amber-900/10">
            <div className="flex flex-col gap-4 pt-4">
              <Link to="/" className="text-amber-900 hover:text-amber-700">
                Home
              </Link>
              <Link to="/shop" className="text-amber-900 hover:text-amber-700">
                Shop
              </Link>
              <Link
                to="/collections"
                className="text-amber-900 hover:text-amber-700"
              >
                Collections
              </Link>
              <Link
                to="/ai-stylist"
                className="text-amber-900 hover:text-amber-700"
              >
                AI Stylist
              </Link>
              <Link to="/about" className="text-amber-900 hover:text-amber-700">
                About
              </Link>
              <Link
                to="/contact"
                className="text-amber-900 hover:text-amber-700"
              >
                Contact
              </Link>
              <Link
                to="/wishlist"
                className="text-amber-900 hover:text-amber-700"
              >
                Wishlist
              </Link>
              <Link
                to="/account"
                className="text-amber-900 hover:text-amber-700"
              >
                Account
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
