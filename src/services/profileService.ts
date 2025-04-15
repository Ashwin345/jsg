import axios from "axios";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  preferences?: {
    seatType?: string;
    mealPreference?: string;
    preferredAirlines?: string;
    preferredClass?: string;
  };
}

interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  preferences?: {
    seatType?: string;
    mealPreference?: string;
    preferredAirlines?: string;
    preferredClass?: string;
  };
}

const API_URL = "http://localhost:5000/api";

export const profileService = {
  getUserProfile: async (): Promise<UserProfile> => {
    try {
      // In a real implementation, this would call the backend API
      // For now, we'll return mock data based on localStorage
      const userStr = localStorage.getItem("user");
      let user = userStr ? JSON.parse(userStr) : null;

      if (!user) {
        throw new Error("User not found");
      }

      // Get additional profile data from localStorage if it exists
      const profileStr = localStorage.getItem("userProfile");
      const profile = profileStr ? JSON.parse(profileStr) : {};

      return {
        ...user,
        phone: profile.phone || "(555) 123-4567",
        address: profile.address || "123 Main St, New York, NY 10001",
        preferences: profile.preferences || {
          seatType: "Window",
          mealPreference: "Vegetarian",
          preferredAirlines: "JetBlue, Delta",
          preferredClass: "Economy",
        },
      };
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },

  updateProfile: async (data: UpdateProfileData): Promise<UserProfile> => {
    try {
      // In a real implementation, this would call the backend API
      // For now, we'll update the data in localStorage
      const userStr = localStorage.getItem("user");
      let user = userStr ? JSON.parse(userStr) : null;

      if (!user) {
        throw new Error("User not found");
      }

      // Get existing profile data
      const profileStr = localStorage.getItem("userProfile");
      const existingProfile = profileStr ? JSON.parse(profileStr) : {};

      // Update user data
      if (data.name) user.name = data.name;
      if (data.email) user.email = data.email;

      // Update profile data
      const updatedProfile = {
        ...existingProfile,
        phone: data.phone || existingProfile.phone,
        address: data.address || existingProfile.address,
        preferences: {
          ...existingProfile.preferences,
          ...data.preferences,
        },
      };

      // Save updated data to localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userProfile", JSON.stringify(updatedProfile));

      return {
        ...user,
        ...updatedProfile,
      };
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },
};
