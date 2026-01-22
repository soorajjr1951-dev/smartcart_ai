import axios from "axios";

const API = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
});

//================= Authentication =================//
export const registerUser = (data) =>
    API.post("auth/register/", data);

export const loginUser = (data) =>
    API.post("auth/login/", data);

//================= Products =================//
export const getProducts = (params) =>
    API.get("products/", { params });

export const getProductDetails = (id) =>
    API.get(`products/${id}/`);

//================= Cart =================//
export const getCart = (userId) =>
    API.get(`cart/${userId}/`);

export const addToCart = (data) =>
    API.post("cart/add/", data);

export const removeCartItem = (data) =>
    API.delete("cart/remove/", { data });

//================= Orders =================//
export const checkoutOrder = (data) =>
    API.post("orders/checkout/", data);

export const getOrderHistory = (userId) =>
    API.get(`orders/history/${userId}/`);

//================== Payment =================//
export const createPayment = (data) =>
    API.post("payments/create/", data);

export const verifyPayment = (data) =>
    API.post("payments/verify/", data);

//================== Compare + AI =================//
export const addToCompare = (data) =>
    API.post("compare/add/", data);

export const getCompareList = (userId) =>
    API.get(`compare/view/${userId}/`);

export const getAIRecommendation = (data) =>
    API.post("compare/recommend/", data);