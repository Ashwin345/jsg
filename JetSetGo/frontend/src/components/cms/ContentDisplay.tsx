import React, { useEffect, useState } from "react";
import { cmsService } from "@/services/cmsService";

interface ContentDisplayProps {
  slug: string;
  contentType?: string;
  className?: string;
}

const ContentDisplay: React.FC<ContentDisplayProps> = ({
  slug,
  contentType,
  className = "",
}) => {
  const [content, setContent] = useState<{
    title: string;
    content: string;
    featuredImage?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const data = await cmsService.getContentBySlug(slug);

        // Verify content type if specified
        if (contentType && data.contentType !== contentType) {
          throw new Error(
            `Content type mismatch: expected ${contentType}, got ${data.contentType}`,
          );
        }

        setContent(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching content:", err);
        setError("Failed to load content. Please try again later.");
        setContent(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchContent();
    }
  }, [slug, contentType]);

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className={`text-red-500 ${className}`}>
        {error || "Content not found"}
      </div>
    );
  }

  return (
    <div className={className}>
      {content.featuredImage && (
        <img
          src={content.featuredImage}
          alt={content.title}
          className="w-full h-auto rounded-lg mb-4"
        />
      )}
      <h1 className="text-2xl font-bold mb-4">{content.title}</h1>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: content.content }}
      />
    </div>
  );
};

export default ContentDisplay;
