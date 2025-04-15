import React from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/AuthForm";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const AuthPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back
        </Button>

        <div className="max-w-md mx-auto">
          <AuthForm onSuccess={() => navigate("/")} />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
