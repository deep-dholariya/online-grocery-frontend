import axios from "axios";

// Create axios instance
const API = axios.create({
  baseURL: "https://grocery-store-backend-onat.onrender.com/api",
  withCredentials: true,
  timeout: 60000,
});

// Add token automatically in every request
API.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("deliveryBoyToken");

    // 🔥 Login & Register pe token attach mat karo
    if (
      token &&
      !config.url.includes("/users/login") &&
      !config.url.includes("/users/register")
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;

  },
  (error) => Promise.reject(error)
);

// Handle token expired automatically
API.interceptors.response.use(
  (response) => response,
  (error) => {

    if (error.response?.status === 401) {

      console.log("Token expired, logging out...");

      const deliveryToken = localStorage.getItem("deliveryBoyToken");

      localStorage.removeItem("token");
      localStorage.removeItem("deliveryBoyToken");

      if (deliveryToken) {
        window.location.href = "/delivery-login";
      } else {
        window.location.href = "/login";
      }

    }

    return Promise.reject(error);

  }
);

export default API;
