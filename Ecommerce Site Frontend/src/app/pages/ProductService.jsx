import apiClient from "../../api/apiClient";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableNetworkError = (error) => {
  return (
    !error?.response ||
    error?.code === "ERR_NETWORK" ||
    error?.code === "ECONNABORTED"
  );
};

async function getWithRetry(path, options = {}) {
  const maxAttempts = 2;
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await apiClient.get(path, options);
      return response.data;
    } catch (error) {
      lastError = error;
      if (!isRetryableNetworkError(error) || attempt === maxAttempts) {
        break;
      }
      // Give the backend a short grace period to wake up.
      await delay(2000);
    }
  }

  throw lastError;
}

export const getAllProducts = async () => {
  return getWithRetry("/products");
};

export const getProductById = async (id) => {
  return getWithRetry(`/products/${id}`);
};

export const searchProducts = async (params = {}) => {
  return getWithRetry("/products/search", { params });
};
