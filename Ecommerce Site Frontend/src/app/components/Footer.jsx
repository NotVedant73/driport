import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-amber-900 text-amber-50 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-serif mb-4">Vintage Vogue</h3>
            <p className="text-amber-100 text-sm">
              Curating timeless fashion pieces from bygone eras. Each item tells a unique story.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="hover:text-amber-300 transition">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-amber-300 transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-amber-300 transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-amber-300 transition">
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-amber-100">
              <li><Link to="/shop" className="hover:text-amber-300 transition">All Products</Link></li>
              <li><Link to="/shop/dresses" className="hover:text-amber-300 transition">Dresses</Link></li>
              <li><Link to="/shop/jackets" className="hover:text-amber-300 transition">Jackets</Link></li>
              <li><Link to="/shop/accessories" className="hover:text-amber-300 transition">Accessories</Link></li>
              <li><Link to="/shop/sale" className="hover:text-amber-300 transition">Sale</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm text-amber-100">
              <li><Link to="/contact" className="hover:text-amber-300 transition">Contact Us</Link></li>
              <li><Link to="/shipping" className="hover:text-amber-300 transition">Shipping Info</Link></li>
              <li><Link to="/returns" className="hover:text-amber-300 transition">Returns</Link></li>
              <li><Link to="/faq" className="hover:text-amber-300 transition">FAQ</Link></li>
              <li><Link to="/size-guide" className="hover:text-amber-300 transition">Size Guide</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-sm text-amber-100 mb-4">
              Subscribe to get special offers and updates
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
          </div>
        </div>

        <div className="border-t border-amber-800 mt-8 pt-8 text-center text-sm text-amber-100">
          <p>&copy; 2026 Vintage Vogue. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
