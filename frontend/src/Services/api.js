import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Your backend URL
});

// ✅ Interceptor to attach correct token based on saved role
api.interceptors.request.use((config) => {
  const role = sessionStorage.getItem("role");

  let token;
  if (role === "ceo") token = sessionStorage.getItem("ceo_token");
  else if (role === "client") token = sessionStorage.getItem("client_token");
  else if (role === "pm") token = sessionStorage.getItem("pm_token");
  else if (role === "employee") token = sessionStorage.getItem("employee_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
