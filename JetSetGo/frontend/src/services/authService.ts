import axios, { AxiosError } from "axios";

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role?: string;
  };
  token: string;
}

// Use relative URL for development, will be handled by proxy in production
const API_URL = "/api";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor to add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Add response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear local storage
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("user");
      localStorage.removeItem("userProfile");

      // Redirect to login page if not already there
      if (window.location.pathname !== "/auth") {
        window.location.href = "/auth";
      }
    }
    return Promise.reject(error);
  },
);

export const authService = {
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post("/auth/register", userData);

      // Store the token in localStorage
      localStorage.setItem("jwtToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },

  login: async (credentials: LoginData): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post("/auth/login", credentials);

      // Store the token in localStorage
      localStorage.setItem("jwtToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  logout: () => {
    // Remove the token from localStorage
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userProfile"); // Also clear profile data

    // Optional: Call logout endpoint to invalidate token on server
    apiClient.post("/auth/logout").catch((err) => {
      console.error("Logout error:", err);
      // Continue even if server logout fails
    });
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  isAuthenticated: () => {
    return localStorage.getItem("jwtToken") !== null;
  },

  // Get the API client with auth headers
  getApiClient: () => apiClient,
};
