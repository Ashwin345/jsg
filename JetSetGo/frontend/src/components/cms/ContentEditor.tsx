import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { cmsService } from "@/services/cmsService";
import { useToast } from "@/components/ui/use-toast";

interface ContentFormData {
  title: string;
  content: string;
  contentType: string;
  status: string;
  slug?: string;
  featuredImage?: string;
  metaTitle?: string;
  metaDescription?: string;
}

interface ContentEditorProps {
  contentId?: string;
  initialData?: Partial<ContentFormData>;
  onSuccess?: () => void;
}

const ContentEditor: React.FC<ContentEditorProps> = ({
  contentId,
  initialData = {},
  onSuccess,
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ContentFormData>({
    defaultValues: {
      title: initialData.title || "",
      content: initialData.content || "",
      contentType: initialData.contentType || "about",
      status: initialData.status || "draft",
      slug: initialData.slug || "",
      featuredImage: initialData.featuredImage || "",
      metaTitle: initialData.metaTitle || "",
      metaDescription: initialData.metaDescription || "",
    },
  });

  const watchTitle = watch("title");

  const generateSlug = () => {
    if (!watchTitle) return "";
    return watchTitle
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-");
  };

  const onSubmit = async (data: ContentFormData) => {
    try {
      setIsSubmitting(true);

      // If slug is empty, generate it from title
      if (!data.slug) {
        data.slug = generateSlug();
      }

      if (contentId) {
        // Update existing content
        await cmsService.updateContent(contentId, data);
        toast({
          title: "Content updated",
          description: "Your content has been updated successfully.",
        });
      } else {
        // Create new content
        await cmsService.createContent(data);
        toast({
          title: "Content created",
          description: "Your content has been created successfully.",
        });
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error saving content:", error);
      toast({
        title: "Error",
        description: "Failed to save content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title *
        </label>
        <Input
          id="title"
          {...register("title", { required: "Title is required" })}
          placeholder="Enter content title"
          className="w-full"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="slug" className="block text-sm font-medium mb-1">
          Slug
        </label>
        <div className="flex gap-2">
          <Input
            id="slug"
            {...register("slug")}
            placeholder="Enter URL slug or leave empty to generate from title"
            className="w-full"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const slugInput = document.getElementById(
                "slug",
              ) as HTMLInputElement;
              if (slugInput) {
                slugInput.value = generateSlug();
              }
            }}
          >
            Generate
          </Button>
        </div>
      </div>

      <div>
        <label htmlFor="contentType" className="block text-sm font-medium mb-1">
          Content Type *
        </label>
        <select
          id="contentType"
          {...register("contentType", { required: "Content type is required" })}
          className="w-full rounded-md border border-input bg-background px-3 py-2"
        >
          <option value="about">About Us</option>
          <option value="faq">FAQ</option>
          <option value="terms">Terms & Conditions</option>
          <option value="privacy">Privacy Policy</option>
          <option value="contact">Contact Information</option>
        </select>
        {errors.contentType && (
          <p className="text-red-500 text-sm mt-1">
            {errors.contentType.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium mb-1">
          Status *
        </label>
        <select
          id="status"
          {...register("status", { required: "Status is required" })}
          className="w-full rounded-md border border-input bg-background px-3 py-2"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
        {errors.status && (
          <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-1">
          Content *
        </label>
        <Textarea
          id="content"
          {...register("content", { required: "Content is required" })}
          placeholder="Enter content (HTML supported)"
          className="w-full min-h-[200px]"
        />
        {errors.content && (
          <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="featuredImage"
          className="block text-sm font-medium mb-1"
        >
          Featured Image URL
        </label>
        <Input
          id="featuredImage"
          {...register("featuredImage")}
          placeholder="Enter image URL"
          className="w-full"
        />
      </div>

      <div>
        <label htmlFor="metaTitle" className="block text-sm font-medium mb-1">
          Meta Title
        </label>
        <Input
          id="metaTitle"
          {...register("metaTitle")}
          placeholder="Enter meta title for SEO"
          className="w-full"
        />
      </div>

      <div>
        <label
          htmlFor="metaDescription"
          className="block text-sm font-medium mb-1"
        >
          Meta Description
        </label>
        <Textarea
          id="metaDescription"
          {...register("metaDescription")}
          placeholder="Enter meta description for SEO"
          className="w-full"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : contentId
              ? "Update Content"
              : "Create Content"}
        </Button>
      </div>
    </form>
  );
};

export default ContentEditor;
