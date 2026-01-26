import axios from "axios";

export const BASE_URL = "http://127.0.0.1:8000";

const API = axios.create({
  baseURL: `${BASE_URL}/api/`,
});

// ✅ Helper: convert "/media/..." → "http://127.0.0.1:8000/media/..."
export const fixImageUrl = (imgPath) => {
  if (!imgPath) return null;
  if (imgPath.startsWith("http")) return imgPath;
  return `${BASE_URL}${imgPath}`;
};

//================= Authentication =================//
export const registerUser = (data) => API.post("auth/register/", data);
export const loginUser = (data) => API.post("auth/login/", data);

//================= Products =================//
export const getProducts = (params) => API.get("products/", { params });
export const getProductDetails = (id) => API.get(`products/${id}/`);

//================= Reviews =================//
export const getProductReviews = (productId) =>
  API.get(`products/${productId}/reviews/`);

export const addProductReview = (productId, data) =>
  API.post(`products/${productId}/reviews/`, data);

//================= Cart =================//
export const getCart = (userId) => API.get(`cart/${userId}/`);
export const updateCartItem = (data) => API.put("cart/update/", data);
export const addToCart = (data) => API.post("cart/add/", data);
export const removeCartItem = (data) => API.delete("cart/remove/", { data });

//================= Orders =================//
export const checkoutOrder = (data) => API.post("orders/checkout/", data);
export const getUserOrders = (userId) => API.get(`orders/user/${userId}/`);

//================== Payment =================//
export const createPayment = (data) => API.post("payments/create/", data);
export const verifyPayment = (data) => API.post("payments/verify/", data);

//================== Compare + AI =================//
export const addToCompare = (data) => API.post("compare/add/", data);
export const getCompareList = (userId) => API.get(`compare/view/${userId}/`);
export const getAIRecommendation = (data) =>
  API.post("compare/recommend/", data);

//================== AI Chatbot =================//
export const chatWithAI = (data) => API.post("compare/chat/", data);

// ✅ alias so old imports still work
export const chatAI = chatWithAI;

export default API;
