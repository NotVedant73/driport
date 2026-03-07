import { getAllProducts } from "../pages/ProductService";

export async function homeLoader() {
  const products = await getAllProducts();
  return products.slice(0, 4);
}
