import apiClient from "./apiAuth";

// === Token Price ===
export const getTokenPrice = async (currency = "EGP") => {
  try {
    const response = await apiClient.post("/tokens/token-price", { currency });
        console.log(`[200] Token price fetched:`, response.data);
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.message || "Failed to fetch token price";
    console.error("[ERROR] Token price:", error.response?.data || error.message);
    throw new Error(msg);
  }
};

// === Token Features ===
export const getTokenFeatures = async () => {
  try {
    const response = await apiClient.get("/tokens/features");
    console.log(`[200] Token features fetched:`, response.data);
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.message || "Failed to fetch token features";
    console.error("[ERROR] Token features:", error.response?.data || error.message);
    throw new Error(msg);
  }
};

export const getTokenFeatureById = async (id) => {
  try {
    const response = await apiClient.get(`/tokens/features/${id}`);
    console.log(`[200] Token feature [${id}] fetched:`, response.data);
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.message || `Failed to fetch token feature with ID ${id}`;
    console.error(`[ERROR] Token feature [${id}]:`, error.response?.data || error.message);
    throw new Error(msg);
  }
};

// === Token Packs ===
export const getTokenPacks = async () => {
  try {
    const response = await apiClient.get("/tokens/packs");
    console.log(`[200] Token packs fetched:`, response.data);
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.message || "Failed to fetch token packs";
    console.error("[ERROR] Token packs:", error.response?.data || error.message);
    throw new Error(msg);
  }
};

export const getTokenPackById = async (id) => {
  try {
    const response = await apiClient.get(`/tokens/packs/${id}`);
    console.log(`[200] Token pack [${id}] fetched:`, response.data);
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.message || `Failed to fetch token pack with ID ${id}`;
    console.error(`[ERROR] Token pack [${id}]:`, error.response?.data || error.message);
    throw new Error(msg);
  }
};

// === Token Purchase ===
export const buyTokens = async ({ amountPaid, currency }) => {
  try {
    console.log("Attempting to purchase tokens with amountPaid:", amountPaid, "and currency:", currency);
    const response = await apiClient.patch("/users/buy-tokens", { amountPaid, currency });
    console.log(`[200] Tokens purchased:`, response.data);
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.message || "Failed to purchase tokens";
    console.error("[ERROR] Buy tokens:", error.response?.data || error.message);
    throw new Error(msg);
  }
};

export const buyTokenPack = async (packId) => {
  try {
    const response = await apiClient.patch("/users/buy-token-pack", { packId });
    console.log(`[200] Token pack purchased:`, response.data);
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.message || "Failed to purchase token pack";
    console.error(`[ERROR] Buy token pack [${packId}]:`, error.response?.data || error.message);
    throw new Error(msg);
  }
};



