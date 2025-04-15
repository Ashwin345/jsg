import axios from "axios";

interface FeedbackData {
  name: string;
  email: string;
  subject: string;
  message: string;
  rating: number;
}

const API_URL = "/api";

export const feedbackService = {
  submitFeedback: async (
    feedbackData: FeedbackData,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await axios.post(`${API_URL}/feedback`, feedbackData);
      return response.data;
    } catch (error) {
      console.error("Feedback submission error:", error);
      throw error;
    }
  },
};
