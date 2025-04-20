import React from "react";
import ContentDisplay from "@/components/cms/ContentDisplay";

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <ContentDisplay
        slug="about-us"
        contentType="about"
        className="max-w-4xl mx-auto"
      />
    </div>
  );
};

export default AboutPage;
