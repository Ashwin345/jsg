import axios from "axios";

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
  };
  token: string;
}

const API_URL = "/api";

export const authService = {
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);

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
      const response = await axios.post(`${API_URL}/auth/login`, credentials);

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
};
