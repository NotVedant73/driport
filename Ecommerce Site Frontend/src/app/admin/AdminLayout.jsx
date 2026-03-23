import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function NavItem({ to, label }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`block px-4 py-3 rounded border-2 transition ${
        isActive
          ? "bg-amber-900 text-amber-50 border-amber-900"
          : "bg-white text-amber-900 border-amber-900/10 hover:border-amber-900/30"
      }`}
    >
      {label}
    </Link>
  );
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const { logout: authLogout } = useAuth();

  const handleLogout = () => {
    authLogout();
    navigate("/admin/login");
  };

  return (
    <div className="bg-amber-50/30 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-serif text-amber-900">Admin Panel</h1>
            <p className="text-amber-800">
              Manage products, orders and promotions
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-5 py-2 border-2 border-amber-900 text-amber-900 rounded hover:bg-amber-900 hover:text-amber-50 transition"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1 space-y-3">
            <NavItem to="/admin" label="Dashboard" />
            <NavItem to="/admin/products" label="Products" />
            <NavItem to="/admin/categories" label="Categories" />
            <NavItem to="/admin/orders" label="Orders" />
            <NavItem to="/admin/coupons" label="Coupons" />
          </aside>

          <section className="lg:col-span-3">
            <Outlet />
          </section>
        </div>
      </div>
    </div>
  );
}
