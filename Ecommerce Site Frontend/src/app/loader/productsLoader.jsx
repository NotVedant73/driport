import { getAllProducts } from "../pages/ProductService";

export async function productsLoader() {
  try {
    return await getAllProducts();
  } catch (error) {
    throw new Response(
      error.message || "Failed to fetch products. Please try again.",
      { status: error.status || 500 },
    );
  }
}
