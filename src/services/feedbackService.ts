import axios from "axios";

interface FeedbackData {
  name: string;
  email: string;
  subject: string;
  message: string;
  rating: number;
}

const API_URL = "http://localhost:5000/api";

export const feedbackService = {
  submitFeedback: async (
    feedbackData: FeedbackData,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      // In a real implementation, this would call the backend API
      // For now, we'll simulate a successful submission
      console.log("Feedback submitted:", feedbackData);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        success: true,
        message: "Thank you for your feedback!",
      };
    } catch (error) {
      console.error("Feedback submission error:", error);
      throw error;
    }
  },
};
