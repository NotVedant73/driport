import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Mail } from "lucide-react";
import { STORE_CONFIG } from "../../config";

export default function Footer() {
  return (
    <footer className="bg-amber-900 text-amber-50 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-serif mb-4">
              {STORE_CONFIG.brandName}
            </h3>
            <p className="text-amber-100 text-sm">
              Curating trend-led and store-selected pieces. Fresh drops, styled
              collections, and creator-led looks.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href={STORE_CONFIG.instagram.profileUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-amber-300 transition"
              >
                <Instagram size={20} />
              </a>
              <a
                href={STORE_CONFIG.instagram.profileUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-amber-300 transition"
              >
                <Facebook size={20} />
              </a>
              <a
                href={STORE_CONFIG.instagram.profileUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-amber-300 transition"
              >
                <Twitter size={20} />
              </a>
              <a
                href={`mailto:${STORE_CONFIG.supportEmail}`}
                className="hover:text-amber-300 transition"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-amber-100">
              <li>
                <Link to="/shop" className="hover:text-amber-300 transition">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-amber-300 transition">
                  Trending
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-amber-300 transition">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  to="/ai-stylist"
                  className="hover:text-amber-300 transition"
                >
                  AI Styled Looks
                </Link>
              </li>
              <li>
                <Link
                  to="/collections"
                  className="hover:text-amber-300 transition"
                >
                  Collections
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm text-amber-100">
              <li>
                <Link to="/contact" className="hover:text-amber-300 transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-amber-300 transition">
                  Track Orders
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-amber-300 transition">
                  About Store
                </Link>
              </li>
              <li>
                <Link
                  to="/ai-stylist"
                  className="hover:text-amber-300 transition"
                >
                  Style Assistant
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-amber-300 transition">
                  Account Access
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-sm text-amber-100 mb-4">
              Subscribe to get special offers, new drops, and reel highlights
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="px-3 py-2 rounded bg-amber-800 text-amber-50 placeholder-amber-300 border border-amber-700 focus:outline-none focus:border-amber-500 flex-1"
              />
              <button className="px-4 py-2 bg-amber-50 text-amber-900 rounded hover:bg-amber-100 transition">
                Subscribe
              </button>
            </div>
            <p className="text-xs text-amber-200 mt-2">
              Newsletter API integration coming in next sprint.
            </p>
          </div>
        </div>

        <div className="border-t border-amber-800 mt-8 pt-8 text-center text-sm text-amber-100">
          <p>&copy; 2026 {STORE_CONFIG.brandName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
