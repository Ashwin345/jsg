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

const API_URL = "http://localhost:5000/api";

export const authService = {
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      // In a real implementation, this would call the backend API
      // For now, we'll simulate a successful registration
      const mockResponse: AuthResponse = {
        user: {
          id: `user_${Math.random().toString(36).substr(2, 9)}`,
          name: userData.name,
          email: userData.email,
        },
        token: `mock_token_${Math.random().toString(36).substr(2, 9)}`,
      };

      // Store the token in localStorage
      localStorage.setItem("jwtToken", mockResponse.token);
      localStorage.setItem("user", JSON.stringify(mockResponse.user));

      return mockResponse;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },

  login: async (credentials: LoginData): Promise<AuthResponse> => {
    try {
      // In a real implementation, this would call the backend API
      // For now, we'll simulate a successful login
      const mockResponse: AuthResponse = {
        user: {
          id: `user_${Math.random().toString(36).substr(2, 9)}`,
          name: credentials.email.split("@")[0],
          email: credentials.email,
        },
        token: `mock_token_${Math.random().toString(36).substr(2, 9)}`,
      };

      // Store the token in localStorage
      localStorage.setItem("jwtToken", mockResponse.token);
      localStorage.setItem("user", JSON.stringify(mockResponse.user));

      return mockResponse;
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
