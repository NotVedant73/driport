
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";
  import { Router, RouterProvider } from "react-router-dom";
  import appRouter from "./app/router.jsx";
  import "react-toastify/dist/ReactToastify.css";
import { StrictMode } from "react";
import { ToastContainer, Bounce } from "react-toastify";
import { CartProvider } from "./app/context/CartContext.jsx";
  
  


  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <CartProvider>
        <RouterProvider router={appRouter}/>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          draggable
          pauseOnHover
          theme={localStorage.getItem("theme") === "dark" ? "dark" : "light"}
          transition={Bounce}
        />
      </CartProvider>
    </StrictMode>
  );
  