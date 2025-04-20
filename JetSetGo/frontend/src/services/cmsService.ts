import { authService } from "./authService";

interface ContentData {
  title: string;
  content: string;
  contentType: string;
  status?: string;
  slug?: string;
  featuredImage?: string;
  metaTitle?: string;
  metaDescription?: string;
}

interface Content extends ContentData {
  _id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy?: string;
}

interface PaginatedResponse {
  content: Content[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

const apiClient = authService.getApiClient();

export const cmsService = {
  // Public methods
  getPublicContent: async (params?: {
    contentType?: string;
    limit?: number;
    page?: number;
  }): Promise<PaginatedResponse> => {
    try {
      const response = await apiClient.get("/cms/content", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching content:", error);
      throw error;
    }
  },

  getContentBySlug: async (slug: string): Promise<Content> => {
    try {
      const response = await apiClient.get(`/cms/content/${slug}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching content with slug ${slug}:`, error);
      throw error;
    }
  },

  // Admin methods
  getAdminContent: async (params?: {
    contentType?: string;
    status?: string;
    limit?: number;
    page?: number;
  }): Promise<PaginatedResponse> => {
    try {
      const response = await apiClient.get("/cms/admin/content", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching admin content:", error);
      throw error;
    }
  },

  createContent: async (contentData: ContentData): Promise<Content> => {
    try {
      const response = await apiClient.post("/cms/admin/content", contentData);
      return response.data;
    } catch (error) {
      console.error("Error creating content:", error);
      throw error;
    }
  },

  updateContent: async (
    id: string,
    contentData: Partial<ContentData>,
  ): Promise<Content> => {
    try {
      const response = await apiClient.put(
        `/cms/admin/content/${id}`,
        contentData,
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating content with id ${id}:`, error);
      throw error;
    }
  },

  deleteContent: async (id: string): Promise<{ message: string }> => {
    try {
      const response = await apiClient.delete(`/cms/admin/content/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting content with id ${id}:`, error);
      throw error;
    }
  },
};
