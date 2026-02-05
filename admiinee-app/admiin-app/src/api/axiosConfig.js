import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api", // 🔁 backend base URL
  headers: {
    "Content-Type": "application/json",
  },
});

/* ===============================
   REQUEST INTERCEPTOR (OPTIONAL)
   =============================== */
API.interceptors.request.use(
  (config) => {
    // 🔐 if future-la token use pannina
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ===============================
   RESPONSE INTERCEPTOR (OPTIONAL)
   =============================== */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(
        "API Error:",
        error.response.status,
        error.response.data
      );

      // 🔒 auto logout if unauthorized
      if (error.response.status === 401) {
        localStorage.removeItem("adminToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default API;
