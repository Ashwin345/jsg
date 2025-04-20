import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cmsService } from "@/services/cmsService";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ContentEditor from "@/components/cms/ContentEditor";

interface Content {
  _id: string;
  title: string;
  slug: string;
  contentType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const AdminCmsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Check if user is admin or editor
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    if (user?.role !== "admin" && user?.role !== "editor") {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch content
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const params: { contentType?: string } = {};

        if (activeTab !== "all") {
          params.contentType = activeTab;
        }

        const response = await cmsService.getAdminContent(params);
        setContents(response.content);
        setError(null);
      } catch (err) {
        console.error("Error fetching content:", err);
        setError("Failed to load content. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [activeTab]);

  const handleRefresh = () => {
    setLoading(true);
    const fetchContent = async () => {
      try {
        const params: { contentType?: string } = {};

        if (activeTab !== "all") {
          params.contentType = activeTab;
        }

        const response = await cmsService.getAdminContent(params);
        setContents(response.content);
        setError(null);
      } catch (err) {
        console.error("Error fetching content:", err);
        setError("Failed to load content. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this content?")) {
      try {
        await cmsService.deleteContent(id);
        setContents(contents.filter((content) => content._id !== id));
      } catch (err) {
        console.error("Error deleting content:", err);
        alert("Failed to delete content. Please try again.");
      }
    }
  };

  const handleEditClick = (content: Content) => {
    setSelectedContent(content);
    setIsEditDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Content Management</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create New Content</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Create New Content</DialogTitle>
            </DialogHeader>
            <ContentEditor
              onSuccess={() => {
                setIsCreateDialogOpen(false);
                handleRefresh();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Content</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="terms">Terms</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00256c] mx-auto"></div>
              <p className="mt-4">Loading content...</p>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-8">{error}</div>
          ) : contents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No content found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-left">Title</th>
                    <th className="py-2 px-4 border-b text-left">Type</th>
                    <th className="py-2 px-4 border-b text-left">Status</th>
                    <th className="py-2 px-4 border-b text-left">
                      Last Updated
                    </th>
                    <th className="py-2 px-4 border-b text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contents.map((content) => (
                    <tr key={content._id}>
                      <td className="py-2 px-4 border-b">{content.title}</td>
                      <td className="py-2 px-4 border-b capitalize">
                        {content.contentType}
                      </td>
                      <td className="py-2 px-4 border-b">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(
                            content.status,
                          )}`}
                        >
                          {content.status}
                        </span>
                      </td>
                      <td className="py-2 px-4 border-b">
                        {formatDate(content.updatedAt)}
                      </td>
                      <td className="py-2 px-4 border-b">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClick(content)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(content._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Edit Content</DialogTitle>
          </DialogHeader>
          {selectedContent && (
            <ContentEditor
              contentId={selectedContent._id}
              initialData={{
                title: selectedContent.title,
                slug: selectedContent.slug,
                contentType: selectedContent.contentType,
                status: selectedContent.status,
              }}
              onSuccess={() => {
                setIsEditDialogOpen(false);
                handleRefresh();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCmsPage;
