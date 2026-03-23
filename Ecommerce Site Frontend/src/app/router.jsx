import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Contact, { contactAction } from "./pages/Contact";
import { productsLoader } from "./loader/productsLoader";
import { homeLoader } from "./loader/homeLoader";
import { productDetailLoader } from "./loader/productDetailLoader";
import AdminLayout from "./admin/AdminLayout";
import AdminLogin from "./admin/AdminLogin";
import AdminGuard from "./admin/AdminGuard";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminProducts from "./admin/pages/AdminProducts";
import AdminCategories from "./admin/pages/AdminCategories";
import AdminOrders from "./admin/pages/AdminOrders";
import AdminCoupons from "./admin/pages/AdminCoupons";
import AiStylist from "./pages/AiStylist";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

const routeDefinitions = createRoutesFromElements(
  <Route path="/" element={<App />}>
    <Route index element={<Home />} loader={homeLoader} />
    <Route path="/shop" element={<Shop />} loader={productsLoader} />
    <Route path="/product/:id" element={<ProductDetail />} loader={productDetailLoader} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/checkout" element={
      <ProtectedRoute>
        <Checkout />
      </ProtectedRoute>
    } />
    <Route path="/ai-stylist" element={<AiStylist />} />
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contact />} action={contactAction} />
    <Route path="/collections" element={<Shop />} loader={productsLoader} />
    <Route path="/wishlist" element={<Cart />} />

    {/* Authentication Routes */}
    <Route path="/register" element={<Register />} />
    <Route path="/login" element={<Login />} />
    <Route path="/profile" element={
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    } />
    <Route path="/account" element={
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    } />

    <Route path="/admin/login" element={<AdminLogin />} />
    <Route
      path="/admin"
      element={
        <AdminGuard>
          <AdminLayout />
        </AdminGuard>
      }
    >
      <Route index element={<AdminDashboard />} />
      <Route path="/admin/products" element={<AdminProducts />} />
      <Route path="/admin/categories" element={<AdminCategories />} />
      <Route path="/admin/orders" element={<AdminOrders />} />
      <Route path="/admin/coupons" element={<AdminCoupons />} />
    </Route>
  </Route>,
);

const appRouter = createBrowserRouter(routeDefinitions);

export default appRouter;
