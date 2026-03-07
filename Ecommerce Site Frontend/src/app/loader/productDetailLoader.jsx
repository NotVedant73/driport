import { getProductById } from "../pages/ProductService";

export async function productDetailLoader({ params }) {
  try {
    return await getProductById(params.id);
  } catch (error) {
    throw new Response(
      error.message || "Failed to fetch product. Please try again.",
      { status: error.status || 500 },
    );
  }
}

