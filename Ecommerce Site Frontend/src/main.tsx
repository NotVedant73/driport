
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";
  import { RouterProvider } from "react-router-dom";
  import appRouter from "./app/router.jsx";
  import "react-toastify/dist/ReactToastify.css";
import { StrictMode } from "react";
import { ToastContainer, Bounce } from "react-toastify";
import { CartProvider } from "./app/context/CartContext.jsx";
import { AuthProvider } from "./app/context/AuthContext.jsx";
import AppCrashBoundary from "./app/components/AppCrashBoundary.jsx";

  // ✅ Get theme safely (client-side only)
  const getTheme = () => {
    if (typeof window === 'undefined') return 'light';
    try {
      return localStorage.getItem("theme") === "dark" ? "dark" : "light";
    } catch {
      return 'light';
    }
  };

  const rootElement = document.getElementById("root");

  if (!rootElement) {
    throw new Error("Root element '#root' was not found in index.html");
  }

  createRoot(rootElement).render(
    <StrictMode>
      <AppCrashBoundary>
        <AuthProvider>
          <CartProvider>
            <RouterProvider router={appRouter} />
            <ToastContainer
              position="top-center"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              draggable
              pauseOnHover
              theme={getTheme()}
              transition={Bounce}
            />
          </CartProvider>
        </AuthProvider>
      </AppCrashBoundary>
    </StrictMode>
  );
